import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import useStyles, { StyledTableCell } from './InterruptionsAlerts.styles';
import Spinner from '../../../../common/components/spinner/Spinner';
import { thunkGetAlertsSent, thunkGetConfiguredAlerts, thunkGetListProvinces, thunkGetUserDevice } from '../../../actions/ControlMensajeriaThunkActions';
import { useDispatch } from 'react-redux';
import { StyledTab, StyledTabSelector } from '../../../../common/components/styled-tab-selector/StyledTabSelector';
import Badge from '@material-ui/core/Badge';
import { StyledMobileTab } from '../../../../common/components/styled-tab-selector/styled-tab-selector-mobile/StyledTabSelectorMobile';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import DatepickerV3 from '../../../../common/components/datepickerV3/DatepickerV3';
import Button from '../../../../common/components/button/Button';
import DynamicSearcher from '../../../../common/components/searcher/DynamicSearcher';
import ArrowTooltip from '../../../../common/components/tooltip/arrow/ArrowTooltip';

import {
  extractDateFromDateAndHourString,
  extractHourFromDateAndHourString,
  formatDate,
  gettHourFromDate
} from '../../../../common/lib/FormatLib'
import Tooltip from '../../../../common/components/tooltip/Tooltip';

import XLSX from 'xlsx'

import OkIcon from '../../../../assets/icons/Interfaz_22_check_tick_validar_completo_verde.svg'
import ErrorIcon from '../../../../assets/icons/Interfaz_24_cruz_cerrar_error_rojo.svg'
import EmailIcon from '../../../../assets/icons/Interfaz_90_sobre_mail_correo_postal.svg'
import PhoneIcon from '../../../../assets/icons/Interfaz_108_contacto_telefono.svg'
import EnvelopeIcon from '../../../../assets/icons/Interfaz_126_correo_arroba.svg'
import SMSIcon from '../../../../assets/icons/Icon_sms.svg'
import AppICon from '../../../../assets/icons/Icon_app.svg'
import CheckIcon from '../../../../assets/icons/Icon_check_estado.svg'
import InfoIcon from '../../../../assets/icons/Icon_informacion_estado.svg'
import RelojIcon from '../../../../assets/icons/Icon_reloj_estado.svg'

import AddressIcon from '../../../../assets/icons/Icon_address.svg'
import BoundedIcon from '../../../../assets/icons/ico_Acotado.svg'
import AnyIcon from '../../../../assets/icons/ico_Cualquiera.svg'
import Pagination from '../../../../common/components/pagination/Pagination2';
import { thunkGetMasterData } from '../../../../gestionAverias/actions/GestionAveriasThunkActions';

