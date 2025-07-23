import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import { RadioGroup, FormControlLabel } from '@material-ui/core'

import Button from '../../../../../../common/components/button/Button'
import Datepicker from '../../../../../../common/components/datepicker/Datepicker'
import Checkbox from '../../../../../../common/components/checkbox/Checkbox'
import Radio from '../../../../../../common/components/radio/Radio'

import Logo from '../../../../../../assets/icons/ico_calendario_plazos.svg'
import infoLogo from '../../../../../../assets/icons/info.svg'

import SuccessDialog from './success-dialog/SuccessDialog'

import {
  formatDate,
  convertStringToDateHours,
  getOneYearFromDate,
  formatDayAndMonthToDate,
  getOneMonthFromDate,
  getSixDaysFromDate
} from '../../../../../../common/lib/FormatLib'

import {
  thunkGetMasterData,
  thunkGetProgrammedQuery,
  thunkCreateOrUpdateProgrammedQuery,
  thunkDeleteProgrammedQuery
} from '../../../../store/actions/SuppliesDetailsThunkActions'

import useStyles from './NewProgrammedReadForm.styles'
import { Link } from 'react-router-dom'
import IconTextButton from '../../../../../../common/components/icon-text-button/IconTextButton'
import HelpDialog from './helpDialog/HelpDialog'

