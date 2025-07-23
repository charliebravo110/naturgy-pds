import React, { useState, useEffect, useRef } from 'react'
import { withRouter } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Divider, Grid, DialogContent } from '@material-ui/core'

import Graph from './graph/Graph'
import InfoCambioPotencia from './InfoCambioPotencia/InfoCambioPotencia'

import XLSX from 'xlsx'

import ExportIcon from '../../../../../assets/icons/exportar_datos_potencia.svg'

import { thunkGetMaxPotencyDemanded } from '../../../store/actions/SuppliesDetailsThunkActions'

import useStyles from './EstimatedMaximumPower.styles'
import Button from '../../../../../common/components/button/Button'
import Input from '../../../../../common/components/input/Input'
import Item from '../../../../../common/components/dropdown/Item'
import CloseIcon from '../../../../../assets/icons/cerrar.svg'
import InfoIcon from '../../../../../assets/icons/info.svg'
import TextButton from '../../../../../common/components/text-button/TextButton'
import ArrowTooltip from '../../../../../common/components/tooltip/arrow/ArrowTooltip'
import Dialog from '../../../../../common/components/dialog/Dialog'

import { setDossierType, setDossierSubtype, setCurrentProvision, setCadastreDataCoordinates, setCadastreDataItem } from '../../../../../provisions/store/actions/ProvisionsActions'
import { isMobileApp } from '../../../../../mobile-apps/common/detectPlatform'
import createFileAndOpenIt from '../../../../../mobile-apps/local-downloads/createFileAndOpenIt'
import { sendGAEvent, removeEmails } from '../../../../../core/utils/gtm'

const EstimatedMaximumPower = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const {
    setIsLoading,
    supplyData,
    supplantedUser
  } = props

  var currentSupplyPowerAux = {
    maxPowerDate: '',
    minPowerDate: '',
    avgPower: '',
    maxPower: '',
    minPower: '',
    totalPower: '',
    powers: []
  }
  var currentComparePowerAux = {
    maxPowerDate: '',
    minPowerDate: '',
    avgPower: '',
    maxPower: '',
    minPower: '',
    totalPower: '',
    powers: []
  }
  var currentCompare2PowerAux = {
    maxPowerDate: '',
    minPowerDate: '',
    avgPower: '',
    maxPower: '',
    minPower: '',
    totalPower: '',
    powers: []
  }


  const [currentSupplyPowers, setCurrentSupplyPowers] = useState([] as any)
  const [currentComparePowers, setCurrentComparePowers] = useState([] as any)
  const [currentComparePowers2, setCurrentComparePowers2] = useState([] as any)

  const roles = sessionStorage.getItem('userRoles') || ''
  const suppliesListStore = useSelector((state: any) => state.supplies.list)
  const delegatesInMe = useSelector((state: any) => state.delegations.delegatesInMeList)

  const isDelegate = (roles.includes('US_MANAGER') || roles.includes('US_CONSULTANT')) && suppliesListStore.filter(supply => supply.cups === (supplyData && supplyData.cups))[0] ? false : delegatesInMe.filter(supply => supply.cups === (supplyData && supplyData.cups))[0] ? true : false

  const [date, setDate] = useState('')
  const [startDate, setStartDate] = useState(new Date())

  const [disabledButton, setDisabledButton] = useState(false)

  const [years, setYears] = useState({
    year0: (new Date().getFullYear()),
    yearMinus1: ((new Date().getFullYear()) - 1),
    yearMinus2: ((new Date().getFullYear()) - 2)
  })
  const [data, setData] = useState({
    maxPower: '' as any,
    maxHired: supplyData && supplyData.power && supplyData.power !== '' ? supplyData.power.replace(',', '.') : '0'
  })
  const [dataCompare, setDataCompare] = useState({
    maxPower: '' as any,
    maxHired: supplyData && supplyData.power && supplyData.power !== '' ? supplyData.power.replace(',', '.') : '0'
  })
  const [dataCompare2, setDataCompare2] = useState({
    maxPower: '' as any,
    maxHired: supplyData && supplyData.power && supplyData.power !== '' ? supplyData.power.replace(',', '.') : '0'
  })

  const [yearSelected, setYearSelected] = useState((new Date()).getFullYear())

  const [viewPopup, setViewPopup] = useState(false)

  const [showFormStep1, setShowFormStep1] = useState(false)
  const [showFormStep2, setShowFormStep2] = useState(false)
  const [showFromStep3, setShowFrommStep3] = useState(false)
  const [powerChangeButtonStatus, setPowerChangeButtonStatus] = useState(false)
  const [powerChangeStep1ButtonStatus, setPowerChangeStep1ButtonStatus] = useState(false)

  const inputRef = useRef(null)
  // const [inputValue, setInputValue] = useState(0.0)
  // const [inputValueStr, setInputValueStr] = useState('')
  // const [autocompleteData, setAutocompleteData] = useState(null)

  const [inputValueStr1, setInputValueStr1] = useState('')
  const [inputValueStr2, setInputValueStr2] = useState('')
  const [inputValueStr3, setInputValueStr3] = useState('')
  const [inputValueStr4, setInputValueStr4] = useState('')
  const [inputValueStr5, setInputValueStr5] = useState('')
  const [inputValueStr6, setInputValueStr6] = useState('')

  const [inputValue1, setInputValue1] = useState(0.0)
  const [inputValue2, setInputValue2] = useState(0.0)
  const [inputValue3, setInputValue3] = useState(0.0)
  const [inputValue4, setInputValue4] = useState(0.0)
  const [inputValue5, setInputValue5] = useState(0.0)
  const [inputValue6, setInputValue6] = useState(0.0)

  const [maxNewPower, setMaxNewPower] = useState(0.0)
  const [maxOldPower, setMaxOldNewPower] = useState(0.0)

  const [autocompleteData1, setAutocompleteData1] = useState(null)
  const [autocompleteData2, setAutocompleteData2] = useState(null)
  const [autocompleteData3, setAutocompleteData3] = useState(null)
  const [autocompleteData4, setAutocompleteData4] = useState(null)
  const [autocompleteData5, setAutocompleteData5] = useState(null)
  const [autocompleteData6, setAutocompleteData6] = useState(null)

  const [option, setOption] = useState(0)
  const [compare, setCompare] = useState(false)
  const [typecompare, setTypeCompare] = useState('')
  const [lasttypecompare, setLastTypeCompare] = useState('')
  const [sendTypecompare, setSendTypeCompare] = useState('')
  const [showingDialog, setShowingDialog] = useState(false)
  const [showingDialogAlert, setShowingDialogAlert] = useState(false)
  const [recargarGraf, setRecargarGraf] = useState(false)
  const isAdapted = supplyData.measurementEquipments.meters[0].isAdapted
  const adaptedDate = supplyData.measurementEquipments.meters[0].adaptedDate
  const tipoUsuario = supplyData.rate.toString().includes('2.') ? 'simple' : 'complejo'

  const [disabledCheckbox, setDisabledCheckbox] = useState({
    disabled0: false as boolean,
    disabled1: false as boolean,
    disabled2: false as boolean,
    disabled3: false as boolean,
    disabled4: false as boolean,
    disabled5: false as boolean,
    disabled6: false as boolean,
  });

  const [state, setState] = useState({
    checked0: true as boolean,
    checked1: true as boolean,
    checked2: true as boolean,
    checked3: true as boolean,
    checked4: tipoUsuario === 'simple' ? false : true as boolean,
    checked5: tipoUsuario === 'simple' ? false : true as boolean,
    checked6: tipoUsuario === 'simple' ? false : true as boolean,
  });

  const [topLegendYear, setTopLegendYear] = useState('')
  const [showLegendYear, setShowLegendYear] = useState(false)

  let menuData = [];

  const handleInput = (value, position) => {

    let validator = value;
    let lastChar = value.slice(-1);
    let isDecimal = lastChar === ',' || lastChar === '.';

    if (validator === 'NaN') {
      if (isDecimal) {
        validator = '.';
      } else {
        validator = '';
      }
    } else if ((isDecimal) && !validator.includes('.')) {
      validator += '.';
    }

    if (position === 1) {
      setInputValueStr1(validator)
      setInputValue1(parseFloat(validator))
    } else if (position === 2) {
      setInputValueStr2(validator)
      setInputValue2(parseFloat(validator))
    } else if (position === 3) {
      setInputValueStr3(validator)
      setInputValue3(parseFloat(validator))
    } else if (position === 4) {
      setInputValueStr4(validator)
      setInputValue4(parseFloat(validator))
    } else if (position === 5) {
      setInputValueStr5(validator)
      setInputValue5(parseFloat(validator))
    } else if (position === 6) {
      setInputValueStr6(validator)
      setInputValue6(parseFloat(validator))
    }

    if (value !== '' && !isNaN(value)) {
      if (value.includes('.')) {
        const auxValue = value.split('.');
        if (auxValue[1].length === 0) {
          menuData = [];
          for (let i = 0; i < 10; i++) {
            menuData[i] = {
              value: value + i,
              title: value + i + 'kW',
              image: { CloseIcon }
            }
          }
        } else {
          menuData = null;
        }
      } else {
        menuData = [];
        for (let i = 0; i < 10; i++) {
          menuData[i] = {
            value: value + '.' + i,
            title: value + '.' + i + 'kW',
            image: { CloseIcon }
          }
        }
      }
      if (position === 1) { setAutocompleteData1(menuData) }
      else if (position === 2) { setAutocompleteData2(menuData) }
      else if (position === 3) { setAutocompleteData3(menuData) }
      else if (position === 4) { setAutocompleteData4(menuData) }
      else if (position === 5) { setAutocompleteData5(menuData) }
      else if (position === 6) { setAutocompleteData6(menuData) }

    } else {
      clearAutocompleteData()
    }
  }

  const clearInputStrings = () => {
    setInputValueStr1('')
    setInputValueStr2('')
    setInputValueStr3('')
    setInputValueStr4('')
    setInputValueStr5('')
    setInputValueStr6('')
  }

  const clearInputValues = () => {
    setInputValue1(0.0)
    setInputValue2(0.0)
    setInputValue3(0.0)
    setInputValue4(0.0)
    setInputValue5(0.0)
    setInputValue6(0.0)
  }

  const clearAutocompleteData = () => {
    setAutocompleteData1(null)
    setAutocompleteData2(null)
    setAutocompleteData3(null)
    setAutocompleteData4(null)
    setAutocompleteData5(null)
    setAutocompleteData6(null)
  }

  const validateNumberImput = (e) => {
    const value = e.target.value;

    if (value !== '' && isNaN(value)) {
      e.target.value = value.slice(0, -1);
    } else {
      if (value.includes('.')) {
        const auxValue = value.split('.');
        if (auxValue[1].length > 1) {
          e.target.value = auxValue[0] + '.' + auxValue[1].substring(0, 1);
        }
      }
    }
  }

  const onBlurAutocomplete = () => {
    setTimeout(() => {
      clearAutocompleteData()
    }, 1000)
  }

  const onClickAutocomplete = (data, position) => {
    if (position === 1) {
      setInputValueStr1(data.value)
      setInputValue1(data.value)
    } else if (position === 2) {
      setInputValueStr2(data.value)
      setInputValue2(data.value)
    } else if (position === 3) {
      setInputValueStr3(data.value)
      setInputValue3(data.value)
    } else if (position === 4) {
      setInputValueStr4(data.value)
      setInputValue4(data.value)
    } else if (position === 5) {
      setInputValueStr5(data.value)
      setInputValue5(data.value)
    } else if (position === 6) {
      setInputValueStr6(data.value)
      setInputValue6(data.value)
    }

    clearAutocompleteData()
  }

  const closeForm = () => {
    setShowFormStep1(false)
    setShowFormStep2(false)
    setPowerChangeButtonStatus(false)
  }

  const handleCloseDialog = () => {
    setShowingDialog(false)
    clearInputStrings()
    clearInputValues()
  }
  const handleOpenDialog = () => {
    setState({
      checked0: true,
      checked1: false,
      checked2: false,
      checked3: false,
      checked4: false,
      checked5: false,
      checked6: false
    })
    setShowingDialog(true)
    setLastTypeCompare(typecompare)
  }
  const handleCancelDialog = () => {
    setTypeCompare(lasttypecompare)
    setShowingDialog(false)
    clearInputStrings()
    clearInputValues()
  }

  const handleCloseDialogAlert = () => {
    setShowingDialogAlert(false)
  }

  useEffect(() => {
    setCurrentComparePowers([])
    setCurrentComparePowers2([])
  }, [yearSelected, compare])

  const handleSelectedDossierType = (type: string, subtype?: string) => {
    dispatch(setDossierType(type))
    dispatch(setDossierSubtype(subtype))
    dispatch(setCurrentProvision({}))
    dispatch(setCadastreDataCoordinates({ x: '', y: '' }))
    dispatch(setCadastreDataItem({}))

    props.history.push('/provisions/edit-provision/keep-in-mind')
  }

  function recargarGrafico(): string {

    const call = {
      startDate: '01/01/' + yearSelected.toString(),
      endDate: '31/12/' + yearSelected.toString(),
      startDateCompare: '01/01/' + (yearSelected - 1).toString(),
      endDateCompare: '31/12/' + (yearSelected - 1).toString(),
      startDateCompare2: '01/01/' + (yearSelected - 2).toString(),
      endDateCompare2: '31/12/' + (yearSelected - 2).toString()
    }

    if (yearSelected === years.yearMinus1) {
      call.startDate = '01/01/' + yearSelected.toString()
      call.endDate = '31/12/' + yearSelected.toString()
      call.startDateCompare = '01/01/' + (yearSelected - 1).toString()
      call.endDateCompare = '31/12/' + (yearSelected - 1).toString()
      call.startDateCompare2 = '01/01/' + (yearSelected + 1).toString()
      call.endDateCompare2 = '31/12/' + (yearSelected + 1).toString()
    }
    else if (yearSelected === years.yearMinus2) {
      call.startDate = '01/01/' + yearSelected.toString()
      call.endDate = '31/12/' + yearSelected.toString()
      call.startDateCompare = '01/01/' + (yearSelected + 1).toString()
      call.endDateCompare = '31/12/' + (yearSelected + 1).toString()
      call.startDateCompare2 = '01/01/' + (yearSelected + 2).toString()
      call.endDateCompare2 = '31/12/' + (yearSelected + 2).toString()
    }

    if (yearSelected && yearSelected > 0) {

      const maxPower = { power: 0 }

      setIsLoading(true)

      dispatch(thunkGetMaxPotencyDemanded(supplyData.cups, call.startDate, call.endDate, setIsLoading, '0', supplantedUser, isDelegate, supplyData.measurementSystem, (response) => {

        if (response && response.months && response.months.items && response.months.items.length > 0) {
          let i
          var minPower = 100000
          for (i = 0; i < response.months.items.length; i++) {
            var itemPower =
            {
              PowerDate: '',
              hour: '',
              activeOutput: '',
              PowerValue: '',
              PowerDateP1: '',
              hourP1: '',
              PowerValueP1: '',
              PowerDateP2: '',
              hourP2: '',
              PowerValueP2: '',
              PowerDateP3: '',
              hourP3: '',
              PowerValueP3: '',
              PowerDateP4: '',
              hourP4: '',
              PowerValueP4: '',
              PowerDateP5: '',
              hourP5: '',
              PowerValueP5: '',
              PowerDateP6: '',
              hourP6: '',
              PowerValueP6: ''
            }

            var itemResp = response.months.items[i]

            if (itemResp.maxPotencyDemandedP0 < minPower) {
              minPower = itemResp.maxPotencyDemandedP0
            }
            //Buscamos la potencia maxima de todas
            if (itemResp.maxPotencyDemandedP0 > maxPower.power) {
              maxPower.power = itemResp.maxPotencyDemandedP0
            }

            //Rellenamos cada item del array
            itemPower.PowerValue = itemResp.maxPotencyDemandedP0.toString().replace('.', ',')
            itemPower.activeOutput = itemResp.maxPotencyDemandedP0.toString().replace('.', ',')
            itemPower.PowerDate = itemResp.dayP0.toString() + '/' + itemResp.month.toString() + '/' + itemResp.year.toString()
            itemPower.hour = itemResp.hourP0.toString() + ':' + itemResp.minuteP0.toString()

            //Validamos que el contador esté adaptado
            if (isAdapted === 'SI') {
              if (itemResp.maxPotencyDemandedP1) {
                itemPower.PowerValueP1 = itemResp.maxPotencyDemandedP1.toString().replace('.', ',')
                itemPower.PowerDateP1 = itemResp.dayP1.toString() + '/' + itemResp.month.toString() + '/' + itemResp.year.toString()
                itemPower.hourP1 = itemResp.hourP1.toString() + ':' + itemResp.minuteP1.toString()
              }

              if (itemResp.maxPotencyDemandedP2) {
                itemPower.PowerValueP2 = itemResp.maxPotencyDemandedP2.toString().replace('.', ',')
                itemPower.PowerDateP2 = itemResp.dayP2.toString() + '/' + itemResp.month.toString() + '/' + itemResp.year.toString()
                itemPower.hourP2 = itemResp.hourP2.toString() + ':' + itemResp.minuteP2.toString()
              }

              if (itemResp.maxPotencyDemandedP3) {
                itemPower.PowerValueP3 = itemResp.maxPotencyDemandedP3.toString().replace('.', ',')
                itemPower.PowerDateP3 = itemResp.dayP3.toString() + '/' + itemResp.month.toString() + '/' + itemResp.year.toString()
                itemPower.hourP3 = itemResp.hourP3.toString() + ':' + itemResp.minuteP3.toString()
              }

              //Comprobamos tipo usuario
              if (tipoUsuario === 'complejo') {
                if (itemResp.maxPotencyDemandedP4 && itemResp.dayP4) {
                  itemPower.PowerValueP4 = itemResp.maxPotencyDemandedP4.toString().replace('.', ',')
                  itemPower.PowerDateP4 = itemResp.dayP4.toString() + '/' + itemResp.month.toString() + '/' + itemResp.year.toString()
                  itemPower.hourP4 = itemResp.hourP4.toString() + ':' + itemResp.minuteP4.toString()
                }

                if (itemResp.maxPotencyDemandedP5) {
                  itemPower.PowerValueP5 = itemResp.maxPotencyDemandedP5.toString().replace('.', ',')
                  itemPower.PowerDateP5 = itemResp.dayP5.toString() + '/' + itemResp.month.toString() + '/' + itemResp.year.toString()
                  itemPower.hourP5 = itemResp.hourP5.toString() + ':' + itemResp.minuteP5.toString()
                }

                if (itemResp.maxPotencyDemandedP6) {
                  itemPower.PowerValueP6 = itemResp.maxPotencyDemandedP6.toString().replace('.', ',')
                  itemPower.PowerDateP6 = itemResp.dayP6.toString() + '/' + itemResp.month.toString() + '/' + itemResp.year.toString()
                  itemPower.hourP6 = itemResp.hourP6.toString() + ':' + itemResp.minuteP6.toString()
                }
              }
            }

            //currentSupplyPowerAux.powers.push(itemPower)

            //TODO Tibor -> faltaría comprobar funcionamiento con un caso que llegaran 13 lecturas o más, se tiene que solicitar
            if (i > 0 && itemPower.PowerDate === currentSupplyPowerAux.powers[i - 1].PowerDate && itemResp.maxPotencyDemandedP0 > currentSupplyPowerAux.powers[i - 1].maxPotencyDemandedP0) {
              currentSupplyPowerAux.powers.splice(i - 1, 1, itemPower)
            } else {
              currentSupplyPowerAux.powers.push(itemPower)
            }
          }

          currentSupplyPowerAux.minPower = minPower.toString().replace('.', ',')
          currentSupplyPowerAux.maxPower = maxPower.power.toString().replace('.', ',')
          currentSupplyPowerAux.avgPower = data.maxHired

          setData({ ...data, maxPower: currentSupplyPowerAux.maxPower.replace(',', '.') })
          setCurrentSupplyPowers(currentSupplyPowerAux)

          if (response.months.items[0]) {

            response.months.items.map(item => {
              maxPower.power = parseFloat(item.maxPotencyDemandedP0)
            })

            setData({ ...data, maxPower: maxPower.power.toString() })
            setIsLoading(false)
          }


        } else {
          setCurrentSupplyPowers(currentSupplyPowerAux)
          setIsLoading(false)
        }
        //setIsLoading(false)
      }))

      //Con esto guardamos el valor que debe apareces en la leyenda superior al comparar
      if (compare) {
        if (isAdapted === 'SI') {
          if (state.checked0) {
            setTopLegendYear('(P0) ')
          } else if (state.checked1) {
            setTopLegendYear('(P1) ')
          } else if (state.checked2) {
            setTopLegendYear('(P2) ')
          } else if (state.checked3) {
            setTopLegendYear('(P3) ')
          } else if (state.checked4) {
            setTopLegendYear('(P4) ')
          } else if (state.checked5) {
            setTopLegendYear('(P5) ')
          } else if (state.checked6) {
            setTopLegendYear('(P6) ')
          }
        }
      }

      if (compare && typecompare === '1') {
        //este dispatch carga las potencias del año anterior para comparar
        dispatch(thunkGetMaxPotencyDemanded(supplyData.cups, call.startDateCompare, call.endDateCompare, setIsLoading, '0', supplantedUser, isDelegate, supplyData.measurementSystem, (response) => {

          if (response && response.months && response.months.items && response.months.items.length > 0) {

            let i
            var minPower = 100000

            for (i = 0; i < response.months.items.length; i++) {
              var itemPowerCompare =
              {
                PowerDate: '',
                hour: '',
                activeOutput: '',
                PowerValue: '',
                PowerDateP1: '',
                hourP1: '',
                PowerValueP1: '',
                PowerDateP2: '',
                hourP2: '',
                PowerValueP2: '',
                PowerDateP3: '',
                hourP3: '',
                PowerValueP3: '',
                PowerDateP4: '',
                hourP4: '',
                PowerValueP4: '',
                PowerDateP5: '',
                hourP5: '',
                PowerValueP5: '',
                PowerDateP6: '',
                hourP6: '',
                PowerValueP6: ''
              }

              var itemRespCompare = response.months.items[i]

              if (itemRespCompare.maxPotencyDemandedP0 < minPower) {
                minPower = itemRespCompare.maxPotencyDemandedP0
              }
              //Buscamos la potencia maxima de todas
              if (itemRespCompare.maxPotencyDemandedP0 > maxPower.power) {
                maxPower.power = itemRespCompare.maxPotencyDemandedP0
              }
              //Rellenamos cada item del array
              itemPowerCompare.PowerValue = itemRespCompare.maxPotencyDemandedP0.toString().replace('.', ',')
              itemPowerCompare.activeOutput = itemRespCompare.maxPotencyDemandedP0.toString().replace('.', ',')
              itemPowerCompare.PowerDate = itemRespCompare.dayP0.toString() + '/' + itemRespCompare.month.toString() + '/' + itemRespCompare.year.toString()
              itemPowerCompare.hour = itemRespCompare.hourP0.toString() + ':' + itemRespCompare.minuteP0.toString()

              if (isAdapted === 'SI') {
                if (itemRespCompare.maxPotencyDemandedP1) {
                  itemPowerCompare.PowerValueP1 = itemRespCompare.maxPotencyDemandedP1.toString().replace('.', ',')
                  itemPowerCompare.PowerDateP1 = itemRespCompare.dayP1.toString() + '/' + itemRespCompare.month.toString() + '/' + itemRespCompare.year.toString()
                  itemPowerCompare.hourP1 = itemRespCompare.hourP1.toString() + ':' + itemRespCompare.minuteP1.toString()
                }

                if (itemRespCompare.maxPotencyDemandedP2) {
                  itemPowerCompare.PowerValueP2 = itemRespCompare.maxPotencyDemandedP2.toString().replace('.', ',')
                  itemPowerCompare.PowerDateP2 = itemRespCompare.dayP2.toString() + '/' + itemRespCompare.month.toString() + '/' + itemRespCompare.year.toString()
                  itemPowerCompare.hourP2 = itemRespCompare.hourP2.toString() + ':' + itemRespCompare.minuteP2.toString()
                }

                if (itemRespCompare.maxPotencyDemandedP3) {
                  itemPowerCompare.PowerValueP3 = itemRespCompare.maxPotencyDemandedP3.toString().replace('.', ',')
                  itemPowerCompare.PowerDateP3 = itemRespCompare.dayP3.toString() + '/' + itemRespCompare.month.toString() + '/' + itemRespCompare.year.toString()
                  itemPowerCompare.hourP3 = itemRespCompare.hourP3.toString() + ':' + itemRespCompare.minuteP3.toString()
                }

                if (tipoUsuario === 'complejo') {

                  if (itemRespCompare.maxPotencyDemandedP4) {
                    itemPowerCompare.PowerValueP4 = itemRespCompare.maxPotencyDemandedP4.toString().replace('.', ',')
                    itemPowerCompare.PowerDateP4 = itemRespCompare.dayP4.toString() + '/' + itemRespCompare.month.toString() + '/' + itemRespCompare.year.toString()
                    itemRespCompare.hourP4 = itemRespCompare.hourP4.toString() + ':' + itemRespCompare.minuteP4.toString()
                  }

                  if (itemRespCompare.maxPotencyDemandedP5) {
                    itemPowerCompare.PowerValueP5 = itemRespCompare.maxPotencyDemandedP5.toString().replace('.', ',')
                    itemPowerCompare.PowerDateP5 = itemRespCompare.dayP5.toString() + '/' + itemRespCompare.month.toString() + '/' + itemRespCompare.year.toString()
                    itemPowerCompare.hourP5 = itemRespCompare.hourP5.toString() + ':' + itemRespCompare.minuteP5.toString()
                  }

                  if (itemRespCompare.maxPotencyDemandedP6) {
                    itemPowerCompare.PowerValueP6 = itemRespCompare.maxPotencyDemandedP6.toString().replace('.', ',')
                    itemPowerCompare.PowerDateP6 = itemRespCompare.dayP6.toString() + '/' + itemRespCompare.month.toString() + '/' + itemRespCompare.year.toString()
                    itemPowerCompare.hourP6 = itemRespCompare.hourP6.toString() + ':' + itemRespCompare.minuteP6.toString()
                  }
                }
              }

              //currentComparePowerAux.powers.push(itemPowerCompare)

              //TODO Tibor -> faltaría comprobar funcionamiento con un caso que llegaran 13 lecturas o más, se tiene que solicitar
              if (i > 0 && itemPowerCompare.PowerDate === currentComparePowerAux.powers[i - 1].PowerDate && itemRespCompare.maxPotencyDemandedP0 > currentComparePowerAux.powers[i - 1].maxPotencyDemandedP0) {
                currentComparePowerAux.powers.splice(i - 1, 1, itemPowerCompare)
              } else {
                currentComparePowerAux.powers.push(itemPowerCompare)
              }
            }
            currentComparePowerAux.minPower = minPower.toString().replace('.', ',')
            currentComparePowerAux.maxPower = maxPower.power.toString().replace('.', ',')
            currentComparePowerAux.avgPower = data.maxHired

            setDataCompare({ ...dataCompare, maxPower: currentComparePowerAux.maxPower.replace(',', '.') })
            setCurrentComparePowers(currentComparePowerAux)

            if (response.months.items[0]) {

              response.months.items.map(item => {
                maxPower.power = parseFloat(item.maxPotencyDemandedP0)
              })

              setDataCompare({ ...dataCompare, maxPower: maxPower.power.toString() })
              setIsLoading(false)
            }


          } else {
            setCurrentComparePowers(currentComparePowerAux)
            setIsLoading(false)
          }
        }))
      }
      else if (compare && typecompare === '2') {
        //este dispatch carga las potencias de hace dos años para comparar
        dispatch(thunkGetMaxPotencyDemanded(supplyData.cups, call.startDateCompare2, call.endDateCompare2, setIsLoading, '0', supplantedUser, isDelegate, supplyData.measurementSystem, (response) => {

          if (response && response.months && response.months.items && response.months.items.length > 0) {

            let i
            var minPower = 100000
            //var maxPower = 0
            for (i = 0; i < response.months.items.length; i++) {
              var itemPowerCompare2 =
              {
                PowerDate: '',
                hour: '',
                activeOutput: '',
                PowerValue: '',
                PowerDateP1: '',
                hourP1: '',
                PowerValueP1: '',
                PowerDateP2: '',
                hourP2: '',
                PowerValueP2: '',
                PowerDateP3: '',
                hourP3: '',
                PowerValueP3: '',
                PowerDateP4: '',
                hourP4: '',
                PowerValueP4: '',
                PowerDateP5: '',
                hourP5: '',
                PowerValueP5: '',
                PowerDateP6: '',
                hourP6: '',
                PowerValueP6: ''
              }

              var itemRespCompare2 = response.months.items[i]

              if (itemRespCompare2.maxPotencyDemandedP0 < minPower) {
                minPower = itemRespCompare2.maxPotencyDemandedP0
              }
              //Buscamos la potencia maxima de todas
              if (itemRespCompare2.maxPotencyDemandedP0 > maxPower.power) {
                maxPower.power = itemRespCompare2.maxPotencyDemandedP0
              }
              //Rellenamos cada item del array
              itemPowerCompare2.PowerValue = itemRespCompare2.maxPotencyDemandedP0.toString().replace('.', ',')
              itemPowerCompare2.activeOutput = itemRespCompare2.maxPotencyDemandedP0.toString().replace('.', ',')
              itemPowerCompare2.PowerDate = itemRespCompare2.dayP0.toString() + '/' + itemRespCompare2.month.toString() + '/' + itemRespCompare2.year.toString()
              itemPowerCompare2.hour = itemRespCompare2.hourP0.toString() + ':' + itemRespCompare2.minuteP0.toString()

              if (isAdapted === 'SI') {
                if (itemRespCompare2.maxPotencyDemandedP1) {
                  itemPowerCompare2.PowerValueP1 = itemRespCompare2.maxPotencyDemandedP1.toString().replace('.', ',')
                  itemPowerCompare2.PowerDateP1 = itemRespCompare2.dayP1.toString() + '/' + itemRespCompare2.month.toString() + '/' + itemRespCompare2.year.toString()
                  itemPowerCompare2.hourP1 = itemRespCompare2.hourP1.toString() + ':' + itemRespCompare2.minuteP1.toString()
                }

                if (itemRespCompare2.maxPotencyDemandedP2) {
                  itemPowerCompare2.PowerValueP2 = itemRespCompare2.maxPotencyDemandedP2.toString().replace('.', ',')
                  itemPowerCompare2.PowerDateP2 = itemRespCompare2.dayP2.toString() + '/' + itemRespCompare2.month.toString() + '/' + itemRespCompare2.year.toString()
                  itemPowerCompare2.hourP2 = itemRespCompare2.hourP2.toString() + ':' + itemRespCompare2.minuteP2.toString()
                }

                if (itemRespCompare2.maxPotencyDemandedP3) {
                  itemPowerCompare2.PowerValueP3 = itemRespCompare2.maxPotencyDemandedP3.toString().replace('.', ',')
                  itemPowerCompare2.PowerDateP3 = itemRespCompare2.dayP3.toString() + '/' + itemRespCompare2.month.toString() + '/' + itemRespCompare2.year.toString()
                  itemPowerCompare2.hourP3 = itemRespCompare2.hourP3.toString() + ':' + itemRespCompare2.minuteP3.toString()
                }

                if (tipoUsuario === 'complejo') {
                  if (itemRespCompare2.maxPotencyDemandedP4) {
                    itemPowerCompare2.PowerValueP4 = itemRespCompare2.maxPotencyDemandedP4.toString().replace('.', ',')
                    itemPowerCompare2.PowerDateP4 = itemRespCompare2.dayP4.toString() + '/' + itemRespCompare2.month.toString() + '/' + itemRespCompare2.year.toString()
                    itemPowerCompare2.hourP4 = itemRespCompare2.hourP4.toString() + ':' + itemRespCompare2.minuteP4.toString()
                  }

                  if (itemRespCompare2.maxPotencyDemandedP5) {
                    itemPowerCompare2.PowerValueP5 = itemRespCompare2.maxPotencyDemandedP5.toString().replace('.', ',')
                    itemPowerCompare2.PowerDateP5 = itemRespCompare2.dayP5.toString() + '/' + itemRespCompare2.month.toString() + '/' + itemRespCompare2.year.toString()
                    itemPowerCompare2.hourP5 = itemRespCompare2.hourP5.toString() + ':' + itemRespCompare2.minuteP5.toString()
                  }

                  if (itemRespCompare2.maxPotencyDemandedP6) {
                    itemPowerCompare2.PowerValueP6 = itemRespCompare2.maxPotencyDemandedP6.toString().replace('.', ',')
                    itemPowerCompare2.PowerDateP6 = itemRespCompare2.dayP6.toString() + '/' + itemRespCompare2.month.toString() + '/' + itemRespCompare2.year.toString()
                    itemPowerCompare2.hourP6 = itemRespCompare2.hourP6.toString() + ':' + itemRespCompare2.minuteP6.toString()
                  }
                }
              }

              //currentCompare2PowerAux.powers.push(itemPowerCompare2)

              //TODO Tibor -> faltaría comprobar funcionamiento con un caso que llegaran 13 lecturas o más, se tiene que solicitar
              if (i > 0 && itemPowerCompare2.PowerDate === currentCompare2PowerAux.powers[i - 1].PowerDate && itemRespCompare2.maxPotencyDemandedP0 > currentCompare2PowerAux.powers[i - 1].maxPotencyDemandedP0) {
                currentCompare2PowerAux.powers.splice(i - 1, 1, itemPowerCompare2)
              } else {
                currentCompare2PowerAux.powers.push(itemPowerCompare2)
              }
            }
            currentCompare2PowerAux.minPower = minPower.toString().replace('.', ',')
            currentCompare2PowerAux.maxPower = maxPower.power.toString().replace('.', ',')
            currentCompare2PowerAux.avgPower = data.maxHired

            setDataCompare2({ ...dataCompare2, maxPower: currentCompare2PowerAux.maxPower.replace(',', '.') })
            setCurrentComparePowers2(currentCompare2PowerAux)

            if (response.months.items[0]) {

              response.months.items.map(item => {
                maxPower.power = parseFloat(item.maxPotencyDemandedP0)
              })

              setDataCompare2({ ...dataCompare2, maxPower: maxPower.power.toString() })
              setIsLoading(false)
            }


          } else {
            setCurrentComparePowers2(currentCompare2PowerAux)
            setIsLoading(false)
          }
        }))
      }

      else if (compare && typecompare === '0') {
        dispatch(thunkGetMaxPotencyDemanded(supplyData.cups, call.startDateCompare, call.endDateCompare, setIsLoading, '0', supplantedUser, isDelegate, supplyData.measurementSystem, (response) => {

          if (response && response.months && response.months.items && response.months.items.length > 0) {

            let i
            var minPower = 100000
            //var maxPower = 0
            for (i = 0; i < response.months.items.length; i++) {
              var itemPowerCompare =
              {
                PowerDate: '',
                hour: '',
                activeOutput: '',
                PowerValue: '',
                PowerDateP1: '',
                hourP1: '',
                PowerValueP1: '',
                PowerDateP2: '',
                hourP2: '',
                PowerValueP2: '',
                PowerDateP3: '',
                hourP3: '',
                PowerValueP3: '',
                PowerDateP4: '',
                hourP4: '',
                PowerValueP4: '',
                PowerDateP5: '',
                hourP5: '',
                PowerValueP5: '',
                PowerDateP6: '',
                hourP6: '',
                PowerValueP6: ''
              }

              var itemRespCompare = response.months.items[i]

              if (itemRespCompare.maxPotencyDemandedP0 < minPower) {
                minPower = itemRespCompare.maxPotencyDemandedP0
              }
              //Buscamos la potencia maxima de todas
              if (itemRespCompare.maxPotencyDemandedP0 > maxPower.power) {
                maxPower.power = itemRespCompare.maxPotencyDemandedP0
              }
              //Rellenamos cada item del array
              itemPowerCompare.PowerValue = itemRespCompare.maxPotencyDemandedP0.toString().replace('.', ',')
              itemPowerCompare.activeOutput = itemRespCompare.maxPotencyDemandedP0.toString().replace('.', ',')
              itemPowerCompare.PowerDate = itemRespCompare.dayP0.toString() + '/' + itemRespCompare.month.toString() + '/' + itemRespCompare.year.toString()
              itemPowerCompare.hour = itemRespCompare.hourP0.toString() + ':' + itemRespCompare.minuteP0.toString()

              if (isAdapted === 'SI') {
                if (itemRespCompare.maxPotencyDemandedP1) {
                  itemPowerCompare.PowerValueP1 = itemRespCompare.maxPotencyDemandedP1.toString().replace('.', ',')
                  itemPowerCompare.PowerDateP1 = itemRespCompare.dayP1.toString() + '/' + itemRespCompare.month.toString() + '/' + itemRespCompare.year.toString()
                  itemPowerCompare.hourP1 = itemRespCompare.hourP1.toString() + ':' + itemRespCompare.minuteP1.toString()
                }

                if (itemRespCompare.maxPotencyDemandedP2) {
                  itemPowerCompare.PowerValueP2 = itemRespCompare.maxPotencyDemandedP2.toString().replace('.', ',')
                  itemPowerCompare.PowerDateP2 = itemRespCompare.dayP2.toString() + '/' + itemRespCompare.month.toString() + '/' + itemRespCompare.year.toString()
                  itemPowerCompare.hourP2 = itemRespCompare.hourP2.toString() + ':' + itemRespCompare.minuteP2.toString()
                }

                if (itemRespCompare.maxPotencyDemandedP3) {
                  itemPowerCompare.PowerValueP3 = itemRespCompare.maxPotencyDemandedP3.toString().replace('.', ',')
                  itemPowerCompare.PowerDateP3 = itemRespCompare.dayP3.toString() + '/' + itemRespCompare.month.toString() + '/' + itemRespCompare.year.toString()
                  itemPowerCompare.hourP3 = itemRespCompare.hourP3.toString() + ':' + itemRespCompare.minuteP3.toString()
                }

                if (tipoUsuario === 'complejo') {
                  if (itemRespCompare.maxPotencyDemandedP4) {
                    itemPowerCompare.PowerValueP4 = itemRespCompare.maxPotencyDemandedP4.toString().replace('.', ',')
                    itemPowerCompare.PowerDateP4 = itemRespCompare.dayP4.toString() + '/' + itemRespCompare.month.toString() + '/' + itemRespCompare.year.toString()
                    itemRespCompare.hourP4 = itemRespCompare.hourP4.toString() + ':' + itemRespCompare.minuteP4.toString()
                  }

                  if (itemRespCompare.maxPotencyDemandedP5) {
                    itemPowerCompare.PowerValueP5 = itemRespCompare.maxPotencyDemandedP5.toString().replace('.', ',')
                    itemPowerCompare.PowerDateP5 = itemRespCompare.dayP5.toString() + '/' + itemRespCompare.month.toString() + '/' + itemRespCompare.year.toString()
                    itemPowerCompare.hourP5 = itemRespCompare.hourP5.toString() + ':' + itemRespCompare.minuteP5.toString()
                  }

                  if (itemRespCompare.maxPotencyDemandedP6) {
                    itemPowerCompare.PowerValueP6 = itemRespCompare.maxPotencyDemandedP6.toString().replace('.', ',')
                    itemPowerCompare.PowerDateP6 = itemRespCompare.dayP6.toString() + '/' + itemRespCompare.month.toString() + '/' + itemRespCompare.year.toString()
                    itemPowerCompare.hourP6 = itemRespCompare.hourP6.toString() + ':' + itemRespCompare.minuteP6.toString()
                  }
                }
              }

              //currentComparePowerAux.powers.push(itemPowerCompare)

              //TODO Tibor -> faltaría comprobar funcionamiento con un caso que llegaran 13 lecturas o más, se tiene que solicitar
              if (i > 0 && itemPowerCompare.PowerDate === currentComparePowerAux.powers[i - 1].PowerDate && itemRespCompare.maxPotencyDemandedP0 > currentComparePowerAux.powers[i - 1].maxPotencyDemandedP0) {
                currentComparePowerAux.powers.splice(i - 1, 1, itemPowerCompare)
              } else {
                currentComparePowerAux.powers.push(itemPowerCompare)
              }
            }
            currentComparePowerAux.minPower = minPower.toString().replace('.', ',')
            currentComparePowerAux.maxPower = maxPower.power.toString().replace('.', ',')
            currentComparePowerAux.avgPower = data.maxHired

            setDataCompare({ ...dataCompare, maxPower: currentComparePowerAux.maxPower.replace(',', '.') })
            setCurrentComparePowers(currentComparePowerAux)

            if (response.months.items[0]) {

              response.months.items.map(item => {
                maxPower.power = parseFloat(item.maxPotencyDemandedP0)
              })

              setDataCompare({ ...dataCompare, maxPower: maxPower.power.toString() })
              setIsLoading(false)
            }


          } else {
            setCurrentComparePowers(currentComparePowerAux)
            setIsLoading(false)
          }
        }))
        dispatch(thunkGetMaxPotencyDemanded(supplyData.cups, call.startDateCompare2, call.endDateCompare2, setIsLoading, '0', supplantedUser, isDelegate, supplyData.measurementSystem, (response) => {

          if (response && response.months && response.months.items && response.months.items.length > 0) {

            let i
            var minPower = 100000
            //var maxPower = 0
            for (i = 0; i < response.months.items.length; i++) {
              var itemPowerCompare2 =
              {
                PowerDate: '',
                hour: '',
                activeOutput: '',
                PowerValue: '',
                PowerDateP1: '',
                hourP1: '',
                PowerValueP1: '',
                PowerDateP2: '',
                hourP2: '',
                PowerValueP2: '',
                PowerDateP3: '',
                hourP3: '',
                PowerValueP3: '',
                PowerDateP4: '',
                hourP4: '',
                PowerValueP4: '',
                PowerDateP5: '',
                hourP5: '',
                PowerValueP5: '',
                PowerDateP6: '',
                hourP6: '',
                PowerValueP6: ''
              }

              var itemRespCompare2 = response.months.items[i]

              if (itemRespCompare2.maxPotencyDemandedP0 < minPower) {
                minPower = itemRespCompare2.maxPotencyDemandedP0
              }
              //Buscamos la potencia maxima de todas
              if (itemRespCompare2.maxPotencyDemandedP0 > maxPower.power) {
                maxPower.power = itemRespCompare2.maxPotencyDemandedP0
              }

              //Rellenamos cada item del array
              itemPowerCompare2.PowerValue = itemRespCompare2.maxPotencyDemandedP0.toString().replace('.', ',')
              itemPowerCompare2.activeOutput = itemRespCompare2.maxPotencyDemandedP0.toString().replace('.', ',')
              itemPowerCompare2.PowerDate = itemRespCompare2.dayP0.toString() + '/' + itemRespCompare2.month.toString() + '/' + itemRespCompare2.year.toString()
              itemPowerCompare2.hour = itemRespCompare2.hourP0.toString() + ':' + itemRespCompare2.minuteP0.toString()

              if (isAdapted === 'SI') {
                if (itemRespCompare2.maxPotencyDemandedP1) {
                  itemPowerCompare2.PowerValueP1 = itemRespCompare2.maxPotencyDemandedP1.toString().replace('.', ',')
                  itemPowerCompare2.PowerDateP1 = itemRespCompare2.dayP1.toString() + '/' + itemRespCompare2.month.toString() + '/' + itemRespCompare2.year.toString()
                  itemPowerCompare2.hourP1 = itemRespCompare2.hourP1.toString() + ':' + itemRespCompare2.minuteP1.toString()
                }

                if (itemRespCompare2.maxPotencyDemandedP2) {
                  itemPowerCompare2.PowerValueP2 = itemRespCompare2.maxPotencyDemandedP2.toString().replace('.', ',')
                  itemPowerCompare2.PowerDateP2 = itemRespCompare2.dayP2.toString() + '/' + itemRespCompare2.month.toString() + '/' + itemRespCompare2.year.toString()
                  itemPowerCompare2.hourP2 = itemRespCompare2.hourP2.toString() + ':' + itemRespCompare2.minuteP2.toString()
                }

                if (itemRespCompare2.maxPotencyDemandedP3) {
                  itemPowerCompare2.PowerValueP3 = itemRespCompare2.maxPotencyDemandedP3.toString().replace('.', ',')
                  itemPowerCompare2.PowerDateP3 = itemRespCompare2.dayP3.toString() + '/' + itemRespCompare2.month.toString() + '/' + itemRespCompare2.year.toString()
                  itemPowerCompare2.hourP3 = itemRespCompare2.hourP3.toString() + ':' + itemRespCompare2.minuteP3.toString()
                }

                if (tipoUsuario === 'complejo') {
                  if (itemRespCompare2.maxPotencyDemandedP4) {
                    itemPowerCompare2.PowerValueP4 = itemRespCompare2.maxPotencyDemandedP4.toString().replace('.', ',')
                    itemPowerCompare2.PowerDateP4 = itemRespCompare2.dayP4.toString() + '/' + itemRespCompare2.month.toString() + '/' + itemRespCompare2.year.toString()
                    itemPowerCompare2.hourP4 = itemRespCompare2.hourP4.toString() + ':' + itemRespCompare2.minuteP4.toString()
                  }

                  if (itemRespCompare2.maxPotencyDemandedP5) {
                    itemPowerCompare2.PowerValueP5 = itemRespCompare2.maxPotencyDemandedP5.toString().replace('.', ',')
                    itemPowerCompare2.PowerDateP5 = itemRespCompare2.dayP5.toString() + '/' + itemRespCompare2.month.toString() + '/' + itemRespCompare2.year.toString()
                    itemPowerCompare2.hourP5 = itemRespCompare2.hourP5.toString() + ':' + itemRespCompare2.minuteP5.toString()
                  }

                  if (itemRespCompare2.maxPotencyDemandedP6) {
                    itemPowerCompare2.PowerValueP6 = itemRespCompare2.maxPotencyDemandedP6.toString().replace('.', ',')
                    itemPowerCompare2.PowerDateP6 = itemRespCompare2.dayP6.toString() + '/' + itemRespCompare2.month.toString() + '/' + itemRespCompare2.year.toString()
                    itemPowerCompare2.hourP6 = itemRespCompare2.hourP6.toString() + ':' + itemRespCompare2.minuteP6.toString()
                  }
                }
              }

              //currentCompare2PowerAux.powers.push(itemPowerCompare2)

              //TODO Tibor -> faltaría comprobar funcionamiento con un caso que llegaran 13 lecturas o más, se tiene que solicitar
              if (i > 0 && itemPowerCompare2.PowerDate === currentCompare2PowerAux.powers[i - 1].PowerDate && itemRespCompare2.maxPotencyDemandedP0 > currentCompare2PowerAux.powers[i - 1].maxPotencyDemandedP0) {
                currentCompare2PowerAux.powers.splice(i - 1, 1, itemPowerCompare2)
              } else {
                currentCompare2PowerAux.powers.push(itemPowerCompare2)
              }
            }
            currentCompare2PowerAux.minPower = minPower.toString().replace('.', ',')
            currentCompare2PowerAux.maxPower = maxPower.power.toString().replace('.', ',')
            currentCompare2PowerAux.avgPower = data.maxHired

            setDataCompare2({ ...dataCompare2, maxPower: currentCompare2PowerAux.maxPower.replace(',', '.') })
            setCurrentComparePowers2(currentCompare2PowerAux)

            if (response.months.items[0]) {

              response.months.items.map(item => {
                maxPower.power = parseFloat(item.maxPotencyDemandedP0)
              })

              setDataCompare2({ ...dataCompare2, maxPower: maxPower.power.toString() })
              setIsLoading(false)
            }


          } else {
            setCurrentComparePowers2(currentCompare2PowerAux)
            setIsLoading(false)
          }
        }))
      }

      setData({ ...data, maxPower: maxPower.toString() })
      setDataCompare({ ...dataCompare, maxPower: maxPower.toString() })
      setDataCompare2({ ...dataCompare2, maxPower: maxPower.toString() })

    }
    return date
  }

  //Este useEffect es el encargado de recargar el gráfico cuando sea necesario, cuando se modifica alguna de las constantes asignadas
  useEffect(() => {
    recargarGrafico()

  }, [date, yearSelected, compare, recargarGraf])

  // Nuevas possibles opciones:
  // 1 - NEW potencia > potencia actual-> Nueva potencia inferior a la actual, hablar con comercializadora
  // 2 - NEW potencia <= potencia promotor -> Nueva potencia inferior a ultima potencia paga por promotor  hablar comercializadora
  // 3 - NEW potencia > potencia promotor -> habilitar cambio potencia
  const validatePowerChange = (newPower, supplyData, maxOldPower) => {
    const today = new Date()

    const convertStringToDate = (dateString: any): Date => {
      let myDate
      if (dateString) {
        var parts = dateString.split('/')
        myDate = new Date(parts[2], parts[1] - 1, parts[0])
      }
      return myDate
    }

    const ultimaPotenciaPagadaPromotor = supplyData.maxAvalaibleVoltage

    //reduccion de potencia 
    if (parseFloat(newPower) <= parseFloat(maxOldPower)) {
      setOption(2)
    }
    //augmento de potencia, potencia inferior a ultima potencia pagada por promotor
    else if (parseFloat(newPower) <= parseFloat(ultimaPotenciaPagadaPromotor)) {
      setOption(1)
    }
    //augmento de potencia, potencia superopr a ultima potencia pagada por promotor
    else {
      setOption(3)
    }
  }

  const goToStep1 = () => {
    setShowFormStep2(false)
    setShowFormStep1(true)
    setPowerChangeButtonStatus(true)
  }

  useEffect(() => {
    let maxOldValue = 0
    maxOldValue = maxOldValue > supplyData.power1 || supplyData.power1 === undefined ? maxOldValue : supplyData.power1
    maxOldValue = maxOldValue > supplyData.power2 || supplyData.power2 === undefined ? maxOldValue : supplyData.power2

    if (!supplyData.rate.includes('2.')) {
      maxOldValue = maxOldValue > supplyData.power3 || supplyData.power3 === undefined ? maxOldValue : supplyData.power3
      maxOldValue = maxOldValue > supplyData.power4 || supplyData.power4 === undefined ? maxOldValue : supplyData.power4
      maxOldValue = maxOldValue > supplyData.power5 || supplyData.power5 === undefined ? maxOldValue : supplyData.power5
      maxOldValue = maxOldValue > supplyData.power6 || supplyData.power6 === undefined ? maxOldValue : supplyData.power6
    }
    setMaxOldNewPower(maxOldValue)
  }, [])

  useEffect(() => {
    let maxNewValue = 0
    maxNewValue = maxNewValue > inputValue1 ? maxNewValue : inputValue1
    maxNewValue = maxNewValue > inputValue2 ? maxNewValue : inputValue2
    maxNewValue = maxNewValue > inputValue3 ? maxNewValue : inputValue3
    maxNewValue = maxNewValue > inputValue4 ? maxNewValue : inputValue4
    maxNewValue = maxNewValue > inputValue5 ? maxNewValue : inputValue5
    maxNewValue = maxNewValue > inputValue6 ? maxNewValue : inputValue6

    setMaxNewPower(maxNewValue)
  }, [inputValue1, inputValue2, inputValue3, inputValue4, inputValue5, inputValue6])

  const goToStep2 = (newPower, oldPower, maxOldPower) => {
    if (supplyData.validExtentRights > 0) {
      if (newPower >= (supplyData.validExtentRights * 10)) {
        setShowingDialogAlert(true)
      }
    }
    else {
      if (newPower >= (supplyData.maxAuthorizedVoltage * 10)) {
        setShowingDialogAlert(true)
      }
    }
    setShowFormStep1(false)
    validatePowerChange(newPower, oldPower, maxOldPower)
    setShowFormStep2(true)
    // setInputValueStr('')
    clearInputStrings()
    clearInputValues()
  }

  const changeStatusShowPopup = () => {
    setViewPopup(true)
  }

  const handleYear = (fecha: Date) => {
    setCompare(false)
    if (isAdapted === 'SI') {
      if (tipoUsuario === 'simple') {
        setState({
          ...state,
          checked1: true,
          checked2: true,
          checked3: true
        })
      } else {
        setState({
          ...state,
          checked1: true,
          checked2: true,
          checked3: true,
          checked4: true,
          checked5: true,
          checked6: true
        })
      }
      setDisabledCheckbox({
        disabled0: false,
        disabled1: false,
        disabled2: false,
        disabled3: false,
        disabled4: false,
        disabled5: false,
        disabled6: false
      })
    }
    setTypeCompare('')
    setIsLoading(true)
    setStartDate(fecha)
    setYearSelected(fecha.getFullYear())
    setIsLoading(false)
    setDate(yearSelected.toString())
  }

  //Funcion que ejecutamos al pulsar comparar
  const handleCompare = () => {
    if (!compare) {
      setCompare(true)
      /*if (isAdapted === 'SI') {
  
        if (tipoUsuario === 'simple') {
          setState({
            ...state,
            checked1: false,
            checked2: false,
            checked3: false
          })
        } else {
          setState({
            ...state,
            checked1: false,
            checked2: false,
            checked3: false,
            checked4: false,
            checked5: false,
            checked6: false
          })
        }
        setDisabledCheckbox({
          disabled0: true,
          disabled1: true,
          disabled2: true,
          disabled3: true,
          disabled4: true,
          disabled5: true,
          disabled6: true
        })
      }*/
    }

    setSendTypeCompare(typecompare)
    recargarGrafico()
    handleCloseDialog()
  }

  const endCompare = () => {
    setCompare(false)
    setTypeCompare('')
    if (isAdapted === 'SI') {
      if (tipoUsuario === 'simple') {
        setState({
          ...state,
          checked0: true,
          checked1: true,
          checked2: true,
          checked3: true
        })
      } else {
        setState({
          ...state,
          checked0: true,
          checked1: true,
          checked2: true,
          checked3: true,
          checked4: true,
          checked5: true,
          checked6: true
        })
      }
      setDisabledCheckbox({
        disabled0: false,
        disabled1: false,
        disabled2: false,
        disabled3: false,
        disabled4: false,
        disabled5: false,
        disabled6: false
      })
    }
  }

  const [fileType, setFileType] = useState('excel')

  //TO DO poder exportar dependiendo el periodo 
  const exportPower = () => {

    const powersData = currentSupplyPowers && currentSupplyPowers.powers
    const powersDataCompare = currentComparePowers && currentComparePowers.powers
    const powersDataCompare2 = currentComparePowers2 && currentComparePowers2.powers

    const auxPowersData = [] as any

    let ws
    let fileName
    if (fileType === 'excel') {
      if (isAdapted === 'SI') {
        if (tipoUsuario === 'simple') {
          powersData && powersData.map(
            (item) => {
              let auxPowerValue = item.PowerValue
              let auxPowerValue1 = item.PowerValueP1
              let auxPowerValue2 = item.PowerValueP2
              let auxPowerValue3 = item.PowerValueP3

              if (auxPowerValue) {
                auxPowerValue && auxPowerValue !== ' ' &&
                  auxPowersData.push({
                    cups: supplyData.cups ? supplyData.cups : '0',
                    date: item.PowerDate ? item.PowerDate : '00/00/0000',
                    hour: item.hour ? item.hour : '0',
                    power: auxPowerValue ? auxPowerValue.replace(',', '.') : '0.000',
                    period: 'P0'
                  })
                auxPowerValue1 && auxPowerValue1 !== ' ' &&
                  auxPowersData.push({
                    cups: supplyData.cups ? supplyData.cups : '0',
                    date: item.PowerDateP1 ? item.PowerDateP1 : '00/00/0000',
                    hour: item.hourP1 ? item.hourP1 : '0',
                    power: auxPowerValue1 ? auxPowerValue1.replace(',', '.') : '0.000',
                    period: 'P1'
                  })
                auxPowerValue2 && auxPowerValue2 !== ' ' &&
                  auxPowersData.push({
                    cups: supplyData.cups ? supplyData.cups : '0',
                    date: item.PowerDateP2 ? item.PowerDateP2 : '00/00/0000',
                    hour: item.hourP2 ? item.hourP2 : '0',
                    power: auxPowerValue2 ? auxPowerValue2.replace(',', '.') : '0.000',
                    period: 'P2'
                  })
                auxPowerValue3 && auxPowerValue3 !== ' ' &&
                  auxPowersData.push({
                    cups: supplyData.cups ? supplyData.cups : '0',
                    date: item.PowerDateP3 ? item.PowerDateP3 : '00/00/0000',
                    hour: item.hourP3 ? item.hourP3 : '0',
                    power: auxPowerValue3 ? auxPowerValue3.replace(',', '.') : '0.000',
                    period: 'P3'
                  })
              }

              return null
            }
          )
        }
        else if (tipoUsuario === 'complejo') {
          powersData && powersData.map(
            (item) => {
              let auxPowerValue = item.PowerValue
              let auxPowerValue1 = item.PowerValueP1
              let auxPowerValue2 = item.PowerValueP2
              let auxPowerValue3 = item.PowerValueP3
              let auxPowerValue4 = item.PowerValueP4
              let auxPowerValue5 = item.PowerValueP5
              let auxPowerValue6 = item.PowerValueP6

              if (auxPowerValue) {

                auxPowerValue && auxPowerValue !== ' ' &&
                  auxPowersData.push({
                    cups: supplyData.cups ? supplyData.cups : '0',
                    date: item.PowerDate ? item.PowerDate : '00/00/0000',
                    hour: item.hour ? item.hour : '0',
                    power: auxPowerValue ? auxPowerValue.replace(',', '.') : '0.000',
                    period: 'P0'
                  })
                auxPowerValue1 && auxPowerValue1 !== ' ' &&
                  auxPowersData.push({
                    cups: supplyData.cups ? supplyData.cups : '0',
                    date: item.PowerDateP1 ? item.PowerDateP1 : '00/00/0000',
                    hour: item.hourP1 ? item.hourP1 : '0',
                    power: auxPowerValue1 ? auxPowerValue1.replace(',', '.') : '0.000',
                    period: 'P1'
                  })
                auxPowerValue2 && auxPowerValue2 !== ' ' &&
                  auxPowersData.push({
                    cups: supplyData.cups ? supplyData.cups : '0',
                    date: item.PowerDateP2 ? item.PowerDateP2 : '00/00/0000',
                    hour: item.hourP2 ? item.hourP2 : '0',
                    power: auxPowerValue2 ? auxPowerValue2.replace(',', '.') : '0.000',
                    period: 'P2'
                  })
                auxPowerValue3 && auxPowerValue3 !== ' ' &&
                  auxPowersData.push({
                    cups: supplyData.cups ? supplyData.cups : '0',
                    date: item.PowerDateP3 ? item.PowerDateP3 : '00/00/0000',
                    hour: item.hourP3 ? item.hourP3 : '0',
                    power: auxPowerValue3 ? auxPowerValue3.replace(',', '.') : '0.000',
                    period: 'P3'
                  })
                auxPowerValue4 && auxPowerValue4 !== ' ' &&
                  auxPowersData.push({
                    cups: supplyData.cups ? supplyData.cups : '0',
                    date: item.PowerDateP4 ? item.PowerDateP4 : '00/00/0000',
                    hour: item.hourP4 ? item.hourP4 : '0',
                    power: auxPowerValue4 ? auxPowerValue4.replace(',', '.') : '0.000',
                    period: 'P4'
                  })
                auxPowerValue5 && auxPowerValue5 !== ' ' &&
                  auxPowersData.push({
                    cups: supplyData.cups ? supplyData.cups : '0',
                    date: item.PowerDateP5 ? item.PowerDateP5 : '00/00/0000',
                    hour: item.hourP5 ? item.hourP5 : '0',
                    power: auxPowerValue5 ? auxPowerValue5.replace(',', '.') : '0.000',
                    period: 'P5'
                  })
                auxPowerValue6 && auxPowerValue6 !== ' ' &&
                  auxPowersData.push({
                    cups: supplyData.cups ? supplyData.cups : '0',
                    date: item.PowerDateP6 ? item.PowerDateP6 : '00/00/0000',
                    hour: item.hourP6 ? item.hourP6 : '0',
                    power: auxPowerValue6 ? auxPowerValue6.replace(',', '.') : '0.000',
                    period: 'P6'
                  })
              }

              return null
            }
          )
        }
      }
      else {
        powersData && powersData.map(
          (item) => {
            let auxPowerValue = item.PowerValue

            if (auxPowerValue && auxPowerValue !== ' ') {
              auxPowersData.push({
                cups: supplyData.cups ? supplyData.cups : '0',
                date: item.PowerDate ? item.PowerDate : '00/00/0000',
                hour: item.hour ? item.hour : '0',
                power: auxPowerValue ? auxPowerValue.replace(',', '.') : '0.000',
                period: 'P0'
              })
            }

            return null
          }
        )
      }

      ws = XLSX.utils.json_to_sheet(auxPowersData, {
        header: [
          'cups',
          'date',
          'hour',
          'power',
          'period'
        ]
      })

      ws['A1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.cups')
      ws['B1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.date')
      ws['C1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.hour')
      ws['D1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.power')
      ws['E1'].v = t('Periodo')

      fileName = 'powers.xlsx'
      //Este else es para exportar en csv, funcionalidad inactiva
    } else {
      powersData && powersData.map(
        (item) => {
          let auxPowerValue = item.powerValue

          if (auxPowerValue) {
            let auxPowerItem = [
              supplyData.cups ? supplyData.cups : '0',
              item.powerDate ? item.powerDate : '00/00/0000',
              item.hour ? item.hour : '0',
              auxPowerValue ? auxPowerValue.replace(',', '.') : '0.000'
            ]

            auxPowersData.push({
              item: auxPowerItem.join(';')
            })
          }

          return null
        }
      )

      ws = XLSX.utils.json_to_sheet(auxPowersData, {
        header: [
          'item'
        ]
      })

      ws['A1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.cups2') + ';' + t('supplies.suppliesDetails.components.consumption.exportDialogs.date') + ';' + t('supplies.suppliesDetails.components.consumption.exportDialogs.hour') + ';' + t('supplies.suppliesDetails.components.consumption.exportDialogs.consumption2') + '_kW;'

      fileName = 'power.csv'
    }

    const wb = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(wb, ws, 'power')

    XLSX.writeFile(wb, fileName)

    // XLSX.writeFile will attempt to force a client-side download, works for web,
    // for mobile apps blob downloads do not work ATM, code below is an alternative, (hover createFileAndOpenIt for jsdoc).
    if (isMobileApp()) createFileAndOpenIt({ fileName, contentAsBase64: XLSX.write(wb, { type: 'base64' }) })
     
  }

  const exportPowerCompare = () => {

    const powersData = currentSupplyPowers && currentSupplyPowers.powers
    const powersDataCompare = currentComparePowers && currentComparePowers.powers
    const powersDataCompare2 = currentComparePowers2 && currentComparePowers2.powers

    const auxPowersData = [] as any
    const auxPowersData2 = [] as any
    const auxPowersData3 = [] as any
    const auxPowersDataAll = [] as any

    let ws
    let fileName
    if (fileType === 'excel') {
      if (isAdapted === 'SI' && tipoUsuario === 'simple') {
        powersData && powersData.map(
          (item) => {
            let auxPowerValue = item.PowerValue
            let auxPowerValue1 = item.PowerValueP1
            let auxPowerValue2 = item.PowerValueP2
            let auxPowerValue3 = item.PowerValueP3

            if (auxPowerValue) {
              auxPowerValue && auxPowerValue !== ' ' &&
                auxPowersData.push({
                  cups: supplyData.cups ? supplyData.cups : '0',
                  date: item.PowerDate ? item.PowerDate : '00/00/0000',
                  hour: item.hour ? item.hour : '0',
                  power: auxPowerValue ? auxPowerValue.replace(',', '.') : '0.000',
                  period: 'P0'
                })
              auxPowerValue1 && auxPowerValue1 !== ' ' && state.checked1 &&
                auxPowersData.push({
                  cups: supplyData.cups ? supplyData.cups : '0',
                  date: item.PowerDateP1 ? item.PowerDateP1 : '00/00/0000',
                  hour: item.hourP1 ? item.hourP1 : '0',
                  power: auxPowerValue1 ? auxPowerValue1.replace(',', '.') : '0.000',
                  period: 'P1'
                })
              auxPowerValue2 && auxPowerValue2 !== ' ' && state.checked2 &&
                auxPowersData.push({
                  cups: supplyData.cups ? supplyData.cups : '0',
                  date: item.PowerDateP2 ? item.PowerDateP2 : '00/00/0000',
                  hour: item.hourP2 ? item.hourP2 : '0',
                  power: auxPowerValue2 ? auxPowerValue2.replace(',', '.') : '0.000',
                  period: 'P2'
                })
              auxPowerValue3 && auxPowerValue3 !== ' ' && state.checked3 &&
                auxPowersData.push({
                  cups: supplyData.cups ? supplyData.cups : '0',
                  date: item.PowerDateP3 ? item.PowerDateP3 : '00/00/0000',
                  hour: item.hourP3 ? item.hourP3 : '0',
                  power: auxPowerValue3 ? auxPowerValue3.replace(',', '.') : '0.000',
                  period: 'P3'
                })

            }

            return null
          }
        )
      } else if (isAdapted === 'SI' && tipoUsuario === 'complejo') {
        powersData && powersData.map(
          (item) => {
            let auxPowerValue = item.PowerValue
            let auxPowerValue1 = item.PowerValueP1
            let auxPowerValue2 = item.PowerValueP2
            let auxPowerValue3 = item.PowerValueP3
            let auxPowerValue4 = item.PowerValueP4
            let auxPowerValue5 = item.PowerValueP5
            let auxPowerValue6 = item.PowerValueP6

            if (auxPowerValue) {

              auxPowerValue &&
                auxPowersData.push({
                  cups: supplyData.cups ? supplyData.cups : '0',
                  date: item.PowerDate ? item.PowerDate : '00/00/0000',
                  hour: item.hour ? item.hour : '0',
                  power: auxPowerValue ? auxPowerValue.replace(',', '.') : '0.000',
                  period: 'P0'
                })
              auxPowerValue1 && state.checked1 &&
                auxPowersData.push({
                  cups: supplyData.cups ? supplyData.cups : '0',
                  date: item.PowerDateP1 ? item.PowerDateP1 : '00/00/0000',
                  hour: item.hourP1 ? item.hourP1 : '0',
                  power: auxPowerValue1 ? auxPowerValue1.replace(',', '.') : '0.000',
                  period: 'P1'
                })
              auxPowerValue2 && state.checked2 &&
                auxPowersData.push({
                  cups: supplyData.cups ? supplyData.cups : '0',
                  date: item.PowerDateP2 ? item.PowerDateP2 : '00/00/0000',
                  hour: item.hourP2 ? item.hourP2 : '0',
                  power: auxPowerValue2 ? auxPowerValue2.replace(',', '.') : '0.000',
                  period: 'P2'
                })
              auxPowerValue3 && state.checked3 &&
                auxPowersData.push({
                  cups: supplyData.cups ? supplyData.cups : '0',
                  date: item.PowerDateP3 ? item.PowerDateP3 : '00/00/0000',
                  hour: item.hourP3 ? item.hourP3 : '0',
                  power: auxPowerValue3 ? auxPowerValue3.replace(',', '.') : '0.000',
                  period: 'P3'
                })
              auxPowerValue4 && state.checked4 &&
                auxPowersData.push({
                  cups: supplyData.cups ? supplyData.cups : '0',
                  date: item.PowerDateP4 ? item.PowerDateP4 : '00/00/0000',
                  hour: item.hourP4 ? item.hourP4 : '0',
                  power: auxPowerValue4 ? auxPowerValue4.replace(',', '.') : '0.000',
                  period: 'P4'
                })
              auxPowerValue5 && state.checked5 &&
                auxPowersData.push({
                  cups: supplyData.cups ? supplyData.cups : '0',
                  date: item.PowerDateP5 ? item.PowerDateP5 : '00/00/0000',
                  hour: item.hourP5 ? item.hourP5 : '0',
                  power: auxPowerValue5 ? auxPowerValue5.replace(',', '.') : '0.000',
                  period: 'P5'
                })
              auxPowerValue6 && state.checked6 &&
                auxPowersData.push({
                  cups: supplyData.cups ? supplyData.cups : '0',
                  date: item.PowerDateP6 ? item.PowerDateP6 : '00/00/0000',
                  hour: item.hourP6 ? item.hourP6 : '0',
                  power: auxPowerValue6 ? auxPowerValue6.replace(',', '.') : '0.000',
                  period: 'P6'
                })
            }

            return null
          }
        )
      } else {
        powersData && powersData.map(
          (item) => {
            let auxPowerValue = item.PowerValue

            if (auxPowerValue && auxPowerValue !== ' ') {
              auxPowersData.push({
                cups: supplyData.cups ? supplyData.cups : '0',
                date: item.PowerDate ? item.PowerDate : '00/00/0000',
                hour: item.hour ? item.hour : '0',
                power: auxPowerValue ? auxPowerValue.replace(',', '.') : '0.000',
                period: 'P0'
              })
            }

            return null
          }
        )
      }

      if (isAdapted === 'SI' && tipoUsuario === 'simple') {
        powersDataCompare && powersDataCompare.map(
          (item) => {
            let auxPowerValue = item.PowerValue
            let auxPowerValue1 = item.PowerValueP1
            let auxPowerValue2 = item.PowerValueP2
            let auxPowerValue3 = item.PowerValueP3

            if (auxPowerValue) {
              auxPowerValue &&
                auxPowersData2.push({
                  cups: supplyData.cups ? supplyData.cups : '0',
                  date: item.PowerDate ? item.PowerDate : '00/00/0000',
                  hour: item.hour ? item.hour : '0',
                  power: auxPowerValue ? auxPowerValue.replace(',', '.') : '0.000',
                  period: 'P0'
                })
              auxPowerValue1 && state.checked1 &&
                auxPowersData2.push({
                  cups: supplyData.cups ? supplyData.cups : '0',
                  date: item.PowerDateP1 ? item.PowerDateP1 : '00/00/0000',
                  hour: item.hourP1 ? item.hourP1 : '0',
                  power: auxPowerValue1 ? auxPowerValue1.replace(',', '.') : '0.000',
                  period: 'P1'
                })
              auxPowerValue2 && state.checked2 &&
                auxPowersData2.push({
                  cups: supplyData.cups ? supplyData.cups : '0',
                  date: item.PowerDateP2 ? item.PowerDateP2 : '00/00/0000',
                  hour: item.hourP2 ? item.hourP2 : '0',
                  power: auxPowerValue2 ? auxPowerValue2.replace(',', '.') : '0.000',
                  period: 'P2'
                })
              auxPowerValue3 && state.checked3 &&
                auxPowersData2.push({
                  cups: supplyData.cups ? supplyData.cups : '0',
                  date: item.PowerDateP3 ? item.PowerDateP3 : '00/00/0000',
                  hour: item.hourP3 ? item.hourP3 : '0',
                  power: auxPowerValue3 ? auxPowerValue3.replace(',', '.') : '0.000',
                  period: 'P3'
                })
            }

            return null
          }
        )
      } else if (isAdapted === 'SI' && tipoUsuario === 'complejo') {
        powersDataCompare && powersDataCompare.map(
          (item) => {
            let auxPowerValue = item.PowerValue
            let auxPowerValue1 = item.PowerValueP1
            let auxPowerValue2 = item.PowerValueP2
            let auxPowerValue3 = item.PowerValueP3
            let auxPowerValue4 = item.PowerValueP4
            let auxPowerValue5 = item.PowerValueP5
            let auxPowerValue6 = item.PowerValueP6

            if (auxPowerValue) {

              auxPowerValue &&
                auxPowersData2.push({
                  cups: supplyData.cups ? supplyData.cups : '0',
                  date: item.PowerDate ? item.PowerDate : '00/00/0000',
                  hour: item.hour ? item.hour : '0',
                  power: auxPowerValue ? auxPowerValue.replace(',', '.') : '0.000',
                  period: 'P0'
                })
              auxPowerValue1 && state.checked1 &&
                auxPowersData2.push({
                  cups: supplyData.cups ? supplyData.cups : '0',
                  date: item.PowerDateP1 ? item.PowerDateP1 : '00/00/0000',
                  hour: item.hourP1 ? item.hourP1 : '0',
                  power: auxPowerValue1 ? auxPowerValue1.replace(',', '.') : '0.000',
                  period: 'P1'
                })
              auxPowerValue2 && state.checked2 &&
                auxPowersData2.push({
                  cups: supplyData.cups ? supplyData.cups : '0',
                  date: item.PowerDateP2 ? item.PowerDateP2 : '00/00/0000',
                  hour: item.hourP2 ? item.hourP2 : '0',
                  power: auxPowerValue2 ? auxPowerValue2.replace(',', '.') : '0.000',
                  period: 'P2'
                })
              auxPowerValue3 && state.checked3 &&
                auxPowersData2.push({
                  cups: supplyData.cups ? supplyData.cups : '0',
                  date: item.PowerDateP3 ? item.PowerDateP3 : '00/00/0000',
                  hour: item.hourP3 ? item.hourP3 : '0',
                  power: auxPowerValue3 ? auxPowerValue3.replace(',', '.') : '0.000',
                  period: 'P3'
                })
              auxPowerValue4 && state.checked4 &&
                auxPowersData2.push({
                  cups: supplyData.cups ? supplyData.cups : '0',
                  date: item.PowerDateP4 ? item.PowerDateP4 : '00/00/0000',
                  hour: item.hourP4 ? item.hourP4 : '0',
                  power: auxPowerValue4 ? auxPowerValue4.replace(',', '.') : '0.000',
                  period: 'P4'
                })
              auxPowerValue5 && state.checked5 &&
                auxPowersData2.push({
                  cups: supplyData.cups ? supplyData.cups : '0',
                  date: item.PowerDateP5 ? item.PowerDateP5 : '00/00/0000',
                  hour: item.hourP5 ? item.hourP5 : '0',
                  power: auxPowerValue5 ? auxPowerValue5.replace(',', '.') : '0.000',
                  period: 'P5'
                })
              auxPowerValue6 && state.checked6 &&
                auxPowersData2.push({
                  cups: supplyData.cups ? supplyData.cups : '0',
                  date: item.PowerDateP6 ? item.PowerDateP6 : '00/00/0000',
                  hour: item.hourP6 ? item.hourP6 : '0',
                  power: auxPowerValue6 ? auxPowerValue6.replace(',', '.') : '0.000',
                  period: 'P6'
                })
            }

            return null
          }
        )
      } else {
        powersDataCompare && powersDataCompare.map(
          (item) => {
            let auxPowerValue = item.PowerValue

            if (auxPowerValue && auxPowerValue !== ' ') {
              auxPowersData2.push({
                cups: supplyData.cups ? supplyData.cups : '0',
                date: item.PowerDate ? item.PowerDate : '00/00/0000',
                hour: item.hour ? item.hour : '0',
                power: auxPowerValue ? auxPowerValue.replace(',', '.') : '0.000',
                period: 'P0'
              })
            }

            return null
          }
        )
      }

      if (isAdapted === 'SI' && tipoUsuario === 'simple') {
        powersDataCompare2 && powersDataCompare2.map(
          (item) => {
            let auxPowerValue = item.PowerValue
            let auxPowerValue1 = item.PowerValueP1
            let auxPowerValue2 = item.PowerValueP2
            let auxPowerValue3 = item.PowerValueP3

            if (auxPowerValue) {
              auxPowerValue &&
                auxPowersData3.push({
                  cups: supplyData.cups ? supplyData.cups : '0',
                  date: item.PowerDate ? item.PowerDate : '00/00/0000',
                  hour: item.hour ? item.hour : '0',
                  power: auxPowerValue ? auxPowerValue.replace(',', '.') : '0.000',
                  period: 'P0'
                })
              auxPowerValue1 && state.checked1 &&
                auxPowersData3.push({
                  cups: supplyData.cups ? supplyData.cups : '0',
                  date: item.PowerDateP1 ? item.PowerDateP1 : '00/00/0000',
                  hour: item.hourP1 ? item.hourP1 : '0',
                  power: auxPowerValue1 ? auxPowerValue1.replace(',', '.') : '0.000',
                  period: 'P1'
                })
              auxPowerValue2 && state.checked2 &&
                auxPowersData3.push({
                  cups: supplyData.cups ? supplyData.cups : '0',
                  date: item.PowerDateP2 ? item.PowerDateP2 : '00/00/0000',
                  hour: item.hourP2 ? item.hourP2 : '0',
                  power: auxPowerValue2 ? auxPowerValue2.replace(',', '.') : '0.000',
                  period: 'P2'
                })
              auxPowerValue3 && state.checked3 &&
                auxPowersData3.push({
                  cups: supplyData.cups ? supplyData.cups : '0',
                  date: item.PowerDateP3 ? item.PowerDateP3 : '00/00/0000',
                  hour: item.hourP3 ? item.hourP3 : '0',
                  power: auxPowerValue3 ? auxPowerValue3.replace(',', '.') : '0.000',
                  period: 'P3'
                })
            }

            return null
          }
        )
      } else if (isAdapted === 'SI' && tipoUsuario === 'complejo') {
        powersDataCompare2 && powersDataCompare2.map(
          (item) => {
            let auxPowerValue = item.PowerValue
            let auxPowerValue1 = item.PowerValueP1
            let auxPowerValue2 = item.PowerValueP2
            let auxPowerValue3 = item.PowerValueP3
            let auxPowerValue4 = item.PowerValueP4
            let auxPowerValue5 = item.PowerValueP5
            let auxPowerValue6 = item.PowerValueP6

            if (auxPowerValue) {

              auxPowerValue &&
                auxPowersData3.push({
                  cups: supplyData.cups ? supplyData.cups : '0',
                  date: item.PowerDate ? item.PowerDate : '00/00/0000',
                  hour: item.hour ? item.hour : '0',
                  power: auxPowerValue ? auxPowerValue.replace(',', '.') : '0.000',
                  period: 'P0'
                })
              auxPowerValue1 && state.checked1 &&
                auxPowersData3.push({
                  cups: supplyData.cups ? supplyData.cups : '0',
                  date: item.PowerDateP1 ? item.PowerDateP1 : '00/00/0000',
                  hour: item.hourP1 ? item.hourP1 : '0',
                  power: auxPowerValue1 ? auxPowerValue1.replace(',', '.') : '0.000',
                  period: 'P1'
                })
              auxPowerValue2 && state.checked2 &&
                auxPowersData3.push({
                  cups: supplyData.cups ? supplyData.cups : '0',
                  date: item.PowerDateP2 ? item.PowerDateP2 : '00/00/0000',
                  hour: item.hourP2 ? item.hourP2 : '0',
                  power: auxPowerValue2 ? auxPowerValue2.replace(',', '.') : '0.000',
                  period: 'P2'
                })
              auxPowerValue3 && state.checked3 &&
                auxPowersData3.push({
                  cups: supplyData.cups ? supplyData.cups : '0',
                  date: item.PowerDateP3 ? item.PowerDateP3 : '00/00/0000',
                  hour: item.hourP3 ? item.hourP3 : '0',
                  power: auxPowerValue3 ? auxPowerValue3.replace(',', '.') : '0.000',
                  period: 'P3'
                })
              auxPowerValue4 && state.checked4 &&
                auxPowersData3.push({
                  cups: supplyData.cups ? supplyData.cups : '0',
                  date: item.PowerDateP4 ? item.PowerDateP4 : '00/00/0000',
                  hour: item.hourP4 ? item.hourP4 : '0',
                  power: auxPowerValue4 ? auxPowerValue4.replace(',', '.') : '0.000',
                  period: 'P4'
                })
              auxPowerValue5 && state.checked5 &&
                auxPowersData3.push({
                  cups: supplyData.cups ? supplyData.cups : '0',
                  date: item.PowerDateP5 ? item.PowerDateP5 : '00/00/0000',
                  hour: item.hourP5 ? item.hourP5 : '0',
                  power: auxPowerValue5 ? auxPowerValue5.replace(',', '.') : '0.000',
                  period: 'P5'
                })
              auxPowerValue6 && state.checked6 &&
                auxPowersData3.push({
                  cups: supplyData.cups ? supplyData.cups : '0',
                  date: item.PowerDateP6 ? item.PowerDateP6 : '00/00/0000',
                  hour: item.hourP6 ? item.hourP6 : '0',
                  power: auxPowerValue6 ? auxPowerValue6.replace(',', '.') : '0.000',
                  period: 'P6'
                })
            }

            return null
          }
        )
      } else {
        powersDataCompare2 && powersDataCompare2.map(
          (item) => {
            let auxPowerValue = item.PowerValue

            if (auxPowerValue && auxPowerValue !== ' ') {
              auxPowersData3.push({
                cups: supplyData.cups ? supplyData.cups : '0',
                date: item.PowerDate ? item.PowerDate : '00/00/0000',
                hour: item.hour ? item.hour : '0',
                power: auxPowerValue ? auxPowerValue.replace(',', '.') : '0.000',
                period: 'P0'
              })
            }

            return null
          }
        )
      }


      let i
      var maxItem = auxPowersData.length

      if (auxPowersData2.length > maxItem) {
        maxItem = auxPowersData2.length
      }

      if (auxPowersData3.length > maxItem) {
        maxItem = auxPowersData3.length
      }

      maxItem = maxItem - 1

      if (auxPowersData3.length > 0) {
        for (i = 0; i <= maxItem; i++) {
          auxPowersDataAll.push({
            cups: auxPowersData[0].cups,
            date: ((auxPowersData.length - 1) >= i) ? auxPowersData[i].date : '',
            hour: ((auxPowersData.length - 1) >= i) ? auxPowersData[i].hour : '',
            power: ((auxPowersData.length - 1) >= i) ? auxPowersData[i].power : '',
            period: ((auxPowersData.length - 1) >= i) ? auxPowersData[i].period : '',
            dateCompare: ((auxPowersData2.length - 1) >= i) ? auxPowersData2[i].date : '',
            hourCompare: ((auxPowersData2.length - 1) >= i) ? auxPowersData2[i].hour : '',
            powerCompare: ((auxPowersData2.length - 1) >= i) ? auxPowersData2[i].power : '',
            periodCompare: ((auxPowersData2.length - 1) >= i) ? auxPowersData2[i].period : '',
            dateCompare2: ((auxPowersData3.length - 1) >= i) ? auxPowersData3[i].date : '',
            hourCompare2: ((auxPowersData3.length - 1) >= i) ? auxPowersData3[i].hour : '',
            powerCompare2: ((auxPowersData3.length - 1) >= i) ? auxPowersData3[i].power : '',
            periodCompare2: ((auxPowersData3.length - 1) >= i) ? auxPowersData3[i].period : '',
          })
        }

        ws = XLSX.utils.json_to_sheet(auxPowersDataAll, {
          header: [
            'cups',
            'date',
            'hour',
            'power',
            'period',
            'dateCompare',
            'hourCompare',
            'powerCompare',
            'periodCompare',
            'dateCompare2',
            'hourCompare2',
            'powerCompare2',
            'periodCompare2',
          ]
        })

        ws['A1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.cups')
        ws['B1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.date')
        ws['C1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.hour')
        ws['D1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.power')
        ws['E1'].v = t('Periodo')
        ws['F1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.date')
        ws['G1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.hour')
        ws['H1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.power')
        ws['I1'].v = t('Periodo')
        ws['J1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.date')
        ws['K1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.hour')
        ws['L1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.power')
        ws['M1'].v = t('Periodo')
      } else {
        for (i = 0; i <= maxItem; i++) {
          auxPowersDataAll.push({
            cups: auxPowersData[0].cups,
            date: ((auxPowersData.length - 1) >= i) ? auxPowersData[i].date : '',
            hour: ((auxPowersData.length - 1) >= i) ? auxPowersData[i].hour : '',
            power: ((auxPowersData.length - 1) >= i) ? auxPowersData[i].power : '',
            period: ((auxPowersData.length - 1) >= i) ? auxPowersData[i].period : '',
            dateCompare: ((auxPowersData2.length - 1) >= i) ? auxPowersData2[i].date : '',
            hourCompare: ((auxPowersData2.length - 1) >= i) ? auxPowersData2[i].hour : '',
            powerCompare: ((auxPowersData2.length - 1) >= i) ? auxPowersData2[i].power : '',
            periodCompare: ((auxPowersData2.length - 1) >= i) ? auxPowersData2[i].period : ''
          })
        }

        ws = XLSX.utils.json_to_sheet(auxPowersDataAll, {
          header: [
            'cups',
            'date',
            'hour',
            'power',
            'period',
            'dateCompare',
            'hourCompare',
            'powerCompare',
            'periodCompare',
          ]
        })

        ws['A1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.cups')
        ws['B1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.date')
        ws['C1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.hour')
        ws['D1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.power')
        ws['E1'].v = t('Periodo')
        ws['F1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.date')
        ws['G1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.hour')
        ws['H1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.power')
        ws['I1'].v = t('Periodo')
      }

      fileName = 'powers.xlsx'
      //Este else es para exportar en csv, funcionalidad inactiva
    } else {
      powersData && powersData.map(
        (item) => {
          let auxPowerValue = item.powerValue

          if (auxPowerValue) {
            let auxPowerItem = [
              supplyData.cups ? supplyData.cups : '0',
              item.powerDate ? item.powerDate : '00/00/0000',
              item.hour ? item.hour : '0',
              auxPowerValue ? auxPowerValue.replace(',', '.') : '0.000'
            ]

            auxPowersData.push({
              item: auxPowerItem.join(';')
            })
          }

          return null
        }
      )

      powersDataCompare && powersDataCompare.map(
        (item) => {
          let auxPowerValue = item.powerValue
          if (auxPowerValue) {
            let auxPowerItem = [
              supplyData.cups ? supplyData.cups : '0',
              item.powerDate ? item.powerDate : '00/00/0000',
              item.hour ? item.hour : '0',
              auxPowerValue ? auxPowerValue.replace(',', '.') : '0.000'
            ]

            auxPowersData2.push({
              item: auxPowerItem.join(';')
            })
          }

          return null
        }
      )

      ws = XLSX.utils.json_to_sheet(auxPowersData, {
        header: [
          'item'
        ]
      })

      ws['A1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.cups2') + ';' + t('supplies.suppliesDetails.components.consumption.exportDialogs.date') + ';' + t('supplies.suppliesDetails.components.consumption.exportDialogs.hour') + ';' + t('supplies.suppliesDetails.components.consumption.exportDialogs.consumption2') + '_kW;'

      fileName = 'power.csv'
    }

    const wb = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(wb, ws, 'power')

    XLSX.writeFile(wb, fileName)

    // XLSX.writeFile will attempt to force a client-side download, works for web,
    // for mobile apps blob downloads do not work ATM, code below is an alternative, (hover createFileAndOpenIt for jsdoc).
    if (isMobileApp()) createFileAndOpenIt({ fileName, contentAsBase64: XLSX.write(wb, { type: 'base64' }) })
     

  }

  function createSelectItems() {
    let items = [] as any

    items.push(years.yearMinus2 + '|' + years.yearMinus2)
    items.push(years.yearMinus1 + '|' + years.yearMinus1)
    items.push(years.year0 + '|' + years.year0)

    return items;
  }

  const sendGAEventChangePot = ():void => {
    sendGAEvent({
      event: 'browsing',
      section_name: 'mis suministros',
      subsection_name: 'potencia maxima demandada',
      click_text: 'como cambiar mi potencia',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      browsing_type: sessionStorage.getItem('browsing_type'),
      cups: supplyData.cups,
      supply_type: supplyData.isGenerator ? (supplyData.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
      see_consumption: 'no aplica',
    })
  }

  const sendGAEventCompareYear = (): void => {
    sendGAEvent({
      event: 'browsing',
      section_name: 'mis suministros',
      subsection_name: 'potencia maxima demandada',
      click_text: 'comparar',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      browsing_type: sessionStorage.getItem('browsing_type'),
      cups: supplyData.cups,
      supply_type: supplyData.isGenerator ? (supplyData.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
      see_consumption: String(yearSelected),
    })
  }

  const sendGAEventExportPotency = ():void => {
    sendGAEvent({
      event: 'download',
      section_name: 'mis suministros',
      subsection_name: 'potencia maxima demandada',
      click_text: 'exportar datos de potencia',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      browsing_type: sessionStorage.getItem('browsing_type'),
      cups: supplyData.cups,
      supply_type: supplyData.isGenerator ? (supplyData.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
      see_consumption: String(yearSelected),
    })
  }

  return (
    <>
      <InfoCambioPotencia
        open={viewPopup}
        closeFunction={() => setViewPopup(false)}
      />

      <Dialog className={classes.dialog} open={showingDialogAlert} onClose={handleCloseDialogAlert}>
        <DialogContent className={classes.dialogContainer}>

          <Grid container className={classes.noItems}>
            <Grid item>
              <Grid container>
                <Grid item xs={12} sm={12} md={12} className={classes.alertBlock}>
                  <img src={InfoIcon} className={classes.alertIcon} alt='' />
                </Grid>
                <Grid container className={classes.text}>
                  {t('provisions.newProvision.requestData.supplyType.form.errors.powerError')}
                </Grid>
                <Grid container className={classes.text}>
                  {t('provisions.newProvision.requestData.supplyType.form.errors.powerError2')}
                </Grid>
                <Grid container className={classes.textBold2}>
                  {t('provisions.newProvision.requestData.supplyType.form.errors.powerError3')}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      <Dialog className={classes.dialog} open={showingDialog} onClose={handleCancelDialog}>
        <DialogContent className={classes.dialogContainer}>
          <Grid container className={classes.noItems}>
            <Grid item>
              <Grid container>
                <Grid container className='row title'>
                  {t('supplies.suppliesDetails.components.consumption.charts.actions.compareYear')}
                  {yearSelected}
                  {t('supplies.suppliesDetails.components.consumption.charts.actions.con')}
                </Grid>

                <Grid item md={12} sm={12} xs={12} className={classes.text}>
                  <Grid container className={classes.hourSelectors}>
                    {<Grid item className={classes.hourSelectorsItem}>
                      <div
                        className={`${classes.radioButton} ${((typecompare === '1' && yearSelected !== years.year0) || (typecompare === '2' && yearSelected === years.year0)) && 'active'}`}
                        onClick={yearSelected === years.year0 ? () => setTypeCompare('2') : () => setTypeCompare('1')}
                      />

                      {
                        yearSelected === years.yearMinus2 ?
                          <span style={{ color: '#004571' }}>{years.yearMinus1}</span>
                          :
                          <span style={{ color: '#004571' }}>{years.yearMinus2}</span>
                      }
                    </Grid>}

                    <Grid item className={classes.hourSelectorsItem}>
                      <div
                        className={`${classes.radioButton} ${((typecompare === '2' && yearSelected !== years.year0) || (typecompare === '1' && yearSelected === years.year0)) && 'active'}`}
                        onClick={yearSelected === years.year0 ? () => setTypeCompare('1') : () => setTypeCompare('2')}
                      />
                      {
                        yearSelected === years.year0 ?
                          <span style={{ color: '#004571' }}>{years.yearMinus1}</span>
                          :
                          <span style={{ color: '#004571' }}>{years.year0}</span>
                      }

                    </Grid>

                    {<Grid item className={classes.hourSelectorsItem}>
                      <div
                        className={`${classes.radioButton} ${typecompare === '0' && 'active'}`}
                        onClick={() => setTypeCompare('0')}
                      />

                      <span style={{ color: '#004571' }}>{t('supplies.suppliesDetails.components.maxPowerEstimated.ambos')}</span>
                    </Grid>}
                  </Grid>
                </Grid>

                <Grid container className='row title'>
                  {t('supplies.suppliesDetails.components.consumption.charts.actions.selectPeriod')}
                </Grid>

                <Grid item md={12} sm={12} xs={12} className={classes.text}>
                  <Grid container className={classes.hourSelectors}>
                    {<Grid item className={classes.hourSelectorsItem}>
                      <div
                        className={`${classes.radioButtonGrey} ${state.checked0 && 'active'}`}
                        onClick={() => setState({
                          ...state,
                          checked0: true,
                          checked1: false,
                          checked2: false,
                          checked3: false,
                          checked4: false,
                          checked5: false,
                          checked6: false
                        })}
                      />
                      <span style={{ color: '#004571' }}>{t('P0')}</span>
                    </Grid>}

                    {tipoUsuario === 'simple' ?
                      <>
                        <Grid item className={classes.hourSelectorsItem}>
                          <div
                            className={`${classes.radioButtonRed} ${state.checked1 && 'active'}`}
                            onClick={() => setState({
                              ...state,
                              checked0: false,
                              checked1: true,
                              checked2: false,
                              checked3: false
                            })}
                          />
                          <span style={{ color: '#004571' }}>{t('P1')}</span>
                        </Grid>

                        <Grid item className={classes.hourSelectorsItem}>
                          <div
                            className={`${classes.radioButtonYellow} ${state.checked2 && 'active'}`}
                            onClick={() => setState({
                              ...state,
                              checked0: false,
                              checked1: false,
                              checked2: true,
                              checked3: false
                            })}
                          />
                          <span style={{ color: '#004571' }}>{t('P2')}</span>
                        </Grid>

                        <Grid item className={classes.hourSelectorsItem}>
                          <div
                            className={`${classes.radioButtonBlue} ${state.checked3 && 'active'}`}
                            onClick={() => setState({
                              ...state,
                              checked0: false,
                              checked1: false,
                              checked2: false,
                              checked3: true
                            })}
                          />
                          <span style={{ color: '#004571' }}>{t('P3')}</span>
                        </Grid>
                      </>
                      :
                      <>
                        <Grid item className={classes.hourSelectorsItem}>
                          <div
                            className={`${classes.radioButtonRed} ${state.checked1 && 'active'}`}
                            onClick={() => setState({
                              ...state,
                              checked0: false,
                              checked1: true,
                              checked2: false,
                              checked3: false,
                              checked4: false,
                              checked5: false,
                              checked6: false
                            })}
                          />
                          <span style={{ color: '#004571' }}>{t('P1')}</span>
                        </Grid>

                        <Grid item className={classes.hourSelectorsItem}>
                          <div
                            className={`${classes.radioButtonOrange} ${state.checked2 && 'active'}`}
                            onClick={() => setState({
                              ...state,
                              checked0: false,
                              checked1: false,
                              checked2: true,
                              checked3: false,
                              checked4: false,
                              checked5: false,
                              checked6: false
                            })}
                          />
                          <span style={{ color: '#004571' }}>{t('P2')}</span>
                        </Grid>

                        <Grid item className={classes.hourSelectorsItem}>
                          <div
                            className={`${classes.radioButtonYellow} ${state.checked3 && 'active'}`}
                            onClick={() => setState({
                              ...state,
                              checked0: false,
                              checked1: false,
                              checked2: false,
                              checked3: true,
                              checked4: false,
                              checked5: false,
                              checked6: false
                            })}
                          />
                          <span style={{ color: '#004571' }}>{t('P3')}</span>
                        </Grid>

                        <Grid item className={classes.hourSelectorsItem}>
                          <div
                            className={`${classes.radioButtonGreen} ${state.checked4 && 'active'}`}
                            onClick={() => setState({
                              ...state,
                              checked0: false,
                              checked1: false,
                              checked2: false,
                              checked3: false,
                              checked4: true,
                              checked5: false,
                              checked6: false
                            })}
                          />
                          <span style={{ color: '#004571' }}>{t('P4')}</span>
                        </Grid>

                        <Grid item className={classes.hourSelectorsItem}>
                          <div
                            className={`${classes.radioButtonDarkGreen} ${state.checked5 && 'active'}`}
                            onClick={() => setState({
                              ...state,
                              checked0: false,
                              checked1: false,
                              checked2: false,
                              checked3: false,
                              checked4: false,
                              checked5: true,
                              checked6: false
                            })}
                          />
                          <span style={{ color: '#004571' }}>{t('P5')}</span>
                        </Grid>

                        <Grid item className={classes.hourSelectorsItem}>
                          <div
                            className={`${classes.radioButtonBlue} ${state.checked6 && 'active'}`}
                            onClick={() => setState({
                              ...state,
                              checked0: false,
                              checked1: false,
                              checked2: false,
                              checked3: false,
                              checked4: false,
                              checked5: false,
                              checked6: true
                            })}
                          />
                          <span style={{ color: '#004571' }}>{t('P6')}</span>
                        </Grid>
                      </>
                    }

                  </Grid>
                </Grid>

                <Grid container className='buttons'>
                  <Button
                    className={classes.buttonMobile}
                    text='Cancelar'
                    color='primary'
                    size='large'
                    variant='outlined'
                    onClick={handleCancelDialog}
                  />
                  <Grid item className={classes.dialogPadding} />
                  <Button
                    text='Aceptar'
                    color='primary'
                    size='large'
                    variant='contained'
                    onClick={handleCompare}
                    disabled={(typecompare === '0' || typecompare === '1' || typecompare === '2') ? false : true}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      <Grid container className={classes.container} justifyContent='center'>
        <Grid item md={10} className={classes.maxWidthForBigScreens} >
          <Grid container item md={12} className={classes.title}>
            {t('supplies.suppliesDetails.components.maxPowerEstimated.title')}
          </Grid>
          <Grid container className={classes.header} spacing={2} justifyContent='space-between'>
            <Grid item md={3} className={classes.description}>
              <Grid container>
                {t('supplies.suppliesDetails.components.maxPowerEstimated.displayLin1')}
              </Grid>
              {/*Filtros para seleccionar el año a cargar en el gráfico */}
              <Grid container>
                {t('supplies.suppliesDetails.components.maxPowerEstimated.displayLin2')}
              </Grid>
              <Grid container className={classes.filtersmenu}>
                {<Grid
                  item
                  className={`${classes.filtersmenuItem} ${yearSelected === years.yearMinus2 && 'active'}`}
                  onClick={() => handleYear(new Date(years.yearMinus2, 1, 1))}
                >
                  {years.yearMinus2}
                </Grid>}

                <Grid
                  item
                  className={`${classes.filtersmenuItem} ${yearSelected === years.yearMinus1 && 'active'}`}
                  onClick={() => handleYear(new Date(years.yearMinus1, 1, 1))}
                >
                  {years.yearMinus1}
                </Grid>

                <Grid
                  item
                  className={`${classes.filtersmenuItem} ${yearSelected === years.year0 && 'active'}`}
                  onClick={() => handleYear(new Date(years.year0, 1, 1))}
                >
                  {years.year0}
                </Grid>
              </Grid>
              <Grid item className={classes.buttonContainer}>
                <Button
                  className={classes.buttonCompare}
                  text={t('supplies.suppliesDetails.components.consumption.charts.views.compare')}
                  color={'primary'}
                  size={'medium'}
                  variant={'contained'}
                  onClick={() => { sendGAEventCompareYear(); handleOpenDialog()}}
                  disabled={disabledButton}
                />
                {
                  compare &&
                  <TextButton className={classes.closeButtonCompare} onClick={endCompare}>
                    <img src={CloseIcon} className={classes.closeIcon} alt='' />
                    <span>{t('supplies.suppliesDetails.components.consumption.charts.views.closeCompare')}</span>
                  </TextButton>
                }
              </Grid>
              <Grid container justifyContent='center' alignItems='center' className={/*allPeriods ? classes.gridDisabled : */classes.button} onClick={() => { sendGAEventExportPotency(); !compare ? exportPower() : exportPowerCompare()}} >
                <Grid item>{t('supplies.suppliesDetails.components.consumption.charts.downloads.exportPower')}</Grid>
                <Grid item><img className={classes.exportImg} src={ExportIcon} /></Grid>
              </Grid>
            </Grid>

            <Grid item md={6} className={classes.container4}>
              <Grid item className={classes.description2}>
                {t('supplies.suppliesDetails.components.maxPowerEstimated.infpotencia2')}
              </Grid>
              <Grid item className={classes.button2} onClick={changeStatusShowPopup}>
                {t('supplies.suppliesDetails.components.maxPowerEstimated.howKnow')}
              </Grid>
              <Grid container className={classes.container5}>
                <Button
                  text={t('supplies.suppliesDetails.components.maxPowerEstimated.changepot')}
                  color='primary'
                  size='large'
                  variant='contained'
                  onClick={() => {sendGAEventChangePot() ; goToStep1()}}
                  disabled={powerChangeButtonStatus}
                />
              </Grid>
              {
                showFormStep1 &&
                <>
                  <Divider className={classes.divider} />
                  <Grid container justifyContent='flex-end'>
                    <TextButton className={classes.closeButton} onClick={closeForm}>
                      <img src={CloseIcon} className={classes.closeIcon} alt='' />
                    </TextButton>
                  </Grid>

                  {
                    supplyData.rate && supplyData.rate !== '' &&
                    <>
                      {
                        // Para tarifas de consumo '2.' mostramos dos potencias

                        supplyData.rate.includes('2.') ?
                          <>
                            <Grid container className={classes.formTitle}>
                              {t('supplies.suppliesDetails.components.generalData.power1')}
                              <span className={classes.formHiredPower}>{typeof supplyData.power1 === 'object' ? '' : Number(supplyData.power1).toFixed(2).replace('.', ',')}</span>
                            </Grid>
                            <Grid container className={classes.formTitle}>
                              {t('supplies.suppliesDetails.components.generalData.power2')}
                              <span className={classes.formHiredPower}>{typeof supplyData.power2 === 'object' ? '' : Number(supplyData.power2).toFixed(2).replace('.', ',')}</span>
                            </Grid>
                          </>

                          :

                          // Para tarifas distintas de '2.' mostramos seis potencias

                          <>
                            <Grid container className={classes.formTitle}>
                              {t('supplies.suppliesDetails.components.generalData.power1')}
                              <span className={classes.formHiredPower}>{typeof supplyData.power1 === 'object' ? '' : Number(supplyData.power1).toFixed(2).replace('.', ',')}</span>
                            </Grid>
                            <Grid container className={classes.formTitle}>
                              {t('supplies.suppliesDetails.components.generalData.power2')}
                              <span className={classes.formHiredPower}>{typeof supplyData.power2 === 'object' ? '' : Number(supplyData.power2).toFixed(2).replace('.', ',')}</span>
                            </Grid>
                            <Grid container className={classes.formTitle}>
                              {t('supplies.suppliesDetails.components.generalData.power3')}
                              <span className={classes.formHiredPower}>{typeof supplyData.power3 === 'object' ? '' : Number(supplyData.power3).toFixed(2).replace('.', ',')}</span>
                            </Grid>
                            <Grid container className={classes.formTitle}>
                              {t('supplies.suppliesDetails.components.generalData.power4')}
                              <span className={classes.formHiredPower}>{typeof supplyData.power4 === 'object' ? '' : Number(supplyData.power4).toFixed(2).replace('.', ',')}</span>
                            </Grid>
                            <Grid container className={classes.formTitle}>
                              {t('supplies.suppliesDetails.components.generalData.power5')}
                              <span className={classes.formHiredPower}>{typeof supplyData.power5 === 'object' ? '' : Number(supplyData.power5).toFixed(2).replace('.', ',')}</span>
                            </Grid>
                            <Grid container className={classes.formTitle}>
                              {t('supplies.suppliesDetails.components.generalData.power6')}
                              <span className={classes.formHiredPower}>{typeof supplyData.power6 === 'object' ? '' : Number(supplyData.power6).toFixed(2).replace('.', ',')}</span>
                            </Grid>
                          </>
                      }

                      <Grid container className={classes.formTitle}>
                        <span>
                          {t('supplies.suppliesDetails.components.maxPowerEstimated.maxPower')}
                          <ArrowTooltip title={t('supplies.suppliesDetails.components.maxPowerEstimated.cieDesc')} placement='top' >
                            <span>{t('supplies.suppliesDetails.components.maxPowerEstimated.cie')} </span>
                          </ArrowTooltip>
                          {t('supplies.suppliesDetails.components.maxPowerEstimated.kw')}
                          <span className={classes.formHiredPower}>{typeof supplyData.maxAuthorizedVoltage === 'object' ? '' : Number(supplyData.maxAuthorizedVoltage).toFixed(2).replace('.', ',')}</span>
                        </span>
                      </Grid>
                      <Grid container className={classes.formTitle}>
                        {t('supplies.suppliesDetails.components.maxPowerEstimated.validExtentRights')}
                        <span className={classes.formHiredPower}>{typeof supplyData.validExtentRights === 'object' ? '' : Number(supplyData.validExtentRights).toFixed(2).replace('.', ',')}</span>
                      </Grid>
                      <Grid container className={classes.formTitle}>
                        {t('supplies.suppliesDetails.components.maxPowerEstimated.acometidaMaxPower')}
                        <span className={classes.formHiredPower}>{typeof supplyData.maxAvalaibleVoltage === 'object' ? '' : Number(supplyData.maxAvalaibleVoltage).toFixed(2).replace('.', ',')}</span>
                      </Grid>

                      {

                        // Para tarifas de consumo '2.' permitimos solicitar dos potencias

                        supplyData.rate.includes('2.') ?
                          <Grid container>

                            {/* Potencia 1 */}

                            <Grid container className={classes.formItem}>
                              {t('supplies.suppliesDetails.components.maxPowerEstimated.selectpotlit1')}
                            </Grid>
                            <Grid container>
                              <Grid item xs={12} md={8} className={classes.formInput}>
                                <Input
                                  ref={inputRef}
                                  className={classes.input}
                                  value={inputValueStr1}
                                  onChange={(e) => handleInput(e.target.value, 1)}
                                  onKeyUp={(e) => validateNumberImput(e)}
                                  onBlur={onBlurAutocomplete}
                                  maxLength={4}
                                  {...props}
                                />
                                {
                                  autocompleteData1 !== null &&
                                  <div className={classes.box}>
                                    {autocompleteData1.map((item, i) =>
                                      <Item key={i} element={item} selectedItemHandler={onClickAutocomplete} position={1} />
                                    )}
                                  </div>
                                }
                              </Grid>
                            </Grid>

                            {/* Potencia 2 */}

                            <Grid container className={classes.formItem}>
                              {t('supplies.suppliesDetails.components.maxPowerEstimated.selectpotlit2')}
                            </Grid>
                            <Grid container>
                              <Grid item xs={12} md={8} className={classes.formInput}>
                                <Input
                                  ref={inputRef}
                                  className={classes.input}
                                  value={inputValueStr2}
                                  onChange={(e) => handleInput(e.target.value, 2)}
                                  onKeyUp={(e) => validateNumberImput(e)}
                                  onBlur={onBlurAutocomplete}
                                  maxLength={4}
                                  {...props}
                                />
                                {
                                  autocompleteData2 !== null &&
                                  <div className={classes.box}>
                                    {autocompleteData2.map((item, i) =>
                                      <Item key={i} element={item} selectedItemHandler={onClickAutocomplete} position={2} />
                                    )}
                                  </div>
                                }
                              </Grid>
                              <Grid item xs={12} md={4} style={{ textAlign: 'center' }}>
                                <Button
                                  text='Aceptar'
                                  color='primary'
                                  size='medium'
                                  variant='contained'
                                  onClick={() => goToStep2(maxNewPower, supplyData, maxOldPower)}
                                  disabled={powerChangeStep1ButtonStatus}
                                />
                              </Grid>
                            </Grid>
                          </Grid>

                          :

                          // Para tarifas distintas de '2.' permitimos solicitar seis potencias

                          <Grid container>

                            {/* Potencia 1 */}

                            <Grid container className={classes.formItem}>
                              {t('supplies.suppliesDetails.components.maxPowerEstimated.selectpotlit1')}
                            </Grid>
                            <Grid container>
                              <Grid item xs={12} md={8} className={classes.formInput}>
                                <Input
                                  ref={inputRef}
                                  className={classes.input}
                                  value={inputValueStr1}
                                  onChange={(e) => handleInput(e.target.value, 1)}
                                  onKeyUp={(e) => validateNumberImput(e)}
                                  onBlur={onBlurAutocomplete}
                                  maxLength={4}
                                  {...props}
                                />
                                {
                                  autocompleteData1 !== null &&
                                  <div className={classes.box}>
                                    {autocompleteData1.map((item, i) =>
                                      <Item key={i} element={item} selectedItemHandler={onClickAutocomplete} position={1} />
                                    )}
                                  </div>
                                }
                              </Grid>
                            </Grid>

                            {/* Potencia 2 */}

                            <Grid container className={classes.formItem}>
                              {t('supplies.suppliesDetails.components.maxPowerEstimated.selectpotlit2')}
                            </Grid>
                            <Grid container>
                              <Grid item xs={12} md={8} className={classes.formInput}>
                                <Input
                                  ref={inputRef}
                                  className={classes.input}
                                  value={inputValueStr2}
                                  onChange={(e) => handleInput(e.target.value, 2)}
                                  onKeyUp={(e) => validateNumberImput(e)}
                                  onBlur={onBlurAutocomplete}
                                  maxLength={4}
                                  {...props}
                                />
                                {
                                  autocompleteData2 !== null &&
                                  <div className={classes.box}>
                                    {autocompleteData2.map((item, i) =>
                                      <Item key={i} element={item} selectedItemHandler={onClickAutocomplete} position={2} />
                                    )}
                                  </div>
                                }
                              </Grid>
                            </Grid>

                            {/* Potencia 3 */}

                            <Grid container className={classes.formItem}>
                              {t('supplies.suppliesDetails.components.maxPowerEstimated.selectpotlit3')}
                            </Grid>
                            <Grid container>
                              <Grid item xs={12} md={8} className={classes.formInput}>
                                <Input
                                  ref={inputRef}
                                  className={classes.input}
                                  value={inputValueStr3}
                                  onChange={(e) => handleInput(e.target.value, 3)}
                                  onKeyUp={(e) => validateNumberImput(e)}
                                  onBlur={onBlurAutocomplete}
                                  maxLength={4}
                                  {...props}
                                />
                                {
                                  autocompleteData3 !== null &&
                                  <div className={classes.box}>
                                    {autocompleteData3.map((item, i) =>
                                      <Item key={i} element={item} selectedItemHandler={onClickAutocomplete} position={3} />
                                    )}
                                  </div>
                                }
                              </Grid>
                            </Grid>

                            {/* Potencia 4 */}

                            <Grid container className={classes.formItem}>
                              {t('supplies.suppliesDetails.components.maxPowerEstimated.selectpotlit4')}
                            </Grid>
                            <Grid container>
                              <Grid item xs={12} md={8} className={classes.formInput}>
                                <Input
                                  ref={inputRef}
                                  className={classes.input}
                                  value={inputValueStr4}
                                  onChange={(e) => handleInput(e.target.value, 4)}
                                  onKeyUp={(e) => validateNumberImput(e)}
                                  onBlur={onBlurAutocomplete}
                                  maxLength={4}
                                  {...props}
                                />
                                {
                                  autocompleteData4 !== null &&
                                  <div className={classes.box}>
                                    {autocompleteData4.map((item, i) =>
                                      <Item key={i} element={item} selectedItemHandler={onClickAutocomplete} position={4} />
                                    )}
                                  </div>
                                }
                              </Grid>
                            </Grid>

                            {/* Potencia 5 */}

                            <Grid container className={classes.formItem}>
                              {t('supplies.suppliesDetails.components.maxPowerEstimated.selectpotlit5')}
                            </Grid>
                            <Grid container>
                              <Grid item xs={12} md={8} className={classes.formInput}>
                                <Input
                                  ref={inputRef}
                                  className={classes.input}
                                  value={inputValueStr5}
                                  onChange={(e) => handleInput(e.target.value, 5)}
                                  onKeyUp={(e) => validateNumberImput(e)}
                                  onBlur={onBlurAutocomplete}
                                  maxLength={4}
                                  {...props}
                                />
                                {
                                  autocompleteData5 !== null &&
                                  <div className={classes.box}>
                                    {autocompleteData5.map((item, i) =>
                                      <Item key={i} element={item} selectedItemHandler={onClickAutocomplete} position={5} />
                                    )}
                                  </div>
                                }
                              </Grid>
                            </Grid>

                            {/* Potencia 6 */}

                            <Grid container className={classes.formItem}>
                              {t('supplies.suppliesDetails.components.maxPowerEstimated.selectpotlit6')}
                            </Grid>
                            <Grid container>
                              <Grid item xs={12} md={8} className={classes.formInput}>
                                <Input
                                  ref={inputRef}
                                  className={classes.input}
                                  value={inputValueStr6}
                                  onChange={(e) => handleInput(e.target.value, 6)}
                                  onKeyUp={(e) => validateNumberImput(e)}
                                  onBlur={onBlurAutocomplete}
                                  maxLength={4}
                                  {...props}
                                />
                                {
                                  autocompleteData6 !== null &&
                                  <div className={classes.box}>
                                    {autocompleteData6.map((item, i) =>
                                      <Item key={i} element={item} selectedItemHandler={onClickAutocomplete} position={6} />
                                    )}
                                  </div>
                                }
                              </Grid>
                              <Grid item xs={12} md={4} style={{ textAlign: 'center' }}>
                                <Button
                                  text='Aceptar'
                                  color='primary'
                                  size='medium'
                                  variant='contained'
                                  onClick={() => goToStep2(maxNewPower, supplyData, maxOldPower)}
                                  disabled={powerChangeStep1ButtonStatus}
                                />
                              </Grid>
                            </Grid>

                          </Grid>
                      }
                    </>
                  }
                </>
              }
              {
                showFormStep2 &&
                <>
                  <Divider className={classes.divider} />
                  <Grid container justifyContent='flex-end'>
                    <TextButton className={classes.closeButton} onClick={closeForm}>
                      <img src={CloseIcon} className={classes.closeIcon} alt='' />
                    </TextButton>
                  </Grid>
                </>
              }
              { // 1 - Nueva potencia < potencia pagada promotor => NUEVA MAX PW INFERIOR PW PAGADA PROMOTOR
                (showFormStep2 && option === 1) &&
                <>
                  <Grid container className={classes.infoContainer}>
                    <Grid item xs={1} md={1}>
                      <img src={InfoIcon} className={classes.formIcon} />
                    </Grid>
                    <Grid item xs={11} md={11}>
                      <Grid container className={classes.textBold}>
                        {t('supplies.suppliesDetails.components.maxPowerEstimated.derechosCaducados')}
                      </Grid>
                      <Grid container className={classes.textNormal}>
                        {t('supplies.suppliesDetails.components.maxPowerEstimated.potenciaInferiorAPotenciaCometida')}
                      </Grid>
                      <Grid container className={classes.comerContainer1}>
                        {supplyData.marketer}
                      </Grid>
                      <Grid container className={classes.comerContainer1}>
                        <span>
                          {t('supplies.suppliesDetails.components.maxPowerEstimated.linkCNMC')}
                          <a href='https://sede.cnmc.gob.es/listado/censo/2' target='_blank' className={classes.linkContainer}>CNMC</a>
                        </span>
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              }
              {// 2 - Nueva potencia < potencia actual => NUEVA MAX PW INFERIOR OLD MAX PW
                (showFormStep2 && option === 2) &&
                <>
                  <Grid container className={classes.infoContainer}>
                    <Grid item xs={1} md={1}>
                      <img src={InfoIcon} className={classes.formIcon} />
                    </Grid>
                    <Grid item xs={11} md={11}>
                      <Grid container className={classes.textBold}>
                        {t('supplies.suppliesDetails.components.maxPowerEstimated.reducePower1')}
                      </Grid>
                      <Grid container className={classes.textNormal}>
                        {t('supplies.suppliesDetails.components.maxPowerEstimated.reducePower2')}
                      </Grid>
                      <Grid container className={classes.comerContainer1}>
                        {supplyData.marketer}
                      </Grid>
                      <Grid container className={classes.comerContainer1}>
                        <span>
                          {t('supplies.suppliesDetails.components.maxPowerEstimated.linkCNMC')}
                          <a href='https://sede.cnmc.gob.es/listado/censo/2' target='_blank' className={classes.linkContainer}>CNMC</a>
                        </span>
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              }
              {// 3 - Nueva potencia > potencia actual => NUEVA MAX PW 
                (showFormStep2 && option === 3) &&
                <>
                  <Grid container className={classes.infoContainer}>
                    <Grid item xs={1} md={1}>
                      <img src={InfoIcon} className={classes.formIcon} />
                    </Grid>
                    <Grid item xs={11} md={11}>
                      <Grid container className={classes.textBold}>
                        {t('supplies.suppliesDetails.components.maxPowerEstimated.increasePower1')}
                      </Grid>
                      <Grid container className={classes.textNormal}>
                        {t('supplies.suppliesDetails.components.maxPowerEstimated.increasePower4')}
                      </Grid>
                    </Grid>
                    <Grid container className={classes.buttonContainer2}>
                      <Button
                        text={t('supplies.suppliesDetails.components.maxPowerEstimated.textButtonModifySupply')}
                        color='primary'
                        size='medium'
                        variant='contained'
                        onClick={() => { handleSelectedDossierType('DOSTYP001', 'DOSSUB015') }}
                      />
                    </Grid>
                  </Grid>
                </>
              }
              {//potencia mayor a DE y mayor a PMA-CIE
                (showFormStep2 && option === 4) &&
                <>
                  <Grid container className={classes.infoContainer}>
                    <Grid item xs={1} md={1}>
                      <img src={InfoIcon} className={classes.formIcon} />
                    </Grid>
                    <Grid item xs={11} md={11}>
                      <Grid container className={classes.textBold}>
                        {t('supplies.suppliesDetails.components.maxPowerEstimated.increasePower1')}
                      </Grid>
                      <Grid container className={classes.textNormal}>
                        {t('supplies.suppliesDetails.components.maxPowerEstimated.increasePower4')}
                      </Grid>
                      <Grid container className={classes.buttonContainer2}>
                        <Button
                          text={t('supplies.suppliesDetails.components.maxPowerEstimated.textButtonModifySupply')}
                          color='primary'
                          size='medium'
                          variant='contained'
                          onClick={() => { handleSelectedDossierType('DOSTYP001', 'DOSSUB015') }}
                        />
                      </Grid>
                      <Grid container className={classes.textBold}>
                        {t('supplies.suppliesDetails.components.maxPowerEstimated.popupSubtitle')}
                      </Grid>
                      <Grid container className={classes.textNormal}>
                        {t('supplies.suppliesDetails.components.maxPowerEstimated.increasePower3')}
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              }
            </Grid>
          </Grid>

          {
            compare &&
            <>
              <Grid container className={classes.topContainer}>
                <Grid item md={12} xs={12} sm={12} className={classes.labelTop}>
                  <span>{t('supplies.suppliesDetails.components.maxPowerEstimated.charts.legend.comparativaPotencia')}</span>
                </Grid>

                <Grid item xs={5} md={3} className={classes.labelDate}>
                  <Grid container className={classes.legendItemContainer}>
                    <Grid item xs={1} md={1} className={state.checked1 ? classes.whiteTextRed : (state.checked2 && tipoUsuario === 'simple') ? classes.whiteTextYellow : (state.checked2 && tipoUsuario === 'complejo') ? classes.whiteTextOrange : (state.checked3 && tipoUsuario === 'simple') ? classes.whiteTextBlue : (state.checked3 && tipoUsuario === 'complejo') ? classes.whiteTextYellow : state.checked4 ? classes.whiteTextGreen : state.checked5 ? classes.whiteTextDarkGreen : state.checked6 ? classes.whiteTextBlue : classes.whiteTextDarkBlue}>
                      <div>{'   '}</div>
                    </Grid>
                    <Grid item className={classes.labelTitle2} xs='auto' sm='auto'>
                      {topLegendYear + (yearSelected)}
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={5} md={3} className={classes.labelDate}>
                  <Grid container className={classes.legendItemContainer}>
                    <Grid item xs={1} md={1} className={state.checked1 ? classes.whiteTextRed2 : (state.checked2 && tipoUsuario === 'simple') ? classes.whiteTextYellow2 : (state.checked2 && tipoUsuario === 'complejo') ? classes.whiteTextOrange2 : (state.checked3 && tipoUsuario === 'simple') ? classes.whiteTextBlue2 : (state.checked3 && tipoUsuario === 'complejo') ? classes.whiteTextYellow2 : state.checked4 ? classes.whiteTextGreen2 : state.checked5 ? classes.whiteTextDarkGreen2 : state.checked6 ? classes.whiteTextBlue2 : classes.whiteTextDarkBlue3}>
                      <div>{'   '}</div>
                    </Grid>
                    {
                      (yearSelected === years.year0 && (typecompare === '1' || typecompare === '0')) || (yearSelected === years.yearMinus1 && typecompare === '1') || (yearSelected === years.yearMinus1 && typecompare === '0') ?
                        <Grid item className={classes.labelTitle2} xs='auto' sm='auto'>
                          {topLegendYear + (yearSelected - 1)}
                        </Grid>
                        :
                        (yearSelected === years.year0 && typecompare === '2') ?
                          <Grid item className={classes.labelTitle2} xs='auto' sm='auto'>
                            {topLegendYear + (yearSelected - 2)}
                          </Grid>
                          :
                          (yearSelected === years.yearMinus2 && typecompare === '1') || (yearSelected === years.yearMinus1 && typecompare === '2') || (yearSelected === years.yearMinus2 && typecompare === '0') ?
                            <Grid item className={classes.labelTitle2} xs='auto' sm='auto'>
                              {topLegendYear + (yearSelected + 1)}
                            </Grid>
                            :
                            <Grid item className={classes.labelTitle2} xs='auto' sm='auto'>
                              {topLegendYear + (yearSelected + 2)}
                            </Grid>
                    }
                  </Grid>
                </Grid>
                {
                  typecompare === '0' &&
                  <Grid item xs={5} md={3} className={classes.labelDate}>
                    <Grid container className={classes.legendItemContainer}>
                      <Grid item xs={1} md={1} className={state.checked1 ? classes.whiteTextRed3 : (state.checked2 && tipoUsuario === 'simple') ? classes.whiteTextYellow3 : (state.checked2 && tipoUsuario === 'complejo') ? classes.whiteTextOrange3 : (state.checked3 && tipoUsuario === 'simple') ? classes.whiteTextBlue3 : (state.checked3 && tipoUsuario === 'complejo') ? classes.whiteTextYellow3 : state.checked4 ? classes.whiteTextGreen3 : state.checked5 ? classes.whiteTextDarkGreen3 : state.checked6 ? classes.whiteTextBlue3 : classes.whiteTextDarkBlue4}>
                        <div>{'   '}</div>
                      </Grid>
                      {
                        (yearSelected === years.year0) ?
                          <Grid item className={classes.labelTitle2} xs='auto' sm='auto'>
                            {topLegendYear + (yearSelected - 2)}
                          </Grid>
                          :
                          (yearSelected === years.yearMinus1) ?
                            <Grid item className={classes.labelTitle2} xs='auto' sm='auto'>
                              {topLegendYear + (yearSelected + 1)}
                            </Grid>
                            :
                            <Grid item className={classes.labelTitle2} xs='auto' sm='auto'>
                              {topLegendYear + (yearSelected + 2)}
                            </Grid>
                      }
                    </Grid>
                  </Grid>
                }
              </Grid>
              {yearSelected <= 2021 && !state.checked0 && showLegendYear &&
                <Grid container className={classes.topContainer2}>
                  <Grid item xs={5} md={3} className={classes.labelDate}>
                    <Grid container className={classes.legendItemContainer}>
                      <Grid item xs={1} md={1} className={classes.whiteTextDarkBlue}>
                        <div>{'   '}</div>
                      </Grid>
                      <Grid item className={classes.labelTitle2} xs='auto' sm='auto'>
                        {'(P0) ' + (yearSelected)}
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={5} md={3} className={classes.labelDate}>
                    <Grid container className={classes.legendItemContainer}>
                      <Grid item xs={1} md={1} className={classes.whiteTextDarkBlue3}>
                        <div>{'   '}</div>
                      </Grid>
                      {
                        (yearSelected === years.year0 && (typecompare === '1' || typecompare === '0')) || (yearSelected === years.yearMinus1 && typecompare === '1') || (yearSelected === years.yearMinus1 && typecompare === '0') ?
                          <Grid item className={classes.labelTitle2} xs='auto' sm='auto'>
                            {'(P0) ' + (yearSelected - 1)}
                          </Grid>
                          :
                          (yearSelected === years.year0 && typecompare === '2') ?
                            <Grid item className={classes.labelTitle2} xs='auto' sm='auto'>
                              {'(P0) ' + (yearSelected - 2)}
                            </Grid>
                            :
                            (yearSelected === years.yearMinus2 && typecompare === '1') || (yearSelected === years.yearMinus1 && typecompare === '2') || (yearSelected === years.yearMinus2 && typecompare === '0') ?
                              <Grid item className={classes.labelTitle2} xs='auto' sm='auto'>
                                {'(P0) ' + (yearSelected + 1)}
                              </Grid>
                              :
                              <Grid item className={classes.labelTitle2} xs='auto' sm='auto'>
                                {'(P0) ' + (yearSelected + 2)}
                              </Grid>
                      }
                    </Grid>
                  </Grid>
                  {
                    typecompare === '0' &&
                    <Grid item xs={5} md={3} className={classes.labelDate}>
                      <Grid container className={classes.legendItemContainer}>
                        <Grid item xs={1} md={1} className={classes.whiteTextDarkBlue4}>
                          <div>{'   '}</div>
                        </Grid>
                        {
                          (yearSelected === years.year0) ?
                            <Grid item className={classes.labelTitle2} xs='auto' sm='auto'>
                              {'(P0) ' + (yearSelected - 2)}
                            </Grid>
                            :
                            (yearSelected === years.yearMinus1) ?
                              <Grid item className={classes.labelTitle2} xs='auto' sm='auto'>
                                {'(P0) ' + (yearSelected + 1)}
                              </Grid>
                              :
                              <Grid item className={classes.labelTitle2} xs='auto' sm='auto'>
                                {'(P0) ' + (yearSelected + 2)}
                              </Grid>
                        }
                      </Grid>
                    </Grid>
                  }
                </Grid>
              }
            </>
          }

          <Grid item md={12}>
            {
              !compare ?
                <Graph
                  currentSupplyPowers={currentSupplyPowers}
                  yearSelected={yearSelected}
                  setDisabledButton={setDisabledButton}
                  tipoUsuario={tipoUsuario}
                  isAdapted={isAdapted}
                  adaptedDate={adaptedDate}
                  supplyData={supplyData}
                  disabledCheckbox={disabledCheckbox}
                  state={state}
                  setState={setState}
                  setShowLegendYear={setShowLegendYear}
                />
                :
                <Graph
                  currentSupplyPowers={currentSupplyPowers}
                  currentComparePowers={currentComparePowers}
                  currentComparePowers2={currentComparePowers2}
                  yearSelected={yearSelected}
                  compare={compare}
                  typecompare={sendTypecompare}
                  setDisabledButton={setDisabledButton}
                  tipoUsuario={tipoUsuario}
                  isAdapted={isAdapted}
                  adaptedDate={adaptedDate}
                  supplyData={supplyData}
                  disabledCheckbox={disabledCheckbox}
                  state={state}
                  setState={setState}
                  setTopLegendYear={setTopLegendYear}
                  setShowLegendYear={setShowLegendYear}
                />
            }
          </Grid>

          <>
            {/*
              currentSupplyPowers.avgPower && !compare ?
                <Grid container className={classes.container2}>
                  <Grid item xs={12} sm={12} md={4} className={classes.label2}>
                    <Grid container className={classes.legendItemContainer}>
                      <Grid item xs={1} md={1}>
                        <img src={MaxConsumptionIcon} alt='' />
                      </Grid>
                      <Grid item className={classes.labelTitle} xs='auto' sm='auto'>
                        {t('supplies.suppliesDetails.components.maxPowerEstimated.charts.legend.maxPower')}:
                      </Grid>
                      <span>{currentSupplyPowers.maxPower} {t('dashboard.Power')}</span>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={12} md={4} className={classes.label2}>
                    <Grid container className={classes.legendItemContainer}>
                      <Grid item xs={1} md={1}>
                        <img src={MidConsumptionIcon} alt='' />
                      </Grid>
                      <Grid item className={classes.labelTitle} xs='auto' sm='auto'>
                        {t('supplies.suppliesDetails.components.maxPowerEstimated.charts.legend.medPower')}:
                      </Grid>
                      <span>{currentSupplyPowers.avgPower} {t('dashboard.Power')}</span>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={12} md={4} className={classes.label2}>
                    <Grid container className={classes.legendItemContainer}>
                      <Grid item xs={1} md={1}>
                        <img src={MinConsumptionIcon} alt='' />
                      </Grid>
                      <Grid item className={classes.labelTitle} xs='auto' sm='auto'>
                        {t('supplies.suppliesDetails.components.maxPowerEstimated.charts.legend.minPower')}:
                      </Grid>
                      <span>{currentSupplyPowers.minPower} {t('dashboard.Power')}</span>
                    </Grid>
                  </Grid>
                </Grid>
                :
                currentSupplyPowers.avgPower ?
                  <Grid container className={classes.container2}>
                    <Grid item xs={12} sm={12} md={4} className={classes.label2}>
                      <Grid container>
                        <Grid item xs={1} md={1}>
                          <img src={MidConsumptionIcon} alt='' />
                        </Grid>
                        <Grid item className={classes.labelTitle} xs='auto' sm='auto'>
                          {t('supplies.suppliesDetails.components.maxPowerEstimated.charts.legend.medPower')}:
                        </Grid>
                        <span>{currentSupplyPowers.avgPower} {t('dashboard.Power')}</span>
                      </Grid>
                    </Grid>
                  </Grid>
                  :
                  currentComparePowers.avgPower &&
                  <Grid container className={classes.container2}>
                    <Grid item xs={12} sm={12} md={4} className={classes.label2}>
                      <Grid container>
                        <Grid item xs={1} md={1}>
                          <img src={MidConsumptionIcon} alt='' />
                        </Grid>
                        <Grid item className={classes.labelTitle} xs='auto' sm='auto'>
                          {t('supplies.suppliesDetails.components.maxPowerEstimated.charts.legend.medPower')}:
                        </Grid>
                        <span>{currentComparePowers.avgPower} {t('dashboard.Power')}</span>
                      </Grid>
                    </Grid>
                  </Grid>
            */}
          </>
        </Grid>
      </Grid>
    </>
  )
}

export default withRouter(EstimatedMaximumPower)
