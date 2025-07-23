import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import Select from '../../../../../common/components/select/Select'
import Spinner from '../../../../../common/components/spinner/Spinner'
import Button from '../../../../../common/components/button/Button'
import useStyles from './Header.styles'
import UpdateIcon from '../../../../../assets/icons/actualizar.svg'
import icon from '../../../../../assets/icons/guardar.svg'
import Kpi_OK from '../../../../../assets/icons/KPI_OK.svg'
import Kpi_KO from '../../../../../assets/icons/KPI_KO.svg'
import OkIcon from '../../../../../assets/icons/Interfaz_22_check_tick_validar_completo_verde.svg'
import ErrorIcon from '../../../../../assets/icons/Interfaz_24_cruz_cerrar_error_rojo.svg'
import EmailIcon from '../../../../../assets/icons/Interfaz_90_sobre_mail_correo_postal.svg'
import MobileIcon from '../../../../../assets/icons/Icon_sms.svg'
import NewSearchIcon from '../../../../../assets/icons/nueva_consulta.svg'
import { thunkGetListMunicipalities, thunkGetListProvinces, thunkGetMessagesFromDate } from '../../../../actions/ControlMensajeriaThunkActions'
import { multiply, parseInt } from 'lodash'
import { parse } from 'date-fns'
import DatepickerV3 from '../../../../../common/components/datepickerV3/DatepickerV3'
import Checkbox from '../../../../../common/components/checkbox/Checkbox'
import { formatDate } from '../../../../../common/lib/FormatLib'
import { thunkGetSearchedUser, thunkGetSearchedUser2 } from '../../../../../admin/store/actions/AdminThunkActions'
import MensajeriaResumeGraph from '../../../header/mensajeria-resume-graph/MensajeriaResumeGraph'

const Header = (props: any) => {

  const styles = useStyles({});
  const dispatch = useDispatch();
  const { t } = useTranslation();
  let diaAnterior: Date = new Date();
  diaAnterior.setDate(diaAnterior.getDate() - 1);



  const {
    statesList,
    loadingStatesList,
    counters,
    setCounters,
    listItems,
    setListItems,
    listItemsFiltered,
    setListItemsFiltered,
    registeredPercentage,
    registeredPercentage2,
    setRegisteredPercentage,
    setRegisteredPercentage2,
    datepickerDate1,
    setDatepickerDate1,
    datepickerDate2,
    setDatepickerDate2,
    province,
    setProvince,
    town,
    setTown,
    isLoadingList,
    setIsLoadingList,
    setCurrentPage,
    tempSelectedState,
    setTempSelectedState,
    isCheckboxSelectedSendCorrectly,
    setIsCheckboxSelectedSendCorrectly,
    isCheckboxSelectedInvalidEmailAndSMS,
    setIsCheckboxSelectedInvalidEmailAndSMS,
    isCheckboxSelectedOwnerRegistered,
    setIsCheckboxSelectedOwnerRegistered,
    isCheckboxSelectedOpositionRight,
    setIsCheckboxSelectedOpositionRight,
    isCheckboxSelectedInvalidCups,
    setIsCheckboxSelectedInvalidCups,
    executingNewSearch,
    setExecutingNewSearch,
    tabValue,
    setTabValue,
    tabletRes,
    mobileRes
  } = props

  const [loadingTownsList, setLoadingTownsList] = useState(false)

  // const [tempSelectedState, setTempSelectedState] = useState(3) // canal o tipo de mensaje
  const [tempSelectedState2, setTempSelectedState2] = useState(3) // ¿usuario registrado?

  const [provinceCode, setProvinceCode] = useState<string>('')
  const [townsList, setTownsList] = useState([] as any)

  const [totalRegisters, setTotalRegisters] = useState(0)

  let allProvinces = t('controlMensajeria.management.searchResume.all_f')
  let allMunicipalities = t('controlMensajeria.management.searchResume.all_m')

  const [countersAux, setCountersAux] = useState({
    registeredCounter: 0,
    registeredEmailCounter: 0,
    registeredSMSCounter: 0,
    notRegisteredCounter: 0,
    notRegisteredEmailCounter: 0,
    notRegisteredSMSCounter: 0,

  })

  var datesArray = []
  let auxListItemsFiltered = []

  const [resultHeader, setResultHeader] = useState<string>('');

  const removeAccents = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  const addCero = (str: number) => {
    if (str.toString().length === 1) {
      return '0' + str
    } else {
      return str
    }
  }

  const getDates = () => {
    let startDate = datepickerDate1.getTime()
    let endDate = datepickerDate2.getTime()

    let auxDate = new Date()
    let auxDatesArray = []

    while (endDate >= startDate) {
      auxDate.setTime(startDate)
      auxDatesArray.push(addCero(auxDate.getDate()) + '/' + addCero((auxDate.getMonth() + 1)) + '/' + auxDate.getFullYear())
      startDate = startDate + (1000 * 60 * 60 * 24)
    }

    if (auxDatesArray.length === 0) {
      auxDate.setTime(startDate)
      auxDatesArray.push(addCero(auxDate.getDate()) + '/' + addCero((auxDate.getMonth() + 1)) + '/' + auxDate.getFullYear())
    }

    datesArray = auxDatesArray
  }

  const doCounters = (data, listItemsAux?) => {
    let registrado = ''

    let contadorTotal = 0
    let contadorTotalSinRepetidos = 0
    let contadorRegistrado = 0
    let contadorRegistradoEmail = 0
    let contadorRegistradoSMS = 0
    let contadorNoRegistrado = 0
    let contadorNoRegistradoEmail = 0
    let contadorNoRegistradoSMS = 0
    let contadorEnviadoOk = 0
    let contadorEnviadoOkSinRepetidos = 0
    let contadorNoEnviado = 0
    let contadorNoEnviadoSinRepetidos = 0
    let contadorEnviadoOkEmail = 0
    let contadorEnviadoOkSMS = 0
    let contadorTipoEmail = 0
    let contadorTipoSMS = 0
    let contadorErrorEmail = 0
    let contadorErrorSMS = 0
    let contadorErrorNombreEmail = 0
    let contadorErrorNombreSMS = 0
    let titularRegistradoEmail = 0
    let titularRegistradoSMS = 0
    let derechoOpEmail = 0
    let derechoOpSMS = 0
    let invalidDocumentEmail = 0
    let invalidDocumentSMS = 0
    let invalidCupsEmail = 0
    let invalidCupsSMS = 0

    let arrayNifs = []
    let arrayCorrectlySend = []

    //  Arraya para controlar los NIFs repetidos y contabilizarlos sólo una vez
    let arrayNifsNoRepetidosTotal = []
    let arrayNifsNoRepetidosEnviadoOk = []
    let arrayNifsNoRepetidosNoEnviado = []
    let arrayNifsNoRepetidosRegistrado = []
    let arrayNifsNoRepetidosRegistradoNo = []

    data.map((item, index) => {
      if (province !== '' && province !== allProvinces) {
        if (town !== '' && town !== allMunicipalities) {
          if (town === item.municipio) {
            if (arrayNifsNoRepetidosTotal.find(element => element === item.docIdentificativo) === undefined) {
              arrayNifsNoRepetidosTotal.push(item.docIdentificativo)
              contadorTotalSinRepetidos++
            }
            contadorTotal++
            if (item.resultadoValidacion === '1') {
              arrayNifs.push(item.docIdentificativo)
              
              if (item.proceso === '11') {
                registrado = 'Si'
              } else {
                registrado = 'No'
              }
              item = ({ ...item, registrado })
              listItemsAux && listItemsAux.push(item)
              arrayCorrectlySend.push(item)
              if (item.resultadoEnvio === '1') {
                contadorEnviadoOk++
              }
              else {
                contadorNoEnviado++
              }
              if (arrayNifsNoRepetidosEnviadoOk.find(element => element === item.docIdentificativo) === undefined) {                
                if (item.resultadoEnvio === '1') {
                  arrayNifsNoRepetidosEnviadoOk.push(item.docIdentificativo)
                  contadorEnviadoOkSinRepetidos++
                }
              }
              if (arrayNifsNoRepetidosNoEnviado.find(element => element === item.docIdentificativo) === undefined) {
                if (item.resultadoEnvio !== '1') {
                  arrayNifsNoRepetidosNoEnviado.push(item.docIdentificativo)
                  contadorNoEnviadoSinRepetidos++
                }
              }
              // contadorEnviadoOk++        
              if (item.tipoEnvio === '01') {
                contadorEnviadoOkEmail++
                if (item.proceso === '11') {
                  if (arrayNifsNoRepetidosRegistrado.find(element => element === item.docIdentificativo) === undefined) {
                    arrayNifsNoRepetidosRegistrado.push(item.docIdentificativo)
                    contadorRegistrado++
                    contadorRegistradoEmail++
                    if (arrayNifsNoRepetidosRegistradoNo.find(element => element === item.docIdentificativo) !== undefined) {
                      contadorNoRegistrado--
                      contadorNoRegistradoEmail--
                    }
                  }
                  // contadorRegistrado++
                  // contadorRegistradoEmail++
                }else{
                  if (arrayNifsNoRepetidosRegistradoNo.find(element => element === item.docIdentificativo) === undefined &&
                  arrayNifsNoRepetidosRegistrado.find(element => element === item.docIdentificativo) === undefined) {
                    arrayNifsNoRepetidosRegistradoNo.push(item.docIdentificativo)
                    contadorNoRegistrado++
                    contadorNoRegistradoEmail++
                  }
                  // contadorNoRegistrado++
                  // contadorNoRegistradoEmail++
                }
              } else if (item.tipoEnvio === '02') {
                contadorEnviadoOkSMS++
                if (item.proceso === '11') {
                  if (arrayNifsNoRepetidosRegistrado.find(element => element === item.docIdentificativo) === undefined) {
                    arrayNifsNoRepetidosRegistrado.push(item.docIdentificativo)
                    contadorRegistrado++
                    contadorRegistradoSMS++
                    if (arrayNifsNoRepetidosRegistradoNo.find(element => element === item.docIdentificativo) !== undefined) {
                      contadorNoRegistrado--
                      contadorNoRegistradoSMS--
                    }
                  }
                  // contadorRegistrado++
                  // contadorRegistradoSMS++
                }else{
                  if (arrayNifsNoRepetidosRegistradoNo.find(element => element === item.docIdentificativo) === undefined &&
                  arrayNifsNoRepetidosRegistrado.find(element => element === item.docIdentificativo) === undefined) {
                    arrayNifsNoRepetidosRegistradoNo.push(item.docIdentificativo)
                    contadorNoRegistrado++
                    contadorNoRegistradoSMS++
                  }
                    // contadorNoRegistrado++
                    // contadorNoRegistradoSMS++
                  }
              }
                       
            } else if (item.resultadoValidacion === '0') {
              if (item.resultadoEnvio !== '1') {
                contadorNoEnviado++
              }
              if (arrayNifsNoRepetidosNoEnviado.find(element => element === item.docIdentificativo) === undefined) {
                if (item.resultadoEnvio !== '1') {
                  arrayNifsNoRepetidosNoEnviado.push(item.docIdentificativo)
                  contadorNoEnviadoSinRepetidos++
                }
              }
              if (item.proceso === '11') {
                registrado = 'Si'
              } else {
                registrado = 'No'
              }
              item = ({ ...item, registrado })
              listItemsAux && listItemsAux.push(item)
              if (item.descErrorValidacion === '1') {
                if (item.tipoEnvio === '01') {
                  contadorErrorEmail++
                } else if (item.tipoEnvio === '02') {
                  contadorErrorSMS++
                } else {
                  contadorErrorEmail++
                }
              } else if (item.descErrorValidacion === '2') {
                if (item.tipoEnvio === '01') {
                  contadorErrorNombreEmail++
                } else if (item.tipoEnvio === '02') {
                  contadorErrorNombreSMS++
                } else {
                  contadorErrorNombreEmail++
                }
              } else if (item.descErrorValidacion === '3') {
                if (item.tipoEnvio === '01') {
                  titularRegistradoEmail++
                } else if (item.tipoEnvio === '02') {
                  titularRegistradoSMS++
                } else {
                  titularRegistradoEmail++
                }
              } else if (item.descErrorValidacion === '4') {
                if (item.tipoEnvio === '01') {
                  derechoOpEmail++
                } else if (item.tipoEnvio === '02') {
                  derechoOpSMS++
                } else {
                  derechoOpEmail++
                }
              } else if (item.descErrorValidacion === '5') {
                if (item.tipoEnvio === '01') {
                  invalidDocumentEmail++
                } else if (item.tipoEnvio === '02') {
                  invalidDocumentSMS++
                } else {
                  invalidDocumentEmail++
                }
              } else if (item.descErrorValidacion === '6') {
                if (item.tipoEnvio === '01') {
                  invalidCupsEmail++
                } else if (item.tipoEnvio === '02') {
                  invalidCupsSMS++
                } else {
                  invalidCupsEmail++
                }
              }
            }

            if (item.tipoEnvio === '01') {
              contadorTipoEmail++
            } else if (item.tipoEnvio === '02') {
              contadorTipoSMS++
            } else {
              contadorTipoEmail++
            }
          }
        } else if (province === item.provincia) {
          if (arrayNifsNoRepetidosTotal.find(element => element === item.docIdentificativo) === undefined) {
            arrayNifsNoRepetidosTotal.push(item.docIdentificativo)
            contadorTotalSinRepetidos++
          }
          contadorTotal++
          if (item.resultadoValidacion === '1') {
            arrayNifs.push(item.docIdentificativo)
            
            if (item.proceso === '11') {
              registrado = 'Si'
            } else {
              registrado = 'No'
            }
            item = ({ ...item, registrado })
            listItemsAux && listItemsAux.push(item)
            arrayCorrectlySend.push(item)
            if (item.resultadoEnvio === '1') {
              contadorEnviadoOk++
            }
            else {
              contadorNoEnviado++
            }
            if (arrayNifsNoRepetidosEnviadoOk.find(element => element === item.docIdentificativo) === undefined) {                
              if (item.resultadoEnvio === '1') {
                arrayNifsNoRepetidosEnviadoOk.push(item.docIdentificativo)
                contadorEnviadoOkSinRepetidos++
              }
            }
            if (arrayNifsNoRepetidosNoEnviado.find(element => element === item.docIdentificativo) === undefined) {
              if (item.resultadoEnvio !== '1') {
                arrayNifsNoRepetidosNoEnviado.push(item.docIdentificativo)
                contadorNoEnviadoSinRepetidos++
              }
            }
            // contadorEnviadoOk++
            if (item.tipoEnvio === '01') {
              contadorEnviadoOkEmail++
              if (item.proceso === '11') {
                if (arrayNifsNoRepetidosRegistrado.find(element => element === item.docIdentificativo) === undefined) {
                  arrayNifsNoRepetidosRegistrado.push(item.docIdentificativo)
                  contadorRegistrado++
                  contadorRegistradoEmail++
                  if (arrayNifsNoRepetidosRegistradoNo.find(element => element === item.docIdentificativo) !== undefined) {
                    contadorNoRegistrado--
                    contadorNoRegistradoEmail--
                  }
                }
                // contadorRegistrado++
                // contadorRegistradoEmail++
              }else{
                if (arrayNifsNoRepetidosRegistradoNo.find(element => element === item.docIdentificativo) === undefined &&
                arrayNifsNoRepetidosRegistrado.find(element => element === item.docIdentificativo) === undefined) {
                  arrayNifsNoRepetidosRegistradoNo.push(item.docIdentificativo)
                  contadorNoRegistrado++
                  contadorNoRegistradoEmail++
                }
                // contadorNoRegistrado++
                // contadorNoRegistradoEmail++
              }
            } else if (item.tipoEnvio === '02') {
              contadorEnviadoOkSMS++
              if (item.proceso === '11') {
                if (arrayNifsNoRepetidosRegistrado.find(element => element === item.docIdentificativo) === undefined) {
                  arrayNifsNoRepetidosRegistrado.push(item.docIdentificativo)
                  contadorRegistrado++
                  contadorRegistradoSMS++
                  if (arrayNifsNoRepetidosRegistradoNo.find(element => element === item.docIdentificativo) !== undefined) {
                    contadorNoRegistrado--
                    contadorNoRegistradoSMS--
                  }
                }
                // contadorRegistrado++
                // contadorRegistradoSMS++
              }else{
                if (arrayNifsNoRepetidosRegistradoNo.find(element => element === item.docIdentificativo) === undefined &&
                arrayNifsNoRepetidosRegistrado.find(element => element === item.docIdentificativo) === undefined) {
                  arrayNifsNoRepetidosRegistradoNo.push(item.docIdentificativo)
                  contadorNoRegistrado++
                  contadorNoRegistradoSMS++
                }
                  // contadorNoRegistrado++
                  // contadorNoRegistradoSMS++
                }
            }
            
          } else if (item.resultadoValidacion === '0') {
            if (item.resultadoEnvio !== '1') {
              contadorNoEnviado++
            }
            if (arrayNifsNoRepetidosNoEnviado.find(element => element === item.docIdentificativo) === undefined) {
              if (item.resultadoEnvio !== '1') {
                arrayNifsNoRepetidosNoEnviado.push(item.docIdentificativo)
                contadorNoEnviadoSinRepetidos++
              }
            }
            if (item.proceso === '11') {
              registrado = 'Si'
            } else {
              registrado = 'No'
            }
            item = ({ ...item, registrado })
            listItemsAux && listItemsAux.push(item)
            if (item.descErrorValidacion === '1') {
              if (item.tipoEnvio === '01') {
                contadorErrorEmail++
              } else if (item.tipoEnvio === '02') {
                contadorErrorSMS++
              } else {
                contadorErrorEmail++
              }
            } else if (item.descErrorValidacion === '2') {
              if (item.tipoEnvio === '01') {
                contadorErrorNombreEmail++
              } else if (item.tipoEnvio === '02') {
                contadorErrorNombreSMS++
              } else {
                contadorErrorNombreEmail++
              }
            } else if (item.descErrorValidacion === '3') {
              if (item.tipoEnvio === '01') {
                titularRegistradoEmail++
              } else if (item.tipoEnvio === '02') {
                titularRegistradoSMS++
              } else {
                titularRegistradoEmail++
              }
            } else if (item.descErrorValidacion === '4') {
              if (item.tipoEnvio === '01') {
                derechoOpEmail++
              } else if (item.tipoEnvio === '02') {
                derechoOpSMS++
              } else {
                derechoOpEmail++
              }
            } else if (item.descErrorValidacion === '5') {
              if (item.tipoEnvio === '01') {
                invalidDocumentEmail++
              } else if (item.tipoEnvio === '02') {
                invalidDocumentSMS++
              } else {
                invalidDocumentEmail++
              }
            } else if (item.descErrorValidacion === '6') {
              if (item.tipoEnvio === '01') {
                invalidCupsEmail++
              } else if (item.tipoEnvio === '02') {
                invalidCupsSMS++
              } else {
                invalidCupsEmail++
              }
            }
          }

          if (item.tipoEnvio === '01') {
            contadorTipoEmail++
          } else if (item.tipoEnvio === '02') {
            contadorTipoSMS++
          } else {
            contadorTipoEmail++
          }

        }
      } else {
        if (arrayNifsNoRepetidosTotal.find(element => element === item.docIdentificativo) === undefined) {
          arrayNifsNoRepetidosTotal.push(item.docIdentificativo)
          contadorTotalSinRepetidos++
        }
        contadorTotal++
        if (item.resultadoValidacion === '1') {
          arrayNifs.push(item.docIdentificativo)
          
          if (item.proceso === '11') {
            registrado = 'Si'
          } else {
            registrado = 'No'
          }
          item = ({ ...item, registrado })
          listItemsAux && listItemsAux.push(item)
          arrayCorrectlySend.push(item)
          if (item.resultadoEnvio === '1') {
            contadorEnviadoOk++
          }
          else {
            contadorNoEnviado++
          }
          if (arrayNifsNoRepetidosEnviadoOk.find(element => element === item.docIdentificativo) === undefined) {                
            if (item.resultadoEnvio === '1') {
              arrayNifsNoRepetidosEnviadoOk.push(item.docIdentificativo)
              contadorEnviadoOkSinRepetidos++
            }
          }
          if (arrayNifsNoRepetidosNoEnviado.find(element => element === item.docIdentificativo) === undefined) {
            if (item.resultadoEnvio !== '1') {
              arrayNifsNoRepetidosNoEnviado.push(item.docIdentificativo)
              contadorNoEnviadoSinRepetidos++
            }
          }
          // contadorEnviadoOk++
          if (item.tipoEnvio === '01') {
            contadorEnviadoOkEmail++
            if (item.proceso === '11') {
              if (arrayNifsNoRepetidosRegistrado.find(element => element === item.docIdentificativo) === undefined) {
                arrayNifsNoRepetidosRegistrado.push(item.docIdentificativo)
                contadorRegistrado++
                contadorRegistradoEmail++
                if (arrayNifsNoRepetidosRegistradoNo.find(element => element === item.docIdentificativo) !== undefined) {
                  contadorNoRegistrado--
                  contadorNoRegistradoEmail--
                }
              }
              // contadorRegistrado++
              // contadorRegistradoEmail++
            }else{
              if (arrayNifsNoRepetidosRegistradoNo.find(element => element === item.docIdentificativo) === undefined &&
              arrayNifsNoRepetidosRegistrado.find(element => element === item.docIdentificativo) === undefined) {
                arrayNifsNoRepetidosRegistradoNo.push(item.docIdentificativo)
                contadorNoRegistrado++
                contadorNoRegistradoEmail++
              }
              // contadorNoRegistrado++
              // contadorNoRegistradoEmail++
            }
          } else if (item.tipoEnvio === '02') {
            contadorEnviadoOkSMS++
            if (item.proceso === '11') {
              if (arrayNifsNoRepetidosRegistrado.find(element => element === item.docIdentificativo) === undefined) {
                arrayNifsNoRepetidosRegistrado.push(item.docIdentificativo)
                contadorRegistrado++
                contadorRegistradoSMS++
                if (arrayNifsNoRepetidosRegistradoNo.find(element => element === item.docIdentificativo) !== undefined) {
                  contadorNoRegistrado--
                  contadorNoRegistradoSMS--
                }
              }
              // contadorRegistrado++
              // contadorRegistradoSMS++
            }else{
              if (arrayNifsNoRepetidosRegistradoNo.find(element => element === item.docIdentificativo) === undefined &&
              arrayNifsNoRepetidosRegistrado.find(element => element === item.docIdentificativo) === undefined) {
                arrayNifsNoRepetidosRegistradoNo.push(item.docIdentificativo)
                contadorNoRegistrado++
                contadorNoRegistradoSMS++
              }
                // contadorNoRegistrado++
                // contadorNoRegistradoSMS++
              }
          }

        } else if (item.resultadoValidacion === '0') {
          if (item.resultadoEnvio !== '1') {
            contadorNoEnviado++
          }
          if (arrayNifsNoRepetidosNoEnviado.find(element => element === item.docIdentificativo) === undefined) {
            if (item.resultadoEnvio !== '1') {
              arrayNifsNoRepetidosNoEnviado.push(item.docIdentificativo)
              contadorNoEnviadoSinRepetidos++
            }
          }
          if (item.proceso === '11') {
            registrado = 'Si'
          } else {
            registrado = 'No'
          }
          item = ({ ...item, registrado })
          listItemsAux && listItemsAux.push(item)
          if (item.descErrorValidacion === '1') {
            if (item.tipoEnvio === '01') {
              contadorErrorEmail++
            } else if (item.tipoEnvio === '02') {
              contadorErrorSMS++
            } else {
              contadorErrorEmail++
            }
          } else if (item.descErrorValidacion === '2') {
            if (item.tipoEnvio === '01') {
              contadorErrorNombreEmail++
            } else if (item.tipoEnvio === '02') {
              contadorErrorNombreSMS++
            } else {
              contadorErrorNombreEmail++
            }
          } else if (item.descErrorValidacion === '3') {
            if (item.tipoEnvio === '01') {
              titularRegistradoEmail++
            } else if (item.tipoEnvio === '02') {
              titularRegistradoSMS++
            } else {
              titularRegistradoEmail++
            }
          } else if (item.descErrorValidacion === '4') {
            if (item.tipoEnvio === '01') {
              derechoOpEmail++
            } else if (item.tipoEnvio === '02') {
              derechoOpSMS++
            } else {
              derechoOpEmail++
            }
          } else if (item.descErrorValidacion === '5') {
            if (item.tipoEnvio === '01') {
              invalidDocumentEmail++
            } else if (item.tipoEnvio === '02') {
              invalidDocumentSMS++
            } else {
              invalidDocumentEmail++
            }
          } else if (item.descErrorValidacion === '6') {
            if (item.tipoEnvio === '01') {
              invalidCupsEmail++
            } else if (item.tipoEnvio === '02') {
              invalidCupsSMS++
            } else {
              invalidCupsEmail++
            }
          }
        }

        if (item.tipoEnvio === '01') {
          contadorTipoEmail++
        } else if (item.tipoEnvio === '02') {
          contadorTipoSMS++
        } else {
          contadorTipoEmail++
        }
      }


    })

    setCounters({
      ...counters,
      totalCounter: contadorTotal,
      totalCounterNoDuplicates: contadorTotalSinRepetidos,
      registeredCounter: contadorRegistrado,
      registeredEmailCounter: contadorRegistradoEmail,
      registeredSMSCounter: contadorRegistradoSMS,
      notRegisteredCounter: contadorNoRegistrado,
      notRegisteredEmailCounter: contadorNoRegistradoEmail,
      notRegisteredSMSCounter: contadorNoRegistradoSMS,
      correctlySendCounter: contadorEnviadoOk,
      correctlySendCounterNoDuplicates: contadorEnviadoOkSinRepetidos,
      notSent: contadorNoEnviado,
      notSentNoDuplicates: contadorNoEnviadoSinRepetidos,
      correctlySendEmailCounter: contadorEnviadoOkEmail,
      correctlySendSMSCounter: contadorEnviadoOkSMS,
      emailTypeCounter: contadorTipoEmail,
      smsTypeCounter: contadorTipoSMS,
      emailErrorCounter: contadorErrorEmail,
      smsErrorCounter: contadorErrorSMS,
      noNameErrorEmailCounter: contadorErrorNombreEmail,
      noNameErrorSMSCounter: contadorErrorNombreSMS,
      ownerRegisteredEmailCounter: titularRegistradoEmail,
      ownerRegisteredSMSCounter: titularRegistradoSMS,
      oppositionRightEmailCounter: derechoOpEmail,
      oppositionRightSMSCounter: derechoOpSMS,
      invalidDocumentEmailCounter: invalidDocumentEmail,
      invalidDocumentSMSCounter: invalidDocumentSMS,
      invalidCupsEmailCounter: invalidCupsEmail,
      invalidCupsSMSCounter: invalidCupsSMS
    })

    setTotalRegisters(contadorTotal)
  }

  const handelGetData = () => {

    getDates()

    setIsLoadingList(true);

    let listItemsAux = []

    dispatch(thunkGetMessagesFromDate(datesArray, (response) => {
      if (response) {
        doCounters(response.items, listItemsAux)
        setIsLoadingList(false)
      }

    }))
    setListItems(listItemsAux)
  }

  const handleChangeInput = (input, value): any => {
    if (input === 'state') {
      // provincia
      dispatch(thunkGetListProvinces(value, (response) => {
        if (response && response.provinces && response.provinces.items && response.provinces.items.length > 0) {
          setProvinceCode(response.provinces.items[0].provinceCode)
          setProvince(value);
        }
      }));

      if (value === allProvinces) {
        setProvince(value);
        setTown(t('controlMensajeria.management.searchResume.all_m'))
      } else {
        setTown('')
      }

    } else if (input === 'town') {
      // municipio
      dispatch(thunkGetListMunicipalities(value, '', '', '', (response) => {
        if (response && response.municipalities && response.municipalities.items && response.municipalities.items.length > 0) {
          setTown(value)
        }
      }));
    }
  }

  const formatText = (text: string): string => {
    return (text.substring(0, 1) + text.substring(1, text.length).toLowerCase())
  }

  const formatDate = (date: Date): string => {
    return (addCero(date.getDate()) + '/' + addCero((date.getMonth() + 1)) + '/' + date.getFullYear())
  }

  const setHeader = () => {
    let auxString = ''
    if (province !== '' && province !== allProvinces) {
      auxString += formatText(province)
    } else {
      auxString += t('controlMensajeria.management.searchResume.searchResult.allProvinces')
    }

    auxString += t('common.punctuation.hyphen')

    if (town !== '' && town !== allMunicipalities) {
      auxString += formatText(town)
    } else {
      auxString += t('controlMensajeria.management.searchResume.searchResult.allMunicipalities')
    }

    setResultHeader(auxString)
  }

  const newSearch = () => {
    tabValue !== 0 && setTabValue(0)  //  Cuando lanzamos una nueva consulta, volvemos a la pestaña de resultados de la consulta si nos encontramos en la pestaña de la gráfica
    setExecutingNewSearch(executingNewSearch ? false : true)
    setTempSelectedState(3)
    setTempSelectedState2(3)
    setIsCheckboxSelectedSendCorrectly(true)
    setIsCheckboxSelectedInvalidEmailAndSMS(true)
    setIsCheckboxSelectedOwnerRegistered(true)
    setIsCheckboxSelectedOpositionRight(true)
    setIsCheckboxSelectedInvalidCups(true)
    setCounters({
      ...counters,
      totalCounter: 0,
      totalCounterNoDuplicates: 0,
      registeredCounter: 0,
      registeredEmailCounter: 0,
      registeredSMSCounter: 0,
      notRegisteredCounter: 0,
      notRegisteredEmailCounter: 0,
      notRegisteredSMSCounter: 0,
      correctlySendCounter: 0,
      correctlySendCounterNoDuplicates: 0,
      correctlySendEmailCounter: 0,
      correctlySendSMSCounter: 0,
      emailTypeCounter: 0,
      smsTypeCounter: 0,
      emailErrorCounter: 0,
      smsErrorCounter: 0,
      noNameErrorEmailCounter: 0,
      noNameErrorSMSCounter: 0,
      ownerRegisteredEmailCounter: 0,
      ownerRegisteredSMSCounter: 0,
      oppositionRightEmailCounter: 0,
      oppositionRightSMSCounter: 0,
      invalidDocumentEmailCounter: 0,
      invalidDocumentSMSCounter: 0,
      invalidCupsEmailCounter: 0,
      invalidCupsSMSCounter: 0
    })
    setCurrentPage(0)
    setRegisteredPercentage(0)
    setRegisteredPercentage2(0)
    setHeader()
    handelGetData()
  }

  const setAllCounters = (list: any, channel: number) => {
    let contadorTipoEmail = 0
    let contadorTipoSMS = 0
    let contadorErrorEmail = 0
    let contadorErrorSMS = 0
    let contadorErrorNombreEmail = 0
    let contadorErrorNombreSMS = 0
    let titularRegistradoEmail = 0
    let titularRegistradoSMS = 0
    let derechoOpEmail = 0
    let derechoOpSMS = 0
    let invalidDocumentEmail = 0
    let invalidDocumentSMS = 0
    let invalidCupsEmail = 0
    let invalidCupsSMS = 0

    list.map((item) => {
      if (item.tipoEnvio === '01') {
        contadorTipoEmail++
        if (item.descErrorValidacion === '1') {
          contadorErrorEmail++
        } else if (item.descErrorValidacion === '2') {
          contadorErrorNombreEmail++
        } else if (item.descErrorValidacion === '3') {
          titularRegistradoEmail++
        } else if (item.descErrorValidacion === '4') {
          derechoOpEmail++
        } else if (item.descErrorValidacion === '5') {
          invalidDocumentEmail++
        } else if (item.descErrorValidacion === '6') {
          invalidCupsEmail++
        }
      } else if (item.tipoEnvio === '02') {
        contadorTipoSMS++
        if (item.descErrorValidacion === '1') {
          contadorErrorSMS++
        } else if (item.descErrorValidacion === '2') {
          contadorErrorNombreSMS++
        } else if (item.descErrorValidacion === '3') {
          titularRegistradoSMS++
        } else if (item.descErrorValidacion === '4') {
          derechoOpSMS++
        } else if (item.descErrorValidacion === '5') {
          invalidDocumentSMS++
        } else if (item.descErrorValidacion === '6') {
          invalidCupsSMS++
        }
      } else {
        contadorTipoEmail++
        if (item.descErrorValidacion === '1') {
          contadorErrorEmail++
        } else if (item.descErrorValidacion === '2') {
          contadorErrorNombreEmail++
        } else if (item.descErrorValidacion === '3') {
          titularRegistradoEmail++
        } else if (item.descErrorValidacion === '4') {
          derechoOpEmail++
        } else if (item.descErrorValidacion === '5') {
          invalidDocumentEmail++
        } else if (item.descErrorValidacion === '6') {
          invalidCupsEmail++
        }
      }
    })

    if (channel === 1) {
      setCounters({
        ...counters,
        totalCounter: contadorTipoEmail,
        registeredCounter: counters.registeredEmailCounter,
        registeredEmailCounter: counters.registeredEmailCounter,
        registeredSMSCounter: counters.registeredSMSCounter,
        notRegisteredCounter: counters.notRegisteredEmailCounter,
        notRegisteredEmailCounter: counters.notRegisteredEmailCounter,
        notRegisteredSMSCounter: counters.notRegisteredSMSCounter,
        correctlySendCounter: counters.correctlySendEmailCounter,
        correctlySendEmailCounter: counters.correctlySendEmailCounter,
        correctlySendSMSCounter: counters.correctlySendSMSCounter,
        emailTypeCounter: contadorTipoEmail,
        smsTypeCounter: contadorTipoSMS,
        emailErrorCounter: contadorErrorEmail,
        smsErrorCounter: contadorErrorSMS,
        noNameErrorEmailCounter: contadorErrorNombreEmail,
        noNameErrorSMSCounter: contadorErrorNombreSMS,
        ownerRegisteredEmailCounter: titularRegistradoEmail,
        ownerRegisteredSMSCounter: titularRegistradoSMS,
        oppositionRightEmailCounter: derechoOpEmail,
        oppositionRightSMSCounter: derechoOpSMS,
        invalidDocumentEmailCounter: invalidDocumentEmail,
        invalidDocumentSMSCounter: invalidDocumentSMS,
        invalidCupsEmailCounter: invalidCupsEmail,
        invalidCupsSMSCounter: invalidCupsSMS
      })
    } else if (channel === 2) {
      setCounters({
        ...counters,
        totalCounter: contadorTipoSMS,
        registeredCounter: counters.registeredSMSCounter,
        registeredEmailCounter: counters.registeredEmailCounter,
        registeredSMSCounter: counters.registeredSMSCounter,
        notRegisteredCounter: counters.notRegisteredSMSCounter,
        notRegisteredEmailCounter: counters.notRegisteredEmailCounter,
        notRegisteredSMSCounter: counters.notRegisteredSMSCounter,
        correctlySendCounter: counters.correctlySendSMSCounter,
        correctlySendEmailCounter: counters.correctlySendEmailCounter,
        correctlySendSMSCounter: counters.correctlySendSMSCounter,
        emailTypeCounter: contadorTipoEmail,
        smsTypeCounter: contadorTipoSMS,
        emailErrorCounter: contadorErrorEmail,
        smsErrorCounter: contadorErrorSMS,
        noNameErrorEmailCounter: contadorErrorNombreEmail,
        noNameErrorSMSCounter: contadorErrorNombreSMS,
        ownerRegisteredEmailCounter: titularRegistradoEmail,
        ownerRegisteredSMSCounter: titularRegistradoSMS,
        oppositionRightEmailCounter: derechoOpEmail,
        oppositionRightSMSCounter: derechoOpSMS,
        invalidDocumentEmailCounter: invalidDocumentEmail,
        invalidDocumentSMSCounter: invalidDocumentSMS,
        invalidCupsEmailCounter: invalidCupsEmail,
        invalidCupsSMSCounter: invalidCupsSMS
      })
    } else if (channel === 3) {
      setCounters({
        ...counters,
        totalCounter: contadorTipoEmail + contadorTipoSMS,
        registeredCounter: counters.registeredEmailCounter + counters.registeredSMSCounter,
        registeredEmailCounter: counters.registeredEmailCounter,
        registeredSMSCounter: counters.registeredSMSCounter,
        notRegisteredCounter: counters.notRegisteredEmailCounter + counters.notRegisteredSMSCounter,
        notRegisteredEmailCounter: counters.notRegisteredEmailCounter,
        notRegisteredSMSCounter: counters.notRegisteredSMSCounter,
        correctlySendCounter: counters.correctlySendEmailCounter + counters.correctlySendSMSCounter,
        correctlySendEmailCounter: counters.correctlySendEmailCounter,
        correctlySendSMSCounter: counters.correctlySendSMSCounter,
        emailTypeCounter: contadorTipoEmail,
        smsTypeCounter: contadorTipoSMS,
        emailErrorCounter: contadorErrorEmail,
        smsErrorCounter: contadorErrorSMS,
        noNameErrorEmailCounter: contadorErrorNombreEmail,
        noNameErrorSMSCounter: contadorErrorNombreSMS,
        ownerRegisteredEmailCounter: titularRegistradoEmail,
        ownerRegisteredSMSCounter: titularRegistradoSMS,
        oppositionRightEmailCounter: derechoOpEmail,
        oppositionRightSMSCounter: derechoOpSMS,
        invalidDocumentEmailCounter: invalidDocumentEmail,
        invalidDocumentSMSCounter: invalidDocumentSMS,
        invalidCupsEmailCounter: invalidCupsEmail,
        invalidCupsSMSCounter: invalidCupsSMS
      })
    }
  }

  const setTotalCounters = (list: any, type?: boolean) => {
    let contadorTotal = 0
    let contadorTotalSinRepetidos = 0
    let contadorTipoEmail = 0
    let contadorTipoSMS = 0
    let contadorErrorEmail = 0
    let contadorErrorSMS = 0
    let contadorErrorNombreEmail = 0
    let contadorErrorNombreSMS = 0
    let titularRegistradoEmail = 0
    let titularRegistradoSMS = 0
    let derechoOpEmail = 0
    let derechoOpSMS = 0
    let invalidDocumentEmail = 0
    let invalidDocumentSMS = 0
    let invalidCupsEmail = 0
    let invalidCupsSMS = 0

    let arrayNifsNoRepetidosTotal = []

    list.map((item) => {
      if (arrayNifsNoRepetidosTotal.find(element => element === item.docIdentificativo) === undefined) {
        arrayNifsNoRepetidosTotal.push(item.docIdentificativo)
        contadorTotalSinRepetidos++
      }
      contadorTotal++

      if (item.tipoEnvio === '01') {
        contadorTipoEmail++
        if (item.descErrorValidacion === '1') {
          contadorErrorEmail++
        } else if (item.descErrorValidacion === '2') {
          contadorErrorNombreEmail++
        } else if (item.descErrorValidacion === '3') {
          titularRegistradoEmail++
        } else if (item.descErrorValidacion === '4') {
          derechoOpEmail++
        } else if (item.descErrorValidacion === '5') {
          invalidDocumentEmail++
        } else if (item.descErrorValidacion === '6') {
          invalidCupsEmail++
        }
      } else if (item.tipoEnvio === '02') {
        contadorTipoSMS++
        if (item.descErrorValidacion === '1') {
          contadorErrorSMS++
        } else if (item.descErrorValidacion === '2') {
          contadorErrorNombreSMS++
        } else if (item.descErrorValidacion === '3') {
          titularRegistradoSMS++
        } else if (item.descErrorValidacion === '4') {
          derechoOpSMS++
        } else if (item.descErrorValidacion === '5') {
          invalidDocumentSMS++
        } else if (item.descErrorValidacion === '6') {
          invalidCupsSMS++
        }
      } else {
        contadorTipoEmail++
        if (item.descErrorValidacion === '1') {
          contadorErrorEmail++
        } else if (item.descErrorValidacion === '2') {
          contadorErrorNombreEmail++
        } else if (item.descErrorValidacion === '3') {
          titularRegistradoEmail++
        } else if (item.descErrorValidacion === '4') {
          derechoOpEmail++
        } else if (item.descErrorValidacion === '5') {
          invalidDocumentEmail++
        } else if (item.descErrorValidacion === '6') {
          invalidCupsEmail++
        }
      }
    })

    if (counters.registeredCounter !== 0 || counters.registeredEmailCounter !== 0 || counters.registeredSMSCounter !== 0 || counters.notRegisteredCounter !== 0 || counters.notRegisteredEmailCounter !== 0 || counters.notRegisteredSMSCounter !== 0) {
      setCountersAux({
        ...countersAux,
        registeredCounter: counters.registeredCounter,
        registeredEmailCounter: counters.registeredEmailCounter,
        registeredSMSCounter: counters.registeredSMSCounter,
        notRegisteredCounter: counters.notRegisteredCounter,
        notRegisteredEmailCounter: counters.notRegisteredEmailCounter,
        notRegisteredSMSCounter: counters.notRegisteredSMSCounter
      })
    }

    setCounters({
      ...counters,
      totalCounter: contadorTotal,
      totalCounterNoDuplicates: contadorTotalSinRepetidos,
      registeredCounter: typeof type === 'undefined' ? counters.registeredCounter : (type === false ? 0 : countersAux.registeredCounter),
      registeredEmailCounter: typeof type === 'undefined' ? counters.registeredEmailCounter : (type === false ? 0 : countersAux.registeredEmailCounter),
      registeredSMSCounter: typeof type === 'undefined' ? counters.registeredSMSCounter : (type === false ? 0 : countersAux.registeredSMSCounter),
      notRegisteredCounter: typeof type === 'undefined' ? counters.notRegisteredCounter : (type === false ? 0 : countersAux.notRegisteredCounter),
      notRegisteredEmailCounter: typeof type === 'undefined' ? counters.notRegisteredEmailCounter : (type === false ? 0 : countersAux.notRegisteredEmailCounter),
      notRegisteredSMSCounter: typeof type === 'undefined' ? counters.notRegisteredSMSCounter : (type === false ? 0 : countersAux.notRegisteredSMSCounter),
      correctlySendCounter: counters.correctlySendCounter,
      correctlySendCounterNoDuplicates: counters.correctlySendCounterNoDuplicates,
      correctlySendEmailCounter: counters.correctlySendEmailCounter,
      correctlySendSMSCounter: counters.correctlySendSMSCounter,
      emailTypeCounter: contadorTipoEmail,
      smsTypeCounter: contadorTipoSMS,
      emailErrorCounter: contadorErrorEmail,
      smsErrorCounter: contadorErrorSMS,
      noNameErrorEmailCounter: contadorErrorNombreEmail,
      noNameErrorSMSCounter: contadorErrorNombreSMS,
      ownerRegisteredEmailCounter: titularRegistradoEmail,
      ownerRegisteredSMSCounter: titularRegistradoSMS,
      oppositionRightEmailCounter: derechoOpEmail,
      oppositionRightSMSCounter: derechoOpSMS,
      invalidDocumentEmailCounter: invalidDocumentEmail,
      invalidDocumentSMSCounter: invalidDocumentSMS,
      invalidCupsEmailCounter: invalidCupsEmail,
      invalidCupsSMSCounter: invalidCupsSMS
    })

  }

  useEffect(() => {
    if (counters.correctlySendCounter > 0 && counters.totalCounter > 0) {
      const percentage = (counters.correctlySendCounter * 100) / counters.totalCounter
      setRegisteredPercentage(percentage.toFixed(0))
    }
    if (counters.registeredCounter > 0 && counters.correctlySendCounterNoDuplicates > 0) {
      const shipmentsPercentage = (counters.registeredCounter * 100) / counters.correctlySendCounterNoDuplicates
      setRegisteredPercentage2(shipmentsPercentage.toFixed(0))
    }
  }, [counters, setCounters])

  useEffect(() => {
    setListItemsFiltered(listItems)
  }, [listItems])

  const handleChangeChannel = (temp: number) => {
    setCurrentPage(0)

    auxListItemsFiltered = []
    if (temp === 1) {
      listItems.map((auxItem) => {
        if (auxItem.tipoEnvio !== '02') {
          if (isCheckboxSelectedSendCorrectly) {
            if (auxItem.resultadoValidacion === '1') {
              auxListItemsFiltered.push(auxItem)
            }
          }
          if (isCheckboxSelectedInvalidEmailAndSMS) {
            if (auxItem.resultadoValidacion === '0') {
              if (auxItem.descErrorValidacion === '1') {
                auxListItemsFiltered.push(auxItem)
              }
            }
          }
          if (isCheckboxSelectedOwnerRegistered) {
            if (auxItem.resultadoValidacion === '0') {
              if (auxItem.descErrorValidacion === '3') {
                auxListItemsFiltered.push(auxItem)
              }
            }
          }
          if (isCheckboxSelectedOpositionRight) {
            if (auxItem.resultadoValidacion === '0') {
              if (auxItem.descErrorValidacion === '4') {
                auxListItemsFiltered.push(auxItem)
              }
            }
          }
          if (isCheckboxSelectedInvalidCups) {
            if (auxItem.resultadoValidacion === '0') {
              if (auxItem.descErrorValidacion === '6') {
                auxListItemsFiltered.push(auxItem)
              }
            }
          }
        }
      })
      setListItemsFiltered(auxListItemsFiltered)
      // setAllCounters(auxListItemsFiltered, temp)
      doCounters(auxListItemsFiltered)
    } else if (temp === 2) {
      listItems.map((auxItem) => {
        if (auxItem.tipoEnvio === '02') {
          if (isCheckboxSelectedSendCorrectly) {
            if (auxItem.resultadoValidacion === '1') {
              auxListItemsFiltered.push(auxItem)
            }
          }
          if (isCheckboxSelectedInvalidEmailAndSMS) {
            if (auxItem.resultadoValidacion === '0') {
              if (auxItem.descErrorValidacion === '1') {
                auxListItemsFiltered.push(auxItem)
              }
            }
          }
          if (isCheckboxSelectedOwnerRegistered) {
            if (auxItem.resultadoValidacion === '0') {
              if (auxItem.descErrorValidacion === '3') {
                auxListItemsFiltered.push(auxItem)
              }
            }
          }
          if (isCheckboxSelectedOpositionRight) {
            if (auxItem.resultadoValidacion === '0') {
              if (auxItem.descErrorValidacion === '4') {
                auxListItemsFiltered.push(auxItem)
              }
            }
          }
          if (isCheckboxSelectedInvalidCups) {
            if (auxItem.resultadoValidacion === '0') {
              if (auxItem.descErrorValidacion === '6') {
                auxListItemsFiltered.push(auxItem)
              }
            }
          }
        }
      })
      setListItemsFiltered(auxListItemsFiltered)
      // setAllCounters(auxListItemsFiltered, temp)
      doCounters(auxListItemsFiltered)
    } else if (temp === 3) {
      listItems.map((auxItem) => {
        if (isCheckboxSelectedSendCorrectly) {
          if (auxItem.resultadoValidacion === '1') {
            auxListItemsFiltered.push(auxItem)
          }
        }
        if (isCheckboxSelectedInvalidEmailAndSMS) {
          if (auxItem.resultadoValidacion === '0') {
            if (auxItem.descErrorValidacion === '1') {
              auxListItemsFiltered.push(auxItem)
            }
          }
        }
        if (isCheckboxSelectedOwnerRegistered) {
          if (auxItem.resultadoValidacion === '0') {
            if (auxItem.descErrorValidacion === '3') {
              auxListItemsFiltered.push(auxItem)
            }
          }
        }
        if (isCheckboxSelectedOpositionRight) {
          if (auxItem.resultadoValidacion === '0') {
            if (auxItem.descErrorValidacion === '4') {
              auxListItemsFiltered.push(auxItem)
            }
          }
        }
        if (isCheckboxSelectedInvalidCups) {
          if (auxItem.resultadoValidacion === '0') {
            if (auxItem.descErrorValidacion === '6') {
              auxListItemsFiltered.push(auxItem)
            }
          }
        }
      })
      setListItemsFiltered(auxListItemsFiltered)
      // setAllCounters(auxListItemsFiltered, temp)
      doCounters(auxListItemsFiltered)
    }

    setTempSelectedState(temp)
  }

  const handleChangeCheckboxSelectedSendCorrectly = (check) => {
    setCurrentPage(0)
    setIsCheckboxSelectedSendCorrectly(check)

    auxListItemsFiltered = []
    if (!check) {
      listItemsFiltered.map((auxItem, index) => {
        if (auxItem.resultadoValidacion !== '1') {
          if (tempSelectedState === 1) {
            if (auxItem.tipoEnvio !== '02') {
              auxListItemsFiltered.push(auxItem)
            }
          } else if (tempSelectedState === 2) {
            if (auxItem.tipoEnvio === '02') {
              auxListItemsFiltered.push(auxItem)
            }
          } else if (tempSelectedState === 3) {
            auxListItemsFiltered.push(auxItem)
          }
        }
      })
      setListItemsFiltered(auxListItemsFiltered)
      // setTotalCounters(auxListItemsFiltered, check)
      doCounters(auxListItemsFiltered)
    } else {
      listItems.map((auxItem, index) => {
        if (auxItem.resultadoValidacion === '1') {
          if (tempSelectedState === 1) {
            if (auxItem.tipoEnvio !== '02') {
              auxListItemsFiltered.push(auxItem)
            }
          } else if (tempSelectedState === 2) {
            if (auxItem.tipoEnvio === '02') {
              auxListItemsFiltered.push(auxItem)
            }
          } else if (tempSelectedState === 3) {
            auxListItemsFiltered.push(auxItem)
          }
        }
      })
      let auxList = ([...listItemsFiltered, ...auxListItemsFiltered])
      setListItemsFiltered(auxList)
      // setTotalCounters(auxList, check)
      doCounters(auxList)
    }
  }

  const handleChangeCheckboxSelectedInvalidEmailAndSMS = (check) => {
    setCurrentPage(0)
    setIsCheckboxSelectedInvalidEmailAndSMS(check)

    auxListItemsFiltered = []
    if (!check) {
      listItemsFiltered.map((auxItem, index) => {
        if (auxItem.descErrorValidacion !== '1') {
          if (tempSelectedState === 1) {
            if (auxItem.tipoEnvio !== '02') {
              auxListItemsFiltered.push(auxItem)
            }
          } else if (tempSelectedState === 2) {
            if (auxItem.tipoEnvio === '02') {
              auxListItemsFiltered.push(auxItem)
            }
          } else if (tempSelectedState === 3) {
            auxListItemsFiltered.push(auxItem)
          }
        }
      })
      setListItemsFiltered(auxListItemsFiltered)
      // setTotalCounters(auxListItemsFiltered)
      doCounters(auxListItemsFiltered)
    } else {
      listItems.map((auxItem, index) => {
        if (auxItem.descErrorValidacion === '1') {
          if (tempSelectedState === 1) {
            if (auxItem.tipoEnvio !== '02') {
              auxListItemsFiltered.push(auxItem)
            }
          } else if (tempSelectedState === 2) {
            if (auxItem.tipoEnvio === '02') {
              auxListItemsFiltered.push(auxItem)
            }
          } else if (tempSelectedState === 3) {
            auxListItemsFiltered.push(auxItem)
          }
        }
      })
      let auxList = ([...listItemsFiltered, ...auxListItemsFiltered])
      setListItemsFiltered(auxList)
      // setTotalCounters(auxList)
      doCounters(auxList)
    }
  }

  const handleChangeCheckboxSelectedOwnerRegistered = (check) => {
    setCurrentPage(0)
    setIsCheckboxSelectedOwnerRegistered(check)

    auxListItemsFiltered = []

    if (!check) {
      listItemsFiltered.map((auxItem, index) => {
        if (auxItem.descErrorValidacion !== '3') {
          if (tempSelectedState === 1) {
            if (auxItem.tipoEnvio !== '02') {
              auxListItemsFiltered.push(auxItem)
            }
          } else if (tempSelectedState === 2) {
            if (auxItem.tipoEnvio === '02') {
              auxListItemsFiltered.push(auxItem)
            }
          } else if (tempSelectedState === 3) {
            auxListItemsFiltered.push(auxItem)
          }
        }
      })
      setListItemsFiltered(auxListItemsFiltered)
      // setTotalCounters(auxListItemsFiltered)
      doCounters(auxListItemsFiltered)
    } else {
      listItems.map((auxItem, index) => {
        if (auxItem.descErrorValidacion === '3') {
          if (tempSelectedState === 1) {
            if (auxItem.tipoEnvio !== '02') {
              auxListItemsFiltered.push(auxItem)
            }
          } else if (tempSelectedState === 2) {
            if (auxItem.tipoEnvio === '02') {
              auxListItemsFiltered.push(auxItem)
            }
          } else if (tempSelectedState === 3) {
            auxListItemsFiltered.push(auxItem)
          }
        }
      })
      let auxList = ([...listItemsFiltered, ...auxListItemsFiltered])
      setListItemsFiltered(auxList)
      // setTotalCounters(auxList)
      doCounters(auxList)
    }
  }

  const handleChangeCheckboxSelectedOpositionRight = (check) => {
    setCurrentPage(0)
    setIsCheckboxSelectedOpositionRight(check)

    auxListItemsFiltered = []
    if (!check) {
      listItemsFiltered.map((auxItem, index) => {
        if (auxItem.descErrorValidacion !== '4') {
          if (tempSelectedState === 1) {
            if (auxItem.tipoEnvio !== '02') {
              auxListItemsFiltered.push(auxItem)
            }
          } else if (tempSelectedState === 2) {
            if (auxItem.tipoEnvio === '02') {
              auxListItemsFiltered.push(auxItem)
            }
          } else if (tempSelectedState === 3) {
            auxListItemsFiltered.push(auxItem)
          }
        }
      })
      setListItemsFiltered(auxListItemsFiltered)
      // setTotalCounters(auxListItemsFiltered)
      doCounters(auxListItemsFiltered)
    } else {
      listItems.map((auxItem, index) => {
        if (auxItem.descErrorValidacion === '4') {
          if (tempSelectedState === 1) {
            if (auxItem.tipoEnvio !== '02') {
              auxListItemsFiltered.push(auxItem)
            }
          } else if (tempSelectedState === 2) {
            if (auxItem.tipoEnvio === '02') {
              auxListItemsFiltered.push(auxItem)
            }
          } else if (tempSelectedState === 3) {
            auxListItemsFiltered.push(auxItem)
          }
        }
      })
      let auxList = ([...listItemsFiltered, ...auxListItemsFiltered])
      setListItemsFiltered(auxList)
      // setTotalCounters(auxList)
      doCounters(auxList)
    }
  }

  const handleChangeCheckboxSelectedInvalidCups = (check) => {
    setCurrentPage(0)
    setIsCheckboxSelectedInvalidCups(check)

    auxListItemsFiltered = []
    if (!check) {
      listItemsFiltered.map((auxItem, index) => {
        if (auxItem.descErrorValidacion !== '6') {
          if (tempSelectedState === 1) {
            if (auxItem.tipoEnvio !== '02') {
              auxListItemsFiltered.push(auxItem)
            }
          } else if (tempSelectedState === 2) {
            if (auxItem.tipoEnvio === '02') {
              auxListItemsFiltered.push(auxItem)
            }
          } else if (tempSelectedState === 3) {
            auxListItemsFiltered.push(auxItem)
          }
        }
      })
      setListItemsFiltered(auxListItemsFiltered)
      // setTotalCounters(auxListItemsFiltered)
      doCounters(auxListItemsFiltered)
    } else {
      listItems.map((auxItem, index) => {
        if (auxItem.descErrorValidacion === '6') {
          if (tempSelectedState === 1) {
            if (auxItem.tipoEnvio !== '02') {
              auxListItemsFiltered.push(auxItem)
            }
          } else if (tempSelectedState === 2) {
            if (auxItem.tipoEnvio === '02') {
              auxListItemsFiltered.push(auxItem)
            }
          } else if (tempSelectedState === 3) {
            auxListItemsFiltered.push(auxItem)
          }
        }
      })
      let auxList = ([...listItemsFiltered, ...auxListItemsFiltered])
      setListItemsFiltered(auxList)
      // setTotalCounters(auxList)
      doCounters(auxList)
    }
  }

  const handleChangeRadioButtontempSelectedState2 = (optionRb: number) => {
    setCurrentPage(0)

    if (tempSelectedState2 !== optionRb) {
      setTempSelectedState2(optionRb)
    }

    auxListItemsFiltered = []
    // if (optionRb === 1 || optionRb === 3) {
    if (optionRb === 1) {
      // usuario registrado SI
      listItemsFiltered.map((auxItem, index) => {
        if (auxItem.registrado === 'Si') {
          auxListItemsFiltered.push(auxItem)
        }
      })

      if (auxListItemsFiltered.length > 0) {
        setListItemsFiltered(auxListItemsFiltered)

        // setTotalCounters(auxListItemsFiltered)
        doCounters(auxListItemsFiltered)
      } else {
        listItems.map((auxItem, index) => {
          if (auxItem.registrado === 'Si') {
            auxListItemsFiltered.push(auxItem)
          }
        })
        // let auxList = ([...listItemsFiltered, ...auxListItemsFiltered])
        // setListItemsFiltered(auxList)
        // setTotalCounters(auxList)
        setListItemsFiltered(auxListItemsFiltered)
        // setTotalCounters(auxListItemsFiltered)
        doCounters(auxListItemsFiltered)
      }
    }

    // if (optionRb === 2 || optionRb === 3) {
    if (optionRb === 2) {
      // usuario registrado NO
      listItemsFiltered.map((auxItem, index) => {
        if (auxItem.registrado === 'No') {
          auxListItemsFiltered.push(auxItem)
        }
      })

      if (auxListItemsFiltered.length > 0) {
        setListItemsFiltered(auxListItemsFiltered)

        // setTotalCounters(auxListItemsFiltered)
        doCounters(auxListItemsFiltered)
      } else {
        listItems.map((auxItem, index) => {
          if (auxItem.registrado === 'No') {
            auxListItemsFiltered.push(auxItem)
          }
        })
        // let auxList = ([...listItemsFiltered, ...auxListItemsFiltered])
        // setListItemsFiltered(auxList)
        // setTotalCounters(auxList)
        setListItemsFiltered(auxListItemsFiltered)
        // setTotalCounters(auxListItemsFiltered)
        doCounters(auxListItemsFiltered)
      }
    }

    if (optionRb === 3) {
      setListItemsFiltered(listItems)
      doCounters(listItems)
    }
  }

  const resetFilters = () => {
    setTempSelectedState(3)
    setTempSelectedState2(3)

    setIsCheckboxSelectedSendCorrectly(true)
    setIsCheckboxSelectedInvalidEmailAndSMS(true)
    setIsCheckboxSelectedOwnerRegistered(true)
    setIsCheckboxSelectedOpositionRight(true)
    setIsCheckboxSelectedInvalidCups(true)

    setCurrentPage(0)

    setListItemsFiltered(listItems)

    doCounters(listItems)
  }

  useEffect(() => {
    // cargar lista de poblaciones correspondientes a una provincia
    if (province !== '' && province !== allProvinces) {

      setLoadingTownsList(true)
      dispatch(thunkGetListMunicipalities('', '', provinceCode, '', (response) => {
        if (response && response.municipalities && response.municipalities.items && response.municipalities.items.length > 0) {
          let townsList = []
          townsList.push(allMunicipalities)
          response.municipalities.items.map((item) => {
            townsList.push(item.municipalityName)
          })
          setTownsList(townsList)
          setLoadingTownsList(false)
        }
      }));
    }
  }, [province])

  // Ejecutar una búsqueda por defecto al entrar
  useEffect(() => {
    newSearch()
  }, [])

  return (
    <Grid container justifyContent='center'>

      {
        isLoadingList &&
        <Spinner fixed={true} />
      }

      <Grid item className={styles.orangeSubtitle}>{t('controlMensajeria.management.header.description1')}</Grid>

      <Grid item className={styles.lightSubtitle}>{t('controlMensajeria.management.header.description2')}</Grid>

      <Grid container className={styles.searchContainer}>

        <Grid container className={styles.flexContainerOne}>
          <Grid container md={6} sm={10} xs={12} className={styles.searchCont}>
            <Grid item sm={12} className={styles.blueTitle}>{t('controlMensajeria.management.searchResume.resume')}</Grid>
            <Grid container direction='column'>
              <Grid item className={styles.inputTitle}>{t('controlMensajeria.management.searchResume.province')}</Grid>
              <Select
                className={styles.inputV2}
                label={province === '' ? t('averias.management.searchCups.address.select') : ''}
                values={statesList}
                value={province}
                onChange={(e) => handleChangeInput('state', e.target.value)}
                disabled={!loadingStatesList ? false : statesList.length === 0 ? false : true}
                isLoading={loadingStatesList}
              />
            </Grid>
            <Grid container direction='column'>
              <Grid item className={styles.inputTitle}>{t('controlMensajeria.management.searchResume.municipality')}</Grid>            
              <Select
                className={styles.inputV2}
                label={town === '' ? t('averias.management.searchCups.address.select') : ''}
                values={townsList}
                value={town}
                onChange={(e) => handleChangeInput('town', e.target.value)}
                disabled={province === '' || province === allProvinces || loadingTownsList || townsList.length === 0}
                isLoading={loadingTownsList}
              />
            </Grid>
            <Grid container md={12} spacing={2}>
              <Grid item md={4}>
                <Grid className={styles.inputTitle}>{t('controlMensajeria.management.searchResume.dateFrom')}</Grid>
                <DatepickerV3 selectedDate={datepickerDate1} handleChange={setDatepickerDate1} size='m' maxDate={datepickerDate2} dateFormat={'dd/MM/yyyy'} popperPlacement={mobileRes ? 'bottom-start' : 'right-center'} />
              </Grid>
              <Grid item md={4}>
                <Grid className={styles.inputTitle}>{t('controlMensajeria.management.searchResume.dateTo')}</Grid>
                <DatepickerV3 selectedDate={datepickerDate2} handleChange={setDatepickerDate2} size='m' minDate={datepickerDate1} maxDate={diaAnterior} dateFormat={'dd/MM/yyyy'} popperPlacement={mobileRes ? 'bottom-start' : 'right-center'} />
              </Grid>
            </Grid>
            <Grid container className={styles.consultCont}>
              <Button
                text={t('controlMensajeria.management.buttons.consult')}
                color='primary'
                variant='contained'
                onClick={() => newSearch()}
              />
            </Grid>          
          </Grid>

          <Grid container md={6} sm={10} xs={12} className={styles.stadisticsCont}>
            <Grid container className={styles.box} md={11} direction='column'>
              <Grid item className={styles.resultHeader} >
                {resultHeader}
              </Grid>
              <Grid item className={styles.dateRange} >
                {formatDate(datepickerDate1) + t('common.conjunctions.to') + formatDate(datepickerDate2)}
              </Grid>

              <MensajeriaResumeGraph 
                counters={counters} 
                totalRegisters={totalRegisters}
                tabletRes={tabletRes}
                mobileRes={mobileRes}
              />

              <Grid item className={styles.separator} />
              <Grid container className={styles.ratioContainer} direction='row'>
                <Grid container direction='column' md={10} xs={9}>
                  <Grid container className={styles.textAndValueCont} direction={mobileRes ? 'column' : 'row'}>
                    <Grid item>{t('controlMensajeria.management.searchResume.searchResult.summaryPanel.correctShipments')}</Grid>
                    <Grid item>{counters.correctlySendCounter}</Grid>
                  </Grid>
                  <Grid item className={`${styles.separator} variant`} />
                  <Grid container className={`${styles.textAndValueCont} margin`} direction={mobileRes ? 'column' : 'row'}>
                    <Grid item>{t('controlMensajeria.management.searchResume.searchResult.summaryPanel.newUsers')}</Grid>
                    <Grid item>{counters.totalCounter}</Grid>
                  </Grid>
                </Grid>
                <Grid container md={2} xs={3} className={styles.percentageCont}>
                  <div className={`${styles.roundedIcon} ${listItems.length !== 0 ? 'green' : 'red'}`}/>
                  <span>{registeredPercentage + '%'}</span>
                </Grid>
              </Grid>

              <Grid item className={styles.separator} />
              
              <Grid container className={styles.ratioContainer} direction='row'>
                <Grid container direction='column' md={10} xs={9}>
                  <Grid container className={styles.textAndValueCont} direction={mobileRes ? 'column' : 'row'}>
                    <Grid item>{t('controlMensajeria.management.searchResume.searchResult.summaryPanel.newRegisters')}</Grid>
                    <Grid item>{counters.registeredCounter}</Grid>
                  </Grid>
                  <Grid item className={`${styles.separator} variant`} />
                  <Grid container className={`${styles.textAndValueCont} margin`} direction={mobileRes ? 'column' : 'row'}>
                    <Grid item>{t('controlMensajeria.management.searchResume.searchResult.summaryPanel.correctUniqueShipments')}</Grid>
                    <Grid item>{counters.correctlySendCounterNoDuplicates}</Grid>
                  </Grid>
                </Grid>
                <Grid container md={2} xs={3} className={styles.percentageCont}>
                  <div className={`${styles.roundedIcon} ${listItems.length !== 0 ? 'green' : 'red'}`}/>
                  <span>{registeredPercentage2 + '%'}</span>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid container className={styles.flexContainerTwo}>
          <Grid container md={6} sm={10} xs={12}>
            <Grid className={styles.blueTitle}>{t('controlMensajeria.management.searchResume.searchBy.title')}</Grid>
            <Grid container md={12} spacing={2}>
              <Grid item md={4}>
                <Grid className={styles.smallTitle}>{t('controlMensajeria.management.searchResume.searchBy.channel.title')}</Grid>
              </Grid>
              <Grid container md={7} className={styles.buttonsContainer} spacing={1}>
                <Grid item>
                  <div
                    className={`radioButton ${styles.radioButton} ${tempSelectedState === 1 && 'active'}`}
                    onClick={() => {
                      if (tempSelectedState !== 1) {
                        handleChangeChannel(1)
                      }
                    }}
                  />
                  <div className={styles.radioButtonText}><img className={styles.icon} src={EmailIcon} alt='' />{t('controlMensajeria.management.searchResume.searchBy.channel.email')}</div>
                </Grid>
                <Grid item>
                  <div
                    className={`radioButton ${styles.radioButton} ${tempSelectedState === 2 && 'active'}`}
                    onClick={() => {
                      if (tempSelectedState !== 2) {
                        handleChangeChannel(2)
                      }
                    }}
                  />
                  <div className={styles.radioButtonText}><img className={styles.icon} src={MobileIcon} alt='' />{t('controlMensajeria.management.searchResume.searchBy.channel.sms')}</div>
                </Grid>
                <Grid item >
                  <div
                    className={`radioButton ${styles.radioButton} ${tempSelectedState === 3 && 'active'}`}
                    onClick={() => {
                      if (tempSelectedState !== 3) {
                        handleChangeChannel(3)
                      }
                    }}
                  />
                  <div className={styles.radioButtonText}>{t('controlMensajeria.management.searchResume.searchBy.channel.all')}</div>
                </Grid>
              </Grid>
            </Grid>
            <Grid container md={12} spacing={2} className={styles.shipmentResultFiltersCont}>
              <Grid item md={4}>
                <Grid className={styles.smallTitle}>{t('controlMensajeria.management.searchResume.searchBy.result.title')}</Grid>
              </Grid>
              <Grid container md={8} className={styles.checkboxContainer}>
                <Grid container>
                  <Grid item>
                    <Checkbox
                      checked={isCheckboxSelectedSendCorrectly}
                      onChange={(e) => handleChangeCheckboxSelectedSendCorrectly(e.target.checked)}
                    />
                  </Grid>
                  <Grid item className={styles.checkboxText}>
                    <img className={styles.icon} src={OkIcon} alt='' /><span>{t('controlMensajeria.management.searchResume.searchBy.result.correct')}</span>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item>
                    <Checkbox
                      checked={isCheckboxSelectedInvalidEmailAndSMS}
                      onChange={(e) => handleChangeCheckboxSelectedInvalidEmailAndSMS(e.target.checked)}
                    />
                  </Grid>
                  <Grid item className={styles.checkboxText}>
                    <img className={styles.icon} src={ErrorIcon} alt='' /><span>{t('controlMensajeria.management.searchResume.searchBy.result.invalidEmailAndSMS')}</span>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item>
                    <Checkbox
                      checked={isCheckboxSelectedOwnerRegistered}
                      onChange={(e) => handleChangeCheckboxSelectedOwnerRegistered(e.target.checked)}
                    />
                  </Grid>
                  <Grid item className={styles.checkboxText}>
                    <img className={styles.icon} src={ErrorIcon} alt='' /><span>{t('controlMensajeria.management.searchResume.searchBy.result.ownerRegistered')}</span>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item>
                    <Checkbox
                      checked={isCheckboxSelectedOpositionRight}
                      onChange={(e) => handleChangeCheckboxSelectedOpositionRight(e.target.checked)}
                    />
                  </Grid>
                  <Grid item className={styles.checkboxText}>
                    <img className={styles.icon} src={ErrorIcon} alt='' /><span>{t('controlMensajeria.management.searchResume.searchBy.result.oppositionRight')}</span>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item>
                    <Checkbox
                      checked={isCheckboxSelectedInvalidCups}
                      onChange={(e) => handleChangeCheckboxSelectedInvalidCups(e.target.checked)}
                    />
                  </Grid>
                  <Grid item className={styles.checkboxText}>
                    <img className={styles.icon} src={ErrorIcon} alt='' /><span>{t('controlMensajeria.management.searchResume.searchBy.result.invalidCups')}</span>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid container md={12} spacing={2} className={styles.userContainer}>
              <Grid item md={4}>
                <Grid className={styles.smallTitle}>{t('controlMensajeria.management.searchResume.searchBy.registeredUser.title')}</Grid>
              </Grid>
              <Grid container md={6} className={styles.buttonsContainer} spacing={1}>
                <Grid item>
                  <div
                    className={`radioButton ${styles.radioButton} ${tempSelectedState2 === 1 && 'active'}`}
                    onClick={() => {
                      handleChangeRadioButtontempSelectedState2(1)
                    }}
                  />
                  <div className={styles.radioButtonText}>{t('controlMensajeria.management.searchResume.searchBy.registeredUser.yes')}</div>
                </Grid>
                <Grid item>
                  <div
                    className={`radioButton ${styles.radioButton} ${tempSelectedState2 === 2 && 'active'}`}
                    onClick={() => {
                      handleChangeRadioButtontempSelectedState2(2)
                    }}
                  />
                  <div className={styles.radioButtonText}>{t('controlMensajeria.management.searchResume.searchBy.registeredUser.no')}</div>
                </Grid>
                <Grid item >
                  <div
                    className={`radioButton ${styles.radioButton} ${tempSelectedState2 === 3 && 'active'}`}
                    onClick={() => {
                      handleChangeRadioButtontempSelectedState2(3)
                    }}
                  />
                  <div className={styles.radioButtonText}>{t('controlMensajeria.management.searchResume.searchBy.registeredUser.all')}</div>
                </Grid>
              </Grid>
            </Grid>
            <Grid container md={12} spacing={2} className={styles.userContainer}>
              <Grid item md={4}>
                <Grid container className={styles.searchButton} onClick={() => resetFilters()}>
                  <img className={styles.updateIcon} src={UpdateIcon} alt='' />
                  <span className={styles.updateText}>{t('controlMensajeria.management.buttons.resetFilters')}</span>              
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid container md={6} sm={10} xs={12} className={styles.countersCont}>
            <Grid container className={styles.box2} md={11}>
              <Grid container direction='row' md={12}>
                <Grid item className={styles.filterTitle} md={5} xs={12}>{t('controlMensajeria.management.searchResume.searchResult.channelTitle')}</Grid>
                <Grid item className={styles.channelSubtitle2} md={3} xs={4}>
                  {(tempSelectedState === 1 || tempSelectedState === 3) &&
                    <>
                      <img className={styles.iconV3} src={EmailIcon} alt='' />
                      <span>{t('controlMensajeria.management.searchResume.searchBy.channel.email')}</span>
                    </>
                  }
                </Grid>
                <Grid item className={styles.channelSubtitle4} md={2} xs={4}>
                  {(tempSelectedState === 2 || tempSelectedState === 3) &&
                    <>
                      <img className={styles.iconV3} src={MobileIcon} alt='' />
                      <span>{t('controlMensajeria.management.searchResume.searchBy.channel.sms')}</span>
                    </>
                  }
                </Grid>
                <Grid item className={styles.channelSubtitle} md={2} xs={4}>{t('controlMensajeria.management.searchResume.searchResult.total')}</Grid>
              </Grid>
              <Grid container direction='row' md={12}>
                <Grid item md={5} xs={12}/>
                <Grid item md={3} xs={4} className={styles.channelSubtitle3}>{(tempSelectedState === 1 || tempSelectedState === 3) ? counters.emailTypeCounter : ''}</Grid>
                <Grid item md={2} xs={4} className={styles.channelSubtitle3}>{(tempSelectedState === 2 || tempSelectedState === 3) ? counters.smsTypeCounter : ''}</Grid>
                <Grid item md={2} xs={4} className={styles.channelSubtitle}>{counters.totalCounter}</Grid>
              </Grid>
              <Grid item className={styles.separator} />
              <Grid container direction='row' md={12}>
                <Grid item className={styles.filterTitle2} md={5}>{t('controlMensajeria.management.searchResume.searchResult.resultTitle')}</Grid>
              </Grid>

              {isCheckboxSelectedSendCorrectly &&
                <Grid container direction='row' md={12} className={styles.rowContainer}>
                  <Grid item className={styles.checkboxTitle} md={6} xs={12}>
                    <img className={styles.icon} src={OkIcon} alt='' /><span>{t('controlMensajeria.management.searchResume.searchBy.result.correct') + t('common.punctuation.colon')}</span>
                  </Grid>
                  <Grid item md={2} xs={4} className={styles.channelSubtitle3}>{(tempSelectedState === 1 || tempSelectedState === 3) ? counters.correctlySendEmailCounter : ''}</Grid>
                  <Grid item md={2} xs={4} className={styles.channelSubtitle3}>{(tempSelectedState === 2 || tempSelectedState === 3) ? counters.correctlySendSMSCounter : ''}</Grid>
                  <Grid item md={2} xs={4} className={styles.channelSubtitle}>{counters.correctlySendCounter}</Grid>
                </Grid>
              }

              {isCheckboxSelectedInvalidEmailAndSMS &&
                <Grid container direction='row' md={12} className={styles.rowContainer}>
                  <Grid item className={styles.checkboxTitle} md={6} xs={12}>
                    <img className={styles.icon} src={ErrorIcon} alt='' /><span>{t('controlMensajeria.management.searchResume.searchBy.result.invalidEmailAndSMS') + t('common.punctuation.colon')}</span>
                  </Grid>
                  <Grid item md={2} xs={4} className={styles.channelSubtitle3}>{(tempSelectedState === 1 || tempSelectedState === 3) ? counters.emailErrorCounter : ''}</Grid>
                  <Grid item md={2} xs={4} className={styles.channelSubtitle3}>{(tempSelectedState === 2 || tempSelectedState === 3) ? counters.smsErrorCounter : ''}</Grid>
                  <Grid item md={2} xs={4} className={styles.channelSubtitle}>{counters.emailErrorCounter + counters.smsErrorCounter}</Grid>
                </Grid>
              }

              {isCheckboxSelectedOwnerRegistered &&
                <Grid container direction='row' md={12} className={styles.rowContainer}>
                  <Grid item className={styles.checkboxTitle} md={6} xs={12}>
                    <img className={styles.icon} src={ErrorIcon} alt='' /><span>{t('controlMensajeria.management.searchResume.searchBy.result.ownerRegistered') + t('common.punctuation.colon')}</span>
                  </Grid>
                  <Grid item md={2} xs={4} className={styles.channelSubtitle3}>{(tempSelectedState === 1 || tempSelectedState === 3) ? counters.ownerRegisteredEmailCounter : ''}</Grid>
                  <Grid item md={2} xs={4} className={styles.channelSubtitle3}>{(tempSelectedState === 2 || tempSelectedState === 3) ? counters.ownerRegisteredSMSCounter : ''}</Grid>
                  <Grid item md={2} xs={4} className={styles.channelSubtitle}>{counters.ownerRegisteredEmailCounter + counters.ownerRegisteredSMSCounter}</Grid>
                </Grid>
              }

              {isCheckboxSelectedOpositionRight &&
                <Grid container direction='row' md={12} className={styles.rowContainer}>
                  <Grid item className={styles.checkboxTitle} md={6} xs={12}>
                    <img className={styles.icon} src={ErrorIcon} alt='' /><span>{t('controlMensajeria.management.searchResume.rgdpShort')}</span>
                  </Grid>
                  <Grid item md={2} xs={4} className={styles.channelSubtitle3}>{(tempSelectedState === 1 || tempSelectedState === 3) ? counters.oppositionRightEmailCounter : ''}</Grid>
                  <Grid item md={2} xs={4} className={styles.channelSubtitle3}>{(tempSelectedState === 2 || tempSelectedState === 3) ? counters.oppositionRightSMSCounter : ''}</Grid>
                  <Grid item md={2} xs={4} className={styles.channelSubtitle}>{counters.oppositionRightEmailCounter + counters.oppositionRightSMSCounter}</Grid>
                </Grid>
              }

              {isCheckboxSelectedInvalidCups &&
                <Grid container direction='row' md={12} className={styles.rowContainer}>
                  <Grid item className={styles.checkboxTitle} md={6} xs={12}>
                    <img className={styles.icon} src={ErrorIcon} alt='' /><span>{t('controlMensajeria.management.searchResume.searchBy.result.invalidCups') + t('common.punctuation.colon')}</span>
                  </Grid>
                  <Grid item md={2} xs={4} className={styles.channelSubtitle3}>{(tempSelectedState === 1 || tempSelectedState === 3) ? counters.invalidCupsEmailCounter : ''}</Grid>
                  <Grid item md={2} xs={4} className={styles.channelSubtitle3}>{(tempSelectedState === 2 || tempSelectedState === 3) ? counters.invalidCupsSMSCounter : ''}</Grid>
                  <Grid item md={2} xs={4} className={styles.channelSubtitle}>{counters.invalidCupsEmailCounter + counters.invalidCupsSMSCounter}</Grid>
                </Grid>
              }

              <Grid item className={styles.separator} />
              <Grid container direction='row' md={12}>
                <Grid item className={styles.filterTitle2} md={5}>{t('controlMensajeria.management.searchResume.searchResult.registeredUsers')}</Grid>
              </Grid>
              {(tempSelectedState2 === 1 || tempSelectedState2 === 3) &&
                <Grid container direction='row' md={12} className={styles.rowContainer}>
                  <Grid item className={styles.checkboxTitle} md={6} xs={12}>
                    <img className={styles.icon} src={OkIcon} alt='' /><span>{t('controlMensajeria.management.searchResume.searchResult.registered')}</span>
                  </Grid>
                  <Grid item md={2} xs={4} className={styles.channelSubtitle3}>{(tempSelectedState === 1 || tempSelectedState === 3) ? counters.registeredEmailCounter : ''}</Grid>
                  <Grid item md={2} xs={4} className={styles.channelSubtitle3}>{(tempSelectedState === 2 || tempSelectedState === 3) ? counters.registeredSMSCounter : ''}</Grid>
                  <Grid item md={2} xs={4} className={styles.channelSubtitle}>{counters.registeredCounter}</Grid>
                </Grid>
              }

              {(tempSelectedState2 === 2 || tempSelectedState2 === 3) &&
                <Grid container direction='row' md={12} className={styles.rowContainer}>
                  <Grid item className={styles.checkboxTitle} md={6} xs={12}>
                    <img className={styles.icon} src={ErrorIcon} alt='' /><span>{t('controlMensajeria.management.searchResume.searchResult.notRegistered')}</span>
                  </Grid>
                  <Grid item md={2} xs={4} className={styles.channelSubtitle3}>{(tempSelectedState === 1 || tempSelectedState === 3) ? counters.notRegisteredEmailCounter : ''}</Grid>
                  <Grid item md={2} xs={4} className={styles.channelSubtitle3}>{(tempSelectedState === 2 || tempSelectedState === 3) ? counters.notRegisteredSMSCounter : ''}</Grid>
                  <Grid item md={2} xs={4} className={styles.channelSubtitle}>{counters.notRegisteredCounter}</Grid>
                </Grid>
              }

            </Grid>
          </Grid>
        </Grid>

      </Grid>
    </Grid>
  );
}

export default Header;