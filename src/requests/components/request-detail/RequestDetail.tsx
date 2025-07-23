import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Link, Redirect } from 'react-router-dom'
import { useHistory } from 'react-router'

import { Grid } from '@material-ui/core'

import ButtonToTop from '../../../common/components/button-to-top/ButtonToTop'
import Spinner from '../../../common/components/spinner/Spinner'

import HeadboardSR from './headboard-sr/HeadboardSR'
import AddDocumentsSR from './add-documents-sr/AddDocumentsSR'
import ChatSR from './chat-sr/ChatSR'
import DialogReiteracion from './dialog-reiteracion/DialogReiteracion'

import ArrowIcon from '../../../assets/icons/flecha_derecha.svg'


import { hasNotUserPermissions } from '../../../common/lib/UserPermissionsLib'
import { thunkGetDocumentSr, thunkGetDocumentosCargaOffline, thunkGetEventsSr } from '../../store/actions/RequestsThunkActions'

import {
  resetUrlMessages,
  setUrlMessagesCategory, 
  setUrlMessagesDetail,
  setUrlMessagesRequestDataRequest
} from '../../../common/components/send-url/store/actions/UrlMessagesActions'

import useStyles from './RequestDetail.styles'
import { adminCheck } from '../../../common/lib/ValidationLib'
import DialogSentSuccessfully from './dialog-sentSuccessfully/DialogSentSuccessfully'
import DialogNotSent from './dialog-notSent/DialogNotSent'
import DialogReapertura from './dialog-reapertura/DialogReapertura'
import DialogInvalidExtension from './dialog-invalid-extension/DialogInvalidExtension'
import DialogInvalidSize from './dialog-invalid-size/DialogInvalidSize'
import { thunkGetRequestsList } from '../../store/actions/RequestsThunkActions'
import { setRequestsList } from '../../store/actions/RequestsActions'

// LCS: Importa la función - Wave 2
import { sendGAEvent, removeEmails } from '../../../core/utils/gtm'

