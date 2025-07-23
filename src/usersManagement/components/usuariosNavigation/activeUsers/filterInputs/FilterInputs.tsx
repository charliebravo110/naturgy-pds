import Grid from '@material-ui/core/Grid';
import React, { useState, useEffect } from 'react'
import useStyles from './FilterInputs.styles';

import Input from '../../../../../common/components/input/Input'
import DynamicSearcher from '../../../../../common/components/searcher/DynamicSearcher'
import { useTranslation } from 'react-i18next';
import Button from '../../../../../common/components/button/Button';
import DatepickerV3 from '../../../../../common/components/datepickerV3/DatepickerV3';


const FilterInputs = (props: any) => {

    const {
        credentialDoc,
        setCredentialDoc,
        credentialEmail,
        setCredentialEmail,
        fechaAlta,
        setFechaAlta,
        fechaLastLogin,
        setFechaLastLogin,
        handleExport,
        enableSearch,
        setEnableSearch,
        errorDoc,
        setErrorDoc,
        errorEmail,
        setErrorEmail,
        handleChangeInput,
        handleSearch,
        handleSearchAll,
        setCurrentPage
    } = props

    const [actualDate, setActualDAte] = useState<Date>(new Date());
    const classes = useStyles({})
    const { t } = useTranslation()

    const resetFilters = () => {
        setCredentialDoc('')
        setCredentialEmail('')
        setFechaAlta(null)
        setFechaLastLogin(null)
        setErrorDoc(false)
        setErrorEmail(false)
        setEnableSearch(false)
        setCurrentPage(0)
    }

    useEffect(() => {
        if(credentialDoc || credentialEmail || fechaAlta || fechaLastLogin){
            setEnableSearch(true)
        }
      }, [credentialDoc,credentialEmail, fechaAlta,fechaLastLogin])

    return (
        <Grid container className={classes.searchBar}>
            <Grid container className={classes.filterContainer} md={12} spacing={2}>
                <Grid item xs={11} sm={11} md={3}>
                    <p className={errorDoc ? classes.inputTitleError : classes.inputTitle}>{t('gestionUsuarios.management.activeUsers.filter.userCod')}</p>
                    <Input
                        className={classes.input}
                        error={errorDoc}
                        value={credentialDoc}
                        onChange={(e) => handleChangeInput('credential', e.target.value)}
                    />
                    {errorDoc &&
                        <span className={classes.credentialError}>{t('admin.inputs.credentialError')}</span>
                    }
                </Grid>
                <Grid item xs={11} sm={11} md={3}>
                    <p className={errorEmail ? classes.inputTitleError : classes.inputTitle}>{t('gestionUsuarios.management.activeUsers.filter.email')}</p>
                    <Input
                        className={classes.input}
                        error={errorEmail}
                        value={credentialEmail}
                        onChange={(e) => handleChangeInput('email', e.target.value)}
                    />
                    {errorEmail &&
                        <span className={classes.credentialError}>{t('admin.inputs.credentialError')}</span>
                    }
                </Grid>
                <Grid item xs={11} sm={11} md={3}>
                    <p className={classes.inputTitle}>{t('gestionUsuarios.management.activeUsers.filter.fechaAlta') + ':'}</p>
                    <DatepickerV3
                        selectedDate={fechaAlta}
                        handleChange={setFechaAlta}
                        size='l'
                        maxDate={actualDate}
                        dateFormat={'dd/MM/yyyy'}
                        popperPlacement={'right-center'}
                    />
                </Grid>
                <Grid item xs={11} sm={11} md={3}>
                    <p className={classes.inputTitle}>{t('gestionUsuarios.management.activeUsers.filter.ultimoLogin') + ':'}</p>
                    <DatepickerV3
                        selectedDate={fechaLastLogin}
                        handleChange={setFechaLastLogin}
                        size='l'
                        maxDate={actualDate}
                        dateFormat={'dd/MM/yyyy'}
                        popperPlacement={'left-center'}
                    />
                </Grid>
            </Grid>
            <Grid container className={classes.buttonContainer} md={12} spacing={2}>
                <Grid item >
                    <Button
                        className={classes.input}
                        text={t('gestionUsuarios.management.activeUsers.buttons.searchButton')}
                        color={'primary'}
                        size={'large'}
                        variant={'contained'}
                        onClick={handleSearch}
                        disabled={!enableSearch || errorDoc || errorEmail}
                    />
                </Grid>
                <Grid item >
                    <Button
                        className={classes.input}
                        text={t('gestionUsuarios.management.activeUsers.buttons.searchAll')}
                        color={'primary'}
                        size={'large'}
                        variant={'contained'}
                        onClick={handleSearchAll}
                    />
                </Grid>
                <Grid item >
                    <Button
                        className={classes.input}
                        text={t('gestionUsuarios.management.activeUsers.buttons.export')}
                        color={'primary'}
                        size={'large'}
                        variant={'contained'}
                        onClick={handleExport}
                    // disabled={}
                    />
                </Grid>
                <Grid item >
                    <p className={classes.link} onClick={resetFilters}>
                        {t('averias.management.searchCups.resetFilters')}
                    </p>
                </Grid>
            </Grid>
            {/* <Grid container justifyContent='space-between' md={12} spacing={2}>
                    <Grid item xs={11} sm={11} md={2}>
                        <p className={errorDoc ? classes.inputTitleError : classes.inputTitle}>{t('gestionUsuarios.management.activeUsers.filter.userCod')}</p>
                        <Input
                            className={classes.input}
                            error={errorDoc}
                            value={credentialDoc}
                            onChange={(e) => handleChangeInput('credential', e.target.value)}
                        />
                        {errorDoc &&
                            <span className={classes.credentialError}>{t('admin.inputs.credentialError')}</span>
                        }
                    </Grid>
                    <Grid item xs={11} sm={11} md={2}>
                        <p className={errorEmail ? classes.inputTitleError : classes.inputTitle}>{t('gestionUsuarios.management.activeUsers.filter.email')}</p>
                        <Input
                            className={classes.input}
                            error={errorEmail}
                            value={credentialEmail}
                            onChange={(e) => handleChangeInput('email', e.target.value)}
                        />
                        {errorEmail &&
                            <span className={classes.credentialError}>{t('admin.inputs.credentialError')}</span>
                        }
                    </Grid>
                    <Grid item xs={11} sm={11} md={2}>
                        <p className={classes.inputTitle}>{t('gestionUsuarios.management.activeUsers.filter.fechaAlta') + ':'}</p>
                        <DatepickerV3
                            selectedDate={fechaAlta}
                            handleChange={setFechaAlta}
                            size='l'
                            maxDate={actualDate}
                            dateFormat={'dd/MM/yyyy'}
                            popperPlacement={'right-center'}
                        />
                    </Grid>
                    <Grid item xs={11} sm={11} md={2}>
                        <p className={classes.inputTitle}>{t('gestionUsuarios.management.activeUsers.filter.ultimoLogin') + ':'}</p>
                        <DatepickerV3
                            selectedDate={fechaLastLogin}
                            handleChange={setFechaLastLogin}
                            size='l'
                            maxDate={actualDate}
                            dateFormat={'dd/MM/yyyy'}
                            popperPlacement={'right-center'}
                        />
                    </Grid>
                    <Grid item xs={11} sm={11} md={2}>
                        <p className={classes.inputTitle}>{}</p>
                        <Button
                            className={classes.input}
                            text={t('gestionUsuarios.management.activeUsers.buttons.searchButton')}
                            color={'primary'}
                            size={'small'}
                            variant={'contained'}
                            onClick={handleSearch}
                            disabled={errorDoc || errorEmail}
                        />
                    </Grid>
                    <Grid item xs={11} sm={11} md={2}>
                        <p className={classes.inputTitle}>{}</p>
                        <Button
                            className={classes.input}
                            text={t('gestionUsuarios.management.activeUsers.buttons.export')}
                            color={'primary'}
                            size={'small'}
                            variant={'contained'}
                            onClick={handleExport}
                        // disabled={}
                        />
                    </Grid>
                </Grid> */}
        </Grid >
    )
}
export default FilterInputs;