const NewProgrammedReadForm = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const user = useSelector((state: any) => state.user.profile)

  const { supplyData, isLoading, setIsLoading } = props

  const [isEmpty, setIsEmpty] = useState(true)
  const [readingTypesIds, setReadingTypeIds] = useState('')
  const [recurrenceTypes, setRecurrenceTypes] = useState([] as any)
  const [existingProgrammedQuery, setExistingProgrammedQuery] = useState(false)
  const [connectionError, setConnectionError] = useState(false)
  const [deleteMessage, setDeleteMessage] = useState(false)
  const [enableHelper, setEnableHelper] = useState(false)

  const [DialogVisible, setDialogVisible] = useState(false)

  const getProgrammedQueryDefault = (fromDelete: boolean) => {
    if (!programmedQuery || fromDelete) {
      return {
        cups: supplyData.cups,
        documentNumber: user.documentNumber,
        meterId:
          supplyData.measurementEquipments &&
          supplyData.measurementEquipments.meters[0] &&
          supplyData.measurementEquipments.meters[0].meter,
        programmedDate: '',
        hour: '' as any,
        recurrent: 0,
        type: '',
        endDate: '',
        origin: 'S',
        creationDate: ''
      } as any
    }
  }

  const [programmedQuery, setProgrammedQuery] = useState(getProgrammedQueryDefault(false))

  const handleDateChange = (programmedDate) => {
    if (programmedQuery.recurrent === 1) {
      const date = getOneYearFromDate(programmedDate)

      setProgrammedQuery({ ...programmedQuery, programmedDate, endDate: formatDate(date), creationDate: programmedDate })
    } else {
      setProgrammedQuery({ ...programmedQuery, programmedDate, creationDate: programmedDate })
    }
  }

  const handleHourChange = (hour) => {
    setProgrammedQuery({ ...programmedQuery, hour })
  }

  const handleRecurrentChange = (e) => {
    let objAux = programmedQuery

    delete objAux.endDate
    delete objAux.type

    setProgrammedQuery({
      ...objAux,
      recurrent: e.target.checked ? 1 : 0
    })
  }

  const handleTypeChange = (e) => {
    if (programmedQuery.recurrent === 1) {

      setProgrammedQuery({ ...programmedQuery, type: e.target.value })
    }
  }

  const handleEndDateChange = (endDate) => {
    setProgrammedQuery({ ...programmedQuery, endDate })
  }

  const handlePostPorgrammedQuery = () => {
    if (!isEmpty) {
      setIsLoading(true)

      // Cambio de formato de hora
      const body = {
        ...programmedQuery,
        origin: 'S',
        readingTypeIds: readingTypesIds,
        hour:
          `${('0' + programmedQuery.hour.getHours()).slice(-2)}:${('0' +
            programmedQuery.hour.getMinutes()).slice(-2)}`
      }

      dispatch(thunkCreateOrUpdateProgrammedQuery(body, (response) => {
        if (response && response.result && response.result.codResult === '0000') {
          setDialogVisible(true)

          setExistingProgrammedQuery(true)
        }
        else {
          setDialogVisible(true)
          setConnectionError(true)
        }

        setIsLoading(false)
      }))
    }
  }

  const handleReturn = () => {
    setDialogVisible(false)
    setConnectionError(false)
    setDeleteMessage(false)
    setEnableHelper(false)
  }

  const handleDelete = () => {
    setDialogVisible(true)
    setDeleteMessage(true)
  }



  const handleDeletePorgrammedQuery = () => {
    handleReturn()
    if (existingProgrammedQuery) {
      setIsLoading(true)

      dispatch(thunkDeleteProgrammedQuery(programmedQuery.meterId, () => {
        setProgrammedQuery(getProgrammedQueryDefault(true))

        setExistingProgrammedQuery(false)

        setIsLoading(false)
      }))
    }
  }


  function compararFechasYProcesar(programmedDate, endDate) {
    const partesProgrammedDate = programmedDate.split('/');
    const partesEndDate = endDate ? endDate.split('/') : '';

    const programmed = new Date(partesProgrammedDate[2], partesProgrammedDate[1] - 1, partesProgrammedDate[0]);
    const end = new Date(partesEndDate[2], partesEndDate[1] - 1, partesEndDate[0]);

    if (programmed > end) {
      return endDate;
    } else {
      return programmedDate;
    }
  }

  const resetForms = () => {

    setProgrammedQuery(getProgrammedQueryDefault(true))
    setExistingProgrammedQuery(false)
  }

  /* Carga de los recurrenceTypes desde Master Data */
  useEffect(() => {
    if (recurrenceTypes && recurrenceTypes.length === 0) {
      setIsLoading(true)

      dispatch(
        thunkGetMasterData('RECURRENCE_TYPES', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), 'TYPES', (response) => {
          if (response && response.length > 0) {

            setRecurrenceTypes(response)
          }

          setIsLoading(false)
        })
      )

    }
  }, [recurrenceTypes])

  /* Carga de los readingTypeIds desde Master Data */
  useEffect(() => {
    setIsLoading(true)

    const readingTypeKey = supplyData.installationType === 'Monofásica' ? 'FASE_MONOF' : 'FASE_TRIFA'

    dispatch(thunkGetMasterData('METER_READING_TYPE_ID', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), readingTypeKey, (response) => {
      let readingTypeIds = ''

      if (response && response.length > 0) {
        response.map(item => {
          readingTypeIds = readingTypeIds === '' ? item.value : readingTypeIds + ',' + item.value
        })
        setReadingTypeIds(readingTypeIds)
      }

      setIsLoading(false)
    }))
  }, [user])

  //cuando cambia el type, modificamos la data maxima 
  useEffect(() => {
    let newDate
    if (programmedQuery.type === 'daily') {
      newDate = getSixDaysFromDate(programmedQuery.programmedDate)
    }
    else if (programmedQuery.type === 'weekly') {
      newDate = getOneMonthFromDate(programmedQuery.programmedDate)
    }
    else {
      newDate = getOneYearFromDate(programmedQuery.programmedDate)
    }

    setProgrammedQuery({ ...programmedQuery, endDate: formatDate(newDate) })

  }, [programmedQuery.type])

  useEffect(() => {
    setIsEmpty &&
      setIsEmpty(
        Object.keys(programmedQuery).filter((key) => programmedQuery[key] === '').length > 0
      )
    // eslint-disable-next-line
  }, [programmedQuery])

  /* Cambio de fecha a la máxima aceptada en caso de sobrepasar el año */
  useEffect(() => {
    if (programmedQuery.programmedDate && programmedQuery.endDate) {
      const date = getOneYearFromDate(programmedQuery.programmedDate)

      const endDate = formatDayAndMonthToDate(programmedQuery.endDate)

      if (date.getTime() < endDate.getTime()) {
        setProgrammedQuery({ ...programmedQuery, endDate: formatDate(date) })
      }
    }
  }, [programmedQuery.programmedDate])

  useEffect(() => {
    if (!isLoading) {
      if (programmedQuery.recurrent === 1) {
        const date = getOneYearFromDate(programmedQuery.programmedDate)

        setProgrammedQuery({
          ...programmedQuery,
          endDate: programmedQuery.endDate ? programmedQuery.endDate : date && formatDate(date),
          type: programmedQuery.type ? programmedQuery.type : 'monthly'
        })
      } else {
        let objAux = programmedQuery

        delete objAux.endDate
        delete objAux.type

        setProgrammedQuery(objAux)
      }
    }
  }, [isLoading, programmedQuery.recurrent])

  useEffect(() => {
    if (programmedQuery && programmedQuery.meterId) {
      setIsLoading(true)

      dispatch(thunkGetProgrammedQuery(programmedQuery.meterId, (response) => {
        if (response && response.query) {
          setExistingProgrammedQuery(true)

          const hourDate = convertStringToDateHours(response.query.hour)

          setProgrammedQuery({ ...response.query, hour: hourDate })
        }

        setIsLoading(false)
      }))
    }
  }, [programmedQuery.meterId])
  return (
    <>
      <SuccessDialog
        showing={DialogVisible}
        connectionError={connectionError}
        handleReturn={handleReturn}
        deleteMessage={deleteMessage}
        handleDeletePorgrammedQuery={handleDeletePorgrammedQuery}
        programmedQuery={programmedQuery}
      />

      <HelpDialog
        showing={enableHelper}
        handleReturn={handleReturn}
        recurrenceTypes={recurrenceTypes}
        programmedQuery={programmedQuery}
      />

      <div className={classes.container}>
        <div className={classes.title}>
          {t('supplies.suppliesDetails.components.meter.NewProgrammedReadForm.title')}
        </div>

        <div className={classes.description}>
          {t('supplies.suppliesDetails.components.meter.NewProgrammedReadForm.description')}
        </div>
        {existingProgrammedQuery &&
          <Grid container className={classes.existingProgrammedForm} justifyContent='space-between'>
            {programmedQuery.hour &&
              <Grid container md={8} sm={12} xs={12}>
                <Grid item>
                  <img src={Logo} alt='' className={classes.logo} />
                </Grid>
                <Grid item className={classes.existingProgrammedFormDescription}>
                  {programmedQuery.hour.getMinutes() === 0 ?
                    (t('supplies.suppliesDetails.components.meter.NewProgrammedReadForm.existingProgrammedQuery1') +
                      compararFechasYProcesar(programmedQuery.programmedDate, programmedQuery.endDate) +
                      t('supplies.suppliesDetails.components.meter.NewProgrammedReadForm.existingProgrammedQuery2') +
                      programmedQuery.hour.getHours() + ':00'
                    ) : (
                      t('supplies.suppliesDetails.components.meter.NewProgrammedReadForm.existingProgrammedQuery1') +
                      compararFechasYProcesar(programmedQuery.programmedDate, programmedQuery.endDate) +
                      t('supplies.suppliesDetails.components.meter.NewProgrammedReadForm.existingProgrammedQuery2') +
                      programmedQuery.hour.getHours() + ':' + programmedQuery.hour.getMinutes()
                    )}
                </Grid>
              </Grid>
            }
            <Grid item md={3} sm={12} xs={12} className={classes.marginButton}>
              <Button
                text={t('supplies.suppliesDetails.components.meter.NewProgrammedReadForm.form.delete')}
                color={'primary'}
                size={'medium'}
                variant={'contained'}
                onClick={handleDelete}
              />
            </Grid>
          </Grid>
        }

        <Grid container className={classes.form} spacing={2} justifyContent='space-between'>
          <Grid item md={4} sm={12} xs={12}>
            <Grid container>
              <Grid item className={classes.inputLabel} md={12} sm={12} xs={12}>
                {t('supplies.suppliesDetails.components.meter.NewProgrammedReadForm.form.startDate')}
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <Datepicker
                  date={existingProgrammedQuery ? (programmedQuery && programmedQuery.creationDate) ? programmedQuery.creationDate : compararFechasYProcesar(programmedQuery.programmedDate, programmedQuery.endDate) : programmedQuery.programmedDate}
                  setDate={handleDateChange}
                  minDate={new Date()}
                  disabled={existingProgrammedQuery}
                  maxDate={false}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item md={4} sm={12} xs={12}>
            <Grid container>
              <Grid item className={classes.inputLabel} md={12} sm={12} xs={12}>
                {t('supplies.suppliesDetails.components.meter.NewProgrammedReadForm.form.hour')}
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <Datepicker
                  selected={programmedQuery.hour}
                  onChange={(date) => handleHourChange(date)}
                  showTimeSelect
                  showTimeSelectOnly
                  disabled={existingProgrammedQuery}
                  timeIntervals={30}
                  dateFormat='hh:mm aa'
                  isHour={true}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item md={4} sm={12} xs={12}>
            <Grid container className={classes.recurrentContainer} alignItems='center'>
              <Grid item className={classes.recurrentLabel}>
                <Checkbox
                  checked={programmedQuery.recurrent === 1}
                  onChange={handleRecurrentChange}
                  disabled={existingProgrammedQuery}
                />
              </Grid>

              <Grid item>
                {t('supplies.suppliesDetails.components.meter.NewProgrammedReadForm.form.recurrence.label')}
              </Grid>
            </Grid>
            {programmedQuery.recurrent === 1 && !existingProgrammedQuery &&
              <Grid container className={(programmedQuery.recurrent === 0) && classes.disabled} alignItems='center'>
                <RadioGroup
                  className={classes.radioGroup}
                  aria-label='type'
                  name='type'
                  value={programmedQuery.type}
                  onChange={handleTypeChange}
                >
                  {
                    recurrenceTypes && recurrenceTypes.map(item => {
                      return <FormControlLabel key={item.key} value={item.value.split('|')[0]} checked={programmedQuery.type === item.value.split('|')[0]} control={<Radio />} label={item.value.split('|')[1]} />
                    })
                  }
                </RadioGroup>
                {/* radio buton */}
              </Grid>
            }
          </Grid>
        </Grid>

        <Grid container className={classes.form} spacing={2}>
          {
            (programmedQuery.recurrent === 1 && programmedQuery.programmedDate) &&
            <Grid item md={4} sm={12} xs={12}>
              <Grid container>
                <Grid item className={classes.inputLabel} md={12} sm={12} xs={12}>
                  {t('supplies.suppliesDetails.components.meter.NewProgrammedReadForm.form.endDate')}
                </Grid>

                <Grid item className={classes.endDateContainer} md={12} sm={12} xs={12}>
                  <Datepicker
                    date={programmedQuery.endDate && programmedQuery.endDate}
                    setDate={handleEndDateChange}
                    minDate={new Date()}
                    disabled={existingProgrammedQuery}
                    maxDate={programmedQuery.type === 'daily' ?
                      getSixDaysFromDate(programmedQuery.programmedDate)
                      :
                      programmedQuery.type === 'weekly' ?
                        getOneMonthFromDate(programmedQuery.programmedDate)
                        :
                        getOneYearFromDate(programmedQuery.programmedDate)
                    }
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Grid>
          }
        </Grid>

        <Grid container className={classes.infoTextContainer} >
          {/* <Grid item onClick={() => setEnableHelper(true)}>
            <img src={infoLogo} className={classes.logo} alt='' />
          </Grid> */}
          <Grid item xs={12} className={classes.marginCenter} onClick={() => setEnableHelper(true)}>
            <IconTextButton alignItems={'center'} icon={<img src={infoLogo} className={classes.textIconButton} alt='' />} text={t('supplies.suppliesDetails.components.meter.NewProgrammedReadForm.helper')} />
          </Grid>
          {/* <Grid item onClick={() => setEnableHelper(true)}>
            {t('supplies.suppliesDetails.components.meter.NewProgrammedReadForm.helper')}
          </Grid> */}
        </Grid>

        {existingProgrammedQuery ?
          (
            <Grid container className={classes.buttonContainer2} spacing={2}>
              <Grid item className={classes.button2}>
                <Button
                  text={t('supplies.suppliesDetails.components.meter.NewProgrammedReadForm.form.button')}
                  color={'primary'}
                  variant={'contained'}
                  disabled={isEmpty || existingProgrammedQuery}
                  fullWidth
                  onClick={handlePostPorgrammedQuery}
                />
              </Grid>
            </Grid>
          )
          :
          (<Grid container className={classes.buttonContainer} spacing={2}>
            <Grid item md={6} sm={6} xs={6}>
              <Button
                className={classes.button}
                text={t('supplies.suppliesDetails.components.meter.NewProgrammedReadForm.form.button')}
                color={'primary'}
                variant={'contained'}
                disabled={isEmpty || existingProgrammedQuery}
                fullWidth
                onClick={handlePostPorgrammedQuery}
              />
            </Grid>

            <Grid item md={6} sm={6} xs={6}>
              <Button
                className={classes.button3}
                text={t('supplies.suppliesDetails.components.meter.NewProgrammedReadForm.form.cancel')}
                color={'secondary'}
                variant={'contained'}
                fullWidth
                onClick={resetForms}
              />
            </Grid>
          </Grid>)

        }

      </div>
    </>
  )
}

export default NewProgrammedReadForm
