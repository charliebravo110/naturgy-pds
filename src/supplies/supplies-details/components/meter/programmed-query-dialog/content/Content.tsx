import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Grid from '@material-ui/core/Grid'
import { RadioGroup, FormControlLabel } from '@material-ui/core'

import TextButton from '../../../../../../common/components/text-button/TextButton'
import Button from '../../../../../../common/components/button/Button'
import Datepicker from '../../../../../../common/components/datepicker/Datepicker'
import Checkbox from '../../../../../../common/components/checkbox/Checkbox'
import Radio from '../../../../../../common/components/radio/Radio'
import Spinner from '../../../../../../common/components/spinner/Spinner'

import { formatDate, convertStringToDateHours, getOneYearFromDate, formatDayAndMonthToDate } from '../../../../../../common/lib/FormatLib'

import CloseIcon from '../../../../../../assets/icons/cerrar.svg'

import {
  thunkGetMasterData,
  thunkGetProgrammedQuery,
  thunkCreateOrUpdateProgrammedQuery,
  thunkDeleteProgrammedQuery
} from '../../../../store/actions/SuppliesDetailsThunkActions'

import useStyles from './Content.styles'

const Content = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { supplyData, handleReturn } = props

  const user = useSelector((state: any) => state.user.profile)

  const [ isLoading, setIsLoading ] = useState(false)
  const [ isEmpty, setIsEmpty ] = useState(true)
  const [ existingProgrammedQuery, setExistingProgrammedQuery ] = useState(false)
  const [ readingTypesIds, setReadingTypeIds ] = useState('')
  const [ recurrenceTypes, setRecurrenceTypes ] = useState([] as any)

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
        recurrent: 0
      } as any
    }
  }

  const [ programmedQuery, setProgrammedQuery ] = useState(getProgrammedQueryDefault(false))

  useEffect(() => {
    if (programmedQuery && programmedQuery.meterId) {
      setIsLoading(true)
      dispatch(
        thunkGetProgrammedQuery(programmedQuery.meterId, (response) => {
          if (response && response.query) {
            setExistingProgrammedQuery(true)
            const hourDate = convertStringToDateHours(response.query.hour)
            setProgrammedQuery({ ...response.query, hour: hourDate })
          }
          setIsLoading(false)
        })
      )
    }
  }, [ programmedQuery.meterId ])

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
  }, [ recurrenceTypes ])

  /* Carga de los readingTypeIds desde Master Data */
  useEffect(() => {
    setIsLoading(true)
    const readingTypeKey = supplyData.installationType === 'Monofásica' ? 'FASE_MONOF' : 'FASE_TRIFA'
    dispatch(thunkGetMasterData('METER_READING_TYPE_ID', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), readingTypeKey, (response) => {
      let readingTypeIds = ''
      if (response && response.length > 0) {
        response.map(item => {
          readingTypeIds = readingTypeIds === '' ? item.value : readingTypeIds+','+item.value
        })
        setReadingTypeIds(readingTypeIds)
      }
      setIsLoading(false)
    }))
  }, [ user ])

  useEffect(
    () => {
      setIsEmpty &&
        setIsEmpty(
          Object.keys(programmedQuery).filter((key) => programmedQuery[key] === '').length > 0
        )
      // eslint-disable-next-line
    },
    [ programmedQuery ]
  )

  /* Cambio de fecha a la máxima aceptada en caso de sobrepasar el año */
  useEffect(() => {
    if (programmedQuery.programmedDate && programmedQuery.endDate) {
      const date = getOneYearFromDate(programmedQuery.programmedDate)
      const endDate = formatDayAndMonthToDate(programmedQuery.endDate)
      if (date.getTime() < endDate.getTime()) {
        setProgrammedQuery({ ...programmedQuery, endDate: formatDate(date) })
      }
    }
  }, [ programmedQuery.programmedDate ])

  useEffect(
    () => {
      if (!isLoading) {
        if (programmedQuery.recurrent === 1) {
          const date = getOneYearFromDate(programmedQuery.programmedDate)
          setProgrammedQuery({
            ...programmedQuery,
            endDate: programmedQuery.endDate ? programmedQuery.endDate : date && formatDate(date),
            type: programmedQuery.type ? programmedQuery.type : 'weekly'
          })
        } else {
          let objAux = programmedQuery
          delete objAux.endDate
          delete objAux.type
          setProgrammedQuery(objAux)
        }
      }
    },
    [ isLoading, programmedQuery.recurrent ]
  )

  const handleDateChange = (programmedDate) => {
    setProgrammedQuery({ ...programmedQuery, programmedDate })
  }

  const handleEndDateChange = (endDate) => {
    setProgrammedQuery({ ...programmedQuery, endDate })
  }

  const handleHourChange = (hour) => {
    setProgrammedQuery({ ...programmedQuery, hour })
  }

  const handleRecurrentChange = (e) => {
    setProgrammedQuery({ ...programmedQuery, recurrent: e.target.checked ? 1 : 0 })
  }

  const handleTypeChange = (e) => {
    setProgrammedQuery({ ...programmedQuery, type: e.target.value })
  }

  const handlePostPorgrammedQuery = () => {
    if (!isEmpty) {
      setIsLoading(true)
      // Cambio de formato de hora
      const body = {
        ...programmedQuery,
        readingTypeIds: readingTypesIds,
        hour:
          `${('0' + programmedQuery.hour.getHours()).slice(-2)}:${('0' +
            programmedQuery.hour.getMinutes()).slice(-2)}`
      }
      dispatch(
        thunkCreateOrUpdateProgrammedQuery(body, (response) => {
          if (response) {
            setExistingProgrammedQuery(true)
          }
          setIsLoading(false)
          handleReturn()
        })
      )
    }
  }

  const handleDeletePorgrammedQuery = () => {
    if (existingProgrammedQuery) {
      setIsLoading(true)
      dispatch(
        thunkDeleteProgrammedQuery(programmedQuery.meterId, () => {
          setProgrammedQuery(getProgrammedQueryDefault(true))
          setExistingProgrammedQuery(false)
          setIsLoading(false)
        })
      )
    }
  }

  return (
    <Grid container className={classes.container} justifyContent='center'>
      {isLoading && <Spinner />}
      <Grid container justifyContent='flex-end'>
        <TextButton className={classes.closeButton} onClick={handleReturn}>
          <img src={CloseIcon} alt='' />
        </TextButton>
      </Grid>
      <Grid container direction='column' spacing={4} justifyContent='center'>
        <Grid item>Establecer frecuencia de consulta de datos semanal</Grid>

        <Grid item container justifyContent='space-between' spacing={2}>
          <Grid item md={5}>
            <Grid container>
              <Grid item xs={12}>Fecha de programación</Grid>
              <Grid item>
                <Datepicker
                  date={programmedQuery.programmedDate}
                  setDate={handleDateChange}
                  minDate={new Date()}
                  maxDate={false}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={5}>
            <Grid container>
              <Grid item xs={12}>Hora</Grid>
              <Grid item>
                <Datepicker
                  selected={programmedQuery.hour}
                  onChange={(date) => handleHourChange(date)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  dateFormat='hh:mm aa'
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid item container justifyContent='space-between' alignItems='center' spacing={2}>
          <Grid item md={5}>
            <Grid container alignItems='center'>
              <Grid item>
                <Checkbox
                  checked={programmedQuery.recurrent === 1}
                  onChange={handleRecurrentChange}
                />
              </Grid>
              <Grid item>Recurrente</Grid>
            </Grid>
          </Grid>
          {programmedQuery.recurrent === 1 && (
            <Grid item md={5}>
              <Grid container>
                <Grid item>Fecha de fin</Grid>
                <Grid item>
                  <Datepicker
                    date={programmedQuery.endDate}
                    setDate={handleEndDateChange}
                    minDate={new Date()}
                    maxDate={getOneYearFromDate(programmedQuery.programmedDate)}
                  />
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>

        {programmedQuery.recurrent === 1 && (
          <Grid item container alignItems='center'>
            <RadioGroup
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
          </Grid>
        )}

        <Grid item container justifyContent='center'>
          <Grid item container justifyContent='space-around' spacing={2}>
            <Grid item md='auto' xs={12}>
              <Button
                text={'Aceptar'}
                color={'primary'}
                size={'medium'}
                variant={'contained'}
                disabled={isEmpty}
                onClick={handlePostPorgrammedQuery}
              />
            </Grid>
            <Grid item md='auto' xs={12}>
              <Button
                text={'Cancelar'}
                color={'primary'}
                size={'medium'}
                variant={'contained'}
                onClick={handleReturn}
              />
            </Grid>
            <Grid item md='auto' xs={12}>
              <Button
                text={'Borrar recurrencia'}
                color={'primary'}
                size={'medium'}
                variant={'contained'}
                disabled={!existingProgrammedQuery}
                onClick={handleDeletePorgrammedQuery}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Content
