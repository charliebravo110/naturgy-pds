import React, { useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import Input from '../input/Input'
import { convertToFullDate, formatCompletDateString, formatDateAndTime } from '../../lib/FormatLib'
import useStyles from './Searcher.styles'

// LCS: Importa la función - Wave 3
import { sendGAEvent, removeEmails } from '../../../core/utils/gtm';

const DynamicSearcher = (props: any) => {
  const classes = useStyles({})
  const {
    label,
    finalList,
    setFinalList,
    listItems,
    subtype,
    setCurrentPage,
    updateFlag,
    setUpdateFlag,
    CUPS,
    supplyData,
    setReqNumber,
    setBillNumber
  } = props
  const [changeColor, setChangeColor] = useState(false)
  const [valueSearch, setValueSearch] = useState('')

  useEffect(() => {
    //sessionStorage.removeItem('request_number')
    sessionStorage.removeItem('billing_number')
  },[])

  const handleInput = (value) => {
    setValueSearch(value)
    let auxList = []
    let auxListW = { warning: [] }
    setCurrentPage && setCurrentPage(0)
    if (subtype === 'suministro') {
      finalList.filter(item =>
        item.name.toUpperCase().includes(value.toUpperCase()) ||
        item.cups.includes(value.toUpperCase()) ||
        (item.address.street + ' ' + item.address.number + ', ' + item.address.province + ' ' + item.address.zipCode).includes(value.toUpperCase())
      ).map(item => {
        auxList.push(item)
      });
    } else if (subtype === 'peticion') {
      finalList.filter(item =>
        item.codSR.includes(value.toUpperCase()) ||
        item.cups.includes(value.toUpperCase()) ||
        item.codExpedient.includes(value.toUpperCase()) ||
        item.createDate.includes(value.toUpperCase()) ||
        item.closingDate.includes(value.toUpperCase())
      ).map(item => {
        auxList.push(item)
      });
    } else if (subtype === 'solicitud') {
      finalList.filter(item =>
        item.name.toUpperCase().includes(value.toUpperCase()) ||
        item.dossierCod.includes(value.toUpperCase()) ||
        item.addressDescription.includes(value.toUpperCase()) ||
        formatCompletDateString(item.registerDate).includes(value.toUpperCase()) ||
        item.dossierStatusId.includes(value.toUpperCase())
      ).map(item => {
        auxList.push(item)
      });
    } else if (subtype === 'listBillsB') {
      finalList.filter(item =>
        item.billNumber.toUpperCase().includes(value.toUpperCase())
      ).map(item => {
        auxList.push(item)
      });
    } else if (subtype === 'listBillsA') {
      finalList.filter(item =>
        item.numberexpedient.toUpperCase().includes(value.toUpperCase())
      ).map(item => {
        auxList.push(item)
      });
    } else if (subtype === 'delegates') {
      finalList.filter(item =>
        item.name.toUpperCase().includes(value.toUpperCase()) ||
        item.cups.includes(value.toUpperCase()) ||
        (item.address.street + ' ' + item.address.number + ', ' + item.address.province + ' ' + item.address.zipCode).includes(value.toUpperCase())
      ).map(item => {
        auxList.push(item)
      });
    } else if (subtype === 'controlMensajeria') {
      finalList.filter(item =>
        item.cups.includes(value.toUpperCase()) ||
        item.docIdentificativo.includes(value.toUpperCase()) ||
        item.fecha.toString().includes(value.toString()) ||
        (item.fechaMsm && item.fechaMsm.toString().includes(value.toString())) ||
        (item.provincia && item.provincia.toUpperCase().includes(value.toUpperCase())) ||
        (item.municipio && item.municipio.toUpperCase().includes(value.toUpperCase())) ||
        (item.telefono && item.telefono.toUpperCase().includes(value.toUpperCase())) ||
        (item.email && item.email.toUpperCase().includes(value.toUpperCase())) ||
        (item.direccion && item.direccion.toUpperCase().includes(value.toUpperCase()))
      ).map(item => {
        auxList.push(item)
      });

    } else if (subtype === 'auditoria') {
      finalList.filter(item =>
        item.user.includes(value.toUpperCase()) ||
        item.session.toUpperCase().includes(value.toUpperCase()) ||
        item.date.toString().includes(value.toString()) ||
        item.validate.toUpperCase().includes(value.toUpperCase()) ||
        item.tries.length > 0 && item.tries.filter(tr =>
          tr.channel.toUpperCase().includes(value.toUpperCase()) ||
          tr.hour.toString().includes(value.toString())
        ).length > 0
      ).map(item => {
        auxList.push(item)
      });

    } else if (subtype === 'controlInterrupcionesCups') {
      listItems.filter(item =>
        (item.cups && item.cups.includes(value.toUpperCase()))||
        (item.docId && item.docId.includes(value.toUpperCase()))
      ).map(item => {
        auxList.push(item)
      });
    } else if (subtype === 'controlInterrupcionesSent') {
      finalList.filter(item =>
        (item.cups && item.cups.includes(value.toUpperCase()))||
        (item.docId && item.docId.includes(value.toUpperCase()))||
        (item.incidence && item.incidence.includes(value.toUpperCase()))).map(item => {
          auxList.push(item)
        });
    } else if (subtype === 'monitorizacionPagos') {
      finalList.filter(item =>
        (item.requestTimestamp && item.requestTimestamp.toString().includes(value.toString().trim())) ||
        (item.dossierNumber && item.dossierNumber.toUpperCase().trim().includes(value.toUpperCase().trim())) ||
        (item.orderId && item.orderId.toUpperCase().trim().includes(value.toUpperCase().trim())) ||
        (item.amount && item.amount.toUpperCase().trim().includes(value.toUpperCase().trim())) ||
        (item.custNum && item.custNum.toUpperCase().trim().includes(value.toUpperCase().trim())) ||
        (item.status && item.status.toUpperCase().trim().includes(value.toUpperCase().trim())) ||
        (item.result && item.result.toUpperCase().trim().includes(value.toUpperCase().trim()))

      ).map(item => {
        auxList.push(item)
      });
    }  else if (subtype === 'controlDigitalizacion') {
      finalList.filter(item =>
            (item.adminId && item.adminId.toString().includes(value.toString().trim())) ||
            (item.userId && item.userId.toUpperCase().trim().includes(value.toUpperCase().trim()))||
            (item.postDate && item.postDate.toUpperCase().trim().includes(value.toUpperCase().trim()))||
            (item.openUrl2 && item.openUrl2.toUpperCase().trim().includes(value.toUpperCase().trim()))||
            (item.literalDetail && item.literalDetail.toUpperCase().trim().includes(value.toUpperCase().trim()))||
            (item.channel2 && item.channel2.toUpperCase().trim().includes(value.toUpperCase().trim()))||
            (item.literalCategory && item.literalCategory.toUpperCase().trim().includes(value.toUpperCase().trim()))
      ).map(item => {
        auxList.push(item)
      });
    } else if (subtype === 'ProvisionMessaging') {
      finalList.filter(item =>
        (item.subject && item.subject.toString().includes(value.toString().trim())) ||
        (item.sendDate && formatDateAndTime(item.sendDate).toUpperCase().trim().includes(value.toUpperCase().trim())) 
        ).map(item => {
        auxList.push(item)
      });
    } else if (subtype === 'Contracts') {
      finalList.filter(item =>
        (item.desProceso && item.desProceso.toUpperCase().toString().includes(value.toUpperCase().toString().trim())) ||
        (item.desComercializador && item.desComercializador.toUpperCase().trim().includes(value.toUpperCase().trim())) ||
        (item.estado && item.estado.toUpperCase().trim().includes(value.toUpperCase().trim())) ||
        (item.fecSolicitudFormated && item.fecSolicitudFormated.toUpperCase().trim().includes(value.toUpperCase().trim())) ||
        (item.detalle && item.detalle.toUpperCase().trim().includes(value.toUpperCase().trim()))  
        ).map(item => {
        auxList.push(item)
      });
    }else if (subtype === 'Directions') {
      finalList.filter(item => 
        (item.streetName && item.streetName.toUpperCase().toString().includes(value.toUpperCase().toString().trim())) ||
        (item.streetType && item.streetType.toUpperCase().toString().includes(value.toUpperCase().toString().trim())) ||
        (item.zipCode && item.zipCode.toUpperCase().toString().includes(value.toUpperCase().toString().trim()))        
      ).map(item => {
        auxList.push(item)
      });
    }


    if (auxList.length > 0 && value !== '') {
      setFinalList(auxList)
    } else if (subtype === 'warnings') {
      finalList.filter(item =>
        (item.provinceDesc + ' ' + item.number + ', ' + item.municipalityCode + ' ' + item.municipalityDesc + ' ' + item.streetDesc + ' ' + item.fecha + ' ' + item.cupsIncidence).includes(value.toUpperCase())
      ).map(item => {
        auxList.push(item)
      });
    }
    if (auxList.length > 0 && value !== '') {
      setFinalList(auxList)
      setChangeColor(false)
    } else {
      setFinalList(listItems)
      if (value !== '') {
        setChangeColor(true)
      } else {
        setChangeColor(false)
      }
    }

    // LCS: Enviar evento de GdC a GA - Wave 3
    let section_name = '', tab_name = '', subsection_name = ''
    switch(subtype){
      case 'suministro':
        section_name = 'mis suministros'
        tab_name = 'gestionados por mi'
        break;
      case 'peticion':
        section_name = 'mis peticiones'
        tab_name = sessionStorage.getItem('tab_selected')
        break;
      case 'solicitud':
        section_name = 'mi conexion a la red'
        tab_name = sessionStorage.getItem('tab_selected')
        break;
      case 'listBillsB':
        section_name = 'mi conexion a la red'
        break;
      case 'listBillsA':
        section_name = 'mi conexion a la red'
        break;
    }
    // LCS: Enviar evento de GdC a GA - Wave 3
    // LCS: input, caja de busqueda
    if (subtype == 'listBillsA') { //LCS: Número de expediente
      let billing_number = sessionStorage.getItem('billing_number')
      sendGAEvent({
        event: 'search',
        section_name: 'mi conexion a la red',
        subsection_name: 'mis facturas de conexion a la red',
        element_type: 'consulta de informacion',
        page_url: window.location.href,
        request_number: value,
        billing_number: billing_number && billing_number.length > 0 ? billing_number : 'no aplica',
        browsing_type: sessionStorage.getItem('browsing_type')
      })
      sessionStorage.setItem('request_number',value)
      setReqNumber(value)
    } else if (subtype == 'listBillsB') { // LCS: Número de factura
      let request_number = sessionStorage.getItem('request_number')
      let request_status = sessionStorage.getItem('provisionDossierStatus')
      if(window.location.href.includes('/provisions/detail')) {
        sendGAEvent({
          event: 'search',
          section_name: 'mi conexion a la red',
          subsection_name: 'detalle de solicitud',
          billing_number: value,
          element_type: 'consulta de informacion',
          page_url: window.location.href,
          request_number: request_number && request_number.length > 0 ? request_number : 'no aplica',
          request_status: request_status,
          module_name: 'facturas',
          browsing_type: sessionStorage.getItem('browsing_type')
        })
      } else {
        sendGAEvent({
          event: 'search',
          section_name: 'mi conexion a la red',
          subsection_name: 'mis facturas de conexion a la red',
          element_type: 'consulta de informacion',
          page_url: window.location.href,
          request_number: request_number && request_number.length > 0 ? request_number : 'no aplica',
          billing_number: value,
          browsing_type: sessionStorage.getItem('browsing_type')
        })
      }
      sessionStorage.setItem('billing_number',value)
      setBillNumber(value)
    } else if (subtype === 'Contracts') {
      sendGAEvent({
        event: 'search',
        section_name: 'mis suministros',
        subsection_name: 'solicitudes de contratacion',
        click_text: 'ver detalle',
        element_type: 'consulta de informacion',
        page_url: removeEmails(window.location.href),
        browsing_type: sessionStorage.getItem('browsing_type'),
        cups: CUPS,
        supply_type: supplyData ? (supplyData.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
        tab_name: props.tab_name,
        search_term: value
      })
    } else if (section_name != '') {
      sendGAEvent({
        event: 'search',
        section_name: section_name,
        search_term: value,
        element_type: 'consulta de informacion',
        page_url: removeEmails(window.location.href),
        tab_name: tab_name,
        browsing_type: sessionStorage.getItem('browsing_type')
      })
    }
  }

  useEffect(() => {
      setValueSearch('')
      if(updateFlag) {
        setUpdateFlag(false)
      }
  }, [updateFlag])

  const { setfinallist: setfinallist1, setcurrentpage, ...newprops } = props;

  return (
    <Grid item className={classes.container}>
      <Input
        className={!changeColor ? classes.input2 : classes.input3}
        value={valueSearch}
        label={label}
        onChange={(e) => handleInput(e.target.value)}
        type={'search'}
        {...newprops}
      />
    </Grid>
  )
}
export default DynamicSearcher
