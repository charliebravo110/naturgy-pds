import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import XLSX from 'xlsx'

import Grid from '@material-ui/core/Grid'

import Spinner from '../../../../../../../../../common/components/spinner/Spinner'
import Button from '../../../../../../../../../common/components/button/Button'
import CloseIcon from '../../../../../../../../../assets/icons/cerrar.svg'
import ExportExcelIcon from '../../../../../../../../../assets/icons/exportar_excel.svg'

import useStyles from './Content.styles'
import { thunkListDelegatesByCreatorUserId, thunkListDelegatesByDocId } from '../../../../../../../../../delegates/store/actions/DelegatesThunkActions'
import { thunkListProgrammedReads } from '../../../../../../../store/actions/SuppliesDetailsThunkActions'
import { isMobileApp } from '../../../../../../../../../mobile-apps/common/detectPlatform'
import createFileAndOpenIt from '../../../../../../../../../mobile-apps/local-downloads/createFileAndOpenIt'

const Content = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()
  const [trifasic, setTrifasic] = useState(false)

  const selectorProgrammedReads = useSelector((state: any) => state.supplies.currentSupplyProgrammedReads)
  const user = useSelector((state: any) => state.user.profile)
  const admin = useSelector((state: any) => state.admin.profile)
  const delegatesInMeList = useSelector((state: any) => state.delegations.delegatesInMeList)

  const dispatch = useDispatch()

  const {
    supplyData,
    handleClose,
    mode
  } = props
  // INI RVD - PPM 1009750
  const [IdDelegatesList, setIdDelegatesList] = useState('')
  const [IdDelegatesInMeList, setIdDelegatesInMeList] = useState('')
  const delegatedCups = delegatesInMeList && delegatesInMeList.find(item => item.cups === supplyData.cups)

  const [IsLoading, setIsLoading] = useState(false)


  const [programmedReads, setProgrammedReads] = useState({
    count: 0,
    items: [],
    xMessageId: ''
  })
  // FIN RVD - PPM 1009750

  useEffect(() => {
    if (supplyData.installationType == 'Trifásica' || supplyData.installationType == 'TRIFÁSICA') {
      setTrifasic(true)
    }
  }, [])

  // INI RVD - PPM 1009750
  useEffect(() => {
    setIsLoading(true)
    if (user && user.userId) {
      dispatch(thunkListDelegatesByCreatorUserId(user.userId, (response) => {
        if (response) {
          const items = response.delegates.items;
          const userIds = items.map(item => item.userId.toString())
          setIdDelegatesList(userIds)
        }
      }))
    }

    if (delegatedCups) {
      if (user && user.documentNumber) {
        dispatch(thunkListDelegatesByDocId(user.documentNumber, (response) => {
          if (response) {
            const items = response.delegates.items;
            const userIds = items.map(item => item.creatorUserId.toString())
            setIdDelegatesInMeList(userIds)
          }
        }))
      }
    }
    setIsLoading(false)
  }, [user, delegatedCups])

  useEffect(() => {
    setIsLoading(true)
    if (selectorProgrammedReads && selectorProgrammedReads.items && selectorProgrammedReads.items.length > 0) {
      if (admin.userId) {
        setProgrammedReads(selectorProgrammedReads)
      }
      else {
        const userItems = selectorProgrammedReads.items.filter((item) => {
          if (item.actionId.split('/')[0] && item.actionId.split('/')[0] === user.userId) {
            return item
          }
          else if (item.actionId.split('/')[0] && IdDelegatesList && IdDelegatesList.includes(item.actionId.split('/')[0])) {
            return item
          }
          else if (item.actionId.split('/')[0] && delegatedCups && IdDelegatesInMeList.includes(item.actionId.split('/')[0])) {
            return item
          }
          else if (item.actionId.split('/')[0] && item.actionId.split('/')[0] === '0') {
            return item
          }

        })
        const auxProgrammedReads = {
          count: userItems.length,
          items: userItems,
          xMessageId: selectorProgrammedReads.xMessageId
        }
        setProgrammedReads(auxProgrammedReads)
      }
    }
    else {
      setProgrammedReads(selectorProgrammedReads)
    }
    setIsLoading(false)
  }, [selectorProgrammedReads, IdDelegatesList, IdDelegatesInMeList, delegatedCups])
  // FIN RVD - PPM 1009750
  const [fileType, setFileType] = useState('excel')

  const [exportingData, setExportingData] = useState(false)

  const formatNumberES = (numero: Number) => {
    let cadena: string = '';
    let sNumero = numero.toString();

    if (sNumero.length == 4) {
      if (sNumero.includes('.') || sNumero.includes(',')) {
        return numero.toLocaleString('es-ES');
      } else {
        let cadena = numero.toLocaleString('es-ES');
        const result = cadena.slice(0, 1) + '.' + cadena.slice(1);
        return result;
      }
    } else {
      return numero.toLocaleString('es-ES');
    }

  }

  const handleExport = () => {
    setExportingData(true)
    const meterId = (
      supplyData &&
      supplyData.measurementEquipments &&
      supplyData.measurementEquipments.meters[0] &&
      supplyData.measurementEquipments.meters[0].meter
    ) ?
      supplyData.measurementEquipments.meters[0].meter
      :
      ''

    dispatch(thunkListProgrammedReads(meterId, 0, 100, (reads) => {
      const rows = [] as any

      let ws

      let fileName
      // INI RVD - PPM 1009750
      let finalReads

      if (reads && reads.count > 0 && reads.items && reads.items.length > 0) {

        if (admin.userId) {
          finalReads = reads
        }
        else {
          const userItems = reads.items.filter((item) => {
            if (item.actionId.split('/')[0] && item.actionId.split('/')[0] === user.userId) {
              return item
            }
            else if (item.actionId.split('/')[0] && IdDelegatesList && IdDelegatesList.includes(item.actionId.split('/')[0])) {
              return item
            }
            else if (item.actionId.split('/')[0] && delegatedCups && IdDelegatesInMeList.includes(item.actionId.split('/')[0])) {
              return item
            }
            else if (item.actionId.split('/')[0] && item.actionId.split('/')[0] === '0') {
              return item
            }
          })

          finalReads = {
            count: reads.count,
            items: userItems
          }
        }
      }
      // FIN RVD - PPM 1009750
      if (fileType === 'excel') {
        (finalReads && finalReads.count > 0 && finalReads.items) && finalReads.items.map(item => {
          let state = item.state === 'PENDING' ?
            t('supplies.suppliesDetails.components.meter.programmedReads.statePending')
            :
            item.state === 'OK' ?
              t('supplies.suppliesDetails.components.meter.programmedReads.stateOk')
              :
              t('supplies.suppliesDetails.components.meter.programmedReads.stateError')

          let periodList = []
          if (item.periodo4) periodList.push(t('supplies.suppliesDetails.components.meter.connectSuccess.period.period4') + ' ' + (parseFloat(item.periodo4)) + ' ' + t('supplies.suppliesDetails.components.meter.connectSuccess.KWh'))
          if (item.periodo5) periodList.push(t('supplies.suppliesDetails.components.meter.connectSuccess.period.period5') + ' ' + (parseFloat(item.periodo5)) + ' ' + t('supplies.suppliesDetails.components.meter.connectSuccess.KWh'))
          if (item.periodo6) periodList.push(t('supplies.suppliesDetails.components.meter.connectSuccess.period.period6') + ' ' + (parseFloat(item.periodo6)) + ' ' + t('supplies.suppliesDetails.components.meter.connectSuccess.KWh'))

          let powerTrifasic;
          let sPowerTrifasic;
          let sPower = '';
          let power0: string = '';
          let power1: string = '';
          let power2: string = '';

          if (trifasic) {
            powerTrifasic = item.power.split(',');
            if (powerTrifasic[0]) {
              power0 = formatNumberES(parseFloat(powerTrifasic[0]) / 1000);
            }
            if (powerTrifasic[1]) {
              power1 = ' | ' + formatNumberES(parseFloat(powerTrifasic[1]) / 1000);
            }
            if (powerTrifasic[2]) {
              power2 = ' | ' + formatNumberES(parseFloat(powerTrifasic[2]) / 1000);
            }
            sPowerTrifasic = '' + power0 + power1 + power2
          } else {
            sPower = formatNumberES(parseFloat(item.power) / 1000);
          }


          trifasic ?
            rows.push({
              cups: supplyData.cups ? supplyData.cups : '0',
              date: item.programmedDate ? item.programmedDate : '00/00/0000',
              hour: item.hour ? item.hour : '0',
              tension: item.voltage ? item.voltage : '0',
              potenciaInstantanea: item.power ? sPowerTrifasic : 'o',
              periodo1: item.periodo1 ? (parseFloat(item.periodo1)) : '0',
              periodo2: item.periodo2 ? (parseFloat(item.periodo2)) : '0',
              periodo3: item.periodo3 ? (parseFloat(item.periodo3)) : '0',
              periodo4: item.periodo4 ? (parseFloat(item.periodo4)) : '0',
              periodo5: item.periodo5 ? (parseFloat(item.periodo5)) : '0',
              periodo6: item.periodo6 ? (parseFloat(item.periodo6)) : '0',
              lecturaKWh: item.totalizador ? (parseFloat(item.totalizador)) : '0',
              state,
              estadoConsulta:
                item.meterStatus === '0' ?
                  t('supplies.suppliesDetails.components.meter.programmedReads.state0')
                  : item.meterStatus === '1' ?
                    t('supplies.suppliesDetails.components.meter.programmedReads.state1')
                    : item.meterStatus === '2' ?
                      t('supplies.suppliesDetails.components.meter.programmedReads.state2')
                      : '',
            })
            :
            rows.push({
              cups: supplyData.cups ? supplyData.cups : '0',
              date: item.programmedDate ? item.programmedDate : '00/00/0000',
              hour: item.hour ? item.hour : '0',
              tension: item.voltage ? item.voltage : '0',
              potenciaInstantanea: item.power ? sPower : 'o',
              periodo1: item.periodo1 ? (parseFloat(item.periodo1)) : '0',
              periodo2: item.periodo2 ? (parseFloat(item.periodo2)) : '0',
              periodo3: item.periodo3 ? (parseFloat(item.periodo3)) : '0',
              lecturaKWh: item.totalizador ? (parseFloat(item.totalizador)) : '0',
              state,
              estadoConsulta:
                item.meterStatus === '0' ?
                  t('supplies.suppliesDetails.components.meter.programmedReads.state0')
                  : item.meterStatus === '1' ?
                    t('supplies.suppliesDetails.components.meter.programmedReads.state1')
                    : item.meterStatus === '2' ?
                      t('supplies.suppliesDetails.components.meter.programmedReads.state2')
                      : '',
            })

          return null
        })


        if (trifasic) {
          ws = XLSX.utils.json_to_sheet(rows, {
            header: [
              'cups',
              'date',
              'hour',
              'tension',
              'potenciaInstantanea',
              'periodo1',
              'periodo2',
              'periodo3',
              'periodo4',
              'periodo5',
              'periodo6',
              'lecturaKWh',
              'state',
              'estadoConsulta',
            ]
          })
          ws['A1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.cups')
          ws['B1'].v = t('supplies.suppliesDetails.components.meter.programmedReads.table.date')
          ws['C1'].v = t('supplies.suppliesDetails.components.meter.programmedReads.table.hour')
          ws['D1'].v = t('supplies.suppliesDetails.components.meter.programmedReads.table.tension')
          ws['E1'].v = t('supplies.suppliesDetails.components.meter.programmedReads.table.potenciaInstantanea')
          ws['F1'].v = t('supplies.suppliesDetails.components.meter.connectSuccess.period.period1')
          ws['G1'].v = t('supplies.suppliesDetails.components.meter.connectSuccess.period.period2')
          ws['H1'].v = t('supplies.suppliesDetails.components.meter.connectSuccess.period.period3')
          ws['I1'].v = t('supplies.suppliesDetails.components.meter.connectSuccess.period.period4')
          ws['J1'].v = t('supplies.suppliesDetails.components.meter.connectSuccess.period.period5')
          ws['K1'].v = t('supplies.suppliesDetails.components.meter.connectSuccess.period.period6')
          ws['L1'].v = t('supplies.suppliesDetails.components.meter.programmedReads.table.lecturaKWh')
          ws['M1'].v = t('supplies.suppliesDetails.components.meter.programmedReads.table.state')
          ws['N1'].v = t('supplies.suppliesDetails.components.meter.programmedReads.table.estadoConsulta')

        }
        else {
          ws = XLSX.utils.json_to_sheet(rows, {
            header: [
              'cups',
              'date',
              'hour',
              'tension',
              'potenciaInstantanea',
              'periodo1',
              'periodo2',
              'periodo3',
              'lecturaKWh',
              'state',
              'estadoConsulta',
            ]
          })

          ws['A1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.cups')
          ws['B1'].v = t('supplies.suppliesDetails.components.meter.programmedReads.table.date')
          ws['C1'].v = t('supplies.suppliesDetails.components.meter.programmedReads.table.hour')
          ws['D1'].v = t('supplies.suppliesDetails.components.meter.programmedReads.table.tension')
          ws['E1'].v = t('supplies.suppliesDetails.components.meter.programmedReads.table.potenciaInstantanea')
          ws['F1'].v = t('supplies.suppliesDetails.components.meter.connectSuccess.period.period1')
          ws['G1'].v = t('supplies.suppliesDetails.components.meter.connectSuccess.period.period2')
          ws['H1'].v = t('supplies.suppliesDetails.components.meter.connectSuccess.period.period3')
          ws['I1'].v = t('supplies.suppliesDetails.components.meter.programmedReads.table.lecturaKWh')
          ws['J1'].v = t('supplies.suppliesDetails.components.meter.programmedReads.table.state')
          ws['K1'].v = t('supplies.suppliesDetails.components.meter.programmedReads.table.estadoConsulta')

        }

        fileName = 'reads.xlsx'
      } else {
        (finalReads && finalReads.count > 0 && finalReads.items) && finalReads.items.map(item => {
          let state = item.state === 'PENDING' ?
            t('supplies.suppliesDetails.components.meter.programmedReads.statePending')
            :
            item.state === 'OK' ?
              `${item.power} kWh / ${item.voltage} V`
              :
              t('supplies.suppliesDetails.components.meter.programmedReads.stateError')

          let auxRow = [
            supplyData.cups ? supplyData.cups : '0',
            item.programmedDate ? item.programmedDate : '00/00/0000',
            item.hour ? item.hour : '0',
            state
          ]

          rows.push({
            item: auxRow.join(';')
          })

          return null
        })

        ws = XLSX.utils.json_to_sheet(rows, {
          header: [
            'item'
          ]
        })

        ws['A1'].v = t('supplies.suppliesDetails.components.consumption.exportDialogs.cups2') + ';' + t('supplies.suppliesDetails.components.meter.programmedReads.table.date') + ';' + t('supplies.suppliesDetails.components.meter.programmedReads.table.hour') + ';' + t('supplies.suppliesDetails.components.meter.programmedReads.table.state')

        fileName = 'reads.csv'
      }

      const wb = XLSX.utils.book_new()

      XLSX.utils.book_append_sheet(wb, ws, 'reads')

      XLSX.writeFile(wb, fileName)

      // XLSX.writeFile will attempt to force a client-side download, works for web,
      // for mobile apps blob downloads do not work ATM, code below is an alternative, (hover createFileAndOpenIt for jsdoc).
      if (isMobileApp()) createFileAndOpenIt({ fileName, contentAsBase64: XLSX.write(wb, { type: 'base64' }) })


      setExportingData(false)
    }))
  }

  return (
    <>
      {
        exportingData &&
        <Spinner />
      }

      {
        IsLoading &&
        <Spinner />
      }

      <img src={CloseIcon} className={classes.closeButton} alt='' onClick={handleClose} />

      <div className={classes.title}>{t('supplies.suppliesDetails.components.consumption.exportDialogs.exportTableDataDialog.exportData.from')} {`${mode === 'graph' ? t('supplies.suppliesDetails.components.consumption.exportDialogs.exportTableDataDialog.exportData.graph') : t('supplies.suppliesDetails.components.consumption.exportDialogs.exportTableDataDialog.exportData.table')}`}</div>

      <div className={classes.options}>
        <div className={classes.boldText}>{t('supplies.suppliesDetails.components.consumption.exportDialogs.downloadFormat')}</div>

        <Grid container className={classes.exports}>
          <Grid
            item
            className={classes.export}
            sm={12}
            xs={12}
            md='auto'
            onClick={() => setFileType('excel')}
          >
            <Grid container className={classes.exportContainer}>
              <Grid item className={`${classes.checkbox} ${fileType === 'excel' && 'active'}`} />

              <Grid item className={classes.icon}>
                <img src={ExportExcelIcon} alt='' />
              </Grid>

              <Grid item className={classes.label}>{t('supplies.suppliesDetails.components.consumption.exportDialogs.exportExcel')}</Grid>
            </Grid>
          </Grid>

          {/* <Grid
            item
            className={`${classes.export} marginLeft`}
            sm={12}
            xs={12}
            md='auto'
            onClick={() => setFileType('csv')}
          >
            <Grid container className={classes.exportContainer}>
              <Grid item className={`${classes.checkbox} ${fileType === 'csv' && 'active'}`} />

              <Grid item className={classes.icon}>
                <img src={ExportExcelIcon} alt='' />
              </Grid>

              <Grid item className={classes.label}>{t('supplies.suppliesDetails.components.consumption.exportDialogs.downloadInText')}</Grid>
            </Grid>
          </Grid> */}
        </Grid>
      </div>

      <Grid container className={classes.buttonContainer}>
        <Grid item>
          <Button
            text={t('supplies.suppliesDetails.components.consumption.exportDialogs.buttomExpot')}
            color={'primary'}
            size={'large'}
            variant={'contained'}
            onClick={handleExport}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default withRouter(Content)
