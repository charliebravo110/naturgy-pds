import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import FormControlLabel from '@material-ui/core/FormControlLabel'

import Input from '../../../../../common/components/input/Input'
import Checkbox from '../../../../../common/components/checkbox/Checkbox'

import { setAccountingOffice, setTeamManagerOffice, setTramitadoraOffice } from '../../../../store/actions/ProvisionsActions'

import useStyles from './DigitalBill.styles'

const DigitalBill = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const {
    state,
    setIsEmpty,
    setErrorCheck
  } = props

  const currentProvision = useSelector((state: any) => state.provisions.currentProvision)

  const [ emptyAccounting, setIsEmptyAccounting ] = useState(true)
  const [ emptyTeamManager, setIsEmptyTeamManager ] = useState(true)
  const [ emptyTramitadora, setIsEmptyTramitadora ] = useState(true)

  const ACCOUNTING_OFFICE = 'accountingOffice'
  const TEAM_MANAGER_OFFICE = 'teamManagerOffice'
  const TRAMITADORA_OFFICE = 'tramitadoraOffice'

  /* --- DATA --- */
  const [ accountingOfficeData, setAccountingOfficeData ] = useState({
    officeCod: '',
    officeName: '',
    indAccountingOffice: '0'
  })

  const [ teamManagerOfficeData, setTeamManagerOfficeData ] = useState({
    officeCod: '',
    officeName: '',
    indTeamManager: '0'
  })

  const [ tramitadoraOfficeData, setTramitadoraOfficeData ] = useState({
    officeCod: '',
    officeName: '',
    indTramitadoraOffice: '0'
  })

  /* --- ERRORS --- */
  const [ accountingOfficeErrors, setAccountingOfficeErrors ] = useState({
    officeCod: false,
    officeName: false,
    indAccountingOffice: false
  })

  const [ teamManagerOfficeErrors, setTeamManagerOfficeErrors ] = useState({
    officeCod: false,
    officeName: false,
    indTeamManager: false
  })

  const [ tramitadoraOfficeErrors, setTramitadoraOfficeErrors ] = useState({
    officeCod: false,
    officeName: false,
    indTramitadoraOffice: false
  })

  const updateRequestData = () => {
    dispatch(setAccountingOffice(accountingOfficeData))

    dispatch(setTeamManagerOffice(teamManagerOfficeData))

    dispatch(setTramitadoraOffice(tramitadoraOfficeData))
  }

  useEffect(() => {
    updateRequestData()
  // eslint-disable-next-line
  }, [ accountingOfficeData, teamManagerOfficeData, tramitadoraOfficeData] )

  // Si hay una provision vigente se cargan los datos en el formulario
  useEffect(() => {
    if (currentProvision && currentProvision.dossierCod) {
      setAccountingOfficeData(currentProvision.accountingOffice ? currentProvision.accountingOffice : accountingOfficeData)

      setTeamManagerOfficeData(currentProvision.teamManagerOffice ? currentProvision.teamManagerOffice : teamManagerOfficeData)

      setTramitadoraOfficeData(currentProvision.tramitadoraOffice ? currentProvision.tramitadoraOffice : tramitadoraOfficeData)
    }
  // eslint-disable-next-line
  }, [ currentProvision ])

  const setErrorsAndUpdate = (data, office) => {
    if (office === ACCOUNTING_OFFICE) {
      setAccountingOfficeErrors(data)
    } else if (office === TEAM_MANAGER_OFFICE) {
      setTeamManagerOfficeErrors(data)
    } else if (office === TRAMITADORA_OFFICE) {
      setTramitadoraOfficeErrors(data)
    }

    updateRequestData()
  }

  // Comprobar si el formulario tiene algun campo vacio
  useEffect(() => {
    if (emptyAccounting || emptyTeamManager || emptyTramitadora) {
      setIsEmpty(true)
    } else {
      setIsEmpty(false)
    }
  // eslint-disable-next-line
  }, [ emptyAccounting, emptyTeamManager, emptyTramitadora ])

  // Comprobar si accountingOffice esta vacio
  useEffect(() => {
    if (accountingOfficeData.indAccountingOffice === '0') {
      setIsEmptyAccounting(Object.keys(accountingOfficeData).filter((key) => accountingOfficeData[key] === '').length > 0)
    }
  }, [ accountingOfficeData ])

  // Comprobar si teamManagerOffice esta vacio
  useEffect(() => {
    if (teamManagerOfficeData.indTeamManager === '0') {
      setIsEmptyTeamManager(Object.keys(teamManagerOfficeData).filter((key) => teamManagerOfficeData[key] === '').length > 0)
    }
  }, [ teamManagerOfficeData ])

  // Comprobar si tramitadoraOffice esta vacio
  useEffect(() => {
    if (tramitadoraOfficeData.indTramitadoraOffice === '0') {
      setIsEmptyTramitadora(Object.keys(tramitadoraOfficeData).filter((key) => tramitadoraOfficeData[key] === '').length > 0)
    }
  }, [ tramitadoraOfficeData ])

  // Comprobar si hay errores en el fromulario
  useEffect(() => {
    if (Object.keys(accountingOfficeErrors).filter((key) => accountingOfficeErrors[key]).length > 0
      || Object.keys(teamManagerOfficeErrors).filter((key) => teamManagerOfficeErrors[key]).length > 0
      || Object.keys(tramitadoraOfficeErrors).filter((key) => tramitadoraOfficeErrors[key]).length > 0
    ) {
      setErrorCheck(true)
    } else {
      setErrorCheck(false)
    }
  // eslint-disable-next-line
  }, [ accountingOfficeErrors, teamManagerOfficeErrors, tramitadoraOfficeErrors ])

  const handleOfficeCod = (e, office) => {
    if (office === ACCOUNTING_OFFICE) {
      setAccountingOfficeData({ ...accountingOfficeData, officeCod: e.target.value })
    } else if (office === TEAM_MANAGER_OFFICE) {
      setTeamManagerOfficeData({ ...teamManagerOfficeData, officeCod: e.target.value })
    } else if (office === TRAMITADORA_OFFICE) {
      setTramitadoraOfficeData({ ...tramitadoraOfficeData, officeCod: e.target.value })
    }
  }

  const handleOfficeName = (e, office) => {
    if (office === ACCOUNTING_OFFICE) {
      setAccountingOfficeData({ ...accountingOfficeData, officeName: e.target.value })
    } else if (office === TEAM_MANAGER_OFFICE) {
      setTeamManagerOfficeData({ ...teamManagerOfficeData, officeName: e.target.value })
    } else if (office === TRAMITADORA_OFFICE) {
      setTramitadoraOfficeData({ ...tramitadoraOfficeData, officeName: e.target.value })
    }
  }

  const handleOfficeInd = (e, office) => {
    if (office === ACCOUNTING_OFFICE) {
      setAccountingOfficeData({ ...accountingOfficeData, indAccountingOffice: e.target.checked ? '1' : '0' })
      if (e.target.checked) {
        setErrorsAndUpdate({
          officeCod: false,
          officeName: false,
          indAccountingOffice: false
        }, ACCOUNTING_OFFICE)
        setIsEmptyAccounting(false)
      }
    } else if (office === TEAM_MANAGER_OFFICE) {
      setTeamManagerOfficeData({ ...teamManagerOfficeData, indTeamManager: e.target.checked ? '1' : '0' })
      if (e.target.checked) {
        setErrorsAndUpdate({
          officeCod: false,
          officeName: false,
          indTeamManager: false
        }, TEAM_MANAGER_OFFICE)
        setIsEmptyTeamManager(false)
      }
    } else if (office === TRAMITADORA_OFFICE) {
      setTramitadoraOfficeData({ ...tramitadoraOfficeData, indTramitadoraOffice: e.target.checked ? '1' : '0' })
      if (e.target.checked) {
        setErrorsAndUpdate({
          officeCod: false,
          officeName: false,
          indTramitadoraOffice: false
        }, TRAMITADORA_OFFICE)
        setIsEmptyTramitadora(false)
      }
    }
  }

  return (
    <>
      <Grid container className={classes.container}>
        <div className={classes.title}>{t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.digitalBill.title')}</div>
          <Grid container direction='column' justifyContent='space-between'>

            <Grid container justifyContent='space-between'>
              <Grid container className={classes.label} md={4} sm={4}>
                <Grid item>{t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.digitalBill.offices.accounting.title')}</Grid>
              </Grid>
              <Grid container className={classes.inputContainer} md={8} sm={8} xs={12}>
                <Grid item className={`${classes.inputLabel} ${accountingOfficeData.indAccountingOffice === '1' && classes.disabled}`}>
                  <Typography>{t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.digitalBill.offices.accounting.label')}</Typography>
                </Grid>
                <Grid container justifyContent='space-between' alignItems='center' className={classes.input}>
                  <Grid item md={8} sm={8}>
                    {
                      state >= 2 ?
                        <Typography className={classes.stateLabel}>{accountingOfficeData.officeCod}</Typography>
                      :
                        <Input
                          fullWidth
                          value={accountingOfficeData.officeCod}
                          onChange={(e) => handleOfficeCod(e, ACCOUNTING_OFFICE)}
                          onBlur={(e) => e.target.value === '' ? setErrorsAndUpdate({ ...accountingOfficeErrors, officeCod: true }, ACCOUNTING_OFFICE) : setErrorsAndUpdate({ ...accountingOfficeErrors, officeCod: false }, ACCOUNTING_OFFICE)}
                          disabled={accountingOfficeData.indAccountingOffice === '1'}
                          error={accountingOfficeErrors.officeCod}
                          helperText={accountingOfficeErrors.officeCod && t('provisions.newProvision.requestData.supplyType.form.errors.required')}
                        />
                    }
                  </Grid>
                  <Grid item md={3} sm={3}>
                    <FormControlLabel
                      control={<Checkbox
                        checked={accountingOfficeData.indAccountingOffice === '1'}
                        disabled={tramitadoraOfficeData.officeCod !== '' || tramitadoraOfficeData.officeName !== '' || state >= 2}
                      />}
                      onChange={(e) => handleOfficeInd(e, ACCOUNTING_OFFICE)}
                      label={t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.digitalBill.checkbox')}
                      disabled={accountingOfficeData.officeCod !== ''|| tramitadoraOfficeData.officeName !== '' || state >= 2}
                      className={classes.checkBox}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid container md={4} sm={4} />
              <Grid container item direction='column' md={8} sm={8} xs={12} className={classes.lastInputContainer}>
                <Grid item className={`${classes.inputLabel} ${accountingOfficeData.indAccountingOffice === '1' && classes.disabled}`}>
                  <Typography>{t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.digitalBill.description')}</Typography>
                </Grid>
                <Grid item className={classes.input}>
                  {
                    state >= 2 ?
                      <Typography className={classes.stateLabel}>{accountingOfficeData.officeName}</Typography>
                    :
                      <Input
                        fullWidth
                        value={accountingOfficeData.officeName}
                        onChange={(e) => handleOfficeName(e, ACCOUNTING_OFFICE)}
                        onBlur={(e) => e.target.value === '' ? setErrorsAndUpdate({ ...accountingOfficeErrors, officeName: true }, ACCOUNTING_OFFICE) : setErrorsAndUpdate({ ...accountingOfficeErrors, officeName: false }, ACCOUNTING_OFFICE)}
                        disabled={accountingOfficeData.indAccountingOffice === '1'}
                        error={accountingOfficeErrors.officeName}
                        helperText={accountingOfficeErrors.officeName && t('provisions.newProvision.requestData.supplyType.form.errors.required')}
                      />
                  }
                </Grid>
              </Grid>
            </Grid>

            <Grid container justifyContent='space-between'>
              <Grid container className={classes.label} md={4} sm={4}>
                <Grid item>{t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.digitalBill.offices.teamManager.title')}</Grid>
              </Grid>
              <Grid container className={classes.inputContainer} md={8} sm={8} xs={12}>
                <Grid item className={`${classes.inputLabel} ${teamManagerOfficeData.indTeamManager === '1' && classes.disabled}`}>
                  <Typography>{t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.digitalBill.offices.teamManager.label')}</Typography>
                </Grid>
                <Grid container justifyContent='space-between' alignItems='center' className={classes.input}>
                  <Grid item md={8} sm={8}>
                  {
                    state >= 2 ?
                      <Typography className={classes.stateLabel}>{teamManagerOfficeData.officeCod}</Typography>
                    :
                      <Input
                        fullWidth
                        value={teamManagerOfficeData.officeCod}
                        onChange={(e) => handleOfficeCod(e, TEAM_MANAGER_OFFICE)}
                        onBlur={(e) => e.target.value === '' ? setErrorsAndUpdate({ ...teamManagerOfficeErrors, officeCod: true }, TEAM_MANAGER_OFFICE) : setErrorsAndUpdate({ ...teamManagerOfficeErrors, officeCod: false }, TEAM_MANAGER_OFFICE)}
                        disabled={teamManagerOfficeData.indTeamManager === '1'}
                        error={teamManagerOfficeErrors.officeCod}
                        helperText={teamManagerOfficeErrors.officeCod && t('provisions.newProvision.requestData.supplyType.form.errors.required')}
                      />
                  }
                  </Grid>
                  <Grid item md={3} sm={3}>
                    <FormControlLabel
                      control={<Checkbox
                        checked={teamManagerOfficeData.indTeamManager === '1'}
                        disabled={tramitadoraOfficeData.officeCod !== '' || tramitadoraOfficeData.officeName !== '' || state >= 2}
                      />}
                      onChange={(e) => handleOfficeInd(e, TEAM_MANAGER_OFFICE)}
                      label={t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.digitalBill.checkbox')}
                      disabled={teamManagerOfficeData.officeCod !== '' || tramitadoraOfficeData.officeName !== '' || state >= 2}
                      className={classes.checkBox}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid container md={4} sm={4} />
              <Grid container item direction='column' md={8} sm={8} xs={12} className={classes.lastInputContainer}>
                <Grid item className={`${classes.inputLabel} ${teamManagerOfficeData.indTeamManager === '1' && classes.disabled}`}>
                  <Typography>{t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.digitalBill.description')}</Typography>
                </Grid>
                <Grid item className={classes.input}>
                  {
                    state >= 2 ?
                      <Typography className={classes.stateLabel}>{teamManagerOfficeData.officeName}</Typography>
                    :
                      <Input
                        fullWidth
                        value={teamManagerOfficeData.officeName}
                        onChange={(e) => handleOfficeName(e, TEAM_MANAGER_OFFICE)}
                        onBlur={(e) => e.target.value === '' ? setErrorsAndUpdate({ ...teamManagerOfficeErrors, officeName: true }, TEAM_MANAGER_OFFICE) : setErrorsAndUpdate({ ...teamManagerOfficeErrors, officeName: false }, TEAM_MANAGER_OFFICE)}
                        disabled={teamManagerOfficeData.indTeamManager === '1'}
                        error={teamManagerOfficeErrors.officeName}
                        helperText={teamManagerOfficeErrors.officeName && t('provisions.newProvision.requestData.supplyType.form.errors.required')}
                      />
                  }
                </Grid>
              </Grid>
            </Grid>

            <Grid container justifyContent='space-between'>
              <Grid container className={classes.label} md={4} sm={4}>
                <Grid item >{t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.digitalBill.offices.tramitadora.title')}</Grid>
              </Grid>
              <Grid container className={classes.inputContainer} md={8} sm={8} xs={12}>
                <Grid item className={`${classes.inputLabel} ${tramitadoraOfficeData.indTramitadoraOffice === '1' && classes.disabled}`}>
                  <Typography>{t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.digitalBill.offices.tramitadora.label')}</Typography>
                </Grid>
                <Grid container justifyContent='space-between' alignItems='center' className={classes.input}>
                  <Grid item md={8} sm={8}>
                    {
                      state >= 2 ?
                        <Typography className={classes.stateLabel}>{tramitadoraOfficeData.officeCod}</Typography>
                      :
                        <Input
                          fullWidth
                          value={tramitadoraOfficeData.officeCod}
                          onChange={(e) => handleOfficeCod(e, TRAMITADORA_OFFICE)}
                          onBlur={(e) => e.target.value === '' ? setErrorsAndUpdate({ ...tramitadoraOfficeErrors, officeCod: true }, TRAMITADORA_OFFICE) : setErrorsAndUpdate({ ...tramitadoraOfficeErrors, officeCod: false }, TRAMITADORA_OFFICE)}
                          disabled={tramitadoraOfficeData.indTramitadoraOffice === '1'}
                          error={tramitadoraOfficeErrors.officeCod}
                          helperText={tramitadoraOfficeErrors.officeCod && t('provisions.newProvision.requestData.supplyType.form.errors.required')}
                        />
                    }
                  </Grid>
                  <Grid item md={3} sm={3}>
                    <FormControlLabel
                      control={<Checkbox
                        checked={tramitadoraOfficeData.indTramitadoraOffice === '1'}
                        disabled={tramitadoraOfficeData.officeCod !== '' || tramitadoraOfficeData.officeName !== '' || state >= 2}
                      />}
                      onChange={(e) => handleOfficeInd(e, TRAMITADORA_OFFICE)}
                      label={t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.digitalBill.checkbox')}
                      disabled={tramitadoraOfficeData.officeCod !== ''|| tramitadoraOfficeData.officeName !== '' || state >= 2}
                      className={classes.checkBox}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid container md={4} sm={4} />
              <Grid container item direction='column' md={8} sm={8} xs={12} className={classes.lastInputContainer}>
                <Grid item className={`${classes.inputLabel} ${tramitadoraOfficeData.indTramitadoraOffice === '1' && classes.disabled}`}>
                  <Typography>{t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.digitalBill.description')}</Typography>
                </Grid>
                <Grid item className={classes.input}>
                  {
                    state >= 2 ?
                      <Typography className={classes.stateLabel}>{tramitadoraOfficeData.officeName}</Typography>
                    :
                      <Input
                        fullWidth
                        value={tramitadoraOfficeData.officeName}
                        onChange={(e) => handleOfficeName(e, TRAMITADORA_OFFICE)}
                        onBlur={(e) => e.target.value === '' ? setErrorsAndUpdate({ ...tramitadoraOfficeErrors, officeName: true }, TRAMITADORA_OFFICE) : setErrorsAndUpdate({ ...tramitadoraOfficeErrors, officeName: false }, TRAMITADORA_OFFICE)}
                        disabled={tramitadoraOfficeData.indTramitadoraOffice === '1'}
                        error={tramitadoraOfficeErrors.officeName}
                        helperText={tramitadoraOfficeErrors.officeName && t('provisions.newProvision.requestData.supplyType.form.errors.required')}
                      />
                    }
                </Grid>
              </Grid>
            </Grid>

        </Grid>
      </Grid>
    </>
  )
}

export default DigitalBill
