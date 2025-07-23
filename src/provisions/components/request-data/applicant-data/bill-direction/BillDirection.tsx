import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import Input from '../../../../../common/components/input/Input'
import Select from '../../../../../common/components/select/Select'

import { setInvoiceAddress } from '../../../../store/actions/ProvisionsActions'
import { getTracksTypes, noAccents } from '../../../../../common/lib/FormatLib'

import useStyles from './BillDirection.styles'

// LCS: Importar la función
import { sendGAEvent } from '../../../../../core/utils/gtm'

const BillDirection = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const { state, setIsEmpty, setErrorCheck } = props

  const currentProvision = useSelector((state: any) => state.provisions.currentProvision)

  const [ personData, setPersonData ] = useState({
    streetType: '',
    streetName: '',
    addNumber: '',
    town: '',
    zipcode: '',
    state: ''
  } as any)

  const [ errors, setErrors ] = useState({
    streetType: false,
    streetName: false,
    addNumber: false,
    town: false,
    zipcode: false,
    state: false
  } as any)

  const [ invalidZip, setInvalidZip ] = useState(false)

  const cadastreUrl = process.env.REACT_APP_CADSTRE_ENDPOINT

  const [ statesList, setStatesList ] = useState([] as any)
  const [ townsList, setTownsList ] = useState([] as any)
  const [ loadingStatesList, setLoadingStatesList ] = useState(false)
  const [ loadingTownsList, setLoadingTownsList ] = useState(false)

  const updateRequestData = (data) => {
    dispatch(setInvoiceAddress(data))
  }

  const setErrorsAndUpdate = (data) => {
    setErrors(data)

    updateRequestData({ ...personData })
  }

  /* Si hay una provision vigente se cargan los datos en el formulario */
  useEffect(() => {
    if (currentProvision && currentProvision.dossierCod) {
      setPersonData(currentProvision.invoiceAddress)
    }
  // eslint-disable-next-line
  }, [ currentProvision ])

  // Comprobar si el formulario tiene errores
  useEffect(() => {
    Object.keys(errors).filter((key) => errors[key]).length > 0 ?
      setErrorCheck(true)
    :
      setErrorCheck(false)
  // eslint-disable-next-line
  }, [ errors ])

  // Comprobar si el formulario esta vacio
  useEffect(() => {
    Object.keys(personData).filter((key) => personData[key] === '').length > 0 ?
      setIsEmpty(true)
    :
      setIsEmpty(false)
  // eslint-disable-next-line
  }, [ personData ])

  const handleStreetType = (e) => {
    setPersonData({ ...personData, streetType: e.target.value })
  }

  const handleStreetName = (e) => {
    setPersonData({ ...personData, streetName: e.target.value })
  }

  const handleAddNumber = (e) => {
    setPersonData({ ...personData, addNumber: e.target.value })
  }

  const handleStair = (e) => {
    if (e.target.value === '' && personData.stair) {
      const personAux = personData
      delete personAux.stair
      setPersonData(personAux)
    } else {
      setPersonData({ ...personData, stair: e.target.value })
    }
  }

  const handleFloor = (e) => {
    if (e.target.value === '' && personData.floor) {
      const personAux = personData
      delete personAux.floor
      setPersonData(personAux)
    } else {
      setPersonData({ ...personData, floor: e.target.value })
    }
  }

  const handleDoor = (e) => {
    if (e.target.value === '' && personData.door) {
      const personAux = personData
      delete personAux.door
      setPersonData(personAux)
    } else {
      setPersonData({ ...personData, door: e.target.value })
    }
  }

  const handleState = (e) => {
    setPersonData({ ...personData, state: noAccents(e.target.value) })
  }

  const handleTown = (e) => {
    setPersonData({ ...personData, town: noAccents(e.target.value) })
  }

  const handleZipcode = (e) => {
    setPersonData({ ...personData, zipcode: e.target.value })
  }

  const validateZipcode = (e) => {
    if (!isNaN(e.target.value) && e.target.value.length === 5) {
      setInvalidZip(false)
      setErrorsAndUpdate({...errors, zipcode: false})
    } else {
      if (e.target.value !== '') {
        setInvalidZip(true)
      } else {
        setInvalidZip(false)
      }
      setErrorsAndUpdate({...errors, zipcode: true})
    }
  }

  useEffect(() => {
    // cargar lista de provincias
    setLoadingStatesList(true)

    try {
      // LCS: Registrar el tiempo inicial
      const startTime = performance.now();

      fetch(cadastreUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
          'GNFHeader': {
            'IDServicio': 'CATASTRO',
            'IDOperacion': 'ConsultaProvincia',
            'IDCliente': 'ZEUS'
          }
        })
      }).then(async (response) => {
        const responseJson = await response.json()
  
        const statesList = [] as any
  
        responseJson && responseJson.provincias && responseJson.provincias.length > 0 && responseJson.provincias.map((item, key) => {
          return statesList.push(noAccents(item.nombre))
        })
  
        setStatesList(statesList)
  
        setLoadingStatesList(false)
      })

      // LCS: Registrar el tiempo final y calcular la duración
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      // LCS: Enviar evento a GA para medir el tiempo
      sendGAEvent({
        event: 'api_response_time',
        info: {
          apiUrl: 'post /catastro',
          apiUrlShort: 'post /catastro',
          responseTime: responseTime, // Tiempo de respuesta en milisegundos
        }
      });
    } catch (e) {
      // LCS: Enviar evento a GA
      sendGAEvent({
        event: 'api_error',
        info: {
          error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
          error: e,
          reactComponent: 'BillDirection.tsx - useEffect',
          apiUrl: 'post /catastro',
          codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
        }
      });
    }
    
  // eslint-disable-next-line
  }, [])

  useEffect(() => {
    // cargar lista de poblaciones correspondientes a una provincia
    if (personData.state !== '') {
      setLoadingTownsList(true)

      let state = personData.state

      if (state && state.startsWith('A CORU')) {
        state = 'A CORUÑA'
      }

      const body = '{"GNFHeader":{"IDServicio":"CATASTRO","IDOperacion":"ConsultaMunicipio","IDCliente":"ZEUS"},"provincia":"' + state + '"}'

      try {
        // LCS: Registrar el tiempo inicial
        const startTime = performance.now();

        fetch(cadastreUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          body
        }).then(async (response) => {
          const responseJson = await response.json()
  
          const townsList = [] as any
  
          responseJson && responseJson.municipios && responseJson.municipios.length > 0 && responseJson.municipios.map((item, key) => {
            return townsList.push(noAccents(item.nombre))
          })
  
          setTownsList(townsList)
  
          setLoadingTownsList(false)
        })

        // LCS: Registrar el tiempo final y calcular la duración
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        // LCS: Enviar evento a GA para medir el tiempo
        sendGAEvent({
          event: 'api_response_time',
          info: {
            apiUrl: 'post /catastro',
            apiUrlShort: 'post /catastro',
            responseTime: responseTime, // Tiempo de respuesta en milisegundos
          }
        });
      } catch (e) {
        // LCS: Enviar evento a GA
        sendGAEvent({
          event: 'api_error',
          info: {
            error_message: (e as any).result ? (e as any).result.msgResult : ((e as any).msgResult ? (e as any).msgResult : 'Error al llamar al servicio'),
            error: e,
            reactComponent: 'BillDirection.tsx - useEffect',
            apiUrl: 'post /catastro',
            codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
          }
        });
      }
    }
  // eslint-disable-next-line
  }, [ personData.state ])

  return (
    <Grid container justifyContent='space-between' spacing={3}>
      <Grid container item direction='column' xs={12} sm={6} className={classes.inputContainer}>
        <Grid item className={classes.label}>
          <Typography>
            {t(
              'provisions.newProvision.requestData.supplyType.form.applicantData.personData.inputs.streetType'
            )}
          </Typography>
        </Grid>
        <Grid item className={classes.input}>
          {
            state >= 2 ?
              <Typography className={classes.stateLabel}>{personData.streetType}</Typography>
            :
              <Select
                fullWidth
                codFiltering
                label={t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.inputs.streetTypeLabel')}
                value={personData && personData.streetType}
                values={getTracksTypes()}
                onChange={(e) => handleStreetType(e)}
                onBlur={(e) => e.target.value === '' ? setErrorsAndUpdate({ ...errors, streetType: true }) : setErrorsAndUpdate({ ...errors, streetType: false })}
                error={errors.streetType}
                helperText={errors.streetType && t('provisions.newProvision.requestData.supplyType.form.errors.required')}
              />
          }
        </Grid>
      </Grid>

      <Grid container item direction='column' xs={12} sm={6} className={classes.inputContainer}>
        <Grid item className={classes.label}>
          <Typography>
            {t(
              'provisions.newProvision.requestData.supplyType.form.applicantData.personData.inputs.streetName'
            )}
          </Typography>
        </Grid>
        <Grid item className={classes.input}>
          {state >= 2 ? (
            <Typography className={classes.stateLabel}>{personData.streetName}</Typography>
          ) : (
            <Input
              fullWidth
              value={personData.streetName}
              onChange={handleStreetName}
              onBlur={(e) =>
                e.target.value === ''
                  ? setErrorsAndUpdate({ ...errors, streetName: true })
                  : setErrorsAndUpdate({ ...errors, streetName: false })}
              error={errors.streetName}
              helperText={errors.streetName && t('provisions.newProvision.requestData.supplyType.form.errors.required')}
            />
          )}
        </Grid>
      </Grid>

      <Grid container item direction='column' xs={12} sm={6} className={classes.inputContainer}>
        <Grid item className={classes.label}>
          <Typography>
            {t(
              'provisions.newProvision.requestData.supplyType.form.applicantData.personData.inputs.addNumber'
            )}
          </Typography>
        </Grid>
        <Grid item className={classes.input}>
          {state >= 2 ? (
            <Typography className={classes.stateLabel}>{personData.addNumber}</Typography>
          ) : (
            <Input
              fullWidth
              onChange={handleAddNumber}
              onBlur={(e) =>
                e.target.value === ''
                  ? setErrorsAndUpdate({ ...errors, addNumber: true })
                  : setErrorsAndUpdate({ ...errors, addNumber: false })}
              error={errors.addNumber}
              helperText={errors.addNumber && t('provisions.newProvision.requestData.supplyType.form.errors.required')}
              inputProps={{
                maxLength: 15
              }}
            />
          )}
        </Grid>
      </Grid>

      <Grid container item direction='column' xs={12} sm={6} className={classes.inputContainer}>
        <Grid item className={classes.label}>
          <Typography>
            {t(
              'provisions.newProvision.requestData.supplyType.form.applicantData.personData.inputs.zipcode'
            )}
          </Typography>
        </Grid>
        <Grid item className={classes.input}>
          {state >= 2 ? (
            <Typography className={classes.stateLabel}>{personData.zipcode}</Typography>
          ) : (
            <Input
              fullWidth
              value={personData.zipcode}
              onChange={handleZipcode}
              onBlur={validateZipcode}
              error={errors.zipcode}
              helperText={errors.zipcode &&
                (invalidZip ?
                  t('provisions.newProvision.requestData.supplyType.form.errors.invalidZip')
                :
                  t('provisions.newProvision.requestData.supplyType.form.errors.required'))}
            />
          )}
        </Grid>
      </Grid>

      <Grid container item direction='column' xs={12} sm={6} className={classes.inputContainer}>
        <Grid item className={classes.label}>
          <Typography>
            {t(
              'provisions.newProvision.requestData.supplyType.form.applicantData.personData.inputs.province'
            )}
          </Typography>
        </Grid>
        <Grid item className={classes.input}>
          {
            state >= 2 ?
              <Typography className={classes.stateLabel}>{personData.state}</Typography>
            :
              <Select
                fullWidth
                label={t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.inputs.provinceLabel')}
                value={personData && personData.state}
                values={statesList}
                onChange={(e) => {
                  setPersonData({
                    ...personData,
                    town: ''
                  })

                  handleState(e)
                }}
                onBlur={(e) => e.target.value === '' ? setErrorsAndUpdate({ ...errors, state: true }) : setErrorsAndUpdate({ ...errors, state: false })}
                error={errors.state}
                helperText={errors.state && t('provisions.newProvision.requestData.supplyType.form.errors.required')}
                disabled={loadingStatesList}
                isLoading={loadingStatesList}
              />
          }
        </Grid>
      </Grid>

      <Grid container item direction='column' xs={12} sm={6} className={classes.inputContainer}>
        <Grid item className={classes.label}>
          <Typography>
            {t(
              'provisions.newProvision.requestData.supplyType.form.applicantData.personData.inputs.municipality'
            )}
          </Typography>
        </Grid>
        <Grid item className={classes.input}>
          {
            state >= 2 ?
              <Typography className={classes.stateLabel}>{personData.town}</Typography>
            :
              <Select
                fullWidth
                label={t('provisions.newProvision.requestData.supplyType.form.applicantData.personData.inputs.townLabel')}
                value={personData && personData.town}
                values={townsList}
                onChange={(e) => handleTown(e)}
                onBlur={(e) => e.target.value === '' ? setErrorsAndUpdate({ ...errors, town: true }) : setErrorsAndUpdate({ ...errors, town: false })}
                error={errors.town}
                helperText={errors.town && t('provisions.newProvision.requestData.supplyType.form.errors.required')}
                disabled={personData.state === '' || loadingTownsList}
                isLoading={loadingTownsList}
              />
          }
        </Grid>
      </Grid>

      <Grid container item direction='column' md={4} className={classes.inputContainer}>
        <Grid item className={classes.label}>
          <Typography>
            {t(
              'provisions.newProvision.requestData.supplyType.form.applicantData.personData.inputs.stair'
            )}
          </Typography>
        </Grid>
        <Grid item className={classes.input}>
          {state >= 2 ? (
            <Typography className={classes.stateLabel}>{personData.stair}</Typography>
          ) : (
            <Input
              fullWidth
              onChange={handleStair}
              onBlur={(e) => setErrorsAndUpdate({ ...errors, stair: false })}
              inputProps={{
                maxLength: 15
              }}
            />
          )}
        </Grid>
      </Grid>

      <Grid container item direction='column' md={4} className={classes.inputContainer}>
        <Grid item className={classes.label}>
          <Typography>
            {t(
              'provisions.newProvision.requestData.supplyType.form.applicantData.personData.inputs.floor'
            )}
          </Typography>
        </Grid>
        <Grid item className={classes.input}>
          {state >= 2 ? (
            <Typography className={classes.stateLabel}>{personData.floor}</Typography>
          ) : (
            <Input
              fullWidth
              onChange={handleFloor}
              onBlur={(e) => setErrorsAndUpdate({ ...errors, floor: false })}
              inputProps={{
                maxLength: 15
              }}
            />
          )}
        </Grid>
      </Grid>

      <Grid container item direction='column' md={4} className={classes.inputContainer}>
        <Grid item className={classes.label}>
          <Typography>
            {t(
              'provisions.newProvision.requestData.supplyType.form.applicantData.personData.inputs.door'
            )}
          </Typography>
        </Grid>
        <Grid item className={classes.input}>
          {state >= 2 ? (
            <Typography className={classes.stateLabel}>{personData.door}</Typography>
          ) : (
            <Input
              fullWidth
              onChange={handleDoor}
              onBlur={(e) => setErrorsAndUpdate({ ...errors, door: false })}
              inputProps={{
                maxLength: 15
              }}
            />
          )}
        </Grid>
      </Grid>

    </Grid>
  )
}

export default BillDirection
