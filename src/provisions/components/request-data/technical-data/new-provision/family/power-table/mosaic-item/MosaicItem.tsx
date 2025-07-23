import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import InputAdornment from '@material-ui/core/InputAdornment'

import Select from '../../../../../../../../common/components/select/Select'
import Input from '../../../../../../../../common/components/input/Input'
import InputNumeric from '../../../../../../../../common/components/input-numeric/InputNumeric'
import ArrowTooltipPower from '../../../../../../../../common/components/tooltip/arrow/ArrowTooltipPower'

import { thunkGetMasterData } from '../../../../../../../store/actions/ProvisionsThunkActions'

import useStyles from './MosaicItem.styles'

const MosaicItem = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const currentProvision = useSelector((state: any) => state.provisions.currentProvision)

  const provisions = useSelector((state: any) => state.provisions)
  const userToken = useSelector((state: any) => state.user.token)

  const [usesSelect, setUsesSelect] = useState([] as any)
  const [applicationType, setApplicationType] = useState('')
  const [useType, setUseType] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  const [potVehicle, setPotVehicle] = useState('')
  const [popUp, setPopUp] = useState(false)

  const {
    item,
    index,
    techData,
    oneSupplie,
    state,
    powerList,
    setPowerListI,
    powerListErrors,
    setPowerListErrors,
    typesSelect,
    setShowDialog,
    setDialogText
  } = props

  const [statusTooltip4, setStatusTooltip4] = useState<Boolean>(false)

  const selectValue = (select: any, value: any) => {
    const keyValue = select.filter((item) => item.substring(0, item.indexOf('|')) === value)

    return (
      keyValue &&
      keyValue[0] &&
      keyValue[0].substring(keyValue[0].indexOf('|') + 1, keyValue[0].length)
    )
  }

  useEffect(() => {
    if (state >= 1) {
      setApplicationType(selectValue(typesSelect, powerList[index].applicationType))

      setUseType(selectValue(usesSelect, powerList[index].useType))
    }
    // eslint-disable-next-line
  }, [state, typesSelect, usesSelect, powerList])

  const getAndSetMasterDataUseType = (key: string, setSelect: any) => {
    setIsLoading(true)

    dispatch(thunkGetMasterData('USE_TYPE', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), key, (response) => {
      if (response) {
        if (response.length > 0) {
          setSelect(
            response.map((item) => {
              return parseInt(item.value.split('|')[1].indexOf('(')) === -1 ?
                item.value
                :
                item.value.substring(0, item.value.indexOf('(') - 1)
            })
          )
        } else {
          setSelect([])
        }
      }

      setIsLoading(false)
    }))
  }

  useEffect(() => {
    if (!currentProvision.techData && item.applicationType) {
      const key = 'USE_TYPE_' + item.applicationType

      getAndSetMasterDataUseType(key, setUsesSelect)
    }
    // eslint-disable-next-line
  }, [currentProvision, item.applicationType])

  useEffect(() => {
    dispatch(thunkGetMasterData('POT_VEHICLE_ELE', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), 'POTVEHICLEELE', (response) => {
      if (response) {
        setPotVehicle(response[0].value)
      }
    }))
  }, [])

  useEffect(() => {
    if (provisions.selectedSupplySubtype === 'DOSSUB005' && currentProvision.techData && state >= 2 && usesSelect.length === 0) {
      const key = 'USE_TYPE_' + item.applicationType

      getAndSetMasterDataUseType(key, setUsesSelect)
    }
    // eslint-disable-next-line
  }, [provisions.selectedSupplySubtype, state, userToken, currentProvision])

  const handleTypeSupplie = (e, index) => {
    let auxListError = [] as any
    //reseteamos los errores si modificamos el tipo de detalle de potencias
    powerListErrors.map((item, i) => {
      let auxPowerListError = item
      if (index === i) {
        auxPowerListError = {
          ...item,
          applicationType:
          {
            bool: false,
            msg: ''
          },
          buildableArea: {
            bool: false,
            msg: ''
          },
          numberOfSupplies: {
            bool: false,
            msg: ''
          },
          requestPower: {
            bool: false,
            msg: ''
          }
        }
      }
      return auxListError.push(auxPowerListError)
    })
    setPowerListErrors(auxListError)
    setPowerListI(
      powerList.map((item, i) => {
        if (e.target.value === 'UTITYP005') {
          // industriales
          delete item.useType
        } else {
          item = {
            ...item,
            useType: ''
          }
        }

        return index === i ? { ...item, applicationType: e.target.value } : item
      })
    )
  }

  const handleUseSupplie = (e, index) => {
    let auxList = [] as any

    powerList.map((item, i) => {
      let auxItem = item

      if (index === i) {
        if (e.target.value === 'UTISUB011') {
          // vehiculo electrico
          delete auxItem.buildableArea
        } else if (typeof (auxItem.buildableArea) === 'undefined') {
          auxItem = {
            ...auxItem,
            buildableArea: ''
          }
        }

        auxItem = {
          ...auxItem,
          useType: e.target.value
        }

        if (item.useType === 'UTISUB011') {
          auxItem = {
            ...auxItem,
            requestPower: '',
            subtotalPower: ''
          }
        } else {
          auxItem = {
            ...auxItem,
            requestPower: e.target.value === 'UTISUB011' ? potVehicle : item.requestPower,
            subtotalPower: e.target.value === 'UTISUB011' ? potVehicle : item.subtotalPower
          }
        }
      }

      return auxList.push(auxItem)
    })

    setPowerListI(auxList)

    setPowerListErrors(
      powerListErrors.map((item, i) => {
        const check = e.target.value !== 'UTISUB011' && item.buildableArea === ''

        return index === i ?
          {
            ...item,
            buildableArea:
            {
              bool: check,
              msg:
                t('provisions.newProvision.requestData.supplyType.form.errors.requiredAndNotZero')
            }
          }
          :
          item
      })
    )
  }

  const handleNumberSupplies = (e, index?) => {
    if (!isNaN(e.target.value)) {
      setPowerListI(powerList.map((item, i) => {
        const subtotalPower = item.requestPower ? (+Number(e.target.value * parseFloat(item.requestPower)).toFixed(2)).toString() : item.subtotalPower
        const numberOfSupplies = e.target.value.toString()
        return index === i ? { ...item, subtotalPower: subtotalPower, numberOfSupplies: numberOfSupplies } : item
      }))
    }
  }

  const handleBuildableArea = (e, index) => {
    let area = e.target.value.replace(',', '.')
    if (!isNaN(area)) {
      setPowerListI(powerList.map((item, i) => {
        return index === i ? { ...item, buildableArea: area.replace(',', '.').replace(' ', '') } : item
      }))
    }
  }

  const handlePowerRequested = (e, index) => {
    let power = e.target.value.replace(',', '.')
    //let power = e.target.value

    if (power.includes('.')) {
      const auxValue = power.split('.');
      if (auxValue[1].length > 3) {
        power = auxValue[0] + '.' + auxValue[1].substring(0, 3);

        setPowerListErrors(powerListErrors.map((item, i) => {
          let check
          let msg
          if (index === i && powerList && powerList[i]) {
            check = true
            msg = t('provisions.newProvision.requestData.supplyType.form.errors.decimals')
            return { ...item, requestPower: { bool: check, msg: msg } }
          } else {
            return item
          }
        }))
      } else {
        setPowerListErrors(powerListErrors.map((item, i) => {
          let check
          let msg
          if (index === i && powerList && powerList[i]) {
            check = false
            msg = ''
            return {
              ...item, requestPower: { bool: check, msg: msg }
            }
          }
        }))
      }
    }

    if (!isNaN(power)) {
      setPowerListI(powerList.map((item, i) => {
        const subtotalPower = power !== '' ? (+Number(power * parseFloat(item.numberOfSupplies)).toFixed(2)).toString() : '0'
        const requestPower = power.toString()
        return index === i ? { ...item, subtotalPower: subtotalPower, requestPower: requestPower } : item
      }))
    }
  }

  const checkTypeSupplies = (e, index) => {
    setPowerListErrors(
      powerListErrors.map((item, i) => {
        const check = e.target.value === ''
        return index === i
          ? {
            ...item,
            applicationType:
            {
              bool: check,
              msg: t('provisions.newProvision.requestData.supplyType.form.errors.required')
            }
          }
          : item
      })
    )
  }

  const checkUseSupplies = (e, index) => {
    setPowerListErrors(powerListErrors.map((item, i) => {
      const check = e.target.value === ''
      return index === i ? { ...item, useType: { bool: check, msg: t('provisions.newProvision.requestData.supplyType.form.errors.required') } } : item
    }))
    setPowerListErrors(
      powerListErrors.map((item, i) => {
        let check
        let msg
        if (index === i && powerList && powerList[i] && powerList[i].requestPower !== '') {
          if (powerList[i].useType === 'UTISUB001' && powerList[i].requestPower < 5.75) {
            check = true
            msg = t('provisions.newProvision.requestData.supplyType.form.errors.min5')
          } else if (powerList[i].useType === 'UTISUB002' && powerList[i].requestPower < 9.2) {
            check = true
            msg = t('provisions.newProvision.requestData.supplyType.form.errors.min9')
          } else if ((powerList[i].useType === 'UTISUB009' || powerList[i].useType === 'UTISUB010') && powerList[i].requestPower < 3.4) {
            check = true
            msg = t('provisions.newProvision.requestData.supplyType.form.errors.min3-4')
          } else if (powerList[i].useType === 'UTISUB013' && powerList[i].requestPower < 3.45) {
            check = true
            msg = t('provisions.newProvision.requestData.supplyType.form.errors.min3-45')
          } else {
            check = false
          }
          return { ...item, requestPower: { bool: check, msg: msg } }
        } else {
          return item
        }
      })
    )
  }

  const checkNumberSupplies = (e, index) => {
    setPowerListErrors(powerListErrors.map((item, i) => {
      const check = e.target.value === '' || e.target.value === '0'
      return index === i ? { ...item, numberOfSupplies: { bool: check, msg: t('provisions.newProvision.requestData.supplyType.form.errors.requiredAndNotZero') } } : item
    }))
  }

  const checkBuildableArea = (e, index) => {
    setPowerListErrors(powerListErrors.map((item, i) => {
      const check = e.target.value === ''
      return index === i ? { ...item, buildableArea: { bool: check, msg: t('provisions.newProvision.requestData.supplyType.form.errors.required') } } : item
    }))
  }

  const checkPowerRequested = (e, index) => {
    setPowerListErrors(powerListErrors.map((item, i) => {
      let check
      let msg
      if (index === i && powerList && powerList[i]) {
        if (e.target.value === '' || e.target.value === '0') {
          check = true
          msg = t('provisions.newProvision.requestData.supplyType.form.errors.requiredAndNotZero')
        } else if (techData.electricVehicleCharging === '1' && powerList[i].requestPower < 9.2) {
          check = true
          msg = t('provisions.newProvision.requestData.supplyType.form.errors.min9')
        } else if ((provisions.techData.idDossierHeatingType === 'HEATSYS001' ||
          provisions.techData.idDossierAircondType === 'AIRCOD_PRE' ||
          provisions.techData.idDossierAircondType === 'AIRCOD_INS' ||
          parseInt(powerList[i].buildableArea) > 160) && powerList[i].requestPower < 9.2) {
          check = true
          msg = t('provisions.newProvision.requestData.supplyType.form.errors.min9')
          setDialogText(t('provisions.newProvision.requestData.supplyType.form.errors.min9'))
          setShowDialog(true)
        } else if (parseInt(powerList[i].buildableArea) < 160 && powerList[i].requestPower < 5.75) {
          check = true
          msg = t('provisions.newProvision.requestData.supplyType.form.errors.min5')
        } else if (techData.phase === 'FASE_MONOF' && powerList[i].requestPower > 15) {
          check = true
          msg = t('provisions.newProvision.requestData.supplyType.form.errors.max15')
          setDialogText(t('provisions.newProvision.requestData.supplyType.form.errors.max15'))
          setShowDialog(true)
        } else if (provisions.dossiersubtype === 'DOSSUB004' && powerList[i].applicationType === 'UTITYP001' && powerList[i].requestPower > 50) {
          check = false
          setDialogText(t('provisions.newProvision.requestData.supplyType.form.errors.powerError'))
          setShowDialog(true)
        } else if (provisions.techData.phase !== '' && provisions.techData.phase === 'FASE_MONOF' && powerList[i].requestPower > 15) {
          check = true
          setDialogText(t('provisions.newProvision.requestData.supplyType.form.errors.max15'))
          setShowDialog(true)
          msg = (t('provisions.newProvision.requestData.supplyType.form.errors.max15'))
        } else if (powerList[i].applicationType === 'UTITYP001' && powerList[i].requestPower > 50) {
          check = false
          setDialogText(t('provisions.newProvision.requestData.supplyType.form.errors.powerError'))
          setShowDialog(true)
        } else {
          check = false
        }
        return { ...item, requestPower: { bool: check, msg: msg } }
      } else {
        return item
      }
    }))
  }

  useEffect(() => {
    if (provisions.techData.electricVehicleCharging === '0') {
      // formatear los vehiculos electricos (useType = "UTISUB011")
      setPowerListI(
        powerList.map((item, index) => {
          return item.useType === 'UTISUB011' ?
            {
              ...item,
              useType: '',
              requestPower: '',
              subtotalPower: ''
            }
            :
            item
        })
      )
    }
    // eslint-disable-next-line
  }, [provisions.techData.electricVehicleCharging])

  const validateNumberImput = (e) => {
    const value = e.target.value;

    if (value !== '' && isNaN(value)) {
      e.target.value = value.slice(0, -1);
    } else {
      if (value.includes('.')) {
        const auxValue = value.split('.');
        if (auxValue[1].length > 3) {
          e.target.value = auxValue[0] + '.' + auxValue[1].substring(0, 3);
        }
      }
    }
  }

  return (
    <div key={index} className={classes.mobileRow}>
      <Grid container direction='column' className={classes.inputContainer}>
        <Grid item className={classes.label}>
          <Typography>
            {t(
              'provisions.newProvision.requestData.supplyType.form.technicalInstallationData.family.table.tableHead.col1'
            )}
          </Typography>
        </Grid>
        <Grid item className={classes.input}>
          {provisions.selectedSupplySubtype === 'DOSSUB004' ? state === 0 ? (
            <Input
              fullWidth
              value={
                typesSelect
                  .filter((item) => item.split('|')[0] === 'UTITYP001')
                  .map((item) => item.split('|')[1])[0]
              }
              disabled
            />
          ) : (
            <Typography className={classes.stateLabel}>
              {
                typesSelect
                  .filter((item) => item.split('|')[0] === 'UTITYP001')
                  .map((item) => item.split('|')[1])[0]
              }
            </Typography>
          ) : state === 0 ? (
            <Select
              fullWidth
              label={t(
                'provisions.newProvision.requestData.supplyType.form.technicalInstallationData.building.selectLabel.types'
              )}
              value={item.applicationType}
              values={typesSelect}
              codFiltering
              onChange={(e) => handleTypeSupplie(e, index)}
              onBlur={(e) => checkTypeSupplies(e, index)}
              error={powerListErrors[index] && powerListErrors[index].applicationType.bool}
              helperText={
                powerListErrors[index] && powerListErrors[index].applicationType.bool &&
                powerListErrors[index].applicationType.msg
              }
            />
          ) : (
            <Typography className={classes.stateLabel}>{applicationType}</Typography>
          )}
        </Grid>
      </Grid>

      {
        <Grid container direction='column' className={classes.inputContainer}>
          <Grid item className={classes.label}>
            <Typography>
              {t(
                'provisions.newProvision.requestData.supplyType.form.technicalInstallationData.family.table.tableHead.col2'
              )}
            </Typography>
          </Grid>
          <Grid item className={classes.input}>
            {state === 0 ? (
              <Select
                fullWidth
                label={t(
                  'provisions.newProvision.requestData.supplyType.form.technicalInstallationData.building.selectLabel.uses'
                )}
                value={item.useType}
                values={
                  provisions.techData.electricVehicleCharging === '0' ?
                    usesSelect.filter(i => !i.startsWith('UTISUB011'))
                    :
                    usesSelect
                }
                codFiltering
                onChange={(e) => handleUseSupplie(e, index)}
                onBlur={(e) => checkUseSupplies(e, index)}
                error={powerListErrors[index] && powerListErrors[index].useType && powerListErrors[index].useType.bool}
                helperText={powerListErrors[index] && powerListErrors[index].useType && powerListErrors[index].useType.bool && powerListErrors[index].useType.msg}
                disabled={(provisions.selectedSupplySubtype === 'DOSSUB004') && !item.applicationType || usesSelect.length === 0}
                isLoading={isLoading}
              />
            ) : (
              <Typography className={classes.stateLabel}>{useType}</Typography>
            )}
          </Grid>
        </Grid>
      }

      <Grid container direction='column' className={classes.inputContainer}>
        <Grid item className={classes.label}>
          <Typography>
            {t(
              'provisions.newProvision.requestData.supplyType.form.technicalInstallationData.family.table.tableHead.col3'
            )}
          </Typography>
        </Grid>
        <Grid item className={classes.input}>
          {state === 0 ? (
            <InputNumeric
              className={classes.mobileInput}
              value={item.numberOfSupplies}
              onChange={(e) => {
                handleNumberSupplies(e, index)
                checkNumberSupplies(e, index)
              }}
              disabled={oneSupplie}
              onBlur={(e) => checkNumberSupplies(e, index)}
              error={powerListErrors[index] && powerListErrors[index].numberOfSupplies && powerListErrors[index].numberOfSupplies.bool}
              helperText={
                powerListErrors[index] && powerListErrors[index].numberOfSupplies && powerListErrors[index].numberOfSupplies.bool &&
                powerListErrors[index].numberOfSupplies.msg
              }
            />
          ) : (
            <Typography className={classes.stateLabel}>{item.numberOfSupplies}</Typography>
          )}
        </Grid>
      </Grid>

      <Grid container direction='column' className={classes.inputContainer}>
        <Grid item className={classes.label}>
          <Typography>
            {t(
              'provisions.newProvision.requestData.supplyType.form.technicalInstallationData.family.table.tableHead.col4'
            )}
          </Typography>
        </Grid>
        <Grid item className={classes.input}>
          {state === 0 ? (
            <Input
              className={classes.mobileInput}
              value={item.buildableArea && item.buildableArea.replace('.', ',')}
              onChange={(e) => handleBuildableArea(e, index)}
              onBlur={(e) => checkBuildableArea(e, index)}
              error={powerListErrors[index] && powerListErrors[index].buildableArea && powerListErrors[index].buildableArea.bool}
              helperText={
                powerListErrors[index] && powerListErrors[index].buildableArea && powerListErrors[index].buildableArea.bool &&
                powerListErrors[index].buildableArea.msg
              }
            />
          ) : (
            <Typography className={classes.stateLabel}>
              {item.buildableArea ? parseFloat(item.buildableArea).toFixed(2).toString() : '0'}
            </Typography>
          )}
        </Grid>
      </Grid>

      <Grid container direction='column' className={classes.inputContainer}>
        <Grid item className={classes.label}>
          <Typography>
            {t(
              'provisions.newProvision.requestData.supplyType.form.technicalInstallationData.family.table.tableHead.col5'
            )}
          </Typography>
        </Grid>
        <Grid item className={classes.input}>
          {state === 0 ? (
            <ArrowTooltipPower
              title={t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.KWtooltip')}
              placement='top'
            >
              <Input
                className={classes.mobileInput}
                value={item.requestPower && item.requestPower.replace('.', ',')}
                //value={item.requestPower}
                onChange={(e) => handlePowerRequested(e, index)}
                //onInput={(e) => handlePowerRequested(e, index)}
                onBlur={(e) => checkPowerRequested(e, index)}
                error={powerListErrors[index] && powerListErrors[index].requestPower && powerListErrors[index].requestPower.bool}
                helperText={
                  powerListErrors[index] && powerListErrors[index].requestPower && powerListErrors[index].requestPower.bool && powerListErrors[index].requestPower.msg
                }
                InputProps={{
                  endAdornment: <InputAdornment position='end'>kW</InputAdornment>
                }}
              />
            </ArrowTooltipPower>
          ) : (
            <Typography className={classes.stateLabel}>{item.requestPower && item.requestPower.replace('.', ',')}</Typography>
          )}
        </Grid>
      </Grid>

      {
        props.location.pathname === '/provisions/detail' &&
        <Grid container direction='column' className={classes.inputContainer}>
          <Grid item className={classes.label}>
            <Typography>{t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.building.table.tableHead.col6')}</Typography>
          </Grid>

          <Grid item className={classes.input}>
            <Typography className={classes.stateLabel}>{item.subtotalPower && item.subtotalPower.replace('.', ',')}</Typography>
          </Grid>
        </Grid>
      }
    </div>
  )
}

export default withRouter(MosaicItem)
