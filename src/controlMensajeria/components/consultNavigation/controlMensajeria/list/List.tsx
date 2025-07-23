import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import useStyles, { StyledTableCell } from './List.styles'

import OkIcon from '../../../../../assets/icons/Interfaz_22_check_tick_validar_completo_verde.svg'
import ErrorIcon from '../../../../../assets/icons/Interfaz_24_cruz_cerrar_error_rojo.svg'
import AlertIcon from '../../../../../assets/icons/Interfaz_28_Exclamación.svg'
import EmailIcon from '../../../../../assets/icons/Interfaz_90_sobre_mail_correo_postal.svg'
import PhoneIcon from '../../../../../assets/icons/Interfaz_108_contacto_telefono.svg'
import EnvelopeIcon from '../../../../../assets/icons/Interfaz_126_correo_arroba.svg'
import MobileIcon from '../../../../../assets/icons/Icon_sms.svg'
import SmsTextbox from '../../../../../assets/icons/sms_textbox.svg'
import SentMail from '../../../../../assets/icons/sobre_enviado.svg'
import AddressIcon from '../../../../../assets/icons/Icon_address.svg'

import {
  extractDateFromDateAndHourString,
  extractHourFromDateAndHourString
} from '../../../../../common/lib/FormatLib'

import Tooltip from '../../../../../common/components/tooltip/Tooltip'
import Pagination from '../../../../../common/components/pagination/Pagination2'
import Button from '../../../../../common/components/button/Button'
import { formatDate, gettHourFromDate } from '../../../../../common/lib/FormatLib'

import XLSX from 'xlsx'
import DynamicSearcher from '../../../../../common/components/searcher/DynamicSearcher'

const List = (props: any) => {
  const {
    listItems,
    setListItems,
    listItems2,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    counters,
    registeredPercentage,
    registeredPercentage2,
    datepickerDate1,
    datepickerDate2,
    province,
    town,
    startItems,
    endItems,
    totalItems,
    totalPagesFilter,
    tempSelectedState,
    isCheckboxSelectedSendCorrectly,
    isCheckboxSelectedInvalidEmailAndSMS,
    isCheckboxSelectedOwnerRegistered,
    isCheckboxSelectedOpositionRight,
    isCheckboxSelectedInvalidCups,
    executingNewSearch,
    tabletRes,
    mobileRes
  } = props

  const { t } = useTranslation()
  const classes = useStyles({})

  const target = document.getElementById('number') as HTMLSelectElement

  const [showDateSIArrow, setShowDateSIArrow] = useState(false)
  const [showDateMSMArrow, setShowDateMSMArrow] = useState(false)
  const [showProvinceArrow, setShowProvinceArrow] = useState(false)
  const [showMunicipalityArrow, setShowMunicipalityArrow] = useState(false)
  const [showRegisteredArrow, setShowRegisteredArrow] = useState(false)

  const [ordered, setOrdered] = useState('' as String)

  const [orderByDateSIAsc, setOrderByDateSIAsc] = useState(false)
  const [orderByDateMSMAsc, setOrderByDateMSMAsc] = useState(false)
  const [orderByProvinceAsc, setOrderByProvinceAsc] = useState(false)
  const [orderByMunicipalityAsc, setOrderByMunicipalityAsc] = useState(false)
  const [orderByRegisterAsc, setOrderByRegisterAsc] = useState(false)

  const [directionNumber, setDirectionNumber] = useState('desc')

  const resetFilters = () => {
    setShowDateSIArrow(false)
    setShowDateMSMArrow(false)
    setShowProvinceArrow(false)
    setShowMunicipalityArrow(false)
    setShowRegisteredArrow(false)

    setOrderByDateSIAsc(false)
    setOrderByDateMSMAsc(false)
    setOrderByProvinceAsc(false)
    setOrderByMunicipalityAsc(false)
    setOrderByRegisterAsc(false)
  }

  //ordenamos a partir de la columna registrado
  const orderByRegister = () => {
    setOrdered('Registered')
    setShowDateSIArrow(false)
    setShowDateMSMArrow(false)
    setShowProvinceArrow(false)
    setShowMunicipalityArrow(false)
    setShowRegisteredArrow(true)

    setDirectionNumber('desc')
    setCurrentPage(0)
    if (orderByRegisterAsc) {
      setListItems([].concat(listItems).sort().reverse())
      setOrderByRegisterAsc(false)
      setDirectionNumber('asc')
    } else {
      setListItems([].concat(listItems).sort((a, b) => a.registrado.localeCompare(b.registrado)))
      setOrderByRegisterAsc(true)
      setDirectionNumber('desc')
    }
  }

  //ordenamos a partir de la columna municipio
  const orderByMunicipality = () => {
    setOrdered('Municipality')
    setShowDateSIArrow(false)
    setShowDateMSMArrow(false)
    setShowProvinceArrow(false)
    setShowMunicipalityArrow(true)
    setShowRegisteredArrow(false)

    setDirectionNumber('desc')
    setCurrentPage(0)
    if (orderByMunicipalityAsc) {
      setListItems([].concat(listItems).sort().reverse())
      setOrderByMunicipalityAsc(false)
      setDirectionNumber('asc')
    } else {
      setListItems([].concat(listItems).sort((a, b) => a.municipio.localeCompare(b.municipio)))
      setOrderByMunicipalityAsc(true)
      setDirectionNumber('desc')
    }
  }

  //ordenamos a partir de la columna provincia
  const orderByProvince = () => {
    setOrdered('Province')
    setShowDateSIArrow(false)
    setShowDateMSMArrow(false)
    setShowProvinceArrow(true)
    setShowMunicipalityArrow(false)
    setShowRegisteredArrow(false)

    setDirectionNumber('desc')
    setCurrentPage(0)
    if (orderByProvinceAsc) {
      setListItems([].concat(listItems).sort().reverse())
      setOrderByProvinceAsc(false)
      setDirectionNumber('asc')
    } else {
      setListItems([].concat(listItems).sort((a, b) => a.provincia.localeCompare(b.provincia)))
      setOrderByProvinceAsc(true)
      setDirectionNumber('desc')
    }
  }

  //ordenamos a partir de una de las columnas de fecha
  const orderByDate = (dateType) => {
    setShowProvinceArrow(false)
    setShowMunicipalityArrow(false)
    setShowRegisteredArrow(false)

    setDirectionNumber('desc')
    setCurrentPage(0)

    if (dateType === 'SI') {  //  FECHA SI
      setOrdered('DateSI')
      if (orderByDateSIAsc) {
        setListItems([].concat(listItems).sort().reverse())
        setOrderByDateSIAsc(false)
        setDirectionNumber('asc')
        setShowDateSIArrow(true)
        setShowDateMSMArrow(false)
      } else {
        const auxList = listItems.sort(function (a, b) {
          let aa = a.fecha.split('/') // Formato con el que llega la fecha: dd/mm/yyyy hh:mm:ss
          aa = aa[2].substring(0, 4) + '-' + aa[1] + '-' + aa[0] + ' ' + aa[2].substring(5, 13)

          let bb = b.fecha.split('/')
          bb = bb[2].substring(0, 4) + '-' + bb[1] + '-' + bb[0] + ' ' + bb[2].substring(5, 13)

          return aa.localeCompare(bb)
        })
        setListItems(auxList)
        setOrderByDateSIAsc(true)
        setDirectionNumber('desc')
        setShowDateSIArrow(true)
        setShowDateMSMArrow(false)
      }
    }
    else {  //FECHA MSM
      setOrdered('DateMSM')
      if (orderByDateMSMAsc) {
        setListItems([].concat(listItems).sort().reverse())
        setOrderByDateMSMAsc(false)
        setDirectionNumber('asc')
        setShowDateMSMArrow(true)
        setShowDateSIArrow(false)
      }
      else {
        const auxListFechaMsmSI = listItems.filter(item => item.fechaMsm && item.fechaMsm !== '')
        const auxListFechaMsmNO = listItems.filter(item => !item.fechaMsm || item.fechaMsm === '')
        const auxList = auxListFechaMsmSI.sort(function (a, b) {
          let aa = a.fechaMsm.split('/') // Formato con el que llega la fechaMsm: dd/mm/yyyy hh:mm:ss
          aa = aa[2].substring(0, 4) + '-' + aa[1] + '-' + aa[0] + ' ' + aa[2].substring(5, 13)

          let bb = b.fechaMsm.split('/')
          bb = bb[2].substring(0, 4) + '-' + bb[1] + '-' + bb[0] + ' ' + bb[2].substring(5, 13)

          return aa.localeCompare(bb)
        })
        auxList.push(...auxListFechaMsmNO)
        setListItems(auxList)
        setOrderByDateMSMAsc(true)
        setDirectionNumber('desc')
        setShowDateMSMArrow(true)
        setShowDateSIArrow(false)
      }
    }
  }

  const changeHoverOver = (type: String, value: boolean) => {
    switch (type) {
      case 'Registered':
        setShowRegisteredArrow(value)
        break
      case 'Municipality':
        setShowMunicipalityArrow(value)
        break
      case 'Province':
        setShowProvinceArrow(value)
        break
      case 'DateSI':
        setShowDateSIArrow(value)
        break
      case 'DateMSM':
        setShowDateMSMArrow(value)
        break

    }
  }

  const changeHoverLeave = (type: String) => {
    switch (type) {
      case 'Registered':
        if (type === ordered) {
          setShowRegisteredArrow(true)
        } else {
          setShowRegisteredArrow(false)
        }
        break
      case 'Municipality':
        if (type === ordered) {
          setShowMunicipalityArrow(true)
        } else {
          setShowMunicipalityArrow(false)
        }
        break
      case 'Province':
        if (type === ordered) {
          setShowProvinceArrow(true)
        } else {
          setShowProvinceArrow(false)
        }
        break
      case 'DateSI':
        if (type === ordered) {
          setShowDateSIArrow(true)
        } else {
          setShowDateSIArrow(false)
        }
        break
      case 'DateMSM':
        if (type === ordered) {
          setShowDateMSMArrow(true)
        } else {
          setShowDateMSMArrow(false)
        }
        break

    }
  }

  const processTranslations = (processID) => {
    if (processID === '01') {
      return t('controlMensajeria.management.list.table.body.processTranslations.01')
    }
    else if (processID === '02') {
      return t('controlMensajeria.management.list.table.body.processTranslations.02')
    }
    else if (processID === '03') {
      return t('controlMensajeria.management.list.table.body.processTranslations.03')
    }
    else {
      return ''
    }
  }

  const descriptionTranslations = (description) => {
    if (description === '1') {
      return t('controlMensajeria.management.list.table.body.descriptionTranslations.01')
    }
    else if (description === '2') {
      return t('controlMensajeria.management.list.table.body.descriptionTranslations.02')
    }
    else if (description === '3') {
      return t('controlMensajeria.management.list.table.body.descriptionTranslations.03')
    }
    else if (description === '4') {
      return t('controlMensajeria.management.list.table.body.descriptionTranslations.04')
    }
    else if (description === '5') {
      return t('controlMensajeria.management.list.table.body.descriptionTranslations.05')
    }
    else if (description === '6') {
      return t('controlMensajeria.management.list.table.body.descriptionTranslations.06')
    }
    else if (!description) {
      return t('controlMensajeria.management.list.table.body.descriptionTranslations.00')
    }
    else {
      return ''
    }
  }

  const getMessageIcon = (result, getIcon) => {
    if (result === '1') {
      return getIcon ? OkIcon : 'ok'
    }
    else if (result === '0') {
      return getIcon ? ErrorIcon : 'error'
    }
    else {
      return ''
    }
  }

  const setTooltip = (iconType, errorDesc) => {
    if (iconType === 'ok') {
      return t('controlMensajeria.management.list.table.body.tooltips.ok')
    }
    else if (iconType === 'error') {
      if (errorDesc === '1') {
        return 'Sin email ni sms válidos'
      } else if (errorDesc === '2') {
        return 'Sin nombre o apellidos'
      } else if (errorDesc === '3') {
        return 'Titular ya registrado'
      } else if (errorDesc === '4') {
        return 'Ejercicio derecho de oposición (RGPD)'
      } else if (errorDesc === '5') {
        return 'Documento identificativo inválido'
      } else if (errorDesc === '6') {
        return 'CUPS inválido'
      } else {
        return ''
      }
    }
    else {
      return ''
    }
  }

  const onChangeSelector = () => {
    setCurrentPage(0)
    setItemsPerPage(Number(target.options[target.selectedIndex].value))
  }

  const tituloListA: Array<string> = [
    'CONTROL DE MENSAJERÍA',
    'Fecha de exportación de datos',
    'Hora',
    '',
    'Provincia',
    'Municipio',
    'Fecha desde',
    'Fecha hasta',
    '',
    'Ratio registros',
    'Salidas',
    'Registros',
    '',
    'Ratio envíos realizados',
    'Nuevos usuarios',
    'Salidas',
    '',
  ]

  const tituloListB: Array<string> = [
    '',
    '',
    'Enviado correctamente',
    'Sin email o SMS válidos',
    'Sin nombre o apellidos',
    'Titular ya registrado',
    'Ejercicio del derecho de oposición (RGPD)',
    'Documento identificativo inválido',
    'CUPS inválido',
    '',
    'Usuarios registrados',
    'Usuarios No registrados'
  ]

  let tableA = [] as any
  let tableB = [] as any

  const [fechaExport, setFechaExport] = useState('')
  const [horaExport, setHoraExport] = useState('')

  useEffect(() => {
    let fechaExportAux = formatDate(new Date())
    let horaExportAux = gettHourFromDate(new Date())

    setFechaExport(fechaExportAux)
    setHoraExport(horaExportAux)
  }, [])

  const handleSetTables = () => {

    let auxDataCm = {
      tableA: {
        fecha: fechaExport,
        hora: horaExport,
        provincia: province,
        municipio: town,
        fechaDesde: formatDate(datepickerDate1),
        fechaHasta: formatDate(datepickerDate2),
        ratio: registeredPercentage + ' %',
        salidas: counters.correctlySendCounterNoDuplicates,
        registros: counters.registeredCounter,
        ratio2: registeredPercentage2 + ' %',
        nuevosUsuarios: counters.totalCounterNoDuplicates,
        salidas2: counters.correctlySendCounterNoDuplicates,
      },
      tableB: [
        { // D15 TOTALES
          email: counters.emailTypeCounter,
          sms: counters.smsTypeCounter,
          total: counters.totalCounter // salidas
        },
        { // D17 Enviado correctamente
          email: counters.correctlySendEmailCounter,
          sms: counters.correctlySendSMSCounter,
          total: counters.correctlySendCounter
        },
        { // D18 Sin email o SMS válidos
          email: counters.emailErrorCounter,
          sms: counters.smsErrorCounter,
          total: (counters.emailErrorCounter + counters.smsErrorCounter)
        },
        { // D19 Sin nombre o apellidos
          email: counters.noNameErrorEmailCounter,
          sms: counters.noNameErrorSMSCounter,
          total: (counters.noNameErrorEmailCounter + counters.noNameErrorSMSCounter)
        },
        { // D20 Titular ya registrado
          email: counters.ownerRegisteredEmailCounter,
          sms: counters.ownerRegisteredSMSCounter,
          total: (counters.ownerRegisteredEmailCounter + counters.ownerRegisteredSMSCounter)
        },
        { // D21 Ejercicio del derecho de oposición (RGPD)
          email: counters.oppositionRightEmailCounter,
          sms: counters.oppositionRightSMSCounter,
          total: (counters.oppositionRightEmailCounter + counters.oppositionRightSMSCounter)
        },
        { // D22 Documento indentificativo inválido
          email: counters.invalidDocumentEmailCounter,
          sms: counters.invalidDocumentSMSCounter,
          total: (counters.invalidDocumentEmailCounter + counters.invalidDocumentSMSCounter)
        },
        { // D23 CUPS inválido
          email: counters.invalidCupsEmailCounter,
          sms: counters.invalidCupsSMSCounter,
          total: (counters.invalidCupsEmailCounter + counters.invalidCupsSMSCounter)
        },
        { // D25 Usuarios registrados
          email: counters.registeredEmailCounter,
          sms: counters.registeredSMSCounter,
          total: counters.registeredCounter // registrados
        },
        { // D25 Usuarios registrados
          email: counters.notRegisteredEmailCounter,
          sms: counters.notRegisteredSMSCounter,
          total: counters.notRegisteredCounter // No registrados
        }
      ]
    }
    tableA = auxDataCm.tableA
    tableB = auxDataCm.tableB
  }

  const handleExport = () => {
    handleSetTables()

    const rows = [] as any
    const rows2 = [] as any
    let ws
    let ws1
    let auxDate = {}
    let proceso = ''
    let motivo = ''
    let registered = ''
    let titulo = ''
    let auxSendMailResult = ''
    let auxSendSmsResult = ''
    let fileName

    (listItems && listItems.length > 0) && listItems.map((item, index) => {
      auxSendMailResult = ''
      auxSendSmsResult = ''
      proceso = processTranslations(item.proceso)
      motivo = descriptionTranslations(item.descErrorValidacion)
      registered = item.registrado

      if (item.tipoEnvio === '01') {
        auxSendMailResult = motivo
        auxSendSmsResult = 'N/A'
      }

      if (item.tipoEnvio === '02') {
        auxSendMailResult = 'N/A'
        auxSendSmsResult = motivo
      }

      rows.push({
        process: proceso,
        cups: item.cups ? item.cups : '0',
        fechaSi: item.fecha ? item.fecha : '',
        fechaMsm: item.fechaMsm ? item.fechaMsm : '',
        provincia: item.provincia,
        municipio: item.municipio,
        address: item.direccion,
        documentNumber: item.docIdentificativo,
        email: item.email,
        phone: item.telefono,
        sendMailResult: auxSendMailResult,
        sendSmsResult: auxSendSmsResult,
        motive: item.resultadoEnvio === '1' ? 'N/A' : motivo,
        registred: registered
      })
    })

    let i = 0
    tituloListA.map((tituloA, index) => {
      titulo = tituloListA[index]

      if (titulo === '' || titulo === 'CONTROL DE MENSAJERÍA') {
        if (titulo === '') {
          rows2.push({
            titulo: titulo
          })
        }
      } else {
        rows2.push({
          titulo: titulo,
          email: tableA[Object.keys(tableA)[i]]
        })
        i = i + 1
      }
    })

    if (tempSelectedState === 1) {
      rows2.push({
        titulo: 'Canal o tipo de mensaje',
        email: 'Email',
        sms: '',
        total: 'Total',
      })
    } else if (tempSelectedState === 2) {
      rows2.push({
        titulo: 'Canal o tipo de mensaje',
        email: '',
        sms: 'SMS',
        total: 'Total',
      })
    } else if (tempSelectedState === 3) {
      rows2.push({
        titulo: 'Canal o tipo de mensaje',
        email: 'Email',
        sms: 'SMS',
        total: 'Total',
      })
    }

    i = 0
    tituloListB.map((item, index) => {
      titulo = tituloListB[index]

      if (titulo === '' && i > 0) {
        rows2.push({
          titulo: titulo
        })
      } else {
        switch (i) {
          case 0:
            if (tempSelectedState === 1) {
              rows2.push({
                titulo: titulo,
                email: tableB[i].email,
                sms: '',
                total: tableB[i].total
              })
            } else if (tempSelectedState === 2) {
              rows2.push({
                titulo: titulo,
                email: '',
                sms: tableB[i].sms,
                total: tableB[i].total
              })
            } else if (tempSelectedState === 3) {
              rows2.push({
                titulo: titulo,
                email: tableB[i].email,
                sms: tableB[i].sms,
                total: tableB[i].total
              })
            }
            break;
          case 1:
            if (isCheckboxSelectedSendCorrectly) {
              if (tempSelectedState === 1) {
                rows2.push({
                  titulo: titulo,
                  email: tableB[i].email,
                  sms: '',
                  total: tableB[i].total
                })
              } else if (tempSelectedState === 2) {
                rows2.push({
                  titulo: titulo,
                  email: '',
                  sms: tableB[i].sms,
                  total: tableB[i].total
                })
              } else if (tempSelectedState === 3) {
                rows2.push({
                  titulo: titulo,
                  email: tableB[i].email,
                  sms: tableB[i].sms,
                  total: tableB[i].total
                })
              }
            }
            break;
          case 2:
            if (isCheckboxSelectedInvalidEmailAndSMS) {
              if (tempSelectedState === 1) {
                rows2.push({
                  titulo: titulo,
                  email: tableB[i].email,
                  sms: '',
                  total: tableB[i].total
                })
              } else if (tempSelectedState === 2) {
                rows2.push({
                  titulo: titulo,
                  email: '',
                  sms: tableB[i].sms,
                  total: tableB[i].total
                })
              } else if (tempSelectedState === 3) {
                rows2.push({
                  titulo: titulo,
                  email: tableB[i].email,
                  sms: tableB[i].sms,
                  total: tableB[i].total
                })
              }
            }
            break;
          case 3:
            // if (isCheckboxSelectedNameAndSurname) {
            //   if (tempSelectedState === 1) {
            //     rows2.push({
            //       titulo: titulo,
            //       email: tableB[i].email,
            //       sms: '',
            //       total: tableB[i].total
            //     })
            //   } else if (tempSelectedState === 2) {
            //     rows2.push({
            //       titulo: titulo,
            //       email: '',
            //       sms: tableB[i].sms,
            //       total: tableB[i].total
            //     })
            //   } else if (tempSelectedState === 3) {
            //     rows2.push({
            //       titulo: titulo,
            //       email: tableB[i].email,
            //       sms: tableB[i].sms,
            //       total: tableB[i].total
            //     })
            //   }
            // }
            break;
          case 4:
            if (isCheckboxSelectedOwnerRegistered) {
              if (tempSelectedState === 1) {
                rows2.push({
                  titulo: titulo,
                  email: tableB[i].email,
                  sms: '',
                  total: tableB[i].total
                })
              } else if (tempSelectedState === 2) {
                rows2.push({
                  titulo: titulo,
                  email: '',
                  sms: tableB[i].sms,
                  total: tableB[i].total
                })
              } else if (tempSelectedState === 3) {
                rows2.push({
                  titulo: titulo,
                  email: tableB[i].email,
                  sms: tableB[i].sms,
                  total: tableB[i].total
                })
              }
            }
            break;
          case 5:
            if (isCheckboxSelectedOpositionRight) {
              if (tempSelectedState === 1) {
                rows2.push({
                  titulo: titulo,
                  email: tableB[i].email,
                  sms: '',
                  total: tableB[i].total
                })
              } else if (tempSelectedState === 2) {
                rows2.push({
                  titulo: titulo,
                  email: '',
                  sms: tableB[i].sms,
                  total: tableB[i].total
                })
              } else if (tempSelectedState === 3) {
                rows2.push({
                  titulo: titulo,
                  email: tableB[i].email,
                  sms: tableB[i].sms,
                  total: tableB[i].total
                })
              }
            }
            break;
          case 6:
            // if (isCheckboxSelectedInvalidDocument) {
            //   if (tempSelectedState === 1) {
            //     rows2.push({
            //       titulo: titulo,
            //       email: tableB[i].email,
            //       sms: '',
            //       total: tableB[i].total
            //     })
            //   } else if (tempSelectedState === 2) {
            //     rows2.push({
            //       titulo: titulo,
            //       email: '',
            //       sms: tableB[i].sms,
            //       total: tableB[i].total
            //     })
            //   } else if (tempSelectedState === 3) {
            //     rows2.push({
            //       titulo: titulo,
            //       email: tableB[i].email,
            //       sms: tableB[i].sms,
            //       total: tableB[i].total
            //     })
            //   }
            // }
            break;
          case 7:
            if (isCheckboxSelectedInvalidCups) {
              if (tempSelectedState === 1) {
                rows2.push({
                  titulo: titulo,
                  email: tableB[i].email,
                  sms: '',
                  total: tableB[i].total
                })
              } else if (tempSelectedState === 2) {
                rows2.push({
                  titulo: titulo,
                  email: '',
                  sms: tableB[i].sms,
                  total: tableB[i].total
                })
              } else if (tempSelectedState === 3) {
                rows2.push({
                  titulo: titulo,
                  email: tableB[i].email,
                  sms: tableB[i].sms,
                  total: tableB[i].total
                })
              }
            }
            break;
          case 8:
            if (tempSelectedState === 1) {
              rows2.push({
                titulo: titulo,
                email: tableB[i].email,
                sms: '',
                total: tableB[i].total
              })
            } else if (tempSelectedState === 2) {
              rows2.push({
                titulo: titulo,
                email: '',
                sms: tableB[i].sms,
                total: tableB[i].total
              })
            } else if (tempSelectedState === 3) {
              rows2.push({
                titulo: titulo,
                email: tableB[i].email,
                sms: tableB[i].sms,
                total: tableB[i].total
              })
            }
            break;
          case 9:
            if (tempSelectedState === 1) {
              rows2.push({
                titulo: titulo,
                email: tableB[i].email,
                sms: '',
                total: tableB[i].total
              })
            } else if (tempSelectedState === 2) {
              rows2.push({
                titulo: titulo,
                email: '',
                sms: tableB[i].sms,
                total: tableB[i].total
              })
            } else if (tempSelectedState === 3) {
              rows2.push({
                titulo: titulo,
                email: tableB[i].email,
                sms: tableB[i].sms,
                total: tableB[i].total
              })
            }
            break;
        }
        // rows2.push({
        //   titulo: titulo,
        //   email: tableB[i].email,
        //   sms: tableB[i].sms,
        //   total: tableB[i].total
        // })
        i = i + 1
      }
    })

    ws = XLSX.utils.json_to_sheet(rows, {
      header: [
        'process',
        'cups',
        'fechaSi',
        'fechaMsm',
        'provincia',
        'municipio',
        'address',
        'documentNumber',
        'email',
        'phone',
        'sendMailResult',
        'sendSmsResult',
        'motive',
        'registred'
      ]
    })

    ws['A1'].v = t('controlMensajeria.management.list.table.header.process')
    ws['B1'].v = t('controlMensajeria.management.list.table.header.cups')
    ws['C1'].v = t('controlMensajeria.management.list.table.header.dateHourSi')
    ws['D1'].v = t('controlMensajeria.management.list.table.header.dateHourMsm')
    ws['E1'].v = t('controlMensajeria.management.list.table.header.province')
    ws['F1'].v = t('controlMensajeria.management.list.table.header.municipality')
    ws['G1'].v = t('controlMensajeria.management.list.table.header.address')
    ws['H1'].v = t('controlMensajeria.management.list.table.header.docNumber')
    ws['I1'].v = t('controlMensajeria.management.list.table.header.email')
    ws['J1'].v = t('controlMensajeria.management.list.table.header.phone')
    ws['K1'].v = t('controlMensajeria.management.list.table.header.sendMailResult')
    ws['L1'].v = t('controlMensajeria.management.list.table.header.sendSmsResult')
    ws['M1'].v = t('controlMensajeria.management.list.table.header.motive')
    ws['N1'].v = t('controlMensajeria.management.list.table.header.registered')

    ws1 = XLSX.utils.json_to_sheet(rows2, {
      // header: [
      //   'process'
      // ]
    })

    ws1['A1'].v = t('controlMensajeria.management.header.subtitle')
    ws1['B1'].v = t('')
    ws1['C1'].v = t('')
    ws1['D1'].v = t('')

    fileName = 'ResultadoConsulta.xlsx'

    const wb = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(wb, ws1, 'Resumen Consulta')
    XLSX.utils.book_append_sheet(wb, ws, 'Resultados Consulta')

    XLSX.writeFile(wb, fileName)

  }

  useEffect(() => {
    // Restablecemos la ordenación por columnas cuando se lanza una nueva búsqueda o filtro
    resetFilters()
  }, [executingNewSearch, listItems.length])

  return (
    <Grid container className={classes.generalCont}>
      <Grid container className={classes.title}>
        {t('controlMensajeria.management.list.title')}
      </Grid>

      <Grid container className={classes.subTitle}>
        {province &&
          <>
            <span>
              {t('controlMensajeria.management.searchResume.province2')}
              <strong>{province}</strong>
              &nbsp;
            </span>

            {town === '' ?
              <span>
                {t('controlMensajeria.management.searchResume.municipality2')}
                <strong>
                  {t('controlMensajeria.management.searchResume.searchBy.channel.all')}
                  {t('controlMensajeria.management.searchResume.espacio')}
                </strong>
              </span>

              :
              <span>
                {t('controlMensajeria.management.searchResume.municipality2')}
                <strong>
                  {town}
                  {t('controlMensajeria.management.searchResume.espacio')}
                </strong>
              </span>
            }
          </>
        }

        <span>
          &nbsp;
          {t('common.conjunctions.desde') + formatDate(datepickerDate1) + t('common.conjunctions.hasta') + formatDate(datepickerDate2)}
        </span>
      </Grid >

      <Grid container className={classes.titleCont}>
        <Grid item className={classes.buttonContainerSearch}>
          <DynamicSearcher
            label={t('controlMensajeria.management.list.searcher')}
            finalList={listItems}
            setFinalList={setListItems}
            listItems={listItems2}
            subtype={'controlMensajeria'}
            setCurrentPage={setCurrentPage}
          />
        </Grid>

        <Grid item className={classes.buttonContainer}>
          <Button
            text={t('supplies.suppliesDetails.components.consumption.exportDialogs.buttomExpot')}
            color={'primary'}
            size={'large'}
            variant={'contained'}
            onClick={handleExport}
          />
        </Grid>
      </Grid>

      <Grid item className={classes.itemText}>
        {listItems.length !== 0 &&
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

      {(mobileRes || tabletRes) ?
        // MOSAICO (VISTA MOBIL)
        <Grid className={classes.table}>
          {
            listItems.length === 0 ?
              <div>No hay elementos disponibles</div>
              :
              <Grid container spacing={2}>
                {
                  listItems.slice(
                    (currentPage * itemsPerPage),
                    ((currentPage * itemsPerPage) + itemsPerPage)
                  ).map(
                    (item, index) => (
                      <Grid
                        item
                        key={index}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                      >
                        <Grid className={classes.item}>
                          <Grid className={classes.row}>
                            <Typography className={classes.mosaicTitle}>{t('controlMensajeria.management.list.table.header.cups')}</Typography>
                            <Typography className={`${classes.value} bold`}>{item.cups}</Typography>
                          </Grid>

                          <Grid className={classes.row}>
                            <Typography className={classes.mosaicTitle}>{t('controlMensajeria.management.list.table.header.dateHourSi')}</Typography>
                            <Typography className={classes.value}>{item.fecha}</Typography>
                          </Grid>

                          <Grid className={classes.row}>
                            <Typography className={classes.mosaicTitle}>{t('controlMensajeria.management.list.table.header.dateHourMsm')}</Typography>
                            <Typography className={classes.value}>{item.fechaMsm}</Typography>
                          </Grid>

                          <Grid className={classes.row}>
                            <Typography className={classes.mosaicTitle}>{t('controlMensajeria.management.list.table.header.province')}</Typography>
                            <Typography className={classes.value}>{item.provincia}</Typography>
                          </Grid>

                          <Grid className={classes.row}>
                            <Typography className={classes.mosaicTitle}>{t('controlMensajeria.management.list.table.header.municipality')}</Typography>
                            <Typography className={classes.value}>{item.municipio}</Typography>
                          </Grid>

                          <Grid className={classes.row}>
                            <Typography className={classes.mosaicTitle}>{t('controlMensajeria.management.list.table.header.docNumber')}</Typography>
                            <Typography className={classes.value}>{item.docIdentificativo}</Typography>
                          </Grid>

                          <Grid className={classes.row}>
                            <Typography className={classes.mosaicTitle}><img className={classes.iconV2} src={MobileIcon} alt='' /></Typography>
                            <Typography className={classes.value}>{item.telefono}</Typography>
                          </Grid>

                          <Grid className={classes.row}>
                            <Typography className={classes.mosaicTitle}><img className={classes.iconV2} src={EnvelopeIcon} alt='' /></Typography>
                            <Typography className={classes.value}>{item.email}</Typography>
                          </Grid>

                          <Grid className={classes.row}>
                            <Typography className={classes.mosaicTitle}><img className={classes.iconV2} src={AddressIcon} alt='' /></Typography>
                            <Typography className={classes.value}>{item.direccion}</Typography>
                          </Grid>

                          <Grid className={classes.row}>
                            <Typography className={classes.mosaicTitle}><img className={classes.iconV2} src={SentMail} alt='' /></Typography>
                            <Typography className={classes.value}>
                              {item.tipoEnvio !== '02' ?
                                <img className={classes.icon} src={getMessageIcon(item.resultadoValidacion, true)} alt='' />
                                :
                                <Typography className={classes.value}>{' - '}</Typography>
                              }
                            </Typography>
                          </Grid>

                          <Grid className={classes.row}>
                            <Typography className={classes.mosaicTitle}><img className={classes.iconV2} src={SmsTextbox} alt='' /></Typography>
                            <Typography className={classes.value}>
                              {item.tipoEnvio === '02' ?
                                <img className={classes.icon} src={getMessageIcon(item.resultadoValidacion, true)} alt='' />
                                :
                                <Typography className={classes.value}>{' - '}</Typography>
                              }
                            </Typography>
                          </Grid>

                          <Grid className={classes.row}>
                            <Typography className={classes.mosaicTitle}>{t('controlMensajeria.management.list.table.header.registered')}</Typography>
                            <Typography className={classes.value}>{item.registrado}</Typography>
                          </Grid>

                        </Grid>
                      </Grid>
                    )
                  )
                }
              </Grid>
          }
        </Grid>
        :
        // TABLA (VISTA DESKTOP)
        <Table className={classes.messagesTable}>
          <TableHead>
            <TableRow className={classes.tableRow}>
              <StyledTableCell className={classes.headTableCell} rowSpan={1}>
                {t('controlMensajeria.management.list.table.header.cups')}
              </StyledTableCell>

              <StyledTableCell
                className={classes.headTableCell}
                rowSpan={1}
                onMouseOver={() => changeHoverOver('DateSI', true)}
                onMouseLeave={() => changeHoverLeave('DateSI')}
              >
                <Tooltip title={t('controlMensajeria.management.list.table.header.tooltipSi')} placement='bottom'>
                  <span>{t('controlMensajeria.management.list.table.header.dateHourSi')}</span>
                </Tooltip>
                <TableSortLabel
                  active={showDateSIArrow}
                  direction={directionNumber === 'asc' ? 'asc' : 'desc'}
                  onClick={() => { orderByDate('SI') }}
                />
              </StyledTableCell>

              <StyledTableCell
                className={classes.headTableCell}
                rowSpan={1}
                onMouseOver={() => changeHoverOver('DateMSM', true)}
                onMouseLeave={() => changeHoverLeave('DateMSM')}
              >
                <Tooltip title={t('controlMensajeria.management.list.table.header.tooltipMsm')} placement='bottom'>
                  <span>{t('controlMensajeria.management.list.table.header.dateHourMsm')}</span>
                </Tooltip>
                <TableSortLabel
                  active={showDateMSMArrow}
                  direction={directionNumber === 'asc' ? 'asc' : 'desc'}
                  onClick={() => { orderByDate('NO') }}
                />
              </StyledTableCell>

              <StyledTableCell
                className={`${classes.headTableCell} extra`}
                rowSpan={1}
                onMouseOver={() => changeHoverOver('Province', true)}
                onMouseLeave={() => changeHoverLeave('Province')}
              >
                {t('controlMensajeria.management.list.table.header.province')}
                <TableSortLabel
                  active={showProvinceArrow}
                  direction={directionNumber === 'asc' ? 'asc' : 'desc'}
                  onClick={orderByProvince}
                />
              </StyledTableCell>

              <StyledTableCell
                className={classes.headTableCell}
                rowSpan={1}
                onMouseOver={() => changeHoverOver('Municipality', true)}
                onMouseLeave={() => changeHoverLeave('Municipality')}
              >
                {t('controlMensajeria.management.list.table.header.municipality')}
                <TableSortLabel
                  active={showMunicipalityArrow}
                  direction={directionNumber === 'asc' ? 'asc' : 'desc'}
                  onClick={orderByMunicipality}
                />
              </StyledTableCell>

              <StyledTableCell className={classes.headTableCell} rowSpan={1}>
                {t('controlMensajeria.management.list.table.header.docNumber')}
              </StyledTableCell>

              <StyledTableCell className={classes.headTableCell} rowSpan={1}>
                <img className={classes.iconV2} src={MobileIcon} alt='' />
              </StyledTableCell>

              <StyledTableCell className={classes.headTableCell} rowSpan={1}>
                <img className={classes.iconV2} src={EnvelopeIcon} alt='' />
              </StyledTableCell>

              <StyledTableCell className={classes.headTableCell} rowSpan={1}>
                <img className={classes.iconV2} src={AddressIcon} alt='' />
              </StyledTableCell>

              <StyledTableCell className={classes.headTableCell} rowSpan={1}>
                <img className={classes.iconV2} src={SentMail} alt='' />
              </StyledTableCell>

              <StyledTableCell className={classes.headTableCell} rowSpan={1}>
                <img className={classes.iconV2} src={SmsTextbox} alt='' />
              </StyledTableCell>

              <StyledTableCell
                className={`${classes.headTableCell} extra`}
                rowSpan={1}
                onMouseOver={() => changeHoverOver('Registered', true)}
                onMouseLeave={() => changeHoverLeave('Registered')}
              >
                {t('controlMensajeria.management.list.table.header.registered')}
                <TableSortLabel
                  active={showRegisteredArrow}
                  direction={directionNumber === 'asc' ? 'asc' : 'desc'}
                  onClick={orderByRegister}
                />
              </StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {
              listItems.length === 0 ?
                <TableRow className={classes.tableBodyRow} >
                  <StyledTableCell className={classes.noResults} colSpan={12}>
                    {t('controlMensajeria.management.list.table.body.noResults')}
                  </StyledTableCell>
                </TableRow>
                :
                listItems.slice(
                  (currentPage * itemsPerPage),
                  ((currentPage * itemsPerPage) + itemsPerPage)
                ).map(
                  (item, index) => (
                    <>
                      <TableRow key={index} className={classes.tableBodyRow}>

                        <StyledTableCell>{item.cups}</StyledTableCell>
                        <StyledTableCell>
                          {item.fecha}
                        </StyledTableCell>
                        <StyledTableCell>
                          {item.fechaMsm ? item.fechaMsm : ''}
                        </StyledTableCell>
                        <StyledTableCell>{item.provincia}</StyledTableCell>
                        <StyledTableCell>{item.municipio}</StyledTableCell>
                        <StyledTableCell>{item.docIdentificativo}</StyledTableCell>
                        <StyledTableCell style={{ textAlign: 'center' }}>
                          {item.telefono &&
                            <Tooltip title={item.telefono} placement='bottom'>
                              <img className={classes.icon} src={PhoneIcon} alt='' />
                            </Tooltip>
                          }
                        </StyledTableCell>
                        <StyledTableCell style={{ textAlign: 'center' }}>
                          {item.email &&
                            <Tooltip title={item.email.toLowerCase()} placement='bottom'>
                              <img className={classes.icon} src={EnvelopeIcon} alt='' />
                            </Tooltip>
                          }
                        </StyledTableCell>
                        <StyledTableCell style={{ textAlign: 'center' }}>
                          {item.direccion &&
                            <Tooltip title={item.direccion} placement='bottom'>
                              <img className={classes.icon} src={AddressIcon} alt='' />
                            </Tooltip>
                          }
                        </StyledTableCell>
                        <StyledTableCell style={{ textAlign: 'center' }}>
                          {item.tipoEnvio !== '02' &&
                            <Tooltip title={setTooltip(getMessageIcon(item.resultadoValidacion, false), item.descErrorValidacion)} placement='bottom'>
                              <img className={classes.icon} src={getMessageIcon(item.resultadoValidacion, true)} alt='' />
                            </Tooltip>
                          }
                        </StyledTableCell>
                        <StyledTableCell style={{ textAlign: 'center' }}>
                          {item.tipoEnvio === '02' &&
                            <Tooltip title={setTooltip(getMessageIcon(item.resultadoValidacion, false), item.descErrorValidacion)} placement='bottom'>
                              <img className={classes.icon} src={getMessageIcon(item.resultadoValidacion, true)} alt='' />
                            </Tooltip>
                          }
                        </StyledTableCell>
                        <StyledTableCell>{item.registrado}</StyledTableCell>

                      </TableRow>
                    </>
                  )
                )
            }
          </TableBody>
        </Table>
      }

      <Grid container className={classes.itemsPerPage}>
        <span style={{ marginRight: 5 }}>{t('common.pagination.show')}</span>
        <select id='number' name='number' onChange={onChangeSelector} className={classes.select}>
          <option value='20' selected>20</option>
          <option value='50'>50</option>
          <option value='100'>100</option>
        </select>
        <span style={{ marginLeft: 5 }}>{t('common.pagination.forPage')}</span>
      </Grid>

      {
        (listItems.length > itemsPerPage) &&
        <Grid container className={classes.paginationContainer}>
          <Pagination
            totalPages={totalPagesFilter}
            currentPage={currentPage}
            handleChangePage={setCurrentPage}
          />
        </Grid>
      }
    </Grid>
  )
}

export default List