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

import DeleteIcon from '../../../../../../../../assets/icons/eliminar.svg'

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
    oneSupplie,
    state,
    dossierSubtype,
    powerList,
    setPowerListI,
    powerListErrors,
    setPowerListErrors,
    typesSelect,
    handleDeleteSupplie,
    setShowDialog,
    setDialogText
  } = props

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
    if ((dossierSubtype === 'DOSSUB011' || dossierSubtype === 'DOSSUB012' || dossierSubtype === 'DOSSUB013' || dossierSubtype === 'DOSSUB014') && !currentProvision.techData && item.applicationType) {
      const key = 'USE_TYPE_' + item.applicationType

      getAndSetMasterDataUseType(key, setUsesSelect)
    }
    // eslint-disable-next-line
  }, [dossierSubtype, currentProvision, item.applicationType])

  useEffect(() => {
    dispatch(thunkGetMasterData('POT_VEHICLE_ELE', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), 'POTVEHICLEELE', (response) => {
      if (response) {
        setPotVehicle(response[0].value)
      }
    }))
  }, [])

  useEffect(() => {
    if ((dossierSubtype === 'DOSSUB011' || dossierSubtype === 'DOSSUB012' || dossierSubtype === 'DOSSUB013' || dossierSubtype === 'DOSSUB014') && currentProvision.techData && state >= 2 && usesSelect.length === 0) {
      const key = 'USE_TYPE_' + item.applicationType

      getAndSetMasterDataUseType(key, setUsesSelect)
    }
    // eslint-disable-next-line
  }, [dossierSubtype, state, userToken, currentProvision])

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
    let auxList = [] as any

    powerList.map((item, i) => {
      let auxItem = item

      if (index === i) {
        if (dossierSubtype === 'DOSSUB001' || dossierSubtype === 'DOSSUB010') {
          // grandes desarrollos y eventuales
          delete auxItem.useType
        } else if (e.target.value === 'UTITYP005') {
          // industriales
          delete auxItem.useType
        } else {
          auxItem = {
            ...auxItem,
            useType: ''
          }
        }

        auxItem = {
          ...auxItem,
          applicationType: e.target.value
        }
      }

      return auxList.push(auxItem)
    })

    setPowerListI(auxList)
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
              msg: t('provisions.newProvision.requestData.supplyType.form.errors.requiredAndNotZero')
            }
          }
          :
          item
      })
    )
  }

  const handleBuildableArea = (e, index) => {
    if (item.requestPower && item.requestPower !== '') {
      handlePowerRequestedMin(item.requestPower, index)
    }
    let area = e.target.value.replace(',', '.')
    if (!isNaN(area)) {
      setPowerListI(powerList.map((item, i) => {
        return index === i ? { ...item, buildableArea: area.replace(',', '.').replace(' ', '') } : item
      }))
    }
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
  const handlePowerRequested = (e, index) => {
    let power = e.target.value.replace(',', '.')
    handlePowerRequestedMin(power, index)
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
          } else {
            return item
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
    setPowerListErrors(powerListErrors.map((item, i) => {
      const check = e.target.value === ''
      return index === i ? { ...item, applicationType: { bool: check, msg: t('provisions.newProvision.requestData.supplyType.form.errors.required') } } : item
    }))
  }

  const checkUseSupplies = (e, index) => {
    setPowerListErrors(powerListErrors.map((item, i) => {
      const check = e.target.value === ''
      return index === i ? { ...item, useType: { bool: check, msg: t('provisions.newProvision.requestData.supplyType.form.errors.required') } } : item
    }))
  }

  const checkBuildableArea = (e, index) => {
    setPowerListErrors(powerListErrors.map((item, i) => {
      const check = e.target.value === '' || e.target.value === '0'
      return index === i ? { ...item, buildableArea: { bool: check, msg: t('provisions.newProvision.requestData.supplyType.form.errors.requiredAndNotZero') } } : item
    }))
  }

  const checkNumberSupplies = (e, index) => {
    setPowerListErrors(powerListErrors.map((item, i) => {
      const check = e.target.value === '' || e.target.value === '0'
      return index === i ? { ...item, numberOfSupplies: { bool: check, msg: t('provisions.newProvision.requestData.supplyType.form.errors.requiredAndNotZero') } } : item
    }))
  }

  const checkPowerRequested = (e, index) => {
    let power = e.target.value.replace(',', '.')
    setPowerListErrors(powerListErrors.map((item, i) => {
      let check
      let msg
      if (index === i && powerList && powerList[i]) {
        if (e.target.value === '' || e.target.value === '0') {
          check = true
          if (dossierSubtype === 'DOSSUB029' || dossierSubtype === 'DOSSUB030') {
            msg = t('provisions.newProvision.requestData.supplyType.form.errors.minPower') + '3,68 kW'
          }
          else {
            msg = t('provisions.newProvision.requestData.supplyType.form.errors.requiredAndNotZero')
          }
        } else if (powerList[i].applicationType === 'UTITYP005' && dossierSubtype === 'DOSSUB002' && powerList[i].requestPower > 2000) {
          check = false
          setDialogText(t('provisions.newProvision.requestData.supplyType.form.errors.powerError'))
          setShowDialog(true)
        } else if (powerList[i].applicationType === 'UTITYP004' && dossierSubtype === 'DOSSUB008' && powerList[i].requestPower > 999) {
          check = false
          setDialogText(t('provisions.newProvision.requestData.supplyType.form.errors.powerError'))
          setShowDialog(true)
        } else if ((dossierSubtype === 'DOSSUB009' && powerList[i].requestPower > 500) || (powerList[i].applicationType === 'UTITYP006' && dossierSubtype === 'DOSSUB011' && powerList[i].requestPower > 500)) {
          check = false
          setDialogText(t('provisions.newProvision.requestData.supplyType.form.errors.powerError'))
          setShowDialog(true)
        } else if (((dossierSubtype === 'DOSSUB029' || dossierSubtype === 'DOSSUB030') && dossierSubtype !== 'DOSSUB010' && powerList[i].requestPower < 3.68)) {
          check = true
          msg = t('provisions.newProvision.requestData.supplyType.form.errors.minPower') + '3,68 kW'
          setDialogText(t('provisions.newProvision.requestData.supplyType.form.errors.powerErrorInferior'))
          setShowDialog(true)
        } else if ((dossierSubtype !== 'DOSSUB007' || dossierSubtype !== 'DOSSUB011') && provisions.techData.phase !== '' && provisions.techData.phase === 'FASE_MONOF' && powerList[i].requestPower > 15) {
          check = true
          setDialogText(msg = t('provisions.newProvision.requestData.supplyType.form.errors.max15'))
          setShowDialog(true)
          msg = (t('provisions.newProvision.requestData.supplyType.form.errors.max15'))
        } else if (dossierSubtype === 'DOSSUB007' && powerList[i].requestPower < 3.45) {
          check = true
          msg = t('provisions.newProvision.requestData.supplyType.form.errors.min3-45')
          setDialogText(t('provisions.newProvision.requestData.supplyType.form.errors.min3-45'))
          setShowDialog(true)
        } else if (dossierSubtype === 'DOSSUB003') {
          //uso industrial varios suministros
          let powerW = powerList[i].requestPower * 1000
          let power2 = 125 * powerList[i].buildableArea
          let power1 = 10350 * powerList[i].numberOfSupplies
          if (power1 > power2) {
            if (powerW < power1) {
              let aux = (power1 / 1000).toString()
              msg = (t('provisions.newProvision.requestData.supplyType.form.errors.minPower') + aux.replace('.', ',')+ 'kW.')
              setDialogText(t('provisions.newProvision.requestData.supplyType.form.errors.minPower') + aux.replace('.', ',') + 'kW.')
              setShowDialog(true)
              check = true
            }
          } else {
            if (powerW < power2) {
              let aux = (power2 / 1000).toString()
              msg = (t('provisions.newProvision.requestData.supplyType.form.errors.minPower') + aux.replace('.', ',') + 'kW.')
              setDialogText(t('provisions.newProvision.requestData.supplyType.form.errors.minPower') + aux.replace('.', ',') + 'kW.')
              setShowDialog(true)
              check = true
            }
          }
        } else if (dossierSubtype === 'DOSSUB008') {
          //uso industrial varios suministros
          let powerW = powerList[i].requestPower * 1000
          let power2 = 100 * powerList[i].buildableArea
          let power1 = 3450 * powerList[i].numberOfSupplies
          if (power1 > power2) {
            if (powerW < power1) {
              let aux = (power1 / 1000).toString()
              msg = (t('provisions.newProvision.requestData.supplyType.form.errors.minPower') + aux.replace('.', ',') + 'kW.')
              setDialogText(t('provisions.newProvision.requestData.supplyType.form.errors.minPower') + aux.replace('.', ',')+ 'kW.')
              setShowDialog(true)
              check = true
            }
          } else {
            if (powerW < power2) {
              let aux = (power2 / 1000).toString()
              msg = (t('provisions.newProvision.requestData.supplyType.form.errors.minPower') + aux.replace('.', ',') + 'kW.')
              setDialogText(t('provisions.newProvision.requestData.supplyType.form.errors.minPower') + aux.replace('.', ',') + 'kW.')
              setShowDialog(true)
              check = true
            }
          }
        }
        else {
          check = false
          handlePowerRequestedMin(power, index)
        }
        return { ...item, requestPower: { bool: check, msg: msg } }
      } else {
        return item
      }
    }))

    handlePowerRequestedMin(power, index)
    if (popUp) {
      setShowDialog(true)
      setPopUp(false)
    }
  }

  const handlePowerRequestedMin = (power, index) => {
    if (provisions.dossierSubtype !== 'DOSSUB029' &&
      provisions.dossierSubtype !== 'DOSSUB030' &&
      provisions.dossierSubtype !== 'DOSSUB002' &&
      provisions.dossierSubtype !== 'DOSSUB007' &&
      provisions.dossierSubtype !== 'DOSSUB011' &&
      provisions.dossierSubtype !== 'DOSSUB012' &&
      provisions.dossierSubtype !== 'DOSSUB013' &&
      provisions.dossierSubtype !== 'DOSSUB014' &&
      provisions.dossierSubtype !== 'DOSSUB009' &&
      provisions.dossierSubtype !== 'DOSSUB010') {
      //Comprobamos la potencia minima a controlar
      let power1 = 0
      let power2 = 0
      // DOSSUB008 - Uso comercial
      if (provisions.dossierSubtype === 'DOSSUB008' || provisions.dossierSubtype === 'DOSSUB007') {
        power2 = 3450 * item.numberOfSupplies
      } else {
        power2 = 10350 * item.numberOfSupplies
      }
      let minPower
      if (item.buildableArea !== '') {
        if (provisions.dossierSubtype === 'DOSSUB008') {
          power1 = 100 * parseFloat(item.buildableArea)
        } else {
          power1 = 125 * parseFloat(item.buildableArea)
        }
      }
      if (power1 > power2) {
        minPower = power1
      } else {
        minPower = power2

      }


      if (power !== '') {
        setPowerListErrors(powerListErrors.map((item, i) => {
          let check
          let msg
          if (index === i && powerList && powerList[i]) {
            if (!isNaN(power)) {
              let powerW = power * 1000
              if (powerW < minPower && provisions.dossierSubtype !== 'DOSSUB002') {
                check = true
                let aux = (minPower / 1000 ).toString()
                msg = t('provisions.newProvision.requestData.supplyType.form.errors.minPower') + aux.replace('.', ',') + 'kW'
                setDialogText(t('provisions.newProvision.requestData.supplyType.form.errors.minPower') + aux.replace('.', ',') + 'kW')
                setPopUp(true)
                return { ...item, requestPower: { bool: check, msg: msg } }
              } else {
                check = false
                msg = ''
                setPopUp(false)
                return {
                  ...item, requestPower: { bool: check, msg: msg }
                }
              }
            } else {
              return item
            }
          } else {
            return item
          }
        }))
      }
    }
  }

  useEffect(() => {

    handlePowerRequestedMin(item.requestPower, index)

  }, [provisions])

  return (
    <div key={index} className={classes.mobileRow}>
      {
        dossierSubtype !== 'DOSSUB007' && dossierSubtype !== 'DOSSUB009' &&
        //ppm 1007821 - inicio
        dossierSubtype !== 'DOSSUB025' &&
        dossierSubtype !== 'DOSSUB026' &&
        //ppm 1007821 - fin
        <Grid container direction='column' className={classes.inputContainer}>
          <Grid item className={classes.label}>
            <Typography>
              {t(
                'provisions.newProvision.requestData.supplyType.form.technicalInstallationData.group.table.tableHead.col1'
              )}
            </Typography>
          </Grid>
          <Grid item className={classes.input}>
            {
              state === 0 ? (
                <Select
                  fullWidth
                  label={
                    dossierSubtype !== 'DOSSUB002' &&
                    dossierSubtype !== 'DOSSUB003' &&
                    dossierSubtype !== 'DOSSUB008' &&
                    dossierSubtype !== 'DOSSUB011' &&
                    dossierSubtype !== 'DOSSUB012' &&
                    dossierSubtype !== 'DOSSUB013' &&
                    (dossierSubtype !== 'DOSSUB014' &&
                      t(
                        'provisions.newProvision.requestData.supplyType.form.technicalInstallationData.group.selectLabel.types'
                      ))
                  }
                  value={item.applicationType}
                  values={
                    provisions.selectedSupplySubtype === 'DOSSUB010' ?
                      typesSelect.filter(i => i.startsWith('UTITYP006'))
                      :
                      typesSelect
                  }
                  codFiltering
                  disabled={
                    dossierSubtype === 'DOSSUB002' ||
                    dossierSubtype === 'DOSSUB003' ||
                    dossierSubtype === 'DOSSUB008' ||
                    dossierSubtype === 'DOSSUB011' ||
                    dossierSubtype === 'DOSSUB012' ||
                    dossierSubtype === 'DOSSUB013' ||
                    dossierSubtype === 'DOSSUB014'
                  }
                  onChange={(e) => handleTypeSupplie(e, index)}
                  onBlur={(e) => checkTypeSupplies(e, index)}
                  error={powerListErrors[index] && powerListErrors[index].applicationType && powerListErrors[index].applicationType.bool}
                  helperText={
                    (powerListErrors[index] && powerListErrors[index].applicationType && powerListErrors[index].applicationType.bool) &&
                    powerListErrors[index].applicationType.msg
                  }
                />
              ) : (
                <Typography className={classes.stateLabel}>
                  {applicationType}
                </Typography>
              )}
          </Grid>
        </Grid>
      }
      {
        (dossierSubtype === 'DOSSUB011' || dossierSubtype === 'DOSSUB012' || dossierSubtype === 'DOSSUB013' || dossierSubtype === 'DOSSUB014') &&
        <Grid container direction='column' className={classes.inputContainer}>
          <Grid item className={classes.label}>
            <Typography>
              {t(
                'provisions.newProvision.requestData.supplyType.form.technicalInstallationData.group.table.tableHead.col2'
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
                values={usesSelect}
                codFiltering
                className={classes.mobileInput}
                onChange={(e) => handleUseSupplie(e, index)}
                onBlur={(e) => checkUseSupplies(e, index)}
                error={powerListErrors[index] && powerListErrors[index].useType && powerListErrors[index].useType.bool}
                helperText={powerListErrors[index] && powerListErrors[index].useType && powerListErrors[index].useType.bool && powerListErrors[index].useType.msg}
                disabled
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
              'provisions.newProvision.requestData.supplyType.form.technicalInstallationData.group.table.tableHead.col3'
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
              disabled={oneSupplie || ((dossierSubtype === 'DOSSUB011' || dossierSubtype === 'DOSSUB012' || dossierSubtype === 'DOSSUB013' || dossierSubtype === 'DOSSUB014') && (item.useType === 'UTISUB014' || item.useType === 'UTISUB016' || item.useType === 'UTISUB017'))}
              onBlur={(e) => checkNumberSupplies(e, index)}
              error={powerListErrors[index] && powerListErrors[index].numberOfSupplies && powerListErrors[index].numberOfSupplies.bool}
              helperText={
                (powerListErrors[index] && powerListErrors[index].numberOfSupplies && powerListErrors[index].numberOfSupplies.bool) &&
                powerListErrors[index].numberOfSupplies.msg
              }
            />
          ) : (
            <Typography className={classes.stateLabel}>{item.numberOfSupplies}</Typography>
          )}
        </Grid>
      </Grid>

      {
        dossierSubtype === 'DOSSUB009' &&
        <Grid container direction='column' className={classes.inputContainer}>
          <Grid item className={classes.label}>
            <Typography>
              {t(
                'provisions.newProvision.requestData.supplyType.form.technicalInstallationData.group.table.tableHead.col4'
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
              <Typography className={classes.stateLabel}>{item.buildableArea ? parseFloat(item.buildableArea).toFixed(2).toString() : '0'}</Typography>
            )}
          </Grid>
        </Grid>
      }

      <Grid container direction='column' className={classes.inputContainer}>
        <Grid item className={classes.label}>
          <Typography>
            {t(
              'provisions.newProvision.requestData.supplyType.form.technicalInstallationData.group.table.tableHead.col5'
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
                  (powerListErrors[index] && powerListErrors[index].requestPower && powerListErrors[index].requestPower.bool) && powerListErrors[index].requestPower.msg
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

      <Grid container justifyContent='flex-end'>
        {index !== 0 &&
          item.applicationType !== 'UTITYP006' &&
          state === 0 && (
            <div onClick={() => handleDeleteSupplie(index)}>
              <img src={DeleteIcon} className={classes.deleteIcon} alt='' />
            </div>
          )}
      </Grid>
    </div>
  )
}

export default withRouter(MosaicItem)