const InterruptionsAlerts = (props: any) => {

  const { t } = useTranslation();
  const styles = useStyles({});
  const dispatch = useDispatch();
  const theme = useTheme()
  let diaAnterior: Date = new Date();
  diaAnterior.setDate(diaAnterior.getDate());

  const target = document.getElementById('number') as HTMLSelectElement

  const mobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [showCupsArrow, setShowCupsArrow] = useState(false)
  const [showDocumentArrow, setShowDocumentArrow] = useState(false)
  const [showStartDateArrow, setShowStartDateArrow] = useState(false)
  const [showEndDateArrow, setShowEndDateArrow] = useState(false)
  const [showAlertChosenArrow, setShowAlertChosenArrow] = useState(false)
  

  const [showScheduleArrow, setShowScheduleArrow] = useState(false)
  const [showAlertsNumberArrow, setShowAlertsNumberArrow] = useState(false)
  const [showChannelArrow, setShowChannelArrow] = useState(false)
  const [showDateAndHourEnvioArrow, setShowDateAndHourEnvioArrow] = useState(false)
  const [showDateAndHourArrow, setShowDateAndHourArrow] = useState(false)

  const [showIncidencesArrow, setShowIncidencesArrow] = useState(false)
  const [showTipoIncidencesArrow, setShowTipoIncidencesArrow] = useState(false)

  const [showEstadoArrow, setShowEstadoArrow] = useState(false)
  const [showStartDateEnvioArrow, setShowStartDateEnvioArrow] = useState(false)
  const [showDateWaitArrow, setShowDateWaitArrow] = useState(false)
  const [showIdentificadorArrow, setShowIdentificadorArrow] = useState(false)
  const [showTipoNotificacionArrow, setShowTipoNotificacionArrow] = useState(false)

  

  const [ordered, setOrdered] = useState('' as String)

  const [orderByCupsAsc, setOrderByCupsAsc] = useState(false)
  const [orderByDocumentAsc, setOrderByDocumentAsc] = useState(false)
  const [orderByStartDateAsc, setOrderByStartDateAsc] = useState(false)
  const [orderByEndDateAsc, setOrderByEndDateAsc] = useState(false)
  const [orderByAlertChosenAsc, setOrderByAlertChosenAsc] = useState(false)
  const [orderByScheduleAsc, setOrderByScheduleAsc] = useState(false)
  const [orderByAlertsNumberAsc, setOrderByAlertsNumberAsc] = useState(false)
  const [orderByTipoIncidenciaChosenlAsc, setOrderByTipoIncidenciaChosenAsc] = useState(false)

  const [orderByChannelAsc, setOrderByChannelAsc] = useState(false)
  const [orderByIdentificadorAsc, setOrderByIdentificadorAsc] = useState(false)
  const [orderByEstadoAsc, setOrderByEstadoAsc] = useState(false)
  const [orderByStartDateEnvioAsc, setOrderByStartDateEnvioAsc] = useState(false)
  const [orderByEndDateEnvioAsc, setOrderByEndDateEnvioAsc] = useState(false) 
  const [orderByTipoNotificacionAsc, setorderByTipoNotificacionAsc] = useState(false)
  const [orderByIdentificador, setOrdertIdentificador] = useState(false)


  const [orderByDateAndHourAsc, setOrderByDateAndHourAsc] = useState(false)
  const [orderByIncidencesAsc, setOrderByIncidencesAsc] = useState(false)



  const [directionNumber, setDirectionNumber] = useState('desc')

  const [isLoadingList, setIsLoadingList] = useState<boolean>(false)
  const [selectedTab, setSelectedTab] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [totalPagesFilter, setTotalPagesFilter] = useState(0)

  const [alertsVisible, setAlertsVisible] = useState(false)
  const [updateFlag, setUpdateFlag] = useState(false)

  const user = sessionStorage.getItem('userDocument')

  const restarDias = (date: any, dias: number) => {
    date.setDate(date.getDate() - dias)
    return date
  }

  const [datepickerDate1, setDatepickerDate1] = useState<Date>(restarDias(new Date(), 7));
  const [datepickerDate2, setDatepickerDate2] = useState<Date>(new Date());
  const [listItems, setListItems] = useState([] as any)
  const [listItemsFiltered, setListItemsFiltered] = useState([] as any)
  const [startItems, setStartItems] = useState<number>(0)
  const [endItems, setEndItems] = useState<number>(0)
  const [totalItems, setTotalItems] = useState<number>(0)
  const [UserDevice, setUserDevice] = useState([])

  var datesArray = []
  var datesArray2 = []

  const addCero = (str: number) => {
    if (str.toString().length === 1) {
      return '0' + str
    } else {
      return str
    }
  }

  const performSearch = () => {
    setIsLoadingList(true)

    getDates()
    setUpdateFlag(true)
    if (selectedTab === 0) {
      dispatch(thunkGetConfiguredAlerts(datesArray, (response) => {

        if (response) {
          setListItems(response.items)
          setListItemsFiltered(response.items)
        }

      }));

    } else if (selectedTab === 1) {
      dispatch(thunkGetAlertsSent(datesArray2, (response) => {

        if (response) {
          setListItems(response.items)
          setListItemsFiltered(response.items)
        }

      }));
    }
    setIsLoadingList(false)
  }

  const reverseDate = (date: string) => {
    let arrDateWithHour = date.split(' ')
    let arrDate = arrDateWithHour[0].split('-')
    let dateFormatted = (arrDate[2] + '/' + arrDate[1] + '/' + arrDate[0])
    if(arrDateWithHour.length > 1){
      dateFormatted = (dateFormatted + ' ' + splitHour(arrDateWithHour[1]) + 'h')
    }
    return dateFormatted
  }

  const reverseDate2 = (date: string) => {
    let arrDate = date.split('-')
    return (arrDate[2] + '/' + arrDate[1] + '/' + arrDate[0])
  }

  const splitHour = (hour: string) => {
    let arrHour = hour.split(':')
    return (arrHour[0] + ':' + arrHour[1])
  }
  const splitHour2 = (hour: string) => {
    let arrHour = hour.split(':')
    return (arrHour[0] + ':' + arrHour[1])
  }

  const splitDateAndHour = (dateAndHour: string) => {
    let splittedDateAndHour = dateAndHour.split(' ')
    let date = splittedDateAndHour[0]
    let hour = splittedDateAndHour[1]

    return (reverseDate(date) + ' ' + splitHour(hour) + 'h')
  }
  const splitDateWait = (dateWait: string) => {
    let splittedDateWait = dateWait.split(' ')
    let date = splittedDateWait[0]
    let hour = splittedDateWait[1]

    return (reverseDate2(date) + ' ' + splitHour2(hour) + 'h')
  }


  const getDates = () => {
    let startDate = datepickerDate1.getTime()
    let endDate = datepickerDate2.getTime()

    let auxDate = new Date()
    let auxDatesArray = []
    let auxDatesArray2 = []

    while (endDate >= startDate) {
      auxDate.setTime(startDate)
      auxDatesArray.push(auxDate.getFullYear() + '-' + addCero((auxDate.getMonth() + 1)) + '-' + addCero(auxDate.getDate()))
      auxDatesArray2.push(addCero(auxDate.getDate()) + '/' + addCero((auxDate.getMonth() + 1)) + '/' + auxDate.getFullYear())
      startDate = startDate + (1000 * 60 * 60 * 24)
    }

    if (auxDatesArray.length === 0) {
      auxDate.setTime(startDate)
      auxDatesArray.push(auxDate.getFullYear() + '-' + addCero((auxDate.getMonth() + 1)) + '-' + addCero(auxDate.getDate()))
      auxDatesArray2.push(addCero(auxDate.getDate()) + '/' + addCero((auxDate.getMonth() + 1)) + '/' + auxDate.getFullYear())
    }

    datesArray = auxDatesArray
    datesArray2 = auxDatesArray2
  }

  const setTabs = (tab: number) => {
    setStartItems(0)
    setEndItems(0)
    setTotalItems(0)
    setCurrentPage(0)
    setItemsPerPage(20)
    setTotalPagesFilter(0)
    setListItems([])
    setListItemsFiltered([])

    setShowAlertChosenArrow(false)
    setShowAlertsNumberArrow(false)
    setShowChannelArrow(false)
    setShowCupsArrow(false)
    setShowDateAndHourArrow(false)
    setShowDocumentArrow(false)
    setShowIncidencesArrow(false)
    setShowScheduleArrow(false)
    setShowStartDateArrow(false)
    setShowEndDateArrow(false)

    setSelectedTab(tab)
  }

  const onChangeSelector = () => {
    setCurrentPage(0)
    setItemsPerPage(Number(target.options[target.selectedIndex].value))
  }

  const handleExport = () => {

    const rows = [] as any
    let ws
    let fileName

    // Filtrado del listItems
    (listItemsFiltered && listItemsFiltered.length > 0) && listItemsFiltered.map((item, index) => {
      if (selectedTab === 0) {
        rows.push({
          cups: item.cups ? item.cups : '',
          documentNumber: item.docId ? item.docId : '',
          fechaAlta: item.fechaAlta ? reverseDate(item.fechaAlta) : '',
          fechaBaja: item.fechaBaja ? reverseDate(item.fechaBaja) : '',
          option: item.tipoCanal ? item.tipoCanal : '',
          schedule: item.schedule ? (item.tooltip ? item.schedule + ' (' + item.tooltip + ') ' : item.schedule) : '',
          alertsNumber: item.alertsNumber ? item.alertsNumber : ''
        })
      } else if (selectedTab === 1) {
        rows.push({
          cups: item.cups ? item.cups : '',
          documentNumber: item.docId ? item.docId : '',
          incidence: item.incidence ? item.incidence : '',
          tipoAvsio: item.tipoAviso ? item.tipoAviso : '',
          estado: 
          item.estadoAviso === 'OK' ?
            'OK - Envío correcto'
            : item.estadoAviso === 'P' ?
            'P - Pendiente'
            : item.estadoAviso === 'BI' ?
            'BI - Omitido por baja tensión inactivo'
            : item.estadoAviso === 'MI' ?
            'MI - Omitido por media tensión inactivo'
            : item.estadoAviso === 'OT' ?
            'OT - Omitido por distinto titular'
            :item.estadoAviso === 'SU' ?
            'SU - Omitido por suministro único'
            :item.estadoAviso === 'TP' ?
            'TP - Omitido por trabajo planificado'
            :item.estadoAviso === 'TE' ?
            'TE - Omitido por temporal'
            :item.estadoAviso === 'VS' ?
            'VS - Omitido por modo de validación sin destinatario'
            :item.estadoAviso === 'SD' ?
            'SD - Omitido sin dispositivo'
            :item.estadoAviso === 'AN' ?
            'AN - Anuladas'
            :
            '',
          //falta por definir
          tipoNotificacion:
          item.tipoNotificacion === 'EMAIL193' ?
            'Apertura'
            : item.tipoNotificacion === 'EMAIL194' ?
            'Envío único'
            : item.tipoNotificacion === 'EMAIL195' ?
            'Cierre'
                : '',
        
          channel: 
          item.channel === 'sms' ?
          'sms - '+ item.addressee
          : item.channel === 'email' ?
          'email - '+ item.addressee
          : item.channel === 'push' ?
          item.channel
              : '',

          dateAndHour: item.dateAndHour ? splitDateAndHour(item.dateAndHour) : '',
          dateWait: item.dateWait ? splitDateAndHour(item.dateWait) : '',
          identificador: item.estadoIncidencia === 'En resolución'  ? 'Sí' :'No'
      
        })
      }
    })

    if (selectedTab === 0) {
      // Seteamos la cabecera


      ws = XLSX.utils.json_to_sheet(rows, {
        header: [
          'cups',
          'documentNumber',
          'fechaAlta',
          'fechaBaja',
          'option',
          'schedule',
          'alertsNumber'
        ]
      })

      ws['A1'].v = t('controlMensajeria.interruptions.cupsList.cups')
      ws['B1'].v = t('controlMensajeria.interruptions.cupsList.docNumber')
      ws['C1'].v = t('controlMensajeria.interruptions.cupsList.date1')
      ws['D1'].v = t('controlMensajeria.interruptions.cupsList.date2')
      ws['E1'].v = t('controlMensajeria.interruptions.cupsList.option')
      ws['F1'].v = t('controlMensajeria.interruptions.cupsList.schedule')
      ws['G1'].v = t('controlMensajeria.interruptions.cupsList.alertsNumber')

    } else if (selectedTab === 1) {
      // Seteamos la cabecera
      ws = XLSX.utils.json_to_sheet(rows, {
        header: [
          'cups',
          'documentNumber',
          'incidence',
          'tipoAvsio',
          'tipoNotificacion',
          'estado',
          'dateAndHour',
          'channel',         
          'dateWait',
          'identificador'
          
          
        ]
      })

      ws['A1'].v = t('controlMensajeria.interruptions.emailSmsList.cups')
      ws['B1'].v = t('controlMensajeria.interruptions.emailSmsList.docNumber')
      ws['C1'].v = t('controlMensajeria.interruptions.emailSmsList.incidence')
      ws['D1'].v = t('controlMensajeria.interruptions.emailSmsList.tipoIncidencia')
      ws['E1'].v = t('controlMensajeria.interruptions.emailSmsList.tipoNotificacion')
      ws['F1'].v = t('controlMensajeria.interruptions.emailSmsList.estado')
      ws['G1'].v = t('controlMensajeria.interruptions.emailSmsList.fechaEstado')
      ws['H1'].v = t('controlMensajeria.interruptions.emailSmsList.channel')
      ws['I1'].v = t('controlMensajeria.interruptions.emailSmsList.fechaEnvio')
      ws['J1'].v = t('controlMensajeria.interruptions.emailSmsList.IndicadorResolucion')


    }

    fileName = 'ResultadoConsulta.xlsx'

    const wb = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(wb, ws, 'Resultados Consulta')

    XLSX.writeFile(wb, fileName)

  }
    //ordenamos a partir de la columna estado
    const orderByEstado = () => {
      setOrdered('Estado')
      setShowEstadoArrow(true)
      setShowIdentificadorArrow(false)
      setShowTipoNotificacionArrow(false)
      setShowAlertChosenArrow(false)
      setShowAlertsNumberArrow(false)
      setShowChannelArrow(false)
      setShowCupsArrow(false)
      setShowDateAndHourArrow(false)
      setShowDateWaitArrow(false)
      setShowDocumentArrow(false)
      setShowIncidencesArrow(false)
      setShowScheduleArrow(false)
      setShowEndDateArrow(false)
      setShowEndDateArrow(false)
  
      setDirectionNumber('desc')
      setCurrentPage(0)
      if (orderByEstadoAsc) {
        setListItemsFiltered([].concat(listItemsFiltered).sort().reverse())
        setListItems([].concat(listItems).sort().reverse())
        setOrderByEstadoAsc(false)
        setDirectionNumber('asc')
      } else {
        setListItemsFiltered([].concat(listItemsFiltered).sort((a, b) => a.estadoAviso.localeCompare(b.estadoAviso)))
        setListItems([].concat(listItems).sort((a, b) => a.estadoAviso.localeCompare(b.estadoAviso)))
        setOrderByEstadoAsc(true)
        setDirectionNumber('desc')
      }
    }
    //ordenamos a partir de la columna tipo de incidencia
    const orderByTipoAvisoChosen = () => {
      setOrdered('AlertTipoIncidencia')
      setShowIdentificadorArrow(true)
      setShowEstadoArrow(false)
      setShowDateWaitArrow(false)

      setShowAlertChosenArrow(false)
      setShowAlertsNumberArrow(false)
      setShowChannelArrow(false)
      setShowCupsArrow(false)
      setShowDateAndHourArrow(false)
      setShowDocumentArrow(false)
      setShowIncidencesArrow(false)
      setShowScheduleArrow(false)
      setShowTipoNotificacionArrow(false)
      setShowEndDateArrow(false)
      setShowEndDateArrow(false)

      setDirectionNumber('desc')
      setCurrentPage(0)
      if (orderByTipoIncidenciaChosenlAsc) {
        setListItemsFiltered([].concat(listItemsFiltered).sort().reverse())
        setListItems([].concat(listItems).sort().reverse())
        setOrderByTipoIncidenciaChosenAsc(false)
        setDirectionNumber('asc')
      } else {
        setListItemsFiltered([].concat(listItemsFiltered).sort((a, b) => a.tipoAviso.localeCompare(b.tipoAviso)))
        setListItems([].concat(listItems).sort((a, b) => a.tipoAviso.localeCompare(b.tipoAviso)))
        setOrderByTipoIncidenciaChosenAsc(true)
        setDirectionNumber('desc')
      }
    
    }

   //ordenamos a partir de una de las columnas de fecha envio
    const orderByDateWaitEnvio = () => {
    setOrdered('dateWait')
    setShowDateWaitArrow(true)
    setShowIdentificadorArrow(false)
    setShowAlertChosenArrow(false)
    setShowEstadoArrow(false)
    setShowAlertsNumberArrow(false)
    setShowChannelArrow(false)
    setShowCupsArrow(false)
    setShowTipoNotificacionArrow(false)
    setShowDateAndHourArrow(false)
    setShowDocumentArrow(false)
    setShowIncidencesArrow(false)
    setShowScheduleArrow(false)
    setShowEndDateArrow(false)
   

    setDirectionNumber('desc')
    setCurrentPage(0)

    if (orderByDateAndHourAsc) {
      setListItemsFiltered([].concat(listItemsFiltered).sort().reverse())
      setListItems([].concat(listItems).sort().reverse())
      setOrderByDateAndHourAsc(false)
      setDirectionNumber('asc')
      setShowDateAndHourArrow(true)
    } else {
      const auxList = listItems.sort(function (a, b) {
        let aa = a.dateWait.split('-') // Formato con el que llega la fecha: dd-mm-yyyy hh:mm:ss
        aa = aa[0].substring(0, 4) + '-' + aa[1] + '-' + aa[2].substring(0, 2) + ' ' + aa[2].substring(3, 8)
   

        let bb = b.dateWait.split('-')
        bb = bb[0].substring(0, 4) + '-' + bb[1] + '-' + bb[2].substring(0, 2) + ' ' + bb[2].substring(3, 8)



        return aa.localeCompare('bb:'+bb)
      })
      setListItemsFiltered(auxList)
      setListItems(auxList)
      setOrderByDateAndHourAsc(true)
      setDirectionNumber('desc')
      setShowDateAndHourArrow(true)
    }

  }
   //ordenamos a partir de una de las columnas de fecha estado
   const orderByDateAndHour = () => {
    setOrdered('DateAndHour')
    setShowAlertChosenArrow(false)
    setShowDateWaitArrow(false)
    setShowEstadoArrow(false)
    setShowIdentificadorArrow(false)
    setShowAlertsNumberArrow(false)
    setShowChannelArrow(false)
    setShowCupsArrow(false)
    setShowDateAndHourArrow(true)
    setShowDocumentArrow(false)
    setShowIncidencesArrow(false)
    setShowScheduleArrow(false)
    setShowEndDateArrow(false)
    setShowEndDateArrow(false)
    setShowTipoNotificacionArrow(false)

    setDirectionNumber('desc')
    setCurrentPage(0)

    if (orderByDateAndHourAsc) {
      setListItemsFiltered([].concat(listItemsFiltered).sort().reverse())
      setListItems([].concat(listItems).sort().reverse())
      setOrderByDateAndHourAsc(false)
      setDirectionNumber('asc')
      setShowDateAndHourArrow(true)
    } else {
      const auxList = listItems.sort(function (a, b) {
        let aa = a.dateAndHour.split('-') // Formato con el que llega la fecha: dd-mm-yyyy hh:mm:ss
        aa = aa[0].substring(0, 4) + '-' + aa[1] + '-' + aa[2].substring(0, 2) + ' ' + aa[2].substring(3, 8)

        let bb = b.dateAndHour.split('-')
        bb = bb[0].substring(0, 4) + '-' + bb[1] + '-' + bb[2].substring(0, 2) + ' ' + bb[2].substring(3, 8)

        return aa.localeCompare(bb)
      })
      setListItemsFiltered(auxList)
      setListItems(auxList)
      setOrderByDateAndHourAsc(true)
      setDirectionNumber('desc')
      setShowDateAndHourArrow(true)
    }

  }
    //ordenamos a partir de la columna Tipo notificacion 
    const orderByTipoNotificacion = () => {
      setOrdered('TipoNotificacion')
      setShowTipoNotificacionArrow(true)
      setShowIdentificadorArrow(false)
      setShowEstadoArrow(false)
      setShowDateWaitArrow(false)
      setShowAlertChosenArrow(false)
      setShowAlertsNumberArrow(false)
      setShowChannelArrow(false)
      setShowCupsArrow(false)
      setShowDateAndHourArrow(false)
      setShowDocumentArrow(false)
      setShowIncidencesArrow(false)
      setShowScheduleArrow(false)
      setShowEndDateArrow(false)
      setShowEndDateArrow(false)
  
      setDirectionNumber('desc')
      setCurrentPage(0)
      if (orderByTipoNotificacionAsc) {
        setListItemsFiltered([].concat(listItemsFiltered).sort().reverse())
        setListItems([].concat(listItems).sort().reverse())
        setorderByTipoNotificacionAsc(false)
        setDirectionNumber('asc')
      } else {
        setListItemsFiltered([].concat(listItemsFiltered).sort((a, b) => a.tipoNotificacion.localeCompare(b.tipoNotificacion)))
        setListItems([].concat(listItems).sort((a, b) => a.tipoNotificacion.localeCompare(b.tipoNotificacion)))
        setorderByTipoNotificacionAsc(true)
        setDirectionNumber('desc')
      }
    }
    //ordenamos a partir de la columna Identificador 
  const orderByIdentifica = () => {
    setOrdered('Identificador')
    setShowIdentificadorArrow(true)
    setShowAlertChosenArrow(false)
    setShowAlertsNumberArrow(false)
    setShowEstadoArrow(false)
    setShowDateWaitArrow(false)
    setShowChannelArrow(false)
    setShowCupsArrow(false)
    setShowDateAndHourArrow(false)
    setShowTipoNotificacionArrow(false)
    setShowDocumentArrow(false)
    setShowIncidencesArrow(false)
    setShowScheduleArrow(false)
    setShowEndDateArrow(false)
    setShowEndDateArrow(false)

    setDirectionNumber('desc')
    setCurrentPage(0)
    if (orderByIdentificadorAsc) {
      setListItemsFiltered([].concat(listItemsFiltered).sort().reverse())
      setListItems([].concat(listItems).sort().reverse())
      setOrderByIdentificadorAsc(false)
      setDirectionNumber('asc')
    } else {
      setListItemsFiltered([].concat(listItemsFiltered).sort((a, b) => a.estadoIncidencia.localeCompare(b.estadoIncidencia)))
      setListItems([].concat(listItems).sort((a, b) => a.estadoIncidencia.localeCompare(b.estadoIncidencia)))
      setOrderByIdentificadorAsc(true)
      setDirectionNumber('desc')
    }
  }

  //ordenamos a partir de la columna Incidencias
  const orderByIncidences = () => {
    setOrdered('Incidences')
    setShowAlertChosenArrow(false)
    setShowDateWaitArrow(false)
    setShowEstadoArrow(false)
    setShowIdentificadorArrow(false)
    setShowAlertsNumberArrow(false)
    setShowChannelArrow(false)
    setShowCupsArrow(false)
    setShowDateAndHourArrow(false)
    setShowTipoNotificacionArrow(false)
    setShowDocumentArrow(false)
    setShowIncidencesArrow(true)
    setShowScheduleArrow(false)
    setShowEndDateArrow(false)
    setShowEndDateArrow(false)

    setDirectionNumber('desc')
    setCurrentPage(0)
    if (orderByIncidencesAsc) {
      setListItemsFiltered([].concat(listItemsFiltered).sort().reverse())
      setListItems([].concat(listItems).sort().reverse())
      setOrderByIncidencesAsc(false)
      setDirectionNumber('asc')
    } else {
      setListItemsFiltered([].concat(listItemsFiltered).sort((a, b) => a.incidence.localeCompare(b.incidence)))
      setListItems([].concat(listItems).sort((a, b) => a.incidence.localeCompare(b.incidence)))
      setOrderByIncidencesAsc(true)
      setDirectionNumber('desc')
    }
  }


  //ordenamos a partir de la columna Documento
  const orderByDocument = () => {
    setOrdered('Document')
    setShowAlertChosenArrow(false)
    setShowEstadoArrow(false)
    setShowAlertsNumberArrow(false)
    setShowChannelArrow(false)
    setShowDateWaitArrow(false)
    setShowCupsArrow(false)
    setShowDateAndHourArrow(false)
    setShowDocumentArrow(true)
    setShowIncidencesArrow(false)
    setShowTipoNotificacionArrow(false)
    setShowScheduleArrow(false)
    setShowEndDateArrow(false)
    setShowEndDateArrow(false)
    setShowIdentificadorArrow(false)

    setDirectionNumber('desc')
    setCurrentPage(0)
    if (orderByDocumentAsc) {
      setListItemsFiltered([].concat(listItemsFiltered).sort().reverse())
      setListItems([].concat(listItems).sort().reverse())
      setOrderByDocumentAsc(false)
      setDirectionNumber('asc')
    } else {
      setListItemsFiltered([].concat(listItemsFiltered).sort((a, b) => a.docId.localeCompare(b.docId)))
      setListItems([].concat(listItems).sort((a, b) => a.docId.localeCompare(b.docId)))
      setOrderByDocumentAsc(true)
      setDirectionNumber('desc')
    }
  }

  //ordenamos a partir de la columna Cups
  const orderByCups = () => {
    setOrdered('Cups')
    setShowAlertChosenArrow(false)
    setShowAlertsNumberArrow(false)
    setShowChannelArrow(false)
    setShowEstadoArrow(false)
    setShowIdentificadorArrow(false)
    setShowDateWaitArrow(false)
    setShowCupsArrow(true)
    setShowDateAndHourArrow(false)
    setShowDocumentArrow(false)
    setShowIncidencesArrow(false)
    setShowScheduleArrow(false)
    setShowTipoNotificacionArrow(false)
    setShowEndDateArrow(false)
    setShowEndDateArrow(false)

    setDirectionNumber('desc')
    setCurrentPage(0)
    if (orderByCupsAsc) {
      setListItemsFiltered([].concat(listItemsFiltered).sort().reverse())
      setListItems([].concat(listItems).sort().reverse())
      setOrderByCupsAsc(false)
      setDirectionNumber('asc')
    } else {
      setListItemsFiltered([].concat(listItemsFiltered).sort((a, b) => a.cups.localeCompare(b.cups)))
      setListItems([].concat(listItems).sort((a, b) => a.cups.localeCompare(b.cups)))
      setOrderByCupsAsc(true)
      setDirectionNumber('desc')
    }
  }


  //ordenamos a partir de la columna Horario elegido
  const orderBySchedule = () => {
    setOrdered('Schedule')
    setShowAlertChosenArrow(false)
    setShowAlertsNumberArrow(false)
    setShowEstadoArrow(false)
    setShowIdentificadorArrow(false)
    setShowChannelArrow(false)
    setShowCupsArrow(false)
    setShowDateWaitArrow(false)
    setShowDateAndHourArrow(false)
    setShowDocumentArrow(false)
    setShowTipoNotificacionArrow(false)
    setShowIncidencesArrow(false)
    setShowScheduleArrow(true)
    setShowEndDateArrow(false)
    setShowEndDateArrow(false)

    setDirectionNumber('desc')
    setCurrentPage(0)
    if (orderByScheduleAsc) {
      setListItemsFiltered([].concat(listItemsFiltered).sort().reverse())
      setListItems([].concat(listItems).sort().reverse())
      setOrderByScheduleAsc(false)
      setDirectionNumber('asc')
    } else {
      setListItemsFiltered([].concat(listItemsFiltered).sort((a, b) => a.schedule.localeCompare(b.schedule)))
      setListItems([].concat(listItems).sort((a, b) => a.schedule.localeCompare(b.schedule)))
      setOrderByScheduleAsc(true)
      setDirectionNumber('desc')
    }
  }

  //ordenamos a partir de la columna Alertas enviadas
  const orderByAlertsNumber = () => {
    setOrdered('AlertsNumber')
    setShowAlertChosenArrow(false)
    setShowAlertsNumberArrow(true)
    setShowChannelArrow(false)
    setShowEstadoArrow(false)
    setShowIdentificadorArrow(false)
    setShowCupsArrow(false)
    setShowDateAndHourArrow(false)
    setShowDocumentArrow(false)
    setShowDateWaitArrow(false)
    setShowIncidencesArrow(false)
    setShowTipoNotificacionArrow(false)
    setShowScheduleArrow(false)
    setShowEndDateArrow(false)
    setShowEndDateArrow(false)
    setDirectionNumber('desc')
    setCurrentPage(0)
    if (orderByAlertsNumberAsc) {
      setListItemsFiltered([].concat(listItemsFiltered).sort().reverse())
      setListItems([].concat(listItems).sort().reverse())
      setOrderByAlertsNumberAsc(false)
      setDirectionNumber('asc')
    } else {
      setListItemsFiltered([].concat(listItemsFiltered).sort((a, b) => a.alertsNumber.localeCompare(b.alertsNumber)))
      setListItems([].concat(listItems).sort((a, b) => a.alertsNumber.localeCompare(b.alertsNumber)))
      setOrderByAlertsNumberAsc(true)
      setDirectionNumber('desc')
    }
  }

  
  //ordenamos a partir de la columna opcion
  const orderByAlertChosen = () => {
    setOrdered('AlertChosen')
    setShowAlertChosenArrow(true)
    setShowAlertsNumberArrow(false)
    setShowEstadoArrow(false)
    setShowIdentificadorArrow(false)
    setShowChannelArrow(false)
    setShowCupsArrow(false)
    setShowDateAndHourArrow(false)
    setShowDateWaitArrow(false)
    setShowDocumentArrow(false)
    setShowTipoNotificacionArrow(false)
    setShowIncidencesArrow(false)
    setShowScheduleArrow(false)
    setShowEndDateArrow(false)
    setShowEndDateArrow(false)

    setDirectionNumber('desc')
    setCurrentPage(0)
    if (orderByAlertChosenAsc) {
      setListItemsFiltered([].concat(listItemsFiltered).sort().reverse())
      setListItems([].concat(listItems).sort().reverse())
      setOrderByAlertChosenAsc(false)
      setDirectionNumber('asc')
    } else {
      setListItemsFiltered([].concat(listItemsFiltered).sort((a, b) => a.tipoCanal.localeCompare(b.tipoCanal)))
      setListItems([].concat(listItems).sort((a, b) => a.tipoCanal.localeCompare(b.tipoCanal)))
      setOrderByAlertChosenAsc(true)
      setDirectionNumber('desc')
    }
  }

  //ordenamos a partir de la columna canal
  const orderByChannel = () => {
    setOrdered('Channel')
    setShowAlertChosenArrow(false)
    setShowAlertsNumberArrow(false)
    setShowEstadoArrow(false)
    setShowIdentificadorArrow(false)
    setShowChannelArrow(true)
    setShowCupsArrow(false)
    setShowDateAndHourArrow(false)
    setShowDocumentArrow(false)
    setShowDateWaitArrow(false)
    setShowIncidencesArrow(false)
    setShowScheduleArrow(false)
    setShowEndDateArrow(false)
    setShowTipoNotificacionArrow(false)
    setShowEndDateArrow(false)

    setDirectionNumber('desc')
    setCurrentPage(0)
    if (orderByChannelAsc) {
      setListItemsFiltered([].concat(listItemsFiltered).sort().reverse())
      setListItems([].concat(listItems).sort().reverse())
      setOrderByChannelAsc(false)
      setDirectionNumber('asc')
    } else {
      setListItemsFiltered([].concat(listItemsFiltered).sort((a, b) => a.channel.localeCompare(b.channel)))
      setListItems([].concat(listItems).sort((a, b) => a.channel.localeCompare(b.channel)))
      setOrderByChannelAsc(true)
      setDirectionNumber('desc')
    }
  }
  
  //ordenamos a partir de una de las columnas de fecha
  const orderByDate = (dateType) => {
    setShowAlertChosenArrow(false)
    setShowAlertsNumberArrow(false)
    setShowChannelArrow(false)
    setShowCupsArrow(false)
    setShowDateAndHourArrow(false)
    setShowIdentificadorArrow(false)
    setShowTipoNotificacionArrow(false)
    setShowDateWaitArrow(false)
    setShowDocumentArrow(false)
    setShowIncidencesArrow(false)
    setShowEstadoArrow(false)
    setShowScheduleArrow(false)
    setShowIdentificadorArrow(false)

    setDirectionNumber('desc')
    setCurrentPage(0)

    if (dateType === 'StartDate') {  //  FECHA INICIO
      setOrdered('StartDate')
      if (orderByStartDateAsc) {
        setListItemsFiltered([].concat(listItemsFiltered).sort().reverse())

        setListItems([].concat(listItems).sort().reverse())
        setOrderByStartDateAsc(false)
        setDirectionNumber('asc')
        setShowStartDateArrow(true)
        setShowEndDateArrow(false)
      } else {
        const auxList = listItems.sort(function (a, b) {
          let aa = a.fechaAlta.split('-') // Formato con el que llega la fecha: dd-mm-yyyy
          aa = aa[2] + '-' + aa[1] + '-' + aa[0] //Pasamos a yyyy-mm-dd

          let bb = b.fechaAlta.split('-')
          bb = bb[2] + '-' + bb[1] + '-' + bb[0]

          return aa.localeCompare(bb)
        })

        const auxList2 = listItemsFiltered.sort(function (a, b) {
          let aa = a.fechaAlta.split('-') // Formato con el que llega la fecha: dd-mm-yyyy
          aa = aa[2] + '-' + aa[1] + '-' + aa[0] //Pasamos a yyyy-mm-dd

          let bb = b.fechaAlta.split('-')
          bb = bb[2] + '-' + bb[1] + '-' + bb[0]

          return aa.localeCompare(bb)
        })

        setListItemsFiltered(auxList2)
        setListItems(auxList)
        setOrderByStartDateAsc(true)
        setDirectionNumber('desc')
        setShowStartDateArrow(true)
        setShowEndDateArrow(false)
      }
    }
    else {  //FECHA FIN
      setOrdered('EndDate')
      if (orderByEndDateAsc) {
        setListItemsFiltered([].concat(listItemsFiltered).sort().reverse())
        setListItems([].concat(listItems).sort().reverse())
        setOrderByEndDateAsc(false)
        setDirectionNumber('asc')
        setShowEndDateArrow(true)
        setShowStartDateArrow(false)
      }
      else {
        const auxListFechaBajaSI = listItems.filter(item => item.fechaBaja && item.fechaBaja !== '')
        const auxListFechaBajaNO = listItems.filter(item => !item.fechaBaja || item.fechaBaja === '')

        const auxListFechaBajaSI2 = listItemsFiltered.filter(item => item.fechaBaja && item.fechaBaja !== '')
        const auxListFechaBajaNO2 = listItemsFiltered.filter(item => !item.fechaBaja || item.fechaBaja === '')

        const auxList = auxListFechaBajaSI.sort(function (a, b) {
          let aa = a.fechaBaja.split('-') // Formato con el que llega la fechaMsm: dd/mm/yyyy hh:mm:ss
          aa = aa[2] + '-' + aa[1] + '-' + aa[0]

          let bb = b.fechaBaja.split('-')
          bb = bb[2] + '-' + bb[1] + '-' + bb[0]

          return aa.localeCompare(bb)
        })

        const auxList2 = auxListFechaBajaSI2.sort(function (a, b) {
          let aa = a.fechaBaja.split('-') // Formato con el que llega la fechaMsm: dd/mm/yyyy hh:mm:ss
          aa = aa[2] + '-' + aa[1] + '-' + aa[0]

          let bb = b.fechaBaja.split('-')
          bb = bb[2] + '-' + bb[1] + '-' + bb[0]

          return aa.localeCompare(bb)
        })

        auxList.push(...auxListFechaBajaNO)
        setListItemsFiltered(auxList2)
        setListItems(auxList)
        setOrderByEndDateAsc(true)
        setDirectionNumber('desc')
        setShowEndDateArrow(true)
        setShowStartDateArrow(false)
      }
    }
  }

  const changeHoverOver = (type: String, value: boolean) => {
    switch (type) {
        case 'Estado':
          setShowEstadoArrow(value)
          break
      case 'AlertTipoIncidencia':
        setShowIdentificadorArrow(value)
        break
      case 'TipoNotificacion':
        setShowTipoNotificacionArrow(value)
        break
      case 'DateAndHour':
        setShowDateAndHourArrow(value)
        break
        case 'DateAndHourEnvio':
        setShowDateAndHourEnvioArrow(value)
        break
      case 'Incidences':
        setShowIncidencesArrow(value)
        break
      case 'Document':
        setShowDocumentArrow(value)
        break
      case 'Cups':
        setShowCupsArrow(value)
        break
      case 'Schedule':
        setShowScheduleArrow(value)
        break
      case 'AlertsNumber':
        setShowAlertsNumberArrow(value)
        break
      case 'AlertChosen':
        setShowAlertChosenArrow(value)
        break
      case 'StartDate':
        setShowStartDateArrow(value)
        break
      case 'EndDate':
        setShowEndDateArrow(value)
        break
      case 'Channel':
        setShowChannelArrow(value)
        break

    }
  }

  const changeHoverLeave = (type: String) => {
    switch (type) {
      case 'DateAndHour':
        if (type === ordered) {
          setShowDateAndHourArrow(true)
        } else {
          setShowDateAndHourArrow(false)
        }
        break
        case 'DateAndHourEnvio':
          if (type === ordered) {
            setShowDateAndHourEnvioArrow(true)
          } else {
            setShowDateAndHourEnvioArrow(false)
          }
          break
      case 'Incidences':
        if (type === ordered) {
          setShowIncidencesArrow(true)
        } else {
          setShowIncidencesArrow(false)
        }
        break
        case 'TipoIncidencia':
        if (type === ordered) {
          setShowTipoIncidencesArrow(true)
        } else {
          setShowTipoIncidencesArrow(false)
        }
        break
      case 'Document':
        if (type === ordered) {
          setShowDocumentArrow(true)
        } else {
          setShowDocumentArrow(false)
        }
        break
      case 'Cups':
        if (type === ordered) {
          setShowCupsArrow(true)
        } else {
          setShowCupsArrow(false)
        }
        break
      case 'Schedule':
        if (type === ordered) {
          setShowScheduleArrow(true)
        } else {
          setShowScheduleArrow(false)
        }
        break
      case 'AlertsNumber':
        if (type === ordered) {
          setShowAlertsNumberArrow(true)
        } else {
          setShowAlertsNumberArrow(false)
        }
        break
      case 'AlertChosen':
        if (type === ordered) {
          setShowAlertChosenArrow(true)
        } else {
          setShowAlertChosenArrow(false)
        }
        break
      case 'StartDate':
        if (type === ordered) {
          setShowStartDateArrow(true)
        } else {
          setShowStartDateArrow(false)
        }
        break
      case 'EndDate':
        if (type === ordered) {
          setShowEndDateArrow(true)
        } else {
          setShowEndDateArrow(false)
        }
        break
      case 'Channel':
        if (type === ordered) {
          setShowChannelArrow(true)
        } else {
          setShowChannelArrow(false)
        }
        break

    }
  }

  useEffect(() => {
    dispatch(thunkGetMasterData('EnabledUsersForAlerts', 'ES', 'ENABLED_USERS', (response) => {
      if (response && response.length > 0) {
        let users
        response.map(item => {
          users = item.value
        })
        let usersSplit = users.split(',')
        for (let i = 0; i < usersSplit.length; i++) {
          if (usersSplit[i] === user) {
            setAlertsVisible(true)
          }
        }
      }
    }))
  }, [])

  useEffect(() => {
    setTotalPagesFilter(listItemsFiltered.length === 0 ? 1 : Math.ceil(listItemsFiltered.length / itemsPerPage))
    setTotalItems(listItemsFiltered.length)


    handleSetItems()
  }, [listItemsFiltered.length, itemsPerPage])

  useEffect(() => {
    handleSetItems()
  }, [currentPage, itemsPerPage, listItemsFiltered.length])

  const handleSetItems = () => {
    let AendItems = (currentPage + 1) * itemsPerPage
    let AstartItems = AendItems - itemsPerPage + 1

    if (AendItems > listItemsFiltered.length) {
      AendItems = listItemsFiltered.length
    }

    setEndItems(AendItems)
    setStartItems(AstartItems)
  }

  return (
    <>
      {
        isLoadingList &&
        <Spinner fixed={true} />
      }

      <Grid justify='center' alignItems='center'>
        <Grid item xs={12} sm={10} className={styles.maxWidthForBigScreens}>

          <Grid item className={styles.headerTitle}>
            {t('controlMensajeria.interruptions.title')}
          </Grid>

          <Grid container direction='column' justify='space-between'>
            <Grid container justify='center' className={styles.inputsAreaWrapper}>
              <Grid container className={styles.inputsArea}>
                <Grid container >
                  <StyledTabSelector
                    className={styles.tabs}
                    value={selectedTab}
                    onChange={(event, tab) => setTabs(tab)}
                    indicatorColor='primary'
                    textColor='primary'
                    orientation={mobile ? 'vertical' : 'horizontal'}
                    TabIndicatorProps={mobile ? {
                      style: {
                        display: 'none'
                      }
                    } : {}}
                  >
                    {
                      !mobile ?
                        <StyledTab
                          className={styles.tab}
                          label={
                            <Badge
                              classes={{ badge: styles.customBadge }}
                              className={styles.badge}
                            >
                              {t('controlMensajeria.interruptions.cupsRegister')}
                            </Badge>
                          }
                        />
                        :
                        <StyledMobileTab
                          className={styles.tab}
                          label={
                            <Badge
                              classes={{ badge: styles.customBadge }}
                              className={styles.badge}
                            >
                              {t('controlMensajeria.interruptions.cupsRegister')}
                            </Badge>
                          }
                        />
                    }
                    {
                      !mobile ?
                        <StyledTab
                          className={styles.tab}
                          label={
                            <Badge
                              classes={{ badge: styles.customBadge }}
                              className={styles.badge}
                            >
                              {t('controlMensajeria.interruptions.sendedEmailSms')}
                            </Badge>
                          }
                        />
                        :
                        <StyledMobileTab
                          className={styles.tab}
                          label={
                            <Badge
                              classes={{ badge: styles.customBadge }}
                              className={styles.badge}
                            >
                              {t('controlMensajeria.interruptions.sendedEmailSms')}
                            </Badge>
                          }
                        />
                    }
                  </StyledTabSelector>
                </Grid>


                <Grid container md={12} spacing={2}>
                  <Grid item md={3} xs={12}>
                    <Grid className={styles.inputTitle}>{t('controlMensajeria.management.searchResume.dateFrom')}</Grid>
                    <DatepickerV3 selectedDate={datepickerDate1} handleChange={setDatepickerDate1} size='m' maxDate={datepickerDate2} dateFormat={'dd/MM/yyyy'} popperPlacement={mobile ? 'bottom-start' : 'right-center'} />
                  </Grid>
                  <Grid item md={3} xs={12}>
                    <Grid className={styles.inputTitle}>{t('controlMensajeria.management.searchResume.dateTo')}</Grid>
                    <DatepickerV3 selectedDate={datepickerDate2} handleChange={setDatepickerDate2} size='m' minDate={datepickerDate1} maxDate={diaAnterior} dateFormat={'dd/MM/yyyy'} popperPlacement={mobile ? 'bottom-start' : 'right-center'} />
                  </Grid>
                  <Grid item md={3} xs={12}>
                    <Button
                      className={styles.button}
                      text={t('common.buttons.aplicarFiltros')}
                      color='primary'
                      size='large'
                      variant='contained'
                      disabled={!alertsVisible}
                      onClick={performSearch}
                    />
                  </Grid>
                </Grid>


                <Grid container className={styles.titleCont}>
                  <Grid item md={5} xs={12} className={styles.buttonContainerSearch}>
                    {selectedTab === 0 &&
                      <DynamicSearcher
                        label={t('controlMensajeria.management.searchByCups')}
                        finalList={listItemsFiltered}
                        setFinalList={setListItemsFiltered}
                        listItems={listItems}
                        subtype={'controlInterrupcionesCups'}
                        setCurrentPage={setCurrentPage}
                        updateFlag={updateFlag}
                        setUpdateFlag={setUpdateFlag}
                      />
                    }
                    {selectedTab === 1 &&
                      <DynamicSearcher
                        label={t('controlMensajeria.interruptions.emailSmsList.searchText')}
                        finalList={listItemsFiltered}
                        setFinalList={setListItemsFiltered}
                        listItems={listItems}
                        subtype={'controlInterrupcionesSent'}
                        setCurrentPage={setCurrentPage}
                        updateFlag={updateFlag}
                        setUpdateFlag={setUpdateFlag}
                      />
                    }

                  </Grid>

                  <Grid item md={3} xs={12} className={styles.buttonContainer}>
                    <Button
                      text={t('supplies.suppliesDetails.components.consumption.exportDialogs.buttomExpot')}
                      color={'primary'}
                      size={'large'}
                      variant={'contained'}
                      onClick={handleExport}
                    />
                  </Grid>
                </Grid>

                <Grid item className={styles.itemText}>
                  {listItemsFiltered.length !== 0 &&
                    <span>
                      {t('common.conjunctions.del')}
                      {startItems}
                      {t('common.conjunctions.to')}
                      {endItems}
                      {t('common.conjunctions.de')}
                      {totalItems}
                    </span>
                  }
                </Grid>

                {selectedTab === 0 &&

                  <Table className={styles.messagesTable}>
                    <TableHead>
                      <TableRow className={styles.tableRow}>

                        <StyledTableCell
                          className={styles.headTableCellFirst}
                          rowSpan={1}
                          onMouseOver={() => changeHoverOver('Cups', true)}
                          onMouseLeave={() => changeHoverLeave('Cups')}
                        >
                          {t('controlMensajeria.interruptions.cupsList.cups')}
                          <TableSortLabel
                            active={showCupsArrow}
                            direction={directionNumber === 'asc' ? 'asc' : 'desc'}
                            onClick={orderByCups}
                          />
                        </StyledTableCell>

                        <StyledTableCell
                          className={styles.headTableCellSecond}
                          rowSpan={1}
                          onMouseOver={() => changeHoverOver('Document', true)}
                          onMouseLeave={() => changeHoverLeave('Document')}
                        >
                          {t('controlMensajeria.interruptions.cupsList.docNumber')}
                          <TableSortLabel
                            active={showDocumentArrow}
                            direction={directionNumber === 'asc' ? 'asc' : 'desc'}
                            onClick={orderByDocument}
                          />
                        </StyledTableCell>

                        <StyledTableCell
                          className={styles.headTableCell}
                          rowSpan={1}
                          onMouseOver={() => changeHoverOver('StartDate', true)}
                          onMouseLeave={() => changeHoverLeave('StartDate')}
                        >
                          {t('controlMensajeria.interruptions.cupsList.date1')}
                          <TableSortLabel
                            active={showStartDateArrow}
                            direction={directionNumber === 'asc' ? 'asc' : 'desc'}
                            onClick={() => { orderByDate('StartDate') }}
                          />
                        </StyledTableCell>

                        <StyledTableCell
                          className={styles.headTableCell}
                          rowSpan={1}
                          onMouseOver={() => changeHoverOver('EndDate', true)}
                          onMouseLeave={() => changeHoverLeave('EndDate')}
                        >
                          {t('controlMensajeria.interruptions.cupsList.date2')}
                          <TableSortLabel
                            active={showEndDateArrow}
                            direction={directionNumber === 'asc' ? 'asc' : 'desc'}
                            onClick={() => { orderByDate('EndDate') }}
                          />
                        </StyledTableCell>

                        <StyledTableCell
                          className={styles.headTableCell}
                          rowSpan={1}
                          onMouseOver={() => changeHoverOver('AlertChosen', true)}
                          onMouseLeave={() => changeHoverLeave('AlertChosen')}
                        >
                          {t('controlMensajeria.interruptions.cupsList.option')}
                          <TableSortLabel
                            active={showAlertChosenArrow}
                            direction={directionNumber === 'asc' ? 'asc' : 'desc'}
                            onClick={orderByAlertChosen}
                          />
                        </StyledTableCell>

                        <StyledTableCell
                          className={styles.headTableCell}
                          rowSpan={1}
                          onMouseOver={() => changeHoverOver('Schedule', true)}
                          onMouseLeave={() => changeHoverLeave('Schedule')}
                        >
                          {t('controlMensajeria.interruptions.cupsList.schedule')}
                          <TableSortLabel
                            active={showScheduleArrow}
                            direction={directionNumber === 'asc' ? 'asc' : 'desc'}
                            onClick={orderBySchedule}
                          />
                        </StyledTableCell>

                        <StyledTableCell
                          className={styles.headTableCellSendV2}
                          rowSpan={1}
                          onMouseOver={() => changeHoverOver('AlertsNumber', true)}
                          onMouseLeave={() => changeHoverLeave('AlertsNumber')}
                        >
                          {t('controlMensajeria.interruptions.cupsList.alertsNumber')}
                          <TableSortLabel
                            active={showAlertsNumberArrow}
                            direction={directionNumber === 'asc' ? 'asc' : 'desc'}
                            onClick={orderByAlertsNumber}
                          />
                        </StyledTableCell>

                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {
                        listItemsFiltered.length === 0 ?
                          <TableRow className={styles.tableBodyRow} >
                            <StyledTableCell className={styles.noResults} colSpan={12}>
                              {t('controlMensajeria.management.list.table.body.noResults')}
                            </StyledTableCell>
                          </TableRow>
                          :
                          
                          listItemsFiltered.slice(
                            (currentPage * itemsPerPage),
                            ((currentPage * itemsPerPage) + itemsPerPage)
                          ).map(
                            (item, index) => (
                              <>
                                <TableRow key={index} className={styles.tableBodyRow}>

                                  <StyledTableCell>{item.cups}</StyledTableCell>
                                  <StyledTableCell>{item.docId}</StyledTableCell>
                                  <StyledTableCell className={styles.bodyTableCellSend}>{item.fechaAlta ? reverseDate(item.fechaAlta) : ''}</StyledTableCell>
                                  <StyledTableCell className={styles.bodyTableCellSend}>{item.fechaBaja ? reverseDate(item.fechaBaja) : ''}</StyledTableCell>
                                  <StyledTableCell className={styles.bodyTableCellSend}>
                                    {item.tipoCanal === 'sms' && <img className={styles.icon} src={SMSIcon} alt='' />}
                                    {item.tipoCanal === 'email' && <img className={styles.icon} src={EmailIcon} alt='' />}
                                  </StyledTableCell>
                                  <StyledTableCell className={styles.bodyTableCellSendV2}>
                                    {item.schedule === 'Acotado' ?
                                      <Tooltip title={item.tooltip} placement='bottom'>
                                        <div className={styles.schedule}>
                                          <div className={styles.floatLeft}>
                                            <img className={styles.icon} src={BoundedIcon} alt='' />
                                          </div>
                                          <div className={styles.floatLeftAndMargin}>
                                            {item.schedule}
                                          </div>
                                        </div>
                                      </Tooltip>
                                      :
                                      <div className={styles.schedule}>
                                        <div className={styles.floatLeft}>
                                          <img className={styles.icon} src={AnyIcon} alt='' />
                                        </div>
                                        <div className={styles.floatLeftAndMargin}>
                                          {item.schedule}
                                        </div>
                                      </div>
                                    }
                                  </StyledTableCell>
                                  <StyledTableCell className={styles.bodyTableCellSend}>{item.alertsNumber}</StyledTableCell>
                                </TableRow>
                              </>
                            )
                          )
                      }
                    </TableBody>
                  </Table>

                }

                {selectedTab === 1 &&

                  <Table className={styles.messagesTable}>
                    <TableHead>
                      <TableRow className={styles.tableRow}>
                        <StyledTableCell
                    //CUPS
                          className={styles.headTableCellSendFirst}
                          rowSpan={1}
                          onMouseOver={() => changeHoverOver('Cups', true)}
                          onMouseLeave={() => changeHoverLeave('Cups')}
                        >
                          {t('controlMensajeria.interruptions.emailSmsList.cups')}
                          <TableSortLabel
                            active={showCupsArrow}
                            direction={directionNumber === 'asc' ? 'asc' : 'desc'}
                            onClick={orderByCups}
                          />
                        </StyledTableCell>
                        <StyledTableCell
                    //DOCUMENTO
                          className={styles.headTableCellSendFirst}
                          rowSpan={1}
                          onMouseOver={() => changeHoverOver('Document', true)}
                          onMouseLeave={() => changeHoverLeave('Document')}
                        >
                          {t('controlMensajeria.interruptions.emailSmsList.docNumber')}
                          <TableSortLabel
                            active={showDocumentArrow}
                            direction={directionNumber === 'asc' ? 'asc' : 'desc'}
                            onClick={orderByDocument}
                          />
                        </StyledTableCell>
                        <StyledTableCell
                    //CODIGO INCIDENCIA
                          className={styles.headTableCellSendFirst}
                          rowSpan={1}
                          onMouseOver={() => changeHoverOver('Incidences', true)}
                          onMouseLeave={() => changeHoverLeave('Incidences')}
                        >
                          {t('Incidencia')}
                          <TableSortLabel
                            active={showIncidencesArrow}
                            direction={directionNumber === 'asc' ? 'asc' : 'desc'}
                            onClick={orderByIncidences}
                          />
                        </StyledTableCell>
                        <StyledTableCell
                    //TIPO DE Incidencia
                          className={styles.headTableCellSendFirst}
                          rowSpan={1}
                          onMouseOver={() => changeHoverOver('Estado', true)}
                          onMouseLeave={() => changeHoverLeave('Estado')}
                        >
                          {t('controlMensajeria.interruptions.emailSmsList.tipoAviso')}
                          <TableSortLabel
                            active={showIdentificadorArrow}
                            direction={directionNumber === 'asc' ? 'asc' : 'desc'}
                            onClick={orderByTipoAvisoChosen}
                          />
                        </StyledTableCell>
                        <StyledTableCell
                    //TIPO DE NOTIFICACION
                          className={styles.headTableCellSendFirst}
                          rowSpan={1}
                          onMouseOver={() => changeHoverOver('TipoNotificacion', true)}
                          onMouseLeave={() => changeHoverLeave('TipoNotificacion')}
                        >
                          {t('controlMensajeria.interruptions.emailSmsList.tipoNotificacion')}
                          <TableSortLabel
                            active={showTipoNotificacionArrow}
                            direction={directionNumber === 'asc' ? 'asc' : 'desc'}
                            onClick={orderByTipoNotificacion}
                          />
                        </StyledTableCell>
                        <StyledTableCell
                    //Estado de aviso
                          className={styles.headTableCellSendFirst}
                          rowSpan={1}
                          onMouseOver={() => changeHoverOver('Estado', true)}
                          onMouseLeave={() => changeHoverLeave('Estado')}
                        >
                          {t('controlMensajeria.interruptions.emailSmsList.estado')}
                          <TableSortLabel
                            active={showEstadoArrow}
                            direction={directionNumber === 'asc' ? 'asc' : 'desc'}
                            onClick={orderByEstado}
                          />
                        </StyledTableCell>
                        
                        <StyledTableCell
                    //FECHA DE ESTADO
                          className={styles.headTableCellSendFirst}
                          rowSpan={1}
                          onMouseOver={() => changeHoverOver('DateAndHour', true)}
                          onMouseLeave={() => changeHoverLeave('DateAndHour')}
                        >
                          {t('controlMensajeria.interruptions.emailSmsList.fechaEstado')}
                          <TableSortLabel
                            active={showDateAndHourArrow}
                            direction={directionNumber === 'asc' ? 'asc' : 'desc'}
                            onClick={orderByDateAndHour}
                          />
                        </StyledTableCell>
                        
                       
                                              
                        <StyledTableCell
                    //CANAL
                          className={styles.headTableCellSendChannel}
                          rowSpan={1}
                          onMouseOver={() => changeHoverOver('Channel', true)}
                          onMouseLeave={() => changeHoverLeave('Channel')}
                        >
                          {t('controlMensajeria.interruptions.emailSmsList.channel')}
                          <TableSortLabel
                            active={showChannelArrow}
                            direction={directionNumber === 'asc' ? 'asc' : 'desc'}
                            onClick={orderByChannel}
                          />
                        </StyledTableCell>
                        <StyledTableCell
                    //FECHA DE ENVIO
                          className={styles.headTableCellSendFirst}
                          rowSpan={1}
                          onMouseOver={() => changeHoverOver('dateWait', true)}
                          onMouseLeave={() => changeHoverLeave('dateWait')}
                        >
                          {t('controlMensajeria.interruptions.emailSmsList.fechaEnvio')}
                          <TableSortLabel
                            active={showCupsArrow}
                            direction={directionNumber === 'asc' ? 'asc' : 'desc'}
                            onClick={orderByDateWaitEnvio}
                          />
                        </StyledTableCell>
                   
                        
                        <StyledTableCell
                    //INDICADOR DE RESOLUCIÓN PREVISTA
                          className={styles.headTableCellSendFirst}
                          rowSpan={1}
                          onMouseOver={() => changeHoverOver('Identificador', true)}
                          onMouseLeave={() => changeHoverLeave('Identificador')}
                        >
                          {t('controlMensajeria.interruptions.emailSmsList.IndicadorResolucion')}
                          <TableSortLabel
                            active={showCupsArrow}
                            direction={directionNumber === 'asc' ? 'asc' : 'desc'}
                            onClick={orderByIdentifica}
                          />
                        </StyledTableCell>

                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {
                        listItemsFiltered.length === 0 ?
                          <TableRow className={styles.tableBodyRow} >
                            <StyledTableCell className={styles.noResults} colSpan={12}>
                              {t('controlMensajeria.management.list.table.body.noResults')}
                            </StyledTableCell>
                          </TableRow>
                          :
                          listItemsFiltered.slice(
                            (currentPage * itemsPerPage),
                            ((currentPage * itemsPerPage) + itemsPerPage)
                          ).map(
                            (item, index) => (
                              <>
                              
                                <TableRow key={index} className={styles.tableBodyRow}>
                                  <StyledTableCell className={styles.bodyTableCellSend}>{item.cups}</StyledTableCell>
                                  <StyledTableCell className={styles.bodyTableCellSend}>{item.docId && item.docId}</StyledTableCell>
                                  <StyledTableCell className={styles.bodyTableCellSend}>{item.incidence}</StyledTableCell>
                                  <StyledTableCell className={styles.bodyTableCellSend}>{item.tipoAviso}</StyledTableCell>
                                  <StyledTableCell className={styles.bodyTableCellSend}>
                                    {item.tipoNotificacion === 'EMAIL193' && 'Apertura'}
                                    {item.tipoNotificacion === 'EMAIL194' && 'Envío único'}
                                    {item.tipoNotificacion === 'EMAIL195' && 'Cierre'}
                                  </StyledTableCell>

                                  <StyledTableCell className={styles.bodyTableCellSend}>
                                    <div className={styles.styleEstado}>
                                    {item.estadoAviso === 'OK' && 
                                      <ArrowTooltip title={t('Envío correcto')} placement='bottom'>
                                        <img className={styles.icon} src={CheckIcon} alt='' />
                                      </ArrowTooltip>
                                    }
                                    {item.estadoAviso === 'P' && 
                                      <ArrowTooltip title={t('Pendiente')} placement='bottom'>
                                      <img className={styles.icon} src={RelojIcon} alt='' />
                                      </ArrowTooltip>
                                    }
                                    {item.estadoAviso === 'BI' && 
                                      <ArrowTooltip title={t('Omitido por baja tensión inactivo')} placement='bottom'>
                                      <img className={styles.icon} src={InfoIcon} alt='' />
                                      </ArrowTooltip>

                                    }                                    
                                    {item.estadoAviso === 'MI' && 
                                       <ArrowTooltip title={t('Omitido por media tensión inactivo')} placement='bottom'>
                                      <img className={styles.icon} src={InfoIcon} alt='' />
                                      </ArrowTooltip>
                                    }                                    
                                    {item.estadoAviso === 'OT' && 
                                      <ArrowTooltip title={t('Omitido por distinto titular')} placement='bottom'>
                                        <img className={styles.icon} src={InfoIcon} alt='' />
                                      </ArrowTooltip>
                                    }                                    
                                    {item.estadoAviso === 'SU' && 
                                      <ArrowTooltip title={t('Omitido por suministro único')} placement='bottom'>
                                      <img className={styles.icon} src={InfoIcon} alt='' />
                                      </ArrowTooltip>
                                    }                                    
                                    {item.estadoAviso === 'TP' && 
                                      <ArrowTooltip title={t('Omitido por trabajo planificado')} placement='bottom'>
                                      <img className={styles.icon} src={InfoIcon} alt='' />
                                      </ArrowTooltip>
                                    }                                    
                                    {item.estadoAviso === 'TE' && 
                                      <ArrowTooltip title={t('Omitido por temporal')} placement='bottom'>
                                      <img className={styles.icon} src={InfoIcon} alt='' />
                                      </ArrowTooltip>
                                    }   
                                    {item.estadoAviso === 'VS' && 
                                     <ArrowTooltip title={t('Omitido por modo de validación sin destinatario')} placement='bottom'>
                                    <img className={styles.icon} src={InfoIcon} alt='' />
                                    </ArrowTooltip>
                                    }
                                     {item.estadoAviso === 'SD' && 
                                     <ArrowTooltip title={t('Omitido sin dispositivo')} placement='bottom'>
                                    <img className={styles.icon} src={InfoIcon} alt='' />
                                    </ArrowTooltip>
                                    }
                                     {item.estadoAviso === 'AN' && 
                                     <ArrowTooltip title={t('Anuladas')} placement='bottom'>
                                    <img className={styles.icon} src={InfoIcon} alt='' />
                                    </ArrowTooltip>
                                    }
                                 
                                    {item.estadoAviso}
                                    </div>
                                    
                                    </StyledTableCell>
                                  
                                  <StyledTableCell className={styles.bodyTableCellSend}>
                                    {item.dateAndHour && splitDateAndHour(item.dateAndHour)}
                                  </StyledTableCell>
                                  
                                  <StyledTableCell className={styles.bodyTableCellSendCenter}>
                                  <div className={styles.styleEstado2} style={{maxWidth: '70px', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                                    {item.channel === 'sms' && <img className={styles.icon} src={SMSIcon} alt='' />}
                                    {item.channel === 'email' && 
                                      <ArrowTooltip title={item.addressee} placement='bottom'>
                                      <img className={styles.icon} src={EmailIcon} alt='' />
                                      </ArrowTooltip>}
                                    {item.channel === 'push'&& <img className={styles.icon} src={AppICon} alt='' />}
                                    <br/>
                                    {item.channel === '' && 'N/A'} 
                                    {item.channel != 'push' && item.addressee}
                                    </div>
                                    </StyledTableCell>

                                  <StyledTableCell className={styles.bodyTableCellSend}>
                                    {item.dateWait && splitDateWait(item.dateWait)}
                                  </StyledTableCell>

                                  <StyledTableCell className={styles.bodyTableCellSendCenter}>
                                    {item.estadoIncidencia === 'En resolución' && 'Si'}
                                    {item.estadoIncidencia === 'Restablecido' && 'No'}
                                  </StyledTableCell>
                                 
                                </TableRow>
                              </>
                            )
                          )
                      }
                    </TableBody>
                  </Table>

                }

                <Grid container className={styles.itemsPerPage}>
                  <span style={{ marginRight: 5 }}>{t('common.pagination.show')}</span>
                  <select id='number' name='number' onChange={onChangeSelector} className={styles.select}>
                    <option value='20' selected>20</option>
                    <option value='50'>50</option>
                    <option value='100'>100</option>
                  </select>
                  <span style={{ marginLeft: 5 }}>{t('common.pagination.forPage')}</span>
                </Grid>

                {
                  (listItems.length > itemsPerPage) &&
                  <Grid container className={styles.paginationContainer}>
                    <Pagination
                      totalPages={totalPagesFilter}
                      currentPage={currentPage}
                      handleChangePage={setCurrentPage}
                    />
                  </Grid>
                }

              </Grid>
            </Grid>
          </Grid>

        </Grid>
      </Grid>
    </>
  )
}

export default InterruptionsAlerts;