import Grid from '@material-ui/core/Grid';
import React, { useState, useEffect } from 'react'
import useStyles from './FilterInputs.styles';

import Input from '../../../common/components/input/Input'
import { useTranslation } from 'react-i18next';
import Button from '../../../common/components/button/Button';
import DatepickerV3 from '../../../common/components/datepickerV3/DatepickerV3';
import { Typography } from '@material-ui/core';


const FilterInputs = (props: any) => {

    const {
        expedienteDoc,
        setExpedienteDoc,
        credentialId,
        setCredentialId,
        credentialCodOK,
        setCredentialCodOK,
        fechaAlta,
        setFechaAlta,
        fechaLast,
        setFechaLast,
        handleExport,
        enableSearch,
        setEnableSearch,
        errorDoc,
        setErrorDoc,
        errorId,
        setErrorId,
        handleChangeInput,
        handleSearch,
        setCurrentPage,
        enabledExport
    } = props

    const actualDate = new Date()
    const classes = useStyles({})
    const { t } = useTranslation()

    const resetFilters = () => {
        setExpedienteDoc('')
        setCredentialId('')
        setFechaAlta(null)
        setFechaLast(null)
        setErrorDoc(false)
        setErrorId(false)
        setEnableSearch(false)
        setCurrentPage(0)
    }

    useEffect(() => {
        if(expedienteDoc || credentialId || fechaAlta || fechaLast || credentialCodOK){
            setEnableSearch(true)
        } else {
            setEnableSearch(false)
        }
      }, [expedienteDoc,credentialId, fechaAlta,fechaLast,credentialCodOK])

    return (
        <Grid container className={classes.searchBar}>
            <Typography style={{color:'#004571'}}>{t('controlMensajeria.payData.Resume')}</Typography>
            <Grid container md={12}>
                <Grid container xs={12} sm={12} md={12}>
                    <Grid container xs={12} sm={2} md={2} direction='column' className={classes.inputContv1}>
                        <span className={classes.inputTitle}>{t('controlMensajeria.payData.fechaDesde')}</span>
                        <DatepickerV3
                            selectedDate={fechaAlta}
                            handleChange={setFechaAlta}
                            size='l'
                            maxDate={actualDate}
                            dateFormat={'dd/MM/yyyy'}
                            popperPlacement={'bottom-start'}
                        />
                    </Grid>
                    <Grid container xs={12} sm={2} md={2} direction='column' className={classes.inputContv1}>
                        <span className={classes.inputTitle}>{t('controlMensajeria.payData.FechaHasta') + ':'}</span>
                        <DatepickerV3
                            selectedDate={fechaLast}
                            handleChange={setFechaLast}
                            size='l'
                            maxDate={actualDate}
                            dateFormat={'dd/MM/yyyy'}
                            popperPlacement={'bottom-start'}
                        />
                    </Grid>
                </Grid>
                <Grid container xs={12} sm={12} md={12}>
                    <Grid container xs={12} sm={3} md={3} direction='column' className={`${classes.inputContv1} padding1`}>
                        <span className={errorDoc ? classes.inputTitleError : classes.inputTitle}>{t('controlMensajeria.payData.Expediente') + ':'}</span>
                        <Input
                            className={classes.input}
                            error={errorDoc}
                            value={expedienteDoc}
                            onChange={(e) => handleChangeInput('expediente', e.target.value)}
                        />
                        {errorDoc &&
                            <span className={classes.credentialError}>{t('admin.inputs.credentialError')}</span>
                        }
                    </Grid>
                    <Grid container xs={12} sm={3} md={3} direction='column' className={`${classes.inputContv1} padding1`}>
                        <span className={errorId ? classes.inputTitleError : classes.inputTitle}>{t('controlMensajeria.payData.Identificación')  + ':'}</span>
                        <Input
                            className={classes.input}
                            error={errorId}
                            value={credentialId}
                            onChange={(e) => handleChangeInput('id', e.target.value)}
                        />
                        {errorId &&
                            <span className={classes.credentialError}>{t('admin.inputs.credentialError')}</span>
                        }
                    </Grid>
                    <Grid container xs={12} sm={1} md={1} direction='column' className={classes.inputContv1}>
                        <span className={classes.inputTitle}>{t('controlMensajeria.payData.CodigoKO')  + ':'}</span>
                        <Input
                            className={classes.input}
                            value={credentialCodOK}
                            onChange={(e) => handleChangeInput('codok', e.target.value)}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid container className={classes.buttonContainer} md={12} spacing={2}>
                <Grid item xs={11} sm={11} md={2}>
                    <Button
                        className={classes.input}
                        text={t('controlMensajeria.payData.Search')}
                        color={'primary'}
                        size={'small'}
                        variant={'contained'}
                        onClick={handleSearch}
                        disabled={!enableSearch || errorDoc || errorId}
                    />
                </Grid>
                <Grid item xs={11} sm={11} md={2}>
                    <Button
                        className={classes.input}
                        text={t('controlMensajeria.payData.Export')}
                        color={'primary'}
                        size={'small'}
                        variant={'contained'}
                        onClick={handleExport}
                        disabled={!enabledExport || errorDoc || errorId}
                    />
                </Grid>
                <Grid item xs={11} sm={11} md={2} className={classes.resetCont}>
                    <span className={classes.link} onClick={resetFilters}>
                        {t('averias.management.searchCups.resetFilters')}
                    </span>
                </Grid>
            </Grid>
        </Grid >
    )
}
export default FilterInputs;
