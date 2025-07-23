import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TableRow from '@material-ui/core/TableRow'
import InputAdornment from '@material-ui/core/InputAdornment'

import Select from '../../../../../../../../common/components/select/Select'
import Input from '../../../../../../../../common/components/input/Input'
import InputNumeric from '../../../../../../../../common/components/input-numeric/InputNumeric'
import ArrowTooltip from '../../../../../../../../common/components/tooltip/arrow/ArrowTooltip'

import DeleteIcon from '../../../../../../../../assets/icons/eliminar.svg'

import { thunkGetMasterData } from '../../../../../../../store/actions/ProvisionsThunkActions'

import useStyles, { StyledTableCell } from './ListItem.styles'

const ListItem = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const currentProvision = useSelector((state: any) => state.provisions.currentProvision)
  const provisions = useSelector((state: any) => state.provisions)
  const userToken = useSelector((state: any) => state.user.token)

  const [usesSelect, setUsesSelect] = useState([] as any)
  const [applicationType, setApplicationType] = useState('')
  const [useType, setUseType] = useState('')

  const [totalRequestedPower, setTotalRequestedPower] = useState('' as string)

  const [isLoading, setIsLoading] = useState(false)

  const [potVehicle, setPotVehicle] = useState('')
  const [popUp, setPopUp] = useState(false)

  const {
    item,
    index,
    state,
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

  useEffect(() => {
    dispatch(thunkGetMasterData('POT_VEHICLE_ELE', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), 'POTVEHICLEELE', (response) => {
      if (response) {
        setPotVehicle(response[0].value)
      }
    }))
  }, [])
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
    if (currentProvision.techData && state >= 2 && usesSelect.length === 0) {
      const key = 'USE_TYPE_' + item.applicationType

      getAndSetMasterDataUseType(key, setUsesSelect)
    }
    // eslint-disable-next-line
  }, [provisions.selectedSupplySubtype, state, userToken, currentProvision])

  const updateTotalRequestedPower = (requestPower: string, numberOfSupplies: string) => {
    if (requestPower !== '' && numberOfSupplies !== '') {
      let power = parseFloat(requestPower.replace(',', '.'))
      let supplies = parseFloat(numberOfSupplies)
      let total = power * supplies
      setTotalRequestedPower(total.toString())
    }
  }

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
    //reseteamos la tabla i borramos todos los datos
    powerList.map((item, i) => {
      let auxItem = item

      if (index === i) {
        if (e.target.value === 'UTITYP005') {
          // industriales
          delete auxItem.useType
        } else if (e.target.value === 'UTITYP002') {
          delete auxItem.buildableArea
          auxItem = {
            ...auxItem,
            useType: 'UTISUB008',
          }
        } else if (e.target.value === 'UTITYP007') {
          auxItem = {
            ...auxItem,
            useType: 'UTISUB008',
          }
        }
        else {
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
            requestPower: item.requestPower,
            subtotalPower: item.subtotalPower
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

  const handleNumberSupplies = (e, index?) => {
    if (!isNaN(e.target.value)) {
      setPowerListI(
        powerList.map((item, i) => {
          const subtotalPower = item.requestPower ? (+Number(e.target.value * parseFloat(item.requestPower)).toFixed(2)).toString() : item.subtotalPower
          const numberOfSupplies = e.target.value.toString()
          return index === i
            ? { ...item, subtotalPower: subtotalPower, numberOfSupplies: numberOfSupplies }
            : item
        })
      )
    }
  }

  const handleBuildableArea = (e, index) => {
    let area = e.target.value.replace(',', '.')
    if (item.requestPower && item.requestPower !== '') {
      handlePowerRequestedMin(item.requestPower, index)
    }

    if (!isNaN(area)) {
      setPowerListI(
        powerList.map((item, i) => {
          const buildableArea = area.toString()
          return index === i ? { ...item, buildableArea: buildableArea.replace(',', '.').replace(' ', '') } : item
        })
      )
    }
  }

  const handlePowerRequestedMin = (power, index) => {
    // Para grandes desarrollos solo se valida potencia monofáisco <15
    if (provisions.dossierSubtype !== 'DOSSUB001') {
      setPowerListErrors(powerListErrors.map((item, i) => {
        if (item) {
          let area = powerList[i].buildableArea
          let numberOfSupplies = powerList[i].numberOfSupplies
          let power = powerList[i].requestPower

          if (/*index === i && */powerList && powerList[i]) {
            //Comprobamos la potencia minima a controlar
            let power1 = 0
            let power2 = 0
            let minPower = 0
            // DOSSUB006 - Edificio oficinas y Edificio residencial
            if (provisions.dossierSubtype === 'DOSSUB006') {
              if (item.buildableArea !== '') {
                power1 = 100 * parseFloat(item.buildableArea)
              }
              power2 = 3450 * item.numberOfSupplies
            }

            if (power1 > power2) {
              minPower = power1
            } else {
              minPower = power2
            }

            let minValue = 0
            let valueCalc
            let check
            let msg

            if (item.buildableArea !== '') {
              // Garaje Ventilación Natural
              if (powerList[i].useType !== '' && powerList[i].useType === 'UTISUB009') {
                // potencia minima de 3450 para garaje ventulación Natural
                minValue = 3450
                valueCalc = parseFloat(area) * 10
                if (valueCalc > minValue) {
                  minValue = valueCalc
                }

                if (!isNaN(power)) {
                  let powerW = power * 1000
                  if (powerW < minValue) {
                    check = true
                    let aux = (minValue / 1000).toString()
                    msg = t('provisions.newProvision.requestData.supplyType.form.errors.minPower') + aux.replace('.', ',') + 'kW'
                    // if (index === i) {
                    //   setDialogText('La Potencia Solicitada de garajes no supera la potencia mínima calculada ' + minValue / 1000 + 'kW.')
                    //   setPopUp(true)
                    // }
                    return { ...item, requestPower: { bool: check, msg: msg } }
                  } else {
                    check = false
                    msg = ''
                    if (index === i) { setPopUp(false) }
                    return {
                      ...item, requestPower: { bool: check, msg: msg }
                    }
                  }
                } else {
                  return item
                }
                // Garaje Ventilación Forzada
              } else if (powerList[i].useType !== '' && powerList[i].useType === 'UTISUB010') {
                valueCalc = parseFloat(area) * 20
                // potencia minima de 3450 para garaje ventulación Frozada
                minValue = 3450
                if (valueCalc > minValue) {
                  minValue = valueCalc
                }

                if (!isNaN(power)) {
                  let powerW = power * 1000
                  if (powerW < minValue) {
                    check = true
                    let aux = (minValue / 1000).toString()
                    msg = t('provisions.newProvision.requestData.supplyType.form.errors.minPower') + aux.replace('.', ',') + 'kW'
                    return { ...item, requestPower: { bool: check, msg: msg } }
                  } else {
                    check = false
                    msg = ''
                    if (index === i) { setPopUp(false) }
                    return {
                      ...item, requestPower: { bool: check, msg: msg }
                    }
                  }
                } else {
                  return item
                }
                // Garage Vehiculo Electrico
              } else if (powerList[i].useType !== '' && powerList[i].useType === 'UTISUB011') {
                if (!isNaN(power)) {
                  if (power * numberOfSupplies < 3.68 * numberOfSupplies) {
                    check = true
                    let aux = (3.68 * numberOfSupplies).toFixed(2).toString()
                    msg = t('provisions.newProvision.requestData.supplyType.form.errors.minPower') + aux.replace('.', ',') + 'kW'
                    if (index === i) { setPopUp(false) }
                    return {
                      ...item, requestPower: { bool: check, msg: msg }
                    }
                  } else {
                    check = false
                    msg = ''
                    if (index === i) { setPopUp(false) }
                    return {
                      ...item, requestPower: { bool: check, msg: msg }
                    }
                  }
                } else {
                  return item
                }
                // UTITYP001 - Viviendas - Electrificación elevada
              } else if (powerList[i].applicationType !== '' && powerList[i].applicationType === 'UTITYP001' && powerList[i].useType === 'UTISUB002') {
                if (!isNaN(power)) {
                  if (provisions.techData.phase !== '' && provisions.techData.phase === 'FASE_MONOF' && power > 15) {
                    check = true
                    msg = t('provisions.newProvision.requestData.supplyType.form.errors.maxPower') + '15kW ' + t('provisions.newProvision.requestData.supplyType.form.errors.monoPhase')
                    if (index === i) { setPopUp(false) }
                    return {
                      ...item, requestPower: { bool: check, msg: msg }
                    }
                  } else if (power < 9.2) {
                    check = true
                    msg = t('provisions.newProvision.requestData.supplyType.form.errors.minPower') + '9,2kW'
                    if (index === i) { setPopUp(false) }
                    return {
                      ...item, requestPower: { bool: check, msg: msg }
                    }
                  } else {
                    check = false
                    msg = ''
                    if (index === i) { setPopUp(false) }
                    return {
                      ...item, requestPower: { bool: check, msg: msg }
                    }
                  }
                } else {
                  return item
                }
                // UTITYP001 - Viviendas
              } else if (powerList[i].applicationType !== '' && powerList[i].applicationType === 'UTITYP001') {
                if (!isNaN(power)) {
                  if (provisions.techData.phase !== '' && provisions.techData.phase === 'FASE_MONOF' && power > 15) {
                    check = true
                    msg = t('provisions.newProvision.requestData.supplyType.form.errors.maxPower') + '15kW ' + t('provisions.newProvision.requestData.supplyType.form.errors.monoPhase')
                    if (index === i) { setPopUp(false) }
                    return {
                      ...item, requestPower: { bool: check, msg: msg }
                    }
                  } else if ((provisions.techData.idDossierHeatingType === 'HEATSYS001' || provisions.techData.idDossierAircondType === 'AIRCOD_PRE' || provisions.techData.idDossierAircondType === 'AIRCOD_INS' || parseFloat(area) > 160) && power < 9.2) {
                    check = true
                    msg = t('provisions.newProvision.requestData.supplyType.form.errors.minPower') + '9,2kW'
                    // if (index === i) {
                    //   setDialogText(t('provisions.newProvision.requestData.supplyType.form.errors.minPower') + '9,2kW')
                    //   setPopUp(true)
                    // }
                    return {
                      ...item, requestPower: { bool: check, msg: msg }
                    }
                  } else if (power < 5.75) {
                    check = true
                    msg = t('provisions.newProvision.requestData.supplyType.form.errors.minPower') + '5,75kW'
                    if (index === i) { setPopUp(false) }
                    return {
                      ...item, requestPower: { bool: check, msg: msg }
                    }
                  } else {
                    check = false
                    msg = ''
                    if (index === i) { setPopUp(false) }
                    return {
                      ...item, requestPower: { bool: check, msg: msg }
                    }
                  }
                } else {
                  return item
                }
                // UTITYP004 - Locales y ofcinas
              } else if (powerList[i].applicationType !== '' && powerList[i].applicationType === 'UTITYP004') {
                if (!isNaN(power)) {
                  let power1 = 100 * area * numberOfSupplies
                  let power2 = 3450 * numberOfSupplies

                  //No admitir P>15 kW para peticiones en monofásico
                  if (provisions.techData.phase !== '' && provisions.techData.phase === 'FASE_MONOF') {
                    if (power > 15) {
                      check = true
                      msg = t('provisions.newProvision.requestData.supplyType.form.errors.maxPower') + '15kW ' + t('provisions.newProvision.requestData.supplyType.form.errors.monoPhase')
                      if (index === i) { setPopUp(false) }
                      return {
                        ...item, requestPower: { bool: check, msg: msg }
                      }
                    }
                  }

                  let powerW = power * 1000
                  if (power1 > power2) {
                    if (powerW < power1) {
                      check = true
                      let aux = (power1 / 1000).toString()
                      msg = t('provisions.newProvision.requestData.supplyType.form.errors.minPower') + aux.replace('.', ',') + 'kW'
                      return {
                        ...item, requestPower: { bool: check, msg: msg }
                      }
                    } else {
                      check = false
                      msg = ''
                      if (index === i) { setPopUp(false) }
                      return {
                        ...item, requestPower: { bool: check, msg: msg }
                      }
                    }
                  } else {
                    if (powerW < power2) {
                      check = true
                      let aux = (power2 / 1000).toString()
                      msg = t('provisions.newProvision.requestData.supplyType.form.errors.minPower') + aux.replace('.', ',') + 'kW'
                      return {
                        ...item, requestPower: { bool: check, msg: msg }
                      }
                    } else {
                      check = false
                      msg = ''
                      if (index === i) { setPopUp(false) }
                      return {
                        ...item, requestPower: { bool: check, msg: msg }
                      }
                    }
                  }

                } else {
                  return item
                }
              } else {
                return item
              }
            }

          }
        }
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
        if (index === i && powerList && powerList[i] && powerList[i].requestPower !== '' && provisions.dossierSubtype !== 'DOSSUB001') {
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
    setPowerListErrors(
      powerListErrors.map((item, i) => {
        const check = e.target.value === '' || e.target.value === '0'
        return index === i
          ? {
            ...item,
            numberOfSupplies:
            {
              bool: check,
              msg:
                t(
                  'provisions.newProvision.requestData.supplyType.form.errors.requiredAndNotZero'
                )
            }
          }
          : item
      })
    )
  }

  const checkBuildableArea = (e, index) => {
    setPowerListErrors(
      powerListErrors.map((item, i) => {
        const check = e.target.value === '' || e.target.value === '0'
        return index === i
          ? {
            ...item,
            buildableArea:
            {
              bool: check,
              msg:
                t(
                  'provisions.newProvision.requestData.supplyType.form.errors.requiredAndNotZero'
                )
            }
          }
          : item
      })
    )
  }

  const checkPowerRequested = (e, index) => {
    //comprovaciones de potencia
    let power = e.target.value.replace(',', '.')
    setPowerListErrors(
      powerListErrors.map((item, i) => {
        let check
        let msg
        if (index === i && powerList && powerList[i]) {
          if (e.target.value === '' || e.target.value === '0') {
            check = true
            msg = t('provisions.newProvision.requestData.supplyType.form.errors.requiredAndNotZero')
          } else if (powerList[i].useType === 'UTISUB001' && powerList[i].requestPower < 5.75 && provisions.dossierSubtype !== 'DOSSUB001') {
            check = true
            msg = t('provisions.newProvision.requestData.supplyType.form.errors.min5')
          } else if (powerList[i].useType === 'UTISUB002' && powerList[i].requestPower < 9.2 && provisions.dossierSubtype !== 'DOSSUB001') {
            check = true
            msg = t('provisions.newProvision.requestData.supplyType.form.errors.min9')
          } else if ((powerList[i].useType === 'UTISUB009' || powerList[i].useType === 'UTISUB010') && powerList[i].requestPower < 3.45 && provisions.dossierSubtype !== 'DOSSUB001') {
            check = true
            msg = t('provisions.newProvision.requestData.supplyType.form.errors.min3-45')
          } else if (powerList[i].useType === 'UTISUB013' && powerList[i].requestPower < 3.45 && provisions.dossierSubtype !== 'DOSSUB001') {
            check = true
            msg = t('provisions.newProvision.requestData.supplyType.form.errors.min3-45')
          } else if ((powerList[i].applicationType === 'UTITYP001' || powerList[i].applicationType === 'UTITYP002') && powerList[i].requestPower > 99 && provisions.dossierSubtype !== 'DOSSUB001') {
            check = false
            setDialogText(t('provisions.newProvision.requestData.supplyType.form.errors.powerError'))
            setShowDialog(true)
          } else if ((powerList[i].applicationType === 'UTITYP003' || powerList[i].applicationType === 'UTITYP004') && powerList[i].requestPower > 999 && provisions.dossierSubtype !== 'DOSSUB001') {
            check = false
            setDialogText(t('provisions.newProvision.requestData.supplyType.form.errors.powerError'))
            setShowDialog(true)
          } else if ((powerList[i].applicationType === 'UTITYP001') && powerList[i].requestPower > 50 && provisions.dossierSubtype !== 'DOSSUB001') {
            check = false
            setDialogText(t('provisions.newProvision.requestData.supplyType.form.errors.powerError'))
            setShowDialog(true)
          } else if ((powerList[i].applicationType === 'UTITYP004') && provisions.dossierSubtype !== 'DOSSUB001') { //UTITYP004
            let powerW = powerList[i].requestPower * 1000
            let power2 = 3450 * powerList[i].numberOfSupplies
            let power1 = 100 * powerList[i].buildableArea * powerList[i].numberOfSupplies
            if (power1 > power2) {
              if (powerW < power1) {
                let aux = (power1 / 1000).toString()
                setDialogText('La Potencia Solicitada de Locales y Oficinas no supera la potencia mínima calculada ' + aux.replace('.', ',') + 'kW.')
                setShowDialog(true)
              }
            } else {
              if (powerW < power2) {
                let aux = (power2 / 1000).toString()
                setDialogText('La Potencia Solicitada de Locales y Oficinas no supera la potencia mínima calculada ' + aux.replace('.', ',') + 'kW.')
                setShowDialog(true)
              }
            }
          }
          else if ((powerList[i].applicationType === 'UTITYP003' && powerList[i].useType === 'UTISUB009') && provisions.dossierSubtype !== 'DOSSUB001') { //UTITYP003 ventilación manual
            let powerW = powerList[i].requestPower * 1000
            let power2 = 3450 * powerList[i].numberOfSupplies
            let power1 = powerList[i].buildableArea * 10
            if (power1 > power2) {
              if (powerW < power1) {
                let aux = (power1 / 1000).toString()
                setDialogText('La Potencia Solicitada de garajes no supera la potencia mínima calculada ' + aux.replace('.', ',') + 'kW.')
                setShowDialog(true)
              }
            } else {
              if (powerW < power2) {
                let aux = (power2 / 1000).toString()
                setDialogText('La Potencia Solicitada de garajes no supera la potencia mínima calculada ' + aux.replace('.', ',') + 'kW.')
                setShowDialog(true)
              }
            }
          }

          else if ((powerList[i].applicationType === 'UTITYP003' && powerList[i].useType === 'UTISUB0010') && provisions.dossierSubtype !== 'DOSSUB001') { //UTITYP003 ventilación forzada
            let powerW = powerList[i].requestPower * 1000
            let power2 = 3450 * powerList[i].numberOfSupplies //3.450
            let power1 = powerList[i].buildableArea * 20 //10.000
            if (power1 > power2) {
              if (powerW < power1) {
                let aux = (power1 / 1000).toString()
                setDialogText('La Potencia Solicitada de garajes no supera la potencia mínima calculada ' + aux.replace('.', ',') + 'kW.')
                setShowDialog(true)
              }
            } else {
              if (powerW < power2) {
                let aux = (power1 / 1000).toString()
                setDialogText('La Potencia Solicitada de garajes no supera la potencia mínima calculada ' + aux.replace('.', ',') + 'kW.')
                setShowDialog(true)
              }
            }
          }


          else {
            check = false
          }
          return { ...item, requestPower: { bool: check, msg: msg } }
        } else {
          return item
        }
      })
    )

    handlePowerRequestedMin(power, index)
    if (popUp) {
      setShowDialog(true)
      setPopUp(false)
    }
  }

  useEffect(() => {
    handlePowerRequestedMin(item.requestPower, index)

  }, [provisions, powerList])

  // useEffect(() => {
  //   if (provisions.techData.electricVehicleCharging === '0') {
  //     // formatear los vehiculos electricos (useType = "UTISUB011")
  //     setPowerListI(
  //       powerList.map((item, index) => {
  //         return item.useType === 'UTISUB011' ?
  //           {
  //             ...item,
  //             useType: '',
  //             requestPower: '',
  //             subtotalPower: ''
  //           }
  //           :
  //           item
  //       })
  //     )
  //   }
  //   // eslint-disable-next-line
  // }, [provisions.techData.electricVehicleCharging])

  useEffect(() => {
    if (provisions.techData.electricVehicleCharging === '0') {
      // setear el popup

    }
    // eslint-disable-next-line
  }, [setDialogText])

  return (
    <TableRow key={index} className={classes.row}>
      <StyledTableCell>
        <div className={`${classes.inputTableFirst} ${powerListErrors[index] && powerListErrors[index].applicationType && powerListErrors[index].applicationType.bool && classes.errorInputPaddingFirst}`}>
          {state === 0 ? (
            <Select
              fullWidth
              label={t(
                'provisions.newProvision.requestData.supplyType.form.technicalInstallationData.building.selectLabel.types'
              )}
              value={item.applicationType}
              values={
                ((provisions.selectedSupplyType === 'UR' && provisions.selectedSupplySubtype === 'DOSSUB006') || provisions.selectedSupplySubtype === 'DOSSUB005') ?
                  typesSelect.filter(i => !i.startsWith('UTITYP005') && !i.startsWith('UTITYP006') && !i.startsWith('UTITYP007'))
                  :
                  (provisions.selectedSupplySubtype === 'DOSSUB031') ?
                    typesSelect.filter(i => !i.startsWith('UTITYP005') && !i.startsWith('UTITYP006') && !i.startsWith('UTITYP007'))
                    :
                    (provisions.selectedSupplySubtype === 'DOSSUB001') ?
                      typesSelect.filter(i => !i.startsWith('UTITYP002') && !i.startsWith('UTITYP003') && !i.startsWith('UTITYP006'))
                      :
                      typesSelect.filter(i => !i.startsWith('UTITYP001') && !i.startsWith('UTITYP005') && !i.startsWith('UTITYP006') && !i.startsWith('UTITYP007'))
              }
              codFiltering
              onChange={(e) => handleTypeSupplie(e, index)}
              onBlur={(e) => checkTypeSupplies(e, index)}
              error={powerListErrors[index] && powerListErrors[index].applicationType && powerListErrors[index].applicationType.bool}
              helperText={
                (powerListErrors[index] && powerListErrors[index].applicationType && powerListErrors[index].applicationType.bool) &&
                powerListErrors[index].applicationType.msg
              }
            />
          ) : (
            <Typography className={classes.stateLabel}>{applicationType}</Typography>
          )}
        </div>
      </StyledTableCell>

      <StyledTableCell>
        <div className={`${classes.inputTableFirst} ${powerListErrors[index] && powerListErrors[index].useType && powerListErrors[index].useType.bool && classes.errorInputPaddingFirst}`}>
          {state === 0 ? (

            item.applicationType === 'UTITYP002' || item.applicationType === 'UTITYP007' ?
              <>
              </>
              :
              <Select
                fullWidth
                label={t(
                  'provisions.newProvision.requestData.supplyType.form.technicalInstallationData.building.selectLabel.uses'
                )}
                value={item.useType}
                values={
                  (provisions.techData.electricVehicleCharging === '0' && provisions.selectedSupplySubtype !== 'DOSSUB006' && provisions.selectedSupplySubtype !== 'DOSSUB005') ?
                    usesSelect.filter(i => !i.startsWith('UTISUB011'))
                    :
                    usesSelect
                }
                codFiltering
                onChange={(e) => handleUseSupplie(e, index)}
                onBlur={(e) => checkUseSupplies(e, index)}
                error={powerListErrors[index] && powerListErrors[index].useType && powerListErrors[index].useType.bool}
                helperText={powerListErrors[index] && powerListErrors[index].useType && powerListErrors[index].useType.bool && powerListErrors[index].useType.msg}
                disabled={!item.applicationType || usesSelect.length === 0 || item.applicationType === 'UTITYP002' || item.applicationType === 'UTITYP007'}
                isLoading={isLoading}
              />
          ) : (
            <Typography className={classes.stateLabel}>{useType}</Typography>
          )}
        </div>
      </StyledTableCell>

      <StyledTableCell>
        <div className={`${classes.inputTable} ${powerListErrors[index] && powerListErrors[index].numberOfSupplies && powerListErrors[index].numberOfSupplies.bool && classes.errorInputPadding}`}>
          {state === 0 ? (
            <InputNumeric
              value={item.numberOfSupplies}
              onChange={(e) => {
                handleNumberSupplies(e, index)
                checkNumberSupplies(e, index)
                updateTotalRequestedPower(item.requestPower, e.target.value)
              }}
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
        </div>
      </StyledTableCell>


      <StyledTableCell>
        <div className={`${classes.inputTable} ${powerListErrors[index] && powerListErrors[index].buildableArea && powerListErrors[index].buildableArea.bool && classes.errorInputPadding}`}>
          {state === 0 ?
            (
              <Input
                value={item.buildableArea && item.buildableArea.replace('.', ',')}
                onChange={(e) => {
                  handleBuildableArea(e, index)
                }}
                onBlur={(e) => checkBuildableArea(e, index)}
                error={powerListErrors[index] && powerListErrors[index].buildableArea && powerListErrors[index].buildableArea.bool}
                helperText={
                  (powerListErrors[index] && powerListErrors[index].buildableArea && powerListErrors[index].buildableArea.bool) &&
                  powerListErrors[index].buildableArea.msg
                }
                disabled={item.applicationType === 'UTITYP002' || item.useType === 'UTISUB011'}
              />
            ) : (
              <Typography className={classes.stateLabel}>{item.buildableArea ? parseFloat(item.buildableArea).toFixed(2).toString() : '0'}</Typography>
            )}
        </div>
      </StyledTableCell>

      <StyledTableCell>
        <div className={`${classes.inputTable} ${powerListErrors[index] && powerListErrors[index].requestPower && powerListErrors[index].requestPower.bool && classes.errorInputPadding}`}>
          {
            state === 0 ?
              <ArrowTooltip
                title={t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.KWtooltip')}
                placement='top'
              >
                <Input
                  className={classes.mobileInput}
                  value={item.requestPower && item.requestPower.replace('.', ',')}
                  //value={item.requestPower}
                  onChange={(e) => {
                    handlePowerRequested(e, index)
                    checkNumberSupplies(e, index)
                    updateTotalRequestedPower(e.target.value, item.numberOfSupplies)
                  }}
                  //onInput={(e) => handlePowerRequested(e, index)}
                  onBlur={(e) => checkPowerRequested(e, index)}
                  //Comentar para quitar resitriccion 3.68 Pequeños Correctivos 3
                  //disabled={item.useType === 'UTISUB011'}
                  error={powerListErrors[index] && powerListErrors[index].requestPower && powerListErrors[index].requestPower.bool}
                  helperText={
                    (powerListErrors[index] && powerListErrors[index].requestPower && powerListErrors[index].requestPower.bool) && powerListErrors[index].requestPower.msg
                  }
                  InputProps={{
                    endAdornment: <InputAdornment position='end'>kW</InputAdornment>
                  }}
                />
              </ArrowTooltip>
              :
              <Typography className={classes.stateLabel}>{item.requestPower && item.requestPower.replace('.', ',')}</Typography>
          }
        </div>
      </StyledTableCell>

      <StyledTableCell>
        <div>
          {
            state === 0 ?
              <Input
                className={classes.mobileInput}
                value={totalRequestedPower}
                disabled
                // InputProps={{
                //   disableUnderline: true
                // }}
                InputProps={{
                  endAdornment: <InputAdornment position='end'>kW</InputAdornment>
                }}
              />
              :
              <Typography className={classes.stateLabel}>{item.requestPower && item.requestPower.replace('.', ',')}</Typography>
          }
        </div>
      </StyledTableCell>

      {
        props.location.pathname === '/provisions/detail' &&
        <StyledTableCell>
          <div className={classes.inputTable}>
            <Typography className={classes.stateLabel}>{item.subtotalPower && item.subtotalPower.replace('.', ',')}</Typography>
          </div>
        </StyledTableCell>
      }

      <StyledTableCell>
        <div className={classes.lastInput}>
          <Grid container justifyContent='space-between'>
            {
              (index !== 0 && state === 0) && (
                <div onClick={() => handleDeleteSupplie(index)}>
                  <img src={DeleteIcon} className={classes.deleteIcon} alt='' />
                </div>
              )
            }
          </Grid>
        </div>
      </StyledTableCell>
    </TableRow>
  )
}

export default withRouter(ListItem)