const RequestDetail = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const history = useHistory()

  const { requestData, location, setShowingRequestDetail, tab_name } = props

  const user = useSelector((state: any) => state.user.profile)

  const requestDetail = requestData || (location && location.state && location.state.request)

  const [isLoading, setIsLoading] = useState(false)
  const [inCourse] = useState(requestDetail && requestDetail.status !== 'CERRADA')
  const [closed] = useState(requestDetail && requestDetail.status === 'CERRADA')

  const [documentList, setDocumentList] = useState([] as any)
  const [finalDocumentList, setFinalDocumentList] = useState([] as any)
  const [bigFilePopup, setBigFilePopup] = useState(false)
  const [stringMaxUploadFileSize, setStringMaxUploadFileSize] = useState<string>('10000000') // 10MB
  const [openSR, setOpenSR] = useState(false)
  const [showPopupReiteracion, setShowPopupReiteracion] = useState(false)
  const [showPopupSentSuccessfully, setShowPopupSentSuccessfully] = useState(false)
  const [showPopupNotSent, setShowPopupNotSent] = useState(false)
  const [showPopupReapertura, setShowPopupReapertura] = useState(false)
  const [showPopupInvalidExtension, setShowPopupInvalidExtension] = useState(false)
  const [showPopupInvalidSize, setShowPopupInvalidSize] = useState(false)
  const [events, setEvents] = useState([] as any)
  const [reiterationDone, setReiterationDone] = useState(false)
  const [addDocDone, setAddDocDone] = useState(false)
  const [reopenDone, setReopenDone] = useState(false)
  const [addCommentDone, setAddCommentDone] = useState(false)
  const [auxUploadDocuments, setAuxUploadDocuments] = useState([] as any)
  const [closeMessage, setCloseMessage] = useState<string>('')


  // const [optionalDocument, setOptionalDocument] = useState({
  //   text: t('requests.newRequestDetail.addDocumentsSR.addDoc.otherDocs'),
  //   suffix: '',
  //   comment: '',
  //   redInput: '',
  //   anexado: false
  // })

  //Opciones:
  // Comentario --> 'C'
  // Reiteracion --> 'R'
  // Adjuntar Documentacion --> 'D'
  // Ver Documentacion --> 'V'

  // Añadidos

  /*const getFileBase64 = (file, callback) => {
    let reader = new FileReader()

    reader.readAsDataURL(file)

    reader.onload = () => {
      callback(reader.result)
    }

    reader.onerror = (error) => {
      console.error('Error: ', error)
    }
  }*/

  /*const handleUploadDocument = (e) => {
    const file = e.target.files[0]
    e.target.value = ''

    if (file) {

      let documentumData = {
        nombre: file.name,
        extension: file.name && ('.' + file.name.split('.').pop()),
        tipoMime: file.type,
        carpeta: '/Documentos/ZEUDATCWBS01',
        tipo: 'ZEUDATCPRO01',
        metadatos: [
          {
            nombre: 'tipo_sr',
            valor: requests.newRequestData.tipology
          },
          {
            nombre: 'sector',
            valor: 'ELECTRICIDAD'
          },
          {
            nombre: 'nif_consumidor',
            valor: user.documentNumber
          }
        ]
      } as any

      getFileBase64(file, (response) => {
        const base64 = response.substring(response.indexOf('base64,') + 7, response.length)

        documentumData = {
          ...documentumData,
          contenido: base64
        }

        let documentData = {
          nombreArchivo: file.name,
          format: file.name && (file.name.split('.').pop()),
          documentType: 'DOCTYP0101',
          documentState: 'DOCSTA0002'
        } as any

        // subir el fichero a Documentum
        dispatch(thunkCreateDocument(documentumData, (response) => {
          if (response) {
            documentData = {
              ...documentData,
              url: BASE_URL + '/documentum/' + response.idDocumento,
              idDocumentum: response.idDocumento,
            }
            if (response.result.codResult === '0000') {
              setDocumentUpload(true)
            }
            setFileSelected(documentData)
            dispatch(setNewRequestDataDocument(documentData))
            setShowingDialog(true)
          }
        }))

      })
    }
  }*/

  const formatAndFilterEvents = (auxEvents) => {
    const filteredEvents = adminCheck() ? auxEvents : auxEvents.filter((item) => {
      if  (((item.eventTypeName === 'APORTAR INFORMACION' || item.eventTypeName === 'APORTAR NUEVO DOCUMENTO') && item.codCreatedBy === 'SEGAT') ||
          item.eventTypeName === 'REAPERTURA' ||
          item.eventTypeName === 'REITERACIÓN' ||
          item.eventTypeName === 'CAMBIO DE ESTADO'
          ) {
            return item
      }
    })
    filteredEvents.map((item) => {
      const auxFormattedDate = item.creationDateEvent ? item.creationDateEvent.substring(0, 10) : ''
      item.formattedDate = auxFormattedDate ? auxFormattedDate.split('-')[2] + '/' + auxFormattedDate.split('-')[1] + '/' + auxFormattedDate.split('-')[0]  : auxFormattedDate
      item.formattedHour = item.creationDateEvent ? item.creationDateEvent.substring(11, 16) : ''
    })

    filteredEvents.sort(function (a, b) {
      const aDate = a.formattedDate.split('/')
      const aa = aDate[2] + '-' + aDate[1] + '-' + aDate[0] + ' ' + a.formattedHour

      const bDate = b.formattedDate.split('/')
      const bb = bDate[2] + '-' + bDate[1] + '-' + bDate[0] + ' ' + b.formattedHour

      return new Date(aa).getTime() - new Date(bb).getTime()
    })

    // Recoger el último mensaje de cierre
    if (requestDetail.status && requestDetail.status === 'CERRADA') {
      const closeSrEvents = filteredEvents.filter((item) => item.eventTypeName === 'CAMBIO DE ESTADO')
      let auxCloseMessage = ''
      if (closeSrEvents.length > 0) {
        auxCloseMessage = closeSrEvents[closeSrEvents.length - 1].descriptionEvent
        setCloseMessage(auxCloseMessage)
      }
    }

    if (adminCheck()) {
      setEvents(filteredEvents)
    }
    else {
      setEvents(filteredEvents.filter((item) => item.eventTypeName !== 'CAMBIO DE ESTADO'))
    }
  }

  useEffect(() => {
    // LCS: Enviar evento de GdC a GA - Wave 2
    sendGAEvent({
      event: 'view',
      content_group: 'datos de la peticion',
      page_url: removeEmails(window.location.href),
      user_id: sessionStorage.getItem('id'),
      previous_path: removeEmails(sessionStorage.getItem("previousPage")),
      user_type: sessionStorage.getItem('user_type'),
      browsing_type: sessionStorage.getItem('browsing_type'),
      element_type: 'medicion de pagina',
      ga_client_id: sessionStorage.getItem('ga_client_id'),
      cups: requestDetail.cups && requestDetail.cups !== '' ? requestDetail.cups : 'no aplica',
      supply_type: 'no aplica'
    });
    sessionStorage.setItem("previousPage", window.location.href);
  },[])

  useEffect(() => {    
    if (user.documentNumber && user.documentNumber !== '' && requestDetail.documentList && requestDetail.documentList.sentDocuments && requestDetail.documentList.sentDocuments.length > 0 && requestDetail.documentList.sentDocuments.documentumId !== '' && documentList.length === 0) {
      let promises = [] as any
      let errors = [] as any

      let documentsAux = [] as any

      // setIsLoading(true)

      requestDetail.documentList.sentDocuments.map(item => {
        if (item.documentumId !== '') {
          var promise = new Promise<void>(function (resolve, reject) {
            dispatch(thunkGetDocumentSr(item.documentumId, requestDetail.codSR, (response) => {
              if (response && response.documento) {
                documentsAux.push({
                  name: response.documento.nombre,
                  base64: `data:${response.documento.tipoMime};base64,${response.documento.contenido}`,
                  documentTypeDoc: item.documentTypeDoc,
                  documentComment: item.documentComment
                })

                resolve()
              }

              reject()
            }))
          }).then(function () { // resolve()
            // Success :)
          }, function () { // reject()
            // Error :(
            errors.push(item)
          })

          return promises.push(promise)
        }
      })

      Promise.all(promises).then(function () {
        // setIsLoading(false)

        if (errors.length === 0) {
          setDocumentList(documentsAux)
        }
      })
    }
    // handleListComments()
    // eslint-disable-next-line
  }, [user.documentNumber, requestDetail])

  useEffect(() => {
    if (documentList.length > 0) {
      let promises = [] as any
      let errors = [] as any

      let documentsAux = [] as any

      setIsLoading(true)

      documentList.map((item, i) => {
        // Comprobamos si el nombre del fihcero está compuesto por la nueva nomenclatura e ZEUS: IDENTIFICADORORIGEN_PROCESSBATCHID_CODIGOEXPEDIENTE/CUPS/NINGUNO_TIPODOCUMENTO_ SOLICITANTE_NOMBREDELFICHERO_FECHA
        // Comprobamos también que el PROCESSBATCHID pertenece a PDS (comienza por 02)
        if ((item.name.match(/_/g) || []).length >= 6 && item.name.split('_')[1].startsWith('02')) {
          var promise = new Promise<void>(function (resolve, reject) {
          // El valor inicial '02' del PROCESSBATCHID tan solo sirve para indicar que pertenece a PDS. Pero para lanzar la consulta a nuestra base de datos 
          // UFD_DOCUMENTOS_CARGA_OFFLINE tan solo usamos el resto del ID. Es decir, el id sería el PROCESSBATCHID sin el '02' inicial
          const id = item.name.split('_')[1].substring(2)
            dispatch(thunkGetDocumentosCargaOffline(id, '', '', '', '', '', '', (response) => {
              if (response && response.length > 0) {
                documentsAux.push({
                  name: response[0].docName,
                  base64: item.base64,
                  documentTypeDoc: item.documentTypeDoc,
                  documentComment: item.documentComment,
                })

                resolve()
              }

              reject()
            }))
          }).then(function () { // resolve()
            // Success :)
          }, function () { // reject()
            // Error :(
            errors.push(item)
          })

          return promises.push(promise)
        }
        else {
          documentsAux.push({
            name: item.name,
            base64: item.base64,
            documentTypeDoc: item.documentTypeDoc,
            documentComment: item.documentComment,
          })
        }
      })

      Promise.all(promises).then(function () {
        setIsLoading(false)

        if (errors.length === 0) {
          setFinalDocumentList(documentsAux)
        }
      })
    }
    // handleListComments()
    // eslint-disable-next-line
  }, [documentList])

  useEffect(() => {
    if (requestDetail.status && requestDetail.status !== 'CERRADA') {
      setOpenSR(true)
    } 
    else {
      setOpenSR(false)
    }
  }, [requestDetail.status])

  // Metodo antiguo para ordenar y formatear fechas
  // useEffect(() => {
  //   if (requestDetail.events && requestDetail.events.length > 0) {
  //     const auxEvents = requestDetail.events
  //     auxEvents.map((item) => {
  //       item.formattedDate = formatDateString(item.date)
  //       item.formattedHour = formatTimeString(item.date.substring(8, 12))
  //     })

  //     auxEvents.sort(function (a, b) {
  //       const aDate = a.formattedDate.split('/')
  //       const aa = aDate[2] + '-' + aDate[1] + '-' + aDate[0] + ' ' + a.formattedHour

  //       const bDate = b.formattedDate.split('/')
  //       const bb = bDate[2] + '-' + bDate[1] + '-' + bDate[0] + ' ' + b.formattedHour

  //       return new Date(aa).getTime() - new Date(bb).getTime()
  //     })

  //     setEvents(auxEvents)
  //   }    
  // }, [requestDetail])

  useEffect(() => {
    if (requestDetail && requestDetail.codSR) {
      setIsLoading(true)
      dispatch(thunkGetEventsSr(user.documentNumber, requestDetail.codSR, (response) => {
        if (response && response.events && response.events.length > 0) {
          formatAndFilterEvents(response.events)
        }
        setIsLoading(false)
      }))
    }
  }, [requestDetail, reiterationDone, addDocDone, addCommentDone])

  useEffect(() => {
    if (reopenDone || addDocDone) {
      setIsLoading(true)

      const filter = `documentNumber::${user.documentNumber}|status::1`

      dispatch(thunkGetRequestsList(filter, (response) => {
        if (response && response.length > 0) {
          // ok
          dispatch(setRequestsList(response))
        }
        setIsLoading(false)
        if (reopenDone) {
          history.push('/requests')
        }
      }))
    }
  }, [reopenDone, addDocDone])

  // TO-DO 
  // este método es para recuperar el array de comentarios.
  //
  // const handleListComments = () => {
  //   //dispatch(serviceRequestsComments(requestDetail.codSR, (response) => {
  //   dispatch(thunkGetCommentsSr(requestDetail.codSR, (response) => {
  //     if (response) {
  //       console.log('E999513 serviceRequestsComments: ', response)
  //     }

  //   }
  //   ))
  // }

  const UserSkeleton = () => {
    return <div className={classes.userSkeleton} />
  }

  // PPM 1007560 - Seteamos la categoría y el detalle de la pantalla actual para que el usuario Admin pueda mandarle el enlace al cliente vía correo/sms
  useEffect(() => {
    dispatch(resetUrlMessages())
    if (adminCheck() && requestDetail && requestDetail.codSR) {
      dispatch(setUrlMessagesCategory('REQUESTS'))
      dispatch(setUrlMessagesDetail('REQUESTS_DETAIL'))
      dispatch(setUrlMessagesRequestDataRequest(requestDetail.codSR))
    }
  }, [requestDetail])

  let userRoles = sessionStorage.getItem('userRoles') || ''
  let gdprAccepted = sessionStorage.getItem('gdprAccepted') || ''
  let userRolesArray = userRoles.split(',')

  if (hasNotUserPermissions()) {
    const redirectTo = userRolesArray.includes('US_CC') ? '/admin' : '/login'
    return <Redirect to={redirectTo} />
  }

  if (window.location.pathname !== '/gdpr' && gdprAccepted === '0') {
    return <Redirect to='/gdpr' />
  }

  const commentDateLimit = new Date(2020, 11, 1)
  const srCreateDateArray = requestDetail.createDate.split('/')
  const srCreateDate = new Date(srCreateDateArray[2], srCreateDateArray[1] - 1, srCreateDateArray[0])
  let commentVisible = true

  if (commentDateLimit.getTime() > srCreateDate.getTime()) {
    commentVisible = false
  }

  /*const handleAddComentary = () => {
    setOptionDialog('C')
    setShowingDialog(true)
  }

  const handleAddReiteracion = () => {
    setOptionDialog('R')
    setShowingDialog(true)
  }

  const handleAddDoc = () => {
    setOptionDialog('D')
    auxAttachedDocument.firstChild.click()
  }

  const handleViewDoc = () => {
    if (requestDetail.documentList !== undefined
      && requestDetail.documentList.sentDocuments.length > 0
      && requestDetail.documentList.sentDocuments.documentCode !== '.') {

      setOptionDialog('V')
      setShowingDialog(true)
    }
  }*/

  return (
    <div className={`${classes.block} ${window.location.pathname === '/supplies/detail' && 'without-margin'} ${window.location.pathname === '/provisions/detail' && 'with-margin'}`}>
      {
        isLoading &&
        <Spinner fixed />
      }

      {
        window.location.pathname === '/requests/detail' &&
        <ButtonToTop />
      }

      <Grid container className={classes.container}>
        <Grid container xs={11} md={10} className={classes.maxWidthForBigScreens}>
          <Grid container justifyContent='space-between' alignItems='center'>
            {
              (window.location.pathname === '/supplies/detail' || window.location.pathname === '/provisions/detail') ?
                <Grid container xs={12} md={3} className={classes.linkEffect} onClick={() => setShowingRequestDetail(false)}>
                  <img className={classes.arrow} src={ArrowIcon} alt='' />
                  <span className={classes.returnText}>{t('requests.newRequestDetail.return')}</span>
                </Grid>
              :
                <Grid container xs={12} md={3}>
                  <Link to='/requests' className={classes.returnLink}>                  
                    <img className={classes.arrow} src={ArrowIcon} alt='' />
                    <span className={classes.returnText}>{t('requests.newRequestDetail.return')}</span>
                  </Link>
                </Grid>                
            }
            <Grid xs={12} md={6} className={`${classes.title} ${window.location.pathname === '/provisions/detail' && 'without-margin'}`}>
              {t('requests.newRequestDetail.title')}
            </Grid>
            <Grid item xs={12} md={3} />
          </Grid>

          <HeadboardSR 
            requestData={requestDetail}
            location={location}
            events={events}
            setShowPopupReapertura={setShowPopupReapertura}
            closeMessage={closeMessage}
          />

          {/* Sólo permitimos adjuntar documentos a SRs abiertas */}
          {(openSR && !adminCheck()) &&
            <AddDocumentsSR
              // item={optionalDocument}
              setBigFilePopup={setBigFilePopup}
              requestDetail={requestDetail}
              setIsLoading={setIsLoading}
              setShowPopupSentSuccessfully={setShowPopupSentSuccessfully}
              setShowPopupNotSent={setShowPopupNotSent}
              setShowPopupInvalidExtension={setShowPopupInvalidExtension}
              setShowPopupInvalidSize={setShowPopupInvalidSize}
              setStringMaxUploadFileSize={setStringMaxUploadFileSize}
              user={user}
              setAddDocDone={setAddDocDone}
              setAuxUploadDocuments={setAuxUploadDocuments}
            />
          }

          <ChatSR 
            setIsLoading={setIsLoading}
            requestDetail={requestDetail}
            setShowPopupReiteracion={setShowPopupReiteracion}
            events={events}
            user={user}
            setAddCommentDone={setAddCommentDone}
          />
        </Grid>
      </Grid>

      {showPopupReiteracion &&
        <DialogReiteracion
          showingDialog={showPopupReiteracion}
          setShowingDialog={setShowPopupReiteracion}
          user={user}
          codSR={requestDetail.codSR}
          setIsLoading={setIsLoading}
          setReiterationDone={setReiterationDone}
        />
      }

      {showPopupSentSuccessfully && 
        <DialogSentSuccessfully 
          showingDialog={showPopupSentSuccessfully}
          setShowingDialog={setShowPopupSentSuccessfully}
          auxUploadDocuments={auxUploadDocuments}
          setAuxUploadDocuments={setAuxUploadDocuments}
        />
      }

      {showPopupNotSent && 
        <DialogNotSent 
          showingDialog={showPopupNotSent}
          setShowingDialog={setShowPopupNotSent}
        />
      }
      
      {showPopupReapertura && 
        <DialogReapertura 
          showingDialog={showPopupReapertura}
          setShowingDialog={setShowPopupReapertura}
          user={user}
          codSR={requestDetail.codSR}
          setIsLoading={setIsLoading}
          setReopenDone={setReopenDone}
        />
      }

      {showPopupInvalidExtension &&
        <DialogInvalidExtension
          showingDialog={showPopupInvalidExtension}
          setShowingDialog={setShowPopupInvalidExtension}
        />
      }

      {showPopupInvalidSize &&
        <DialogInvalidSize
          showingDialog={showPopupInvalidSize}
          setShowingDialog={setShowPopupInvalidSize}
          stringMaxUploadFileSize={stringMaxUploadFileSize}
        />
      }
    </div>
  )
}

export default RequestDetail
