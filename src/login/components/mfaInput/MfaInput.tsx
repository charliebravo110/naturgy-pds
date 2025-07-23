import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';

import { Trans } from 'react-i18next';
import CircularProgress from '@material-ui/core/CircularProgress';
import { DialogContent, DialogContentText, DialogActions } from '@material-ui/core'
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { useTranslation } from 'react-i18next';
import useStyles from './MfaInput.styles';
import { useDispatch, useSelector } from 'react-redux';
import queryString from 'query-string';
import Image280 from '../../../assets/img/image 280.png';
import Button from '../../../common/components/button/Button';
import OkIcon from '../../../assets/icons/aviso_ok.svg'
import Input from '../../../common/components/input/Input';
import Checkbox from '../../../common/components/checkbox/Checkbox';
import ClockIcon from '../../../assets/icons/seleccionar_hora.svg';
import ErrorIcon from '../../../assets/icons/Interfaz_24_cruz_cerrar_error_rojo.svg';
import AlertIcon from '../../../assets/icons/aviso_alerta_pop_up.svg';
import { thunkMfaLogin, thunkSaveMfaPreferences, thunksaveMfaConfiguration } from '../../store/actions/LoginThunkActions';
import { thunkZeusSincro } from '../../../common/components/zeus-sincro/ZeusSincroThunkActions';
import ZeusWebData from '../../../common/interfaces/ZeusWebData';
import Switch from '../../../common/components/custom-switch/CustomSwitch';
import { resetLoginState } from '../../store/actions/LoginActions';
import { thunkGetProvision } from '../../../provisions/store/actions/ProvisionsThunkActions';
import { setCurrentProvisionHasContactMeButton } from '../../../provisions/store/actions/ProvisionsActions';
import { validateMobileNumber } from '../../../common/lib/ValidationLib';
import { setUserEnabledMfa, setUserMfa, setUserMfaPhone } from '../../../common/store/actions/UserActions';

