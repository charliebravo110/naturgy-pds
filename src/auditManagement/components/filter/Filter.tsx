import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import ButtonMui from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import Datepicker from '../../../common/components/datepicker/Datepicker'
import Button from '../../../common/components/button/Button'
import useStyles from './Filter.styles'
import UpdateIcon from '../../../assets/icons/actualizar.svg'
import DatepickerV3 from '../../../common/components/datepickerV3/DatepickerV3'
import Input from '../../../common/components/input/Input'
import EmailIcon from '../../../assets/icons/Interfaz_90_sobre_mail_correo_postal.svg'
import MobileIcon from '../../../assets/icons/Icon_sms.svg'

const restarDias = (date: any, dias: number) => {
    date.setDate(date.getDate() - dias)
    return date
}

const sumarDias = (date: any, dias: number) => {
    date.setDate(date.getDate() + dias)
    return date
}

const Filter = (props: any) => {

    const styles = useStyles({});
    const { t } = useTranslation();
    const diaAnterior: Date = new Date();
    // diaAnterior.setDate(diaAnterior.getDate() - 1);

    const initialHourFrom = new Date().setHours(0, 0, 0);
    const initialHourTo = new Date().setHours(23, 59, 59);
    const [datepickerDate1, setDatepickerDate1] = useState<Date>(restarDias(new Date(), 8));
    const [datepickerDate2, setDatepickerDate2] = useState<Date>(restarDias(new Date(), 0));

    const {
        setAuditList,
        handleFilter
    } = props;

    const [hourFrom, setHourFrom] = useState(initialHourFrom);
    const [hourTo, setHourTo] = useState(initialHourTo);
    const [loginVal, setLoginVal] = useState('');
    const [channel, setChannel] = useState('');
    const [doubleVal, setDoubleVal] = useState('');
    const [document, setDocument] = useState('');
    const [disableSearch, setDisableSearch] = useState(false);

    const addCero = (str: number) => {
        if (str.toString().length === 1) {
            return '0' + str
        } else {
            return str
        }
    }

    const getFilterData = (): any => {
        return {
            ...(document !== '' && { document: document }),
            dateFrom: datepickerDate1,
            dateTo: datepickerDate2,
            hourFrom,
            hourTo,
            loginVal,
            channel,
            doubleVal
        }
    }


    const formatDate = (date: Date): string => {
        return (addCero(date.getDate()) + '/' + addCero((date.getMonth() + 1)) + '/' + date.getFullYear())
    }

    const newSearch = () => {
        const searchFilter = getFilterData();
        handleFilter(searchFilter);
    }

    const resetFilters = () => {
        setChannel('');
        setDoubleVal('');
        setLoginVal('');
        setDocument('');
        setHourFrom(initialHourFrom);
        setHourTo(initialHourTo);
        setDatepickerDate1(restarDias(new Date(), 8))
        setDatepickerDate2(restarDias(new Date(), 0))
        //setDatepickerDate2(restarDias(new Date(), 1))
        setAuditList([]);
    }

    const calcDays = (date1, date2) => {
        const difference = date1.getTime() - date2.getTime();
        const days = ( Math.ceil(Math.abs(difference) / (1000 * 3600 * 24)));
        return days;
    }


    const handleChangeDate1 = (e: any) => {
        setDatepickerDate1(e)

        if(calcDays(new Date(e), datepickerDate2) > 8) {
            setDatepickerDate2(sumarDias(new Date(e) ,8))
        }
    }

    const handleChangeDate2 = (e: any) => {
        setDatepickerDate2(e)

        if(calcDays(datepickerDate1, new Date(e)) > 8) {
            setDatepickerDate1(restarDias(new Date(e) ,8))
        }
    }


    useEffect(()=> {
        if(loginVal !== '' && loginVal === 'N') {
            setDisableSearch(true);
        } else {
            setDisableSearch(false);
        }
    },[loginVal]);


    

    return (
        <Grid container justifyContent='center'>
            <Grid container className={styles.searchContainer}>

                <Grid container md={12} sm={12} xs={12}>
                    <Grid item sm={12} xs={12} className={styles.bigTitle}>{t('audit.detail')}</Grid>
                    <Grid item sm={12} xs={12} className={styles.blueTitle}>{t('audit.connection')}</Grid>
                    <Grid container md={12} spacing={1} className={styles.fields}>
                        <Grid item md={3} sm={12} xs={12}>
                            <Grid className={styles.inputTitle}>{t('audit.dateFrom')}</Grid>
                            <DatepickerV3 selectedDate={datepickerDate1} handleChange={handleChangeDate1} size='m' maxDate={datepickerDate2} dateFormat={'dd/MM/yyyy'} popperPlacement={'right-center'} />
                        </Grid>
                        <Grid item md={3} sm={12} xs={12}>
                            <Grid className={styles.inputTitle}>{t('audit.dateTo')}</Grid>
                            <DatepickerV3 selectedDate={datepickerDate2} handleChange={handleChangeDate2} size='m' minDate={datepickerDate1} maxDate={diaAnterior} dateFormat={'dd/MM/yyyy'} popperPlacement={'right-center'} />
                        </Grid>

                        <Grid item md={3} sm={12} xs={12}>
                            <Grid item className={styles.inputTitle} md={12} sm={12} xs={12}>
                                {t('audit.hourFrom')}
                            </Grid>
                            <div className={styles.inputHour}>
                                <Datepicker
                                    selected={hourFrom}
                                    onChange={date => setHourFrom(date)}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={30}
                                    dateFormat='HH:mm'
                                    isHour={true}
                                    fullWidth
                                />
                            </div>
                        </Grid>
                        <Grid item md={3} sm={12} xs={12}>
                            <Grid item className={styles.inputTitle} md={12} sm={12} xs={12}>
                                {t('audit.hourTo')}
                            </Grid>
                            <div className={styles.inputHour}>
                                <Datepicker
                                    selected={hourTo}
                                    onChange={date => setHourTo(date)}
                                    className={styles.inputHour}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={30}
                                    dateFormat='HH:mm'
                                    isHour={true}
                                    fullWidth
                                />
                            </div>
                        </Grid>
                    </Grid>
                    <Grid item sm={12} className={styles.blueTitle}>{t('audit.searchUser')}</Grid>
                    <Grid container xs={12} sm={12} md={12} spacing={3} className={styles.fields}>
                        <Grid item xs={12} sm={12} md={6} lg={4}>
                            <span className={styles.inputTitle}>{t('audit.document')}</span>
                            <Input
                                id='document'
                                className={styles.inputV2}
                                value={document}
                                onChange={(event) => setDocument(event.target.value)}
                            />
                        </Grid>
                    </Grid>
                    <Grid item sm={12} className={styles.bigTitle}>{t('audit.searchBy')}</Grid>
                    <Grid item md={8} sm={12} xs={12} className={styles.group}>
                        <Grid item md={4} sm={12} xs={12} className={styles.formTitle}>{t('audit.login')}</Grid>
                        <Grid item md={4} sm={12} xs={12}>
                            <ButtonGroup aria-label='small outlined button group'>
                                <ButtonMui className={loginVal === 'S' && styles.buttonBlue} onClick={() => setLoginVal('S')}>{t('audit.S')}</ButtonMui>
                                <ButtonMui className={loginVal === 'N' && styles.buttonBlue} onClick={() => setLoginVal('N')}>{t('audit.N')}</ButtonMui>
                                <ButtonMui className={loginVal === '' && styles.buttonBlue} onClick={() => setLoginVal('')}>{t('audit.all')}</ButtonMui>
                            </ButtonGroup>
                        </Grid>
                    </Grid>

                    <Grid item md={8} sm={12} xs={12} className={styles.group}>
                        <Grid item md={4} sm={12} xs={12} className={styles.formTitle}>{t('audit.channel')}</Grid>
                        <Grid item md={4} sm={12} xs={12}>
                            <ButtonGroup aria-label='small outlined button group' disabled={disableSearch}>
                                <ButtonMui className={channel === 'email' && styles.buttonBlue} onClick={() => setChannel('email')}>
                                    <img className={styles.icon} src={EmailIcon} alt='' />
                                    {t('audit.email')}
                                </ButtonMui>
                                <ButtonMui className={channel === 'sms' && styles.buttonBlue} onClick={() => setChannel('sms')}>
                                    <img className={styles.icon} src={MobileIcon} alt='' />
                                    {t('audit.sms')}
                                </ButtonMui>
                                <ButtonMui className={channel === '' && styles.buttonBlue} onClick={() => setChannel('')} >{t('audit.all')}</ButtonMui>
                            </ButtonGroup>
                        </Grid>
                    </Grid>

                    <Grid item md={8} sm={12} xs={12} className={styles.group}>
                        <Grid item md={4} sm={12} xs={12} className={styles.formTitle}>{t('audit.double')}</Grid>
                        <Grid item md={4} sm={12} xs={12}>
                            <ButtonGroup aria-label='small outlined button group' disabled={disableSearch}>
                                <ButtonMui className={doubleVal === 'S' && styles.buttonBlue} onClick={() => setDoubleVal('S')}>{t('audit.S')}</ButtonMui>
                                <ButtonMui className={doubleVal === 'N' && styles.buttonBlue} onClick={() => setDoubleVal('N')}>{t('audit.N')}</ButtonMui>
                                <ButtonMui className={doubleVal === '' && styles.buttonBlue} onClick={() => setDoubleVal('')}>{t('audit.all')}</ButtonMui>
                            </ButtonGroup>
                        </Grid>
                    </Grid>

                    <Grid container md={6} sm={10} xs={12}>
                        <Grid container md={12} spacing={2} className={styles.userContainer}>
                            <Grid item md={12}>
                                <Grid container className={styles.searchButton} onClick={() => resetFilters()}>
                                    <img className={styles.updateIcon} src={UpdateIcon} alt='' />
                                    <span className={styles.updateText}>{t('audit.clearFilter')}</span>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container className={styles.consultCont}>
                        <Button
                            text={t('audit.searchButton')}
                            color='primary'
                            variant='contained'
                            onClick={() => newSearch()}
                        />
                    </Grid>
                </Grid>

            </Grid>
        </Grid >
    );
}

export default Filter;