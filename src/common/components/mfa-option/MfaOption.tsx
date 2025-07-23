import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Trans } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import { DialogContent } from '@material-ui/core';

import useStyles from './MfaOption.styles';
import Image280 from '../../../assets/img/image 280.png';
import CloseIcon from '../../../assets/icons/cerrar.svg'
import OkIcon from '../../../assets/icons/aviso_ok.svg';
import Switch from '../custom-switch/CustomSwitch';
import Input from '../../../common/components/input/Input';
import SmsConfirmModal from './SmsConfirmModal';
import EditLabel from '../../../common/components/edit-label/EditLabel';
import SaveLabel from '../../../common/components/save-label/SaveLabel';
import Checkbox from '../../../common/components/checkbox/Checkbox';
import Spinner from '../../../common/components/spinner/Spinner';
import Dialog from '../../../common/components/dialog/Dialog';
import Button from '../../../common/components/button/Button';
import { setUserMfa, setUserMfaPhone, setUserEnabledMfa } from '../../../common/store/actions/UserActions';
import { thunksaveMfaConfiguration } from '../../../login/store/actions/LoginThunkActions';
import { validateMobileNumber } from '../../../common/lib/ValidationLib';

const MfaOption = (props: any) => {
    const classes = useStyles({});
    const { t } = useTranslation();
    const [checkSms, setCheckSms] = useState(false);
    const [showSmsModal, setShowSmsModal] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [inputPhone, setInputPhone] = useState(false);
    const [phoneValidity, setPhoneValidity] = useState(false);
    const user = useSelector((state: any) => state.user.profile);
    const [phoneValue, setPhoneValue] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [mfaEnabled, setMfaEnabled] = useState(false);
    const [showMoreDetails, setShowMoreDetails] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        setPhoneValue(user.mfaPhone || user.phone);
        setCheckSms(user.mfaChanel === 'sms');
        setMfaEnabled(user.mfaEnabled && user.mfaEnabled === 'S' ? true : false);
    }, [user]);

    const handleChangeSwitch = (e) => {
        if (e.target.checked) {
            setShowSmsModal(true);
        } else {
            setCheckSms(false);
            setIsLoading(true);
            dispatch(thunksaveMfaConfiguration(setIsLoading, { channel: 'email', mfaEnabled: mfaEnabled }, (response) => {
                dispatch(setUserMfa('email'));
                setIsLoading(false);
                showConfirmMessage();
            }));
        }
    }

    const handleCloseDialog = () => {
        setCheckSms(true);
        setShowSmsModal(false);
        setIsLoading(true);
        dispatch(thunksaveMfaConfiguration(setIsLoading, { channel: 'sms', phone: phoneValue, mfaEnabled: mfaEnabled }, (response) => {
            dispatch(setUserMfa('sms'));
            setIsLoading(false);
            showConfirmMessage();
        }));
    }

    const handleMoreDetails = () => {
        setShowMoreDetails(true);
    }

    const handleSaveInputPhone = () => {
        setIsLoading(true);
        dispatch(thunksaveMfaConfiguration(setIsLoading, { channel: 'sms', phone: phoneValue, mfaEnabled: mfaEnabled }, (response) => {
            dispatch(setUserMfaPhone(phoneValue));
            setIsLoading(false);
            showConfirmMessage();
        }));
    };

    const handleEditInputPhone = () => {
        setInputPhone(prev => !prev);
    };

    const showConfirmMessage = () => {
        setShowMessage(true);
        setTimeout(() => {
            if (checkSms) setInputPhone(prev => !prev);
            setShowMessage(false);
        }, 5000);
    }

    const handleMfaClick = (event: React.MouseEvent<unknown>) => {
        setIsLoading(true);
        dispatch(thunksaveMfaConfiguration(setIsLoading, { channel: 'email', mfaEnabled: !mfaEnabled }, (response) => {
            if (!mfaEnabled) {
                dispatch(setUserMfa('email'));
            }
            dispatch(setUserEnabledMfa(mfaEnabled ? 'N' : 'S'));
            setIsLoading(false);
        }));
    }

    return (
        <>
            {
                isLoading &&
                <Spinner fixed={true} />
            }

            <Grid container direction='row' className={classes.mfaContainer}>
                <Grid className={classes.mfaCheck}>
                    <Grid className={classes.mfaCheckText}>
                        <Checkbox
                            style={{
                                color: '#004571'
                            }}
                            checked={mfaEnabled}
                            onClick={(event) => handleMfaClick(event)}
                        />
                        <Grid item className={classes.textBold}>
                            <p>{t('profile.mfa.activate')}</p>
                        </Grid>
                    </Grid>
                    <Grid item md={12} xs={12} className={classes.titleMore}>
                        <span className={classes.link} onClick={handleMoreDetails}>{t('profile.mfa.moreDetails')}</span>
                    </Grid>
                </Grid>
                {
                    mfaEnabled &&
                    <Grid item className={classes.mfaBackgroundColor}>
                        <Grid item md={2} xs={2} className={classes.imageContainer}>
                            <img src={Image280} />
                        </Grid>
                        <Grid
                            container
                            item
                            md={10}
                            xs={12}
                        >
                            <Grid item md={12} xs={12} className={classes.title}>
                                <span>{t('profile.mfa.title')}</span>
                            </Grid>
                            <Grid item md={12} xs={12} className={classes.text}>
                                <p>{t('profile.mfa.text')}</p>
                            </Grid>
                            <Grid item md={12} xs={12} className={classes.textBold}>
                                <p>{t('profile.mfa.select')}</p>
                            </Grid>
                            <Switch
                                checked={checkSms}
                                onChange={handleChangeSwitch}
                                name='checkedB'
                                color='primary'
                                value1={t('profile.mfa.email')}
                                value2={t('profile.mfa.sms')}
                            />
                            {
                                showMessage &&
                                <Grid item md={12} xs={12} className={classes.message}>
                                    <img src={OkIcon} alt='' />
                                    <p>{t('profile.mfa.successMesage')}</p>
                                </Grid>
                            }
                            <Grid item md={12} xs={12} className={classes.textColor}>
                                <span>
                                    <Trans
                                        i18nKey={checkSms ? 'profile.mfa.smsText' : 'profile.mfa.emailText'}
                                    />
                                </span>
                            </Grid>

                            <Grid item >
                                {
                                    checkSms && <>
                                        {
                                            (inputPhone) ?
                                                <>
                                                    <Input
                                                        error={phoneValidity}
                                                        showValidationIcon
                                                        onChange={({ target }) => {
                                                            setPhoneValidity(!validateMobileNumber(target.value))

                                                            setPhoneValue(target.value)
                                                        }}
                                                        value={phoneValue}
                                                    />
                                                    <SaveLabel
                                                        label=''
                                                        onClick={handleSaveInputPhone}
                                                        disabled={phoneValidity}
                                                    />
                                                </>
                                                :
                                                <>
                                                    <Grid className={classes.info}>{phoneValue}</Grid>
                                                    {checkSms && <EditLabel label='' onClick={handleEditInputPhone} />}
                                                </>
                                        }
                                    </>
                                }
                            </Grid>
                        </Grid>

                    </Grid>
                }

            </Grid>
            <SmsConfirmModal open={showSmsModal} handleAcceptDialog={handleCloseDialog} handleCloseDialog={() => setShowSmsModal(false)} />
            {
                showMoreDetails &&
                <Dialog className={classes.dialog} open={showMoreDetails} onClose={() => setShowMoreDetails(false)}>
                    <DialogContent className={classes.mfaDetailContainer}>
                        <img src={CloseIcon} className={classes.closeButton} alt='close' onClick={() => setShowMoreDetails(false)} />
                        <img src={Image280} />
                        <div className={classes.dialogTitle}>
                            {t('profile.mfa.title')}
                        </div>
                        <div className={classes.body}>
                            {t('profile.mfa.detail.text1')}
                        </div>
                        <div className={classes.body}>
                            {t('profile.mfa.detail.text2')}
                        </div>
                        <div className={classes.body}>
                            {t('profile.mfa.detail.text3')}
                        </div>
                        <div className={classes.body}>
                            {t('profile.mfa.detail.text4')}
                        </div>
                        <Button className={classes.buttonDetail} text={t('common.buttons.close')} color='primary' size='large' variant='contained' onClick={() => setShowMoreDetails(false)} />
                    </DialogContent>
                </Dialog>
            }
        </>
    )
}

export default MfaOption;