const MfaInput = (props: any) => {
    const {
        time,
        handleCancel,
        handleSend,
        data,
        max = false,
        setIsLoading,
        handleDownloadDocument,
        search,
        history,
        handleConfiguration,
        mfaCode,
        setmfaCode
    } = props;

    const classes = useStyles({});
    const [minutes, setMinutes] = useState('');
    const [seconds, setSeconds] = useState('');
    const [timeAux, setTimeAux] = useState(-1);
    const [timeOut, setTimeout] = useState(false);
    const [showError, setShowError] = useState(false);
    const [showConfigure, setShowConfigure] = useState<Boolean>(data.mfaConfigured === 0);
    const [inputValue, setInputValue] = useState('');
    const [checkSms, setCheckSms] = useState(false);
    const [phoneValidity, setPhoneValidity] = useState(false);
    const [phoneValue, setPhoneValue] = useState();
    const [emailValue, setEmailValue] = useState();
    const [showMfaAdvice, setShowMfaAdvice] = useState<Boolean>(false);
    const [mfaEnabled, setMfaEnabled] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const user = useSelector((state: any) => state.user.profile);
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const CONFIGURE_MFA = '0001';
    const ERROR_MFA = '1001';
    const SHOW_MFA = '2903';

    useEffect(() => {
        if (data.mfaConfigured !== 0 || !showMfaAdvice) {
            setTimeAux(time);
            const interval = setInterval(() => {
                setTimeAux(prevSeconds => prevSeconds - 1);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [time, showMfaAdvice]);

    useEffect(() => {
        setMinutes(timeAux >= 60 ? Math.trunc(timeAux / 60).toString() : '0');
        setSeconds(timeAux % 60 >= 10 ? (timeAux % 60).toString() : '0' + (timeAux % 60).toString());

        if (timeAux === 0) {
            setTimeout(true);
        }
    }, [timeAux]);

    useEffect(() => {
        if (showConfigure) {
            const userS = JSON.parse(sessionStorage.getItem('0001'));
            setPhoneValue((userS && userS.user && userS.user.mfaPhone) ? userS.user.mfaPhone : '');
            setEmailValue((userS && userS.user && userS.user.email) ? userS.user.email : '');
        }
    }, [showConfigure]);

    const handleChangeInput = (event: React.ChangeEvent<{ value: string; id: string; name: string }>) => {
        setInputValue(event.target.value);
    }

    const handleMFASubmit = () => {
        setIsLoading(true);
        sessionStorage.setItem('tempmfa', '1');
        dispatch(thunkMfaLogin(setIsLoading, { code: inputValue }, (response) => {
            if (response.result && response.result.codResult === ERROR_MFA || response === '1001') {
                setShowError(true);
                setIsLoading(false);
            } else {
                let indLegalAccept = '1';

                let webData = {
                    indLegalAccept: indLegalAccept
                } as ZeusWebData;

                dispatch(thunkZeusSincro(webData, user, null));
                dispatch(resetLoginState());

                if (response.result && response.result.codResult === CONFIGURE_MFA) {
                    setPhoneValue(response.user.phone);
                    setmfaCode('')
                    setShowConfigure(true);
                    setIsLoading(false);
                } else {
                    const href = sessionStorage.getItem('href');
                    let hrefGo;

                    let href3000 = [];
                    let hrefcom = [];
                    let hrefes = [];
                    if(sessionStorage.href) {
                      href3000 = (sessionStorage.href.split(':3000'))
                      hrefcom = (sessionStorage.href.split('.com'))
                      hrefes = (sessionStorage.href.split('.es'))
                    }

                    if (href3000[1]) {
                        hrefGo = (sessionStorage.href.split(':3000'));
                    }
                    if (hrefcom[1]) {
                        hrefGo = (sessionStorage.href.split('.com'));
                    }
                    if (hrefes[1]) {
                        hrefGo = (sessionStorage.href.split('.es'));
                    }

                    sessionStorage.removeItem('href');

                    //si logeamos y user es igual al guardado proviniente de la url (descargar factura)
                    if (user === sessionStorage.getItem('nif_factura')) {
                        handleDownloadDocument(sessionStorage.getItem('factura'));
                    }

                    // esto trata si llegamos desde un url que no sea directamente el login
                    if (href && hrefGo[1] !== '/login') {
                        history.push(hrefGo[1]);
                    }
                    else {
                        const queryStringValues = queryString.parse(search) as any;

                        if (!queryStringValues.redirectTo) {
                            history.push('/login');
                        } else {
                            if (queryStringValues.dossier) {
                                // redirect to dossier details
                                let defaultName = t('provisions.defaultName');
                                dispatch(thunkGetProvision(queryStringValues.dossier, defaultName, (response) => {
                                    if (response) {
                                        dispatch(setCurrentProvisionHasContactMeButton(true));
                                        history.push('/provisions/detail');
                                    } else {
                                        history.push('/provisions');
                                    }
                                }))
                            } else {
                                history.push(queryStringValues.redirectTo);
                            }
                        }
                    }
                }
            }
        }));
    }

    const partialEmail = (email = '') => {
        return email.replace(/(\w{1})[\w.-]+@([\w.]+\w)/, '$1***@$2');
    }

    const partialPhone = (phone = '') => {
        return phone.slice(0, 2) + '******' + phone.slice(phone.length - 1);
    }

    const handleConfigure = () => {
        setShowMfaAdvice(false);
    }

    const handleSaveInputPhone = () => {
        dispatch(thunkSaveMfaPreferences(setIsLoading, { phone: phoneValue }, () => {
            setIsLoading(false);
        }));
    };

    const handleSaveConfiguration = () => {
        setIsLoading(true);
        
        dispatch(thunksaveMfaConfiguration(setIsLoading, { channel: checkSms ? 'sms' : 'email', phone: checkSms ? phoneValue : '', mfaEnabled }, (response) => {
            sessionStorage.removeItem('mfa');
            dispatch(setUserEnabledMfa(!!mfaEnabled ? 'S' : 'N'));
            dispatch(setUserMfa(checkSms ? 'sms' : 'email'));
            dispatch(setUserMfaPhone(checkSms ? phoneValue : ''));
            setIsLoading(false);
            setShowSuccess(true);
        }));
    };

    return (
        <>
            <Grid
                container
                justifyContent='center'
                alignItems='center'
                className={classes.mfaContainer}
            >
                <Grid container item xs={12} sm={8} className={classes.container}>
                    <Grid
                        className={classes.header}
                        container
                        justifyContent='center'
                        alignItems='baseline'
                        direction='column'
                    >
                        {
                            showSuccess ?

                                <DialogContent className={classes.container}>
                                    <DialogContentText>
                                        <Grid container className={classes.contentDialog} direction='column' spacing={3} alignItems='center' justifyContent='center'>
                                            <Grid item>
                                                <img src={OkIcon} alt='' />
                                            </Grid>

                                            <Grid item className={classes.title}>
                                                {t('profile.mfa.successMesage')}
                                            </Grid>
                                        </Grid>
                                    </DialogContentText>

                                    <DialogActions>
                                        <Grid container alignItems='center' justifyContent='center'>
                                            <Button
                                                text={t('common.buttons.accept')}
                                                color='primary'
                                                size='large'
                                                variant='contained'
                                                onClick={handleConfiguration}
                                            />
                                        </Grid>
                                    </DialogActions>
                                </DialogContent> :
                                (showConfigure && mfaCode !== SHOW_MFA) ? <>
                                    <Grid item md={2} xs={2} className={classes.imageContainer}>
                                        <img src={Image280} />
                                    </Grid>
                                    <Grid item md={12} xs={12} className={classes.titleConfigure}>
                                        <span>{t('profile.mfa.title')}</span>
                                    </Grid>
                                    <Grid item md={10} xs={12} className={classes.subTitleConfigure}>
                                        <span>{t('login.mfa.configure.startTextConfigure')}</span>
                                    </Grid>
                                    <Grid item md={10} xs={12} className={classes.profileTitleConfigure}>
                                        <span>
                                            <Trans
                                                i18nKey={'login.mfa.configure.profileConfigure'}
                                            />
                                        </span>
                                    </Grid>
                                    <Grid item md={10} xs={12} className={classes.mfaBox}>
                                        <Grid className={classes.mfaCheck}>
                                            <Checkbox
                                                style={{
                                                    color: '#004571'
                                                }}
                                                checked={mfaEnabled}
                                                onClick={() => setMfaEnabled(state => !state)}
                                            />
                                            <Grid item className={classes.textBold}>
                                                <p>{t('login.mfa.configure.activate')}</p>
                                            </Grid>
                                        </Grid>
                                        <Grid item md={12} xs={12} className={mfaEnabled ? classes.textInfo : classes.textInfoDisabled}>
                                            <span>{t('login.mfa.configure.text')}</span>
                                        </Grid>
                                        <Switch
                                            checked={checkSms}
                                            onChange={() => setCheckSms(val => !val)}
                                            name='checkedB'
                                            color={mfaEnabled ? 'primary' : 'grey'}
                                            value1={t('profile.mfa.email')}
                                            value2={t('profile.mfa.sms')}
                                            disabled={!mfaEnabled}
                                        />
                                        {checkSms ?
                                            <>
                                                <Grid item className={classes.inputSms}>
                                                    <Input
                                                        error={phoneValidity || phoneValue === ''}
                                                        showValidationIcon
                                                        onChange={({ target }) => {
                                                            setPhoneValidity(!validateMobileNumber(target.value))

                                                            setPhoneValue(target.value)
                                                        }}
                                                        value={phoneValue}
                                                        disabled={!mfaEnabled}
                                                    />
                                                </Grid>
                                            </> :
                                            <>
                                                <Grid item className={classes.inputSms}>
                                                    <Input
                                                        className={classes.largeInput}
                                                        disabled={true}
                                                        value={emailValue}
                                                    />
                                                </Grid>
                                            </>
                                        }
                                        <Grid container md={5} xs={12} justifyContent='center' className={classes.buttons}>
                                            <Button
                                                className={classes.button}
                                                text={t('login.mfa.configure.saveConfiguration')}
                                                color='primary'
                                                size='large'
                                                variant='contained'
                                                disabled={!mfaEnabled || checkSms && (phoneValidity || phoneValue === '')}
                                                onClick={handleSaveConfiguration}
                                            />
                                        </Grid>
                                    </Grid>




                                    <Grid container md={5} xs={12} justifyContent='center' className={classes.buttons}>
                                        <Button
                                            className={`${classes.button} ${classes.button2}`}
                                            text={t('login.mfa.configure.continue')}
                                            color='secondary'
                                            size='large'
                                            variant='contained'
                                            disabled={mfaEnabled}
                                            onClick={handleSaveConfiguration}
                                        />
                                    </Grid>
                                </> :

                                    showMfaAdvice ? <>
                                        <Grid item md={2} xs={2} className={classes.imageContainer}>
                                            <img src={Image280} />
                                        </Grid>
                                        <Grid item md={12} xs={12} className={classes.title}>
                                            <span>{t('login.mfa.configure.start')}</span>
                                        </Grid>
                                        <Grid item md={10} xs={12} className={classes.subTitleAdvice}>
                                            <span>{t('login.mfa.configure.startText1')}</span>
                                        </Grid>
                                        <Grid item md={10} xs={12} className={classes.subTitleAdvice}>
                                            <span>{t('login.mfa.configure.startText2')}</span>
                                        </Grid>
                                        <Grid container md={5} xs={12} justifyContent='center' className={classes.buttons}>
                                            <Button
                                                className={classes.buttonAdvice}
                                                text={t('login.mfa.configure.startButton')}
                                                color='primary'
                                                size='large'
                                                variant='contained'
                                                onClick={handleConfigure}
                                            />
                                        </Grid>
                                    </> :
                                        max ?
                                            <>
                                                <Grid item xs={12} sm={4} md={4} className={classes.iconErrorBlock}>
                                                    <img src={AlertIcon} alt='' className={classes.iconError} />
                                                </Grid>
                                                <Grid item md={8} xs={12} className={classes.title}>
                                                    <span>{t('login.mfa.maxTitle')}</span>
                                                </Grid>
                                                <p>{t('login.mfa.maxSubTitle')}</p>
                                                <Grid container md={5} xs={12} justifyContent='center' className={classes.buttons}>
                                                    <Button
                                                        className={classes.button}
                                                        text={t('common.buttons.accept')}
                                                        color='primary'
                                                        size='large'
                                                        variant='contained'
                                                        onClick={handleCancel}
                                                    />
                                                </Grid>
                                            </>
                                            :
                                            <>
                                                {(timeOut || showError) ?
                                                    <>
                                                        <Grid item xs={12} sm={4} md={4} className={classes.iconErrorBlock}>
                                                            <img src={ErrorIcon} alt='' className={classes.iconError} />
                                                        </Grid>

                                                        <Grid item md={6} xs={12} className={`${classes.titleError} ${classes.title}`}>
                                                            <span>{t('login.mfa.errorValid')}</span>
                                                        </Grid>
                                                        <Grid item md={10} xs={12} className={`${classes.subTitleError} ${classes.subTitle}`}>
                                                            <span>{t('login.mfa.subtitleError')}</span>
                                                        </Grid>
                                                    </>
                                                    :
                                                    <>
                                                        <Grid item md={4} xs={12} className={classes.title}>
                                                            <span>{t('login.mfa.title', { name: data.name })}</span>
                                                        </Grid>
                                                        <Grid item md={10} xs={12} className={classes.subTitle}>
                                                            <span>{data.mfaChanel === 'sms' ? t('login.mfa.subtitlePhone', { phone: partialPhone(data.mfaPhone) }) : t('login.mfa.subtitleEmail', { email: partialEmail(data.email) })}</span>
                                                        </Grid>
                                                        <Grid item md={10} xs={12} className={classes.subTitle}>
                                                            <span>{t('login.mfa.valididTime', { minutes: time / 60 })}</span>
                                                        </Grid>

                                                        <Box position='relative' display='inline-flex' className={classes.timer}>
                                                            <CircularProgress variant='determinate' value={(timeAux * 100) / time} size='9rem' className={classes.circle} thickness={2} />
                                                            <CircularProgress variant='determinate' value={100} size='9rem' className={classes.circleBottom} disableShrink thickness={2} />
                                                            <Box
                                                                top={0}
                                                                left={0}
                                                                bottom={0}
                                                                right={0}
                                                                position='absolute'
                                                                display='flex'
                                                                alignItems='center'
                                                                justifyContent='center'
                                                                flexDirection='column'
                                                            >
                                                                <img src={ClockIcon} alt='' />
                                                                <Typography variant='caption' component='div' className={classes.time}>{`${minutes}:${seconds}`}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </>
                                                }

                                                <Grid item xs={12} md={6} container justifyContent='center' alignItems='center'>
                                                    <Input error={timeOut} label={t('login.mfa.inputText')} className={`${timeOut && classes.errorInput} ${classes.textField}`} onChange={handleChangeInput} inputProps={{ minLength: 4, maxLength: 6, style: { textAlign: 'center', fontSize: 28, padding: '8px' } }} />
                                                </Grid>

                                                <Grid item md={5} xs={12} className={classes.send}>
                                                    <span>{t('login.mfa.sendCode1')}</span>
                                                    <span className={classes.link} onClick={handleSend}>{t('login.mfa.sendCode2')}</span>
                                                </Grid>
                                                <Grid container md={8} xs={12} justifyContent='center' className={classes.buttons}>
                                                    <Button
                                                        className={classes.button}
                                                        text={t('common.buttons.cancel')}
                                                        color='inherit'
                                                        size='large'
                                                        variant='contained'
                                                        onClick={handleCancel}
                                                    />
                                                    <Button
                                                        className={classes.button}
                                                        text={t('login.mfa.verify')}
                                                        color='primary'
                                                        size='large'
                                                        variant='contained'
                                                        disabled={inputValue.length < 4 || timeOut || showError}
                                                        onClick={handleMFASubmit}
                                                    />
                                                </Grid>
                                            </>
                        }
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}

export default MfaInput;