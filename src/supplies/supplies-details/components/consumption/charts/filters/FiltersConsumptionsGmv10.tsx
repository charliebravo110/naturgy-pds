import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import XLSX from 'xlsx'

import Button from '../../../../../../common/components/button/Button'
import Reload from '../../../../../../assets/icons/reload.png'

import { completeDateWithSlash, formatDate, formatDateHyphens } from '../../../../../../common/lib/FormatLib'

import { setCurrentCompareConsumptions, setCurrentSupplyConsumptions } from '../../../../../store/actions/SuppliesActions'

import useStyles from './Filters.styles'
import DatepickerV3 from '../../../../../../common/components/datepickerV3/DatepickerV3'
import DatepickerV2 from '../../../../../../common/components/datepickerV2/DatepickerV2'
import Datepicker from '../../../../../../common/components/datepicker/Datepicker'
import { useDispatch } from 'react-redux'
import { thunkGetCurrentSupplyConsumptions } from '../../../../store/actions/SuppliesDetailsThunkActions'
import Modales from './error-message/Modales'
import useModal from './error-message/UseModal'
import CloseIcon from '../../../../../../assets/icons/cerrar.svg'
import AlertIcon from '../../../../../../assets/icons/aviso_alerta_pop_up.svg'
import useStyles_ from './error-message/SessionTimeout.styles'
import { sendGAEvent } from '../../../../../../core/utils/gtm'

const FiltersConsumptionsGmv10 = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const mobileRes = useMediaQuery('(max-width:576px)')


  const {
    toggle,
    downLoadFilters,
    setDownLoadFilters,
    consumptionsFilters,
    setConsumptionsFilters,
    isGeneration,
    supplantedUser,
    isDelegate,
    isGenerationTab,
    currentSupplyConsumptions,
    autoConsumption,
    supplyData,
    handleExportConsumptions
  } = props



  const [auxStartDate, setAuxStartDate] = useState<Date>();
  const [stringStartDate, setStringStartDate] = useState('')
  const [auxEndDate, setAuxEndDate] = useState<Date>();
  const [auxMonth, setAuxMonth] = useState<Date>();
  const [stringEndDate, setStringEndDate] = useState('')
  const [enableButton, setEnableButton] = useState<boolean>(false)

  const [exportingData, setExportingData] = useState(false)
  const [granularity, setGranularity] = useState('H')



  const handleChangeGranularityGmv10 = (granularityGmv10: string) => {
    // setCurrentCompareConsumptions([])

    setConsumptionsFilters({
      ...consumptionsFilters,
      granularityGmv10
    })
  }

  const handleChangeGranularity = (aux: string) => {
    // setCurrentCompareConsumptions([])
    if (aux === 'H') {
      setGranularity('H')
    } else {
      setGranularity('Q')
    }
  }

  let auxConsumptionsData = [] as any

  const handleExport = () => {
    setExportingData(true)
    auxConsumptionsData = []
    var startDate = ''
    var endDate = ''
    let fecha = new Date();

    if (downLoadFilters.tipo === 'periodo') {
      startDate = formatDate(auxStartDate)
      endDate = formatDate(auxEndDate)
    } else if (downLoadFilters.tipo === '24meses') {
      endDate = formatDate(fecha)
      fecha.setFullYear(fecha.getFullYear() - 2)
      startDate = formatDate(fecha);
    } else if (downLoadFilters.tipo === 'meses') {
      let aux = auxMonth + ' 00:00:00'
      let auxDate = new Date(completeDateWithSlash(aux).getTime())
      startDate = formatDate(auxDate)
      auxDate.setMonth(auxDate.getMonth() + 1)
      auxDate.setDate(auxDate.getDate() - 1)
      endDate = formatDate(auxDate)
    }

    if (consumptionsFilters.showR4 === 'S') {
      dowloadReactiveGenerated(startDate, endDate)
    }
    else if (consumptionsFilters.showR1 === 'S') {
      dowloadReactiveConsumed(startDate, endDate)
    }
    else if (autoConsumption) {
      dowloadSelfConsumptions(startDate, endDate)
    }
    else if(isGeneration){
      dowloadConsumptionsGeneration(startDate, endDate)
    }
    else {
      dowloadConsumptions(startDate, endDate)
    }
  }

  const dowloadReactiveGenerated = (startDate: any, endDate: any) => {
    dispatch(thunkGetCurrentSupplyConsumptions(false, supplyData.holderDocumentNumber, supplyData.cups, granularity, startDate, endDate, null, supplyData.isGenerator, supplantedUser, isDelegate, setExportingData, '0', supplyData.measurementSystem, (response) => {
      if (response == 'showModalError1007') {
        setModalMessage('errors.autoconsumo.1007')
        setModalSecondMessage('')
        toggle();
      } else {
        let ws
        let fileName

        let item = response[0];
        item.consumptions && item.consumptions.items && item.consumptions.items.map(
              (consumption) => {
                let auxConsumptionValue
                let auxDate

                if (isGeneration) {
                  if (isGenerationTab) {
                    auxConsumptionValue = consumption.activeOutput
                  } else {
                    auxConsumptionValue = consumption.activeInput
                  }
                } else {
                  auxConsumptionValue = consumption.consumptionValue
                }

                if (auxConsumptionValue) {
                  auxConsumptionsData.push({
                    cups: supplyData.cups ? supplyData.cups : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                    date: consumption.consumptionDate ? consumption.consumptionDate : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                    hour: consumption.hour ? consumption.hour : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                    consumption: consumption.reactive4 ? consumption.reactive4 : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                  })
                }

                return null
              }
            )
       
        ws = XLSX.utils.json_to_sheet(auxConsumptionsData, {
          header: [
            'cups',
            'date',
            'hour',
            'consumption',
          ]
        })

        ws['A1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.cups')
        ws['B1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.date')
        ws['C1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.hour')
        ws['D1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.Rkw4')

        fileName = 'consumptions.xlsx'

        const wb = XLSX.utils.book_new()

        XLSX.utils.book_append_sheet(wb, ws, 'consumptions')

        XLSX.writeFile(wb, fileName)
      }
    }))
  }
  const dowloadReactiveConsumed = (startDate: any, endDate: any) => {
    dispatch(thunkGetCurrentSupplyConsumptions(false, supplyData.holderDocumentNumber, supplyData.cups, granularity, startDate, endDate, null, supplyData.isGenerator, supplantedUser, isDelegate, setExportingData, '0', supplyData.measurementSystem, (response) => {
      if (response == 'showModalError1007') {
        setModalMessage('errors.autoconsumo.1007')
        setModalSecondMessage('')
        toggle();
      } else {
        let ws
        let fileName
        let item = response[0];
        item.consumptions && item.consumptions.items && item.consumptions.items.map(
              (consumption) => {
                let auxConsumptionValue
                if (isGeneration) {
                  if (isGenerationTab) {
                    auxConsumptionValue = consumption.activeOutput
                  } else {
                    auxConsumptionValue = consumption.activeInput
                  }
                } else {
                  auxConsumptionValue = consumption.consumptionValue
                }

                if (auxConsumptionValue) {
                  auxConsumptionsData.push({
                    cups: supplyData.cups ? supplyData.cups : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                    date: consumption.consumptionDate ? consumption.consumptionDate : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                    hour: consumption.hour ? consumption.hour : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                    consumption: consumption.reactive1 ? consumption.reactive1 : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                  })
                }

                return null
              }
            )
          

        ws = XLSX.utils.json_to_sheet(auxConsumptionsData, {
          header: [
            'cups',
            'date',
            'hour',
            'consumption',
          ]
        })

        ws['A1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.cups')
        ws['B1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.date')
        ws['C1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.hour')
        ws['D1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.Rkw1')

        fileName = 'consumptions.xlsx'

        const wb = XLSX.utils.book_new()

        XLSX.utils.book_append_sheet(wb, ws, 'consumptions')

        XLSX.writeFile(wb, fileName)
      }

    }))
  }
  const dowloadSelfConsumptions = (startDate: any, endDate: any) => {
    dispatch(thunkGetCurrentSupplyConsumptions(false, supplyData.holderDocumentNumber, supplyData.cups, granularity, startDate, endDate, null, supplyData.isGenerator, supplantedUser, isDelegate, setExportingData, '1', supplyData.measurementSystem, (response) => {
      if (response == 'showModalError1007') {
        setModalMessage('errors.autoconsumo.1007')
        setModalSecondMessage('')
        toggle();
      } else {
        let ws
        let fileName

        response && response.map(
          (item) => {
            auxConsumptionsData.push({
              cups: supplyData.cups ? supplyData.cups : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              date: item.date ? item.date : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              hour: item.hour ? item.hour : '0',
              EHAC: item.EHAC ? item.EHAC : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              EHACi: item.EHACi ? item.EHACi : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              EHCCA: item.EHCCA ? item.EHCCA : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              EHCR: item.EHCR ? item.EHCR : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              EHCRi: item.EHCRi ? item.EHCRi : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              EHCSA: item.EHCSA ? item.EHCSA : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              EHCi: item.EHCi ? item.EHCi : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              EHEX: item.EHEX ? item.EHEX : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              EHEXG: item.EHEXG ? item.EHEXG : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              EHEXi: item.EHEXi ? item.EHEXi : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              EHNG: item.EHNG ? item.EHNG : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
              EHNGi: item.EHNGi ? item.EHNGi : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
            })
          }
        )
        ws = XLSX.utils.json_to_sheet(auxConsumptionsData, {
          header: [
            'cups',
            'date',
            'hour',
            'EHAC',
            'EHACi',
            'EHCCA',
            'EHCR',
            'EHCRi',
            'EHCSA',
            'EHCi',
            'EHEX',
            'EHEXG',
            'EHEXi',
            'EHNG',
            'EHNGi',
          ]
        })

        ws['A1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.cups')
        ws['B1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.date')
        ws['C1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.hour')
        ws['D1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.EHAC')
        ws['E1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.EHACi')
        ws['F1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.EHCCA')
        ws['G1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.EHCR')
        ws['H1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.EHCRi')
        ws['I1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.EHCSA')
        ws['J1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.EHCi')
        ws['K1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.EHEX')
        ws['L1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.EHEXG')
        ws['M1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.EHEXi')
        ws['N1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.EHNG')
        ws['O1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.EHNGi')
        fileName = 'Autoconsumptions.xlsx'
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'consumptions')
        XLSX.writeFile(wb, fileName)
      }

    }))
  }
  const dowloadConsumptionsGeneration = (startDate: any, endDate: any) => {
    dispatch(thunkGetCurrentSupplyConsumptions(false, supplyData.holderDocumentNumber, supplyData.cups, granularity, startDate, endDate, null, supplyData.isGenerator, supplantedUser, isDelegate, setExportingData, '0', supplyData.measurementSystem, (response) => {
      if (response == 'showModalError1007') {
        setModalMessage('errors.autoconsumo.1007')
        setModalSecondMessage('')
        toggle();
      } else {
        let ws
        let fileName
        let item = response[0];
        item.consumptions && item.consumptions.items && item.consumptions.items.map(
              (consumption) => {
                let auxConsumptionValue
                let auxDate
                if (consumption.consumptionDate) {
                  auxDate = consumption.consumptionDate.split('/')
                }

                if (isGeneration) {
                  if (isGenerationTab) {
                    auxConsumptionValue = consumption.activeOutput
                  } else {
                    auxConsumptionValue = consumption.activeInput
                  }
                } else {
                  auxConsumptionValue = consumption.consumptionValue
                }

                if (auxConsumptionValue && isGeneration) {
                  auxConsumptionsData.push({
                    cups: supplyData.cups ? supplyData.cups : '0',
                    date: consumption.consumptionDate ? consumption.consumptionDate : '00/00/0000',
                    hour: consumption.hour ? consumption.hour : '0',
                    consumption: auxConsumptionValue ? auxConsumptionValue : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                    p1: consumption.consumptionValueP1 ? consumption.consumptionValueP1 : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                    p2: consumption.consumptionValueP2 ? consumption.consumptionValueP2 : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                    p3: consumption.consumptionValueP3 ? consumption.consumptionValueP3 : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                    p4: consumption.consumptionValueP4 ? consumption.consumptionValueP4 : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                    p5: consumption.consumptionValueP5 ? consumption.consumptionValueP5 : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                    p6: consumption.consumptionValueP6 ? consumption.consumptionValueP6 : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                  })
                }

                return null
              }
            )
          

        ws = XLSX.utils.json_to_sheet(auxConsumptionsData, {
          header: [
            'cups',
            'date',
            'hour',
            'consumption',
            'p1',
            'p2',
            'p3',
            'p4',
            'p5',
            'p6',
          ]
        })

        ws['A1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.cups')
        ws['B1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.date')
        ws['C1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.hour')
        ws['D1'].v = (isGeneration && isGenerationTab) ? t('supplies.suppliesDetails.components.consumption.exportDialogs.generation') : t('supplies.suppliesDetails.components.consumption.exportDialogs.consumption')
        ws['E1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo1')
        ws['F1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo2')
        ws['G1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo3')
        ws['H1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo4')
        ws['I1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo5')
        ws['J1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo6')

        fileName = 'consumptions.xlsx'

        const wb = XLSX.utils.book_new()

        XLSX.utils.book_append_sheet(wb, ws, 'consumptions')

        XLSX.writeFile(wb, fileName)

      }
    }))
  }

  const dowloadConsumptions = (startDate: any, endDate: any) => {

    dispatch(thunkGetCurrentSupplyConsumptions(false, supplyData.holderDocumentNumber, supplyData.cups, granularity, startDate, endDate, null, supplyData.isGenerator, supplantedUser, isDelegate, setExportingData, '0', supplyData.measurementSystem, (response) => {
      if (response == 'showModalError1007') {
        setModalMessage('errors.autoconsumo.1007')
        setModalSecondMessage('')
        toggle();
      } else {
        let ws
        let fileName



        let item = response[0];
        item.consumptions && item.consumptions.items && item.consumptions.items.map(
              (consumption) => {
                let auxConsumptionValue

                if (isGeneration) {
                  if (isGenerationTab) {
                    auxConsumptionValue = consumption.activeOutput
                  } else {
                    auxConsumptionValue = consumption.activeInput
                  }
                } else {
                  auxConsumptionValue = consumption.consumptionValue
                }
                if (auxConsumptionValue) {
                  auxConsumptionsData.push({
                    cups: supplyData.cups ? supplyData.cups : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                    date: consumption.consumptionDate ? consumption.consumptionDate : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                    hour: consumption.hour ? consumption.hour : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                    consumption: auxConsumptionValue ? auxConsumptionValue : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                    p1: consumption.consumptionValueP1 ? consumption.consumptionValueP1 : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                    p2: consumption.consumptionValueP2 ? consumption.consumptionValueP2 : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),
                    p3: consumption.consumptionValueP3 ? consumption.consumptionValueP3 : t('supplies.suppliesDetails.components.consumption.exportDialogs.noData'),

                  })
                }

                return null
              }
            )
    

        ws = XLSX.utils.json_to_sheet(auxConsumptionsData, {
          header: [
            'cups',
            'date',
            'hour',
            'consumption',
            'p1',
            'p2',
            'p3',
          ]
        })

        ws['A1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.cups')
        ws['B1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.date')
        ws['C1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.hour')
        ws['D1'].v = (isGeneration && isGenerationTab) ? t('supplies.suppliesDetails.components.consumption.exportDialogs.generation') : t('supplies.suppliesDetails.components.consumption.exportDialogs.consumption')
        ws['E1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo1')
        ws['F1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo2')
        ws['G1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.periodo3')

        fileName = 'consumptions.xlsx'

        const wb = XLSX.utils.book_new()

        XLSX.utils.book_append_sheet(wb, ws, 'consumptions')

        XLSX.writeFile(wb, fileName)
      }
    }))
  }

  useEffect(() => {
    //modificamos la fecha incial del filtro
    if (auxStartDate && downLoadFilters.tipo === 'periodo') {
      setDownLoadFilters({
        ...downLoadFilters,
        startDate: formatDate(new Date(formatDateHyphens(auxStartDate)))
      })
    }

  }, [auxStartDate])

  useEffect(() => {
    if (downLoadFilters.tipo == 'meses') {
      if (auxMonth) {
        setEnableButton(true)
      } else {
        setEnableButton(false)
      }
    } else if (downLoadFilters.tipo == 'periodo') {
      if ((auxStartDate && auxEndDate)) {
        if (verifyDatas()) {
          toggle();
        } else {
          setEnableButton(true)
        }
      } else {
        setEnableButton(false)
      }
    } else if (downLoadFilters.tipo == '24meses') {
      setEnableButton(true)
    }
  }, [auxStartDate, auxEndDate, auxMonth, downLoadFilters.tipo])

  useEffect(() => {
    //modificamos la fecha final del filtro
    if (auxEndDate && downLoadFilters.tipo === 'periodo') {
      setDownLoadFilters({
        ...downLoadFilters,
        endDate: formatDate(new Date(formatDateHyphens(auxEndDate)))
      })
    }
  }, [auxEndDate])

  const verifyDatas = () => {
    let distYear = auxEndDate.getFullYear() - auxStartDate.getFullYear();

    if (distYear < 0 || (distYear === 0 && auxEndDate.getDate() < auxStartDate.getDate())) {
      distYear--
    }
    if (distYear >= 2) {
      return true;
    }
  }
  const { isOpen } = useModal();
  const classes_ = useStyles_({})
  const [ModalMessage, setModalMessage] = useState('')
  const [ModalSecondMessage, setModalSecondMessage] = useState('');

  const sendGAEventExport = ():void => {
    sendGAEvent({
      event: 'download',
      section_name: 'mis suministros',
      subsection_name: 'mi consumo',
      click_text: 'exportar en excel',
      element_type: 'consulta de informacion',
      page_url: window.location.href,
      browsing_type: sessionStorage.getItem('browsing_type'),
      cups: supplyData.cups,
      supply_type: supplyData.isGenerator ? (supplyData.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
      tab_name: sessionStorage.getItem('tab1_MiConsumo') ? sessionStorage.getItem('tab1_MiConsumo') : 'energia consumida kwh',
      subtab_name: 'consumo horario',
      see_consumption: sessionStorage.getItem('consumo_horario_option'),
    })
  }

  return (
    <>
      <Modales isOpne={isOpen} toggle={toggle}>
        <img src={CloseIcon} className={classes_.closeButton} alt='close' onClick={toggle} />
        <img src={AlertIcon} />
        <div className={classes_.title}>
          {t(ModalMessage)}
        </div>
        <div className={classes_.body}>
          {t(ModalSecondMessage)}
        </div>
        <Grid item>
          <Grid container justifyContent='center'>
            <Button
              className={classes_.button}
              text={t('errors.date.button.accept')}
              color='primary'
              size='large'
              variant='contained'
              onClick={toggle}
            />
          </Grid>
        </Grid>
      </Modales>
      <Grid item md={12} sm={12} xs={12}>
        {/* BOTONES HORARIO Y CUARTOHORARIO */}
        <Grid container md={12} sm={12} xs={12} className={classes.menu3}>
          {
            ((downLoadFilters.tipo === 'periodo') || (downLoadFilters.tipo === 'meses') || (downLoadFilters.tipo === '24meses')) && (supplyData.measurementSystem && supplyData.measurementSystem === 'G')&& !autoConsumption &&
            <Grid item className={`${classes.menuItem2} ${granularity === 'H' ? 'active' : ''}`} onClick={() => handleChangeGranularity('H')}>
              {t('supplies.suppliesDetails.components.consumption.charts.views.Hour')}
            </Grid>
          }
          {
            ((downLoadFilters.tipo === 'periodo') || (downLoadFilters.tipo === 'meses') || (downLoadFilters.tipo === '24meses')) && !autoConsumption &&
            <Grid item className={`${classes.menuItem2} ${granularity === 'Q' ? 'active' : ''}`} onClick={() => handleChangeGranularity('Q')}>
              {t('supplies.suppliesDetails.components.consumption.charts.views.quarter')}
            </Grid>
          }


        </Grid>

        <Grid container md={12} sm={12} xs={12} className={classes.menu}>

          {
            downLoadFilters.tipo === 'periodo' &&
            <>
              <Grid item md={3} sm={3} xs={12} className={classes.menuItem}>
                <div className={classes.label}>{t('supplies.suppliesDetails.components.consumption.charts.filters.startDate')}</div>
                {
                  <DatepickerV2
                    selectedDate={auxStartDate}
                    handleChange={setAuxStartDate}
                    maxDate={auxEndDate ? auxEndDate : new Date()}
                    size='s'
                  />
                }
              </Grid>

              <Grid item md={3} sm={3} xs={12} className={classes.menuItem}>
                <div className={classes.label}>{t('supplies.suppliesDetails.components.consumption.charts.filters.endDate')}</div>
                {
                  <DatepickerV2
                    selectedDate={auxEndDate}
                    handleChange={setAuxEndDate}
                    size='s'
                    minDate={auxStartDate}
                    maxDate={new Date()}
                  />
                }
              </Grid>
            </>
          }

          {
            downLoadFilters.tipo === 'meses' &&
            <Grid item md={3} sm={3} xs={12} container className={classes.menuItem}>
              <div className={classes.label}>{t('supplies.suppliesDetails.components.consumption.charts.filters.endDate')}</div>
              {
                <Datepicker
                  date={auxMonth}
                  maxDate={new Date()}
                  setDate={setAuxMonth}
                  onChange={setAuxMonth}
                  showMonthYearPicker
                />
              }
            </Grid>
          }
          {
            // ((supplyData.measurementSystem && supplyData.measurementSystem === 'O') || (downLoadFilters.tipo === 'periodo' || downLoadFilters.tipo === 'meses' || downLoadFilters.tipo === '24meses') || autoConsumption) &&
            <Grid item md={3} sm={3} xs={10} className={classes.buttonContainer}>
              <Button
                className={classes.button}
                text={
                  autoConsumption ?
                    t('supplies.suppliesDetails.components.consumption.charts.downloads.excel')
                    :

                    (isGeneration && isGenerationTab) ?
                      t('supplies.suppliesDetails.components.consumption.charts.downloads.excel')
                      :
                      t('supplies.suppliesDetails.components.consumption.charts.downloads.excel')
                }
                color={'primary'}
                size={'medium'}
                variant={'contained'}
                onClick={() => { sendGAEventExport(); handleExport()}}
                disabled={!enableButton}
              />
            </Grid>
          }
        </Grid>

      </Grid>
    </>
  )
}

export default FiltersConsumptionsGmv10
