import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import Input from '../../../../../common/components/input/Input'
import Select from '../../../../../common/components/select/Select'

import { getTracksTypes, noAccents } from '../../../../../common/lib/FormatLib'

import useStyles from './AddressForm.styles'

import { sendGAEvent } from '../../../../../core/utils/gtm'

const AddressForm = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const requests = useSelector((state: any) => state.requests)

  const cadastreUrl = process.env.REACT_APP_CADSTRE_ENDPOINT

  const {
    addressData,
    setAddressData,
    addressErrors,
    setAddressErrors
  } = props

  const [ statesList, setStatesList ] = useState([] as any)
  const [ townsList, setTownsList ] = useState([] as any)
  const [ loadingStatesList, setLoadingStatesList ] = useState(false)
  const [ loadingTownsList, setLoadingTownsList ] = useState(false)

  const handleUpdateErrors = (errors) => {
    setAddressErrors(errors)
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
          reactComponent: 'AddressForm.tsx - useEffect',
          apiUrl: 'post /catastro',
          codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
        }
      });
    }
    
  // eslint-disable-next-line
  }, [])

  useEffect(() => {
    // cargar lista de poblaciones correspondientes a una provincia
    if (addressData.state && addressData.state !== '') {
      setLoadingTownsList(true)

      let state = addressData.state

      if (state.startsWith('A CORU')) {
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
            reactComponent: 'AddressForm.tsx - useEffect',
            apiUrl: 'post /catastro',
            codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
          }
        });
      }
    }
  // eslint-disable-next-line
  }, [ addressData.state ])

  return (
    <div className={classes.container}>
      <div className={classes.description}>
        {
          (requests.newRequestSteps.step1 === 'SUPPLY' && requests.newRequestSteps.step3 === 'INCIDENCE') &&
          t('requests.newRequest.form.addressForm.descriptions.supply')
        }

        {
          (requests.newRequestSteps.step1 === 'FRAUD' && requests.newRequestSteps.step3 === 'PERSONAL-DATA') &&
          t('requests.newRequest.form.addressForm.descriptions.fraud')
        }

        {
          (requests.newRequestSteps.step1 === 'INCIDENTS') &&
          t('requests.newRequest.form.addressForm.descriptions.incident')
        }
      </div>

      <Grid container className={classes.inputs} spacing={3}>
        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>{t('requests.newRequest.form.addressForm.inputs.labels.field1')}</div>
            </Grid>

            <Grid item>
              <Select
                fullWidth
                label={t('requests.newRequest.form.addressForm.inputs.placeholders.field1')}
                value={addressData && addressData.state}
                values={statesList}
                onChange={(e) => {
                  setAddressData({
                    ...addressData,
                    state: noAccents(e.target.value),
                    town: ''
                  })
                }}
                onBlur={(e) => {
                  e.target.value === '' ?
                    handleUpdateErrors({
                      ...addressErrors,
                      state: true
                    })
                  :
                    handleUpdateErrors({
                      ...addressErrors,
                      state: false
                    })
                }}
                error={addressErrors.state}
                helperText={addressErrors.state && t('requests.newRequest.form.addressForm.inputs.errors.required')}
                disabled={loadingStatesList}
                isLoading={loadingStatesList}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>{t('requests.newRequest.form.addressForm.inputs.labels.field2')}</div>
            </Grid>

            <Grid item>
              <Select
                fullWidth
                label={t('requests.newRequest.form.addressForm.inputs.placeholders.field2')}
                value={addressData && addressData.town}
                values={townsList}
                onChange={(e) => {
                  setAddressData({
                    ...addressData,
                    town: noAccents(e.target.value)
                  })
                }}
                onBlur={(e) => {
                  e.target.value === '' ?
                    handleUpdateErrors({
                      ...addressErrors,
                      town: true
                    })
                  :
                    handleUpdateErrors({
                      ...addressErrors,
                      town: false
                    })
                }}
                error={addressErrors.town}
                helperText={addressErrors.town && t('requests.newRequest.form.addressForm.inputs.errors.required')}
                disabled={addressData.state === '' || loadingTownsList}
                isLoading={loadingTownsList}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>{t('requests.newRequest.form.addressForm.inputs.labels.field3')}</div>
            </Grid>

            <Grid item>
              <Input
                fullWidth
                value={addressData && addressData.cp}
                onChange={(e) => {
                  const value = e.target.value

                  setAddressData({
                    ...addressData,
                    cp: value
                  })

                  if (value === '') {
                    handleUpdateErrors({
                      ...addressErrors,
                      cp: true
                    })
                  } else {
                    handleUpdateErrors({
                      ...addressErrors,
                      cp: false
                    })
                  }
                }}
                error={addressErrors.cp}
                helperText={addressErrors.cp && t('requests.newRequest.form.addressForm.inputs.errors.required')}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item md={6} sm={12} xs={12} />

        <Grid item md={6} sm={12} xs={12} >
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>{t('requests.newRequest.form.addressForm.inputs.labels.field4')}</div>
            </Grid>

            <Grid item>
              <Select
                fullWidth
                codFiltering
                label={t('requests.newRequest.form.addressForm.inputs.placeholders.field4')}
                value={addressData && addressData.roadType}
                values={getTracksTypes()}
                onChange={(e) => {
                  setAddressData({
                    ...addressData,
                    roadType: e.target.value
                  })
                }}
                onBlur={(e) => {
                  e.target.value === '' ?
                    handleUpdateErrors({
                      ...addressErrors,
                      roadType: true
                    })
                  :
                    handleUpdateErrors({
                      ...addressErrors,
                      roadType: false
                    })
                }}
                error={addressErrors.roadType}
                helperText={addressErrors.roadType && t('requests.newRequest.form.addressForm.inputs.errors.required')}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>{t('requests.newRequest.form.addressForm.inputs.labels.field5')}</div>
            </Grid>

            <Grid item>
              <Input
                fullWidth
                value={addressData && addressData.roadName}
                onChange={(e) => {
                  const value = e.target.value

                  setAddressData({
                    ...addressData,
                    roadName: value
                  })

                  if (value === '') {
                    handleUpdateErrors({
                      ...addressErrors,
                      roadName: true
                    })
                  } else {
                    handleUpdateErrors({
                      ...addressErrors,
                      roadName: false
                    })
                  }
                }}
                error={addressErrors.roadName}
                helperText={addressErrors.roadName && t('requests.newRequest.form.addressForm.inputs.errors.required')}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>{t('requests.newRequest.form.addressForm.inputs.labels.field6')}</div>
            </Grid>

            <Grid item>
              <Input
                fullWidth
                value={addressData && addressData.number}
                onChange={(e) => {
                  const value = e.target.value

                  setAddressData({
                    ...addressData,
                    number: value
                  })

                  if (value === '') {
                    handleUpdateErrors({
                      ...addressErrors,
                      number: true
                    })
                  } else {
                    handleUpdateErrors({
                      ...addressErrors,
                      number: false
                    })
                  }
                }}
                error={addressErrors.number}
                helperText={addressErrors.number && t('requests.newRequest.form.addressForm.inputs.errors.required')}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item md={6} sm={12} xs={12} />

        <Grid item md={3} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>{t('requests.newRequest.form.addressForm.inputs.labels.field7')}</div>
            </Grid>

            <Grid item>
              <Input
                fullWidth
                value={addressData && addressData.block}
                onChange={(e) => {
                  const value = e.target.value

                  setAddressData({
                    ...addressData,
                    block: value
                  })
                }}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item md={3} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>{t('requests.newRequest.form.addressForm.inputs.labels.field8')}</div>
            </Grid>

            <Grid item>
              <Input
                fullWidth
                value={addressData && addressData.stair}
                onChange={(e) => {
                  const value = e.target.value

                  setAddressData({
                    ...addressData,
                    stair: value
                  })
                }}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item md={3} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>{t('requests.newRequest.form.addressForm.inputs.labels.field9')}</div>
            </Grid>

            <Grid item>
              <Input
                fullWidth
                value={addressData && addressData.floor}
                onChange={(e) => {
                  const value = e.target.value

                  setAddressData({
                    ...addressData,
                    floor: value
                  })
                }}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item md={3} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>{t('requests.newRequest.form.addressForm.inputs.labels.field10')}</div>
            </Grid>

            <Grid item>
              <Input
                fullWidth
                value={addressData && addressData.door}
                onChange={(e) => {
                  const value = e.target.value

                  setAddressData({
                    ...addressData,
                    door: value
                  })
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default AddressForm
