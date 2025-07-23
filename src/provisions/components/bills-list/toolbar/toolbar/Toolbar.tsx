import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import useStyles from './Toolbar.styles'
import DatepickerV2 from '../../../../../common/components/datepickerV2/DatepickerV2'
import DynamicSearcher from '../../../../../common/components/searcher/DynamicSearcher'

import XLSX from 'xlsx'
import { isMobileApp } from '../../../../../mobile-apps/common/detectPlatform'
import createFileAndOpenIt from '../../../../../mobile-apps/local-downloads/createFileAndOpenIt'

// LCS: Importa la función - Wave 3
import { getExpStatus, sendGAEvent, removeEmails } from '../../../../../core/utils/gtm';

const Toolbar = (props: any) => {
  const { t } = useTranslation()

  const {
    billsList,
    setAuxBillsList,
    finalList,
    type,
    dossierCod
  } = props

  const classes = useStyles({})

  const actualDate = new Date()

  const [datepickerDate1, setDatepickerDate1] = useState<Date>();
  const [date1IsModified, setDate1IsModified] = useState(false);
  const [datepickerDate2, setDatepickerDate2] = useState<Date>(actualDate);
  const [date2IsModified, setDate2IsModified] = useState(false);

  const [bill_number, setBillNumber] = useState(false);
  const [req_number, setReqNumber] = useState(false);

  useEffect(() => {
    sessionStorage.removeItem('billing_number')
  },[])

  // Datos 
  //const [dossierCod, setDossierCod] = useState('');
  const [billCod, setBillCod] = useState('');

  // Función para controlar los inputs de la barra de búsquueda
  const filterBillsList = () => {
    if (dossierCod === '' && billCod === '' && !date1IsModified && !date2IsModified) {
      setAuxBillsList(billsList)
    } else {
      // Filtramos el listado de facturas según los campos rellenados del buscador
      const newAuxBillsList = billsList.filter(bill =>
        (dossierCod && dossierCod !== '' ? bill.dossierCod.toUpperCase().includes(dossierCod.toUpperCase()) : bill.dossierCod !== '') &&
        (billCod !== '' ? bill.billCod.toUpperCase().includes(billCod.toUpperCase()) : bill.billCod !== '') &&
        (date1IsModified ?
          new Date(formatDateEEUU(bill.billIssueDate)) >= datepickerDate1
          :
          bill.billIssueDate !== '') &&
        (date2IsModified ?
          new Date(formatDateEEUU(bill.billIssueDate)) <= datepickerDate2
          :
          bill.billIssueDate !== '')
      )
      setAuxBillsList(newAuxBillsList)
    }

    // Reseteamos los valores de los filtros tras la búsqueda
    setDatepickerDate1(datepickerDate1)
    setDate1IsModified(false)
    setDatepickerDate2(datepickerDate2)
    setDate2IsModified(false)
    //setDossierCod('')
    setBillCod('')
    
    // LCS: Enviar evento de GdC a GA - Wave 3
    if(type == 'b'){ // LCS: Funcion del boton buscar dentro de Mi conexion a la red, seccion Facturas
      let billing_number = sessionStorage.getItem('billing_number')
      sessionStorage.setItem('request_number',dossierCod ? dossierCod : 'no aplica')
      let request_status = sessionStorage.getItem('provisionDossierStatus')
      let request_number = sessionStorage.getItem('request_number')
      sendGAEvent({
        event: 'search',
        section_name: 'mi conexion a la red',
        subsection_name: 'detalle de solicitud',
        billing_number: billing_number && billing_number.length > 0 ? billing_number : 'no aplica',
        element_type: 'consulta de informacion',
        page_url: removeEmails(window.location.href),
        request_number: request_number,
        request_status: request_status,
        module_name: 'facturas',
        browsing_type: sessionStorage.getItem('browsing_type')
      })
    } else {
      // LCS: Funcion del boton buscar en la seccion Mi conexion a la red, en Mis facturas 
      sendGAEvent({
        event: 'search',
        section_name: 'mi conexion a la red',
        subsection_name: 'mis facturas de conexion a la red',
        element_type: 'consulta de informacion',
        page_url: removeEmails(window.location.href),
        billing_number: bill_number ? bill_number : 'no aplica',
        request_number: req_number ? req_number : 'no aplica',
        browsing_type: sessionStorage.getItem('browsing_type')
      })
    }
  }

  const formatDateAndTime = (date) => {
    if (date) {
      const year = date.substring(0, 4)
      const month = date.substring(5, 7)
      const day = date.substring(8, 10)
      return (day + '/' + month + '/' + year)
    }
  }
  const formatText = (text: string): string => {
    return (text.substring(0, 1) + text.substring(1, text.length).toLowerCase())
  }

  const handleDowloadBillList = () => {
    if (finalList) {
      let listData = [] as any
      finalList.map(
        (item) => {
          listData.push({
            codExp: item.numberexpedient,
            codBill: item.billNumber,
            sendDate: formatDateAndTime(item.billIssueDate),
            billType: formatText(item.billType),
            status: formatText(item.billStatus),
            amount: item.import + '€'
          })
        }
      )
      //funcion para descar un excel con la información de los suplipoints en un excel
      const wb = XLSX.utils.book_new()
      let ws
      //posa un JSON object a una pagina
      ws = XLSX.utils.json_to_sheet(listData, {
        header: [
          'codExp',
          'codBill',
          'sendDate',
          'billType',
          'status',
          'amount',
        ]
      })
      ws['A1'].v = t('provisions.billsList.codExp')
      ws['B1'].v = t('provisions.billsList.codBill')
      ws['C1'].v = t('provisions.billsList.sendDate')
      ws['D1'].v = t('provisions.billsList.billType')
      ws['E1'].v = t('provisions.billsList.status')
      ws['F1'].v = t('provisions.billsList.amount')

      let fileName = 'MisFacturas.xlsx'
      XLSX.utils.book_append_sheet(wb, ws, 'Mis facturas')
      //crea el llibre 
      XLSX.writeFile(wb, fileName)

      // XLSX.writeFile will attempt to force a client-side download, works for web,
      // for mobile apps blob downloads do not work ATM, code below is an alternative, (hover createFileAndOpenIt for jsdoc).
      if (isMobileApp()) createFileAndOpenIt({ fileName, contentAsBase64: XLSX.write(wb, { type: 'base64' }) })
      
      // LCS: Enviar evento de GdC a GA - Wave 3
      if(type == 'b'){
        sendGAEvent({
          event: 'data_export',
          section_name: 'mi conexion a la red',
          subsection_name: 'detalle de solicitud',
          click_text: 'exportar datos',
          element_type: 'conversion de accion',
          page_url: removeEmails(window.location.href),
          request_number: dossierCod ? dossierCod : 'no aplica',
          request_status: sessionStorage.getItem('provisionDossierStatus'),
          module_name: 'facturas',
          browsing_type: sessionStorage.getItem('browsing_type')
        })
      } else {
        sendGAEvent({
          event: 'data_export',
          section_name: 'mi conexion a la red',
          subsection_name: 'mis facturas de conexion a la red',
          click_text: 'exportar datos',
          element_type: 'conversion de accion',
          page_url: removeEmails(window.location.href),
          browsing_type: sessionStorage.getItem('browsing_type')
        })
      }
    }
  }

  const formatDateEEUU = (date) => {
    if (date) {
      const year = date.substring(0, 4)
      const month = date.substring(5, 7)
      const day = date.substring(8, 10)
      return (month + '/' + day + '/' + year)
    }
  }

  useEffect(() => {
    if (datepickerDate1) {
      setDate1IsModified(true)
    }
  }, [datepickerDate1])

  useEffect(() => {
    if (datepickerDate2.toDateString() !== actualDate.toDateString()) {
      setDate2IsModified(true)
    }
  }, [datepickerDate2, actualDate])

  return (
    <Grid container alignItems='center' justifyContent='flex-end' className={classes.searchBar}>
      <Grid container className={type === 'a' ? classes.datepickerContainer : classes.datepickerContainerB}>
        {type === 'a' &&
          <Grid item md='auto'>
            <div className={classes.codTitle}>
              {t('provisions.billsList.codExp')}
            </div>
            <div style={{ marginRight: 10 }}>
              <DynamicSearcher
                label={t('provisions.provisionsList.searcher')}
                finalList={finalList}
                setFinalList={setAuxBillsList}
                listItems={billsList}
                subtype={'listBillsA'}
                setReqNumber={setReqNumber}
              />
            </div>
          </Grid>
        }
        <Grid item md='auto'>
          <div className={classes.codTitle}>
            {t('provisions.billsList.codBill')}
          </div>
          <div style={{ marginRight: type === 'a' && 10 }}>
            <DynamicSearcher
              label={t('provisions.provisionsList.searcher')}
              finalList={finalList}
              setFinalList={setAuxBillsList}
              listItems={billsList}
              subtype={'listBillsB'}
              setBillNumber={setBillNumber}
            />
          </div>
        </Grid>
        <Grid item md='auto'>
          <div className={classes.datepickerTitle}>
            {t('averias.management.supplyPannel.requestTable.dateFrom') + ':'}
          </div>
          <div className={classes.datepickerInput}>
            <DatepickerV2
              selectedDate={datepickerDate1}
              handleChange={setDatepickerDate1}
              size='l'
              maxDate={datepickerDate2}
            />
          </div>
        </Grid>
        <Grid item md='auto'>
          <div className={classes.datepickerTitle}>
            {t('averias.management.supplyPannel.requestTable.dateTo') + ':'}
          </div>
          <div className={classes.datepickerInput}>
            <DatepickerV2
              selectedDate={datepickerDate2}
              handleChange={setDatepickerDate2}
              size='l'
              minDate={datepickerDate1}
              maxDate={new Date()}
            />
          </div>
        </Grid>
        <Grid item md='auto'>
          <Grid className={classes.button} onClick={filterBillsList}>
            <span className={classes.searchText}>
              {t('averias.management.supplyPannel.requestTable.searchButton')}
            </span>
          </Grid>
        </Grid>
        <Grid item md='auto'>
          <Grid className={classes.exportButton} onClick={handleDowloadBillList}>
            <span className={classes.searchText}>
              {t('provisions.provisionsList.exportarData')}
            </span>
          </Grid>
        </Grid>
      </Grid>
    </Grid >
  )
}

export default Toolbar
