import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import useStyles from './DocumentUploadFrame.styles'

import UploadArchiveIcon from '../../../../assets/icons/misdocumentos_subir_archivo.svg'
import DeleteArchiveIcon from '../../../../assets/icons/misdocumentos_eliminar.svg'
import IconTextButton from '../../../../common/components/icon-text-button/IconTextButton'
import Spinner from '../../../../common/components/spinner/Spinner'

import OnRevisionIcon from '../../../../assets/icons/misdocumentos_en_revision.svg'
import ValidatedIcon from '../../../../assets/icons/misdocumentos_validado.svg'
import DeniedIcon from '../../../../assets/icons/misdocumentos_rechazado.svg'
import ProcessingIcon from '../../../../assets/icons/ico_procesando.svg'

import DocumentationPlanIcon from '../../../../assets/icons/documentacion_ico_plano.svg'
import PointerIcon from '../../../../assets/icons/documentacion_ico_punto_conexion.svg'
import AttachedDocumentTypeIcon from '../../../../assets/icons/plano_documento_adjunto.svg'

import AddPlanDialog from '../add-plan-dialog/AddPlanDialog'

import { adminCheck } from '../../../../common/lib/ValidationLib'
import { formatDateZeus, translateDocOfflineDates } from '../../../../common/lib/FormatLib'

import { setCurrentProvision } from '../../../store/actions/ProvisionsActions'
import { thunkUpdateDossier, thunkGetDocument, thunkGetMasterData, thunkSaveDossierData, thunkGetDocumentosCargaOffline, thunkGetDossier } from '../../../store/actions/ProvisionsThunkActions'
import { setMessage } from '../../../../common/store/actions/ErrorActions'
import AddOtherDocumentDialog from '../add-other-document/add-other-document-dialog/AddOtherDocumentDialog'
import Tooltip from '../../../../common/components/tooltip/Tooltip'
import { Link } from 'react-router-dom'
import { isMobileApp, isWeb } from '../../../../mobile-apps/common/detectPlatform'
import createFileAndOpenIt from '../../../../mobile-apps/local-downloads/createFileAndOpenIt'
import DnInfoDialog from '../add-other-document/add-other-document-dialog/content-new-generation/DnInfoDialog'
// LCS: Enviar evento de GdC a GA - Wave 3
import { getExpStatus, sendGAEvent, removeEmails } from '../../../../core/utils/gtm'

const DocumentUploadFrame = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const {
    document,
    documentumId,
    comment,
    documentType,
    documentTypeName,
    documentName,
    documentCode,
    documentStatus,
    registerDate,
    setUploaded,
    showUploaded,
    setNewDocumentsRecieved,
    setSentDocument,
    isBlockingDoc,
    billingEmail,
    indAceptoFacturaDigital,
    nameAndSurname,
    address,
    zipcode,
    stateProv,
    town,
    uploadState,
    uploadDate,
    processBatchID,
    paymentFrame,
    budgetValue
  } = props

  const rand = Math.round(1 + Math.random() * (1000 - 1))

  const formatDate = (date) => {
    if (date) {
      const year = date.substring(0, 4)
      const month = date.substring(4, 6)
      const day = date.substring(6, 8)
      return day + '/' + month + '/' + year
    }
  }

  const formatTime = (date) => {
    if (date) {
      const hour = date.substring(8, 10)
      const min = date.substring(10, 12)
      const sec = date.substring(12, 14)
      return hour + ':' + min + ':' + sec
    }
  }

  const [isLoading, setIsLoading] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [innerDocument, setInnerDocument] = useState(document && document)
  const [documentDate, setDocumentDate] = useState(registerDate && formatDate(registerDate))
  const [documentTypeIcon, setDocumentTypeIcon] = useState<any>()
  const [documentStatusIcon, setDocumentStatusIcon] = useState<any>()
  const [documentStatusDescription, setDocumentStatusDescription] = useState<any>()
  const [innerComment] = useState(comment && comment)
  const [popup, setPopup] = useState(false)
  const [popupOtherDoc, setPopupOtherDoc] = useState(false)
  const [popupDnInfo, setPopupDnInfo] = useState(false)
  const [popupCroquis, setPopupCroquis] = useState(false)
  const [realUploadDate, setRealUploadDate] = useState('')
  const [realUploadHour, setRealUploadHour] = useState('')

  const user = useSelector((state: any) => state.user.profile)
  const currentProvision = useSelector((state: any) => state.provisions.currentProvision)

  const [maxUploadFileSize, setMaxUploadFileSize] = useState<number>(2000000)
  const [saveRequest, setSaveRequest] = useState<number>(0)
  const [docNameTranslation, setDocNameTranslation] = useState('')
  const [documentUpload, setDocumentUpload] = useState<boolean>(false)
  const [uploadedDocumentName, setUploadedDocumentName] = useState<string>('')
  const [textDownload, setTextDownload] = useState<string>('provisions.documentation.uploadDocument')

  let documentAux: any

  /* Recuperar la información del documento (nombre, base64) desde documentum */
  const handleDownloadDocument = () => {
    handleSendGAEvent()
    setIsLoading(true)

    if (documentumId) {
      dispatch(thunkGetDocument(documentumId, (response) => {
        if (response && response.documento) {
          // Comprobamos si el nombre del fihcero está compuesto por la nueva nomenclatura e ZEUS: IDENTIFICADORORIGEN_PROCESSBATCHID_CODIGOEXPEDIENTE/CUPS/NINGUNO_TIPODOCUMENTO_ SOLICITANTE_NOMBREDELFICHERO_FECHA
          // Comprobamos también que el PROCESSBATCHID pertenece a PDS (comienza por 02)
          if ((response.documento.nombre.match(/_/g) || []).length >= 6 && response.documento.nombre.split('_')[1].startsWith('02')) {
            // El valor inicial '02' del PROCESSBATCHID tan solo sirve para indicar que pertenece a PDS. Pero para lanzar la consulta a nuestra base de datos 
            // UFD_DOCUMENTOS_CARGA_OFFLINE tan solo usamos el resto del ID. Es decir, el id sería el PROCESSBATCHID sin el '02' inicial
            const id = response.documento.nombre.split('_')[1].substring(2)
            dispatch(thunkGetDocumentosCargaOffline(id, '', '', '', '', '', '', (response2) => {
              if (response2 && response2.length > 0) {
                const linkSource = `data:${response.documento.tipoMime};base64,${response.documento.contenido}`
                if (isWeb()) {
                  const downloadLink = window.document.createElement('a')
                  downloadLink.href = linkSource
                  downloadLink.download = response2[0].docName
                  downloadLink.click()
                } else {
                  // downloadLink.click() will attempt to force a client-side download, works for web,
                  // for mobile apps blob downloads do not work ATM, code below is an alternative, (hover createFileAndOpenIt for jsdoc).
                  createFileAndOpenIt({ fileName: response2[0].docName, contentAsBase64: linkSource })
                }
              }
              else {
                const linkSource = `data:${response.documento.tipoMime};base64,${response.documento.contenido}`
                if (isWeb()) {
                  const downloadLink = window.document.createElement('a')
                  downloadLink.href = linkSource
                  downloadLink.download = translateZeusDocName(response.documento.nombre)
                  downloadLink.click()
                } else {
                  // downloadLink.click() will attempt to force a client-side download, works for web,
                  // for mobile apps blob downloads do not work ATM, code below is an alternative, (hover createFileAndOpenIt for jsdoc).
                  createFileAndOpenIt({ fileName: translateZeusDocName(response.documento.nombre), contentAsBase64: linkSource })
                }
              }
            }))
          }
          else {
            const linkSource = `data:${response.documento.tipoMime};base64,${response.documento.contenido}`
            if (isWeb()) {
              const downloadLink = window.document.createElement('a')
              downloadLink.href = linkSource
              downloadLink.download = response.documento.nombre
              downloadLink.click()
            } else {
              // downloadLink.click() will attempt to force a client-side download, works for web,
              // for mobile apps blob downloads do not work ATM, code below is an alternative, (hover createFileAndOpenIt for jsdoc).
              createFileAndOpenIt({ fileName: response.documento.nombre, contentAsBase64: linkSource })
            }
          }
        }
      }))
    } else if (currentProvision && currentProvision.dossierCod){
      var newDocumentumId = ''
      dispatch(thunkGetDossier(currentProvision.dossierCod, (response) => {
        if (response && response.dossier && response.dossier.documentList && response.dossier.documentList.sentDocument) {
          if (response.dossier.documentList.sentDocument.length !== 0) {
            for (var i = 0; i < response.dossier.documentList.sentDocument.length; i++) {
              if(uploadedDocumentName === response.dossier.documentList.sentDocument[i].documentName) {
                newDocumentumId = response.dossier.documentList.sentDocument[i].documentumId
              }
            }
            dispatch(thunkGetDocument(newDocumentumId, (response) => {
              if (response && response.documento) {
                // Comprobamos si el nombre del fihcero está compuesto por la nueva nomenclatura e ZEUS: IDENTIFICADORORIGEN_PROCESSBATCHID_CODIGOEXPEDIENTE/CUPS/NINGUNO_TIPODOCUMENTO_ SOLICITANTE_NOMBREDELFICHERO_FECHA
                // Comprobamos también que el PROCESSBATCHID pertenece a PDS (comienza por 02)
                if ((response.documento.nombre.match(/_/g) || []).length >= 6 && response.documento.nombre.split('_')[1].startsWith('02')) {
                  // El valor inicial '02' del PROCESSBATCHID tan solo sirve para indicar que pertenece a PDS. Pero para lanzar la consulta a nuestra base de datos 
                  // UFD_DOCUMENTOS_CARGA_OFFLINE tan solo usamos el resto del ID. Es decir, el id sería el PROCESSBATCHID sin el '02' inicial
                  const id = response.documento.nombre.split('_')[1].substring(2)
                  dispatch(thunkGetDocumentosCargaOffline(id, '', '', '', '', '', '', (response2) => {
                    if (response2 && response2.length > 0) {
                      const linkSource = `data:${response.documento.tipoMime};base64,${response.documento.contenido}`
                      if (isWeb()) {
                        const downloadLink = window.document.createElement('a')
                        downloadLink.href = linkSource
                        downloadLink.download = response2[0].docName
                        downloadLink.click()
                      } else {
                        // downloadLink.click() will attempt to force a client-side download, works for web,
                        // for mobile apps blob downloads do not work ATM, code below is an alternative, (hover createFileAndOpenIt for jsdoc).
                        createFileAndOpenIt({ fileName: response2[0].docName, contentAsBase64: linkSource })
                      }
                    }
                    else {
                      const linkSource = `data:${response.documento.tipoMime};base64,${response.documento.contenido}`
                      if (isWeb()) {
                        const downloadLink = window.document.createElement('a')
                        downloadLink.href = linkSource
                        downloadLink.download = translateZeusDocName(response.documento.nombre)
                        downloadLink.click()
                      } else {
                        // downloadLink.click() will attempt to force a client-side download, works for web,
                        // for mobile apps blob downloads do not work ATM, code below is an alternative, (hover createFileAndOpenIt for jsdoc).
                        createFileAndOpenIt({ fileName: translateZeusDocName(response.documento.nombre), contentAsBase64: linkSource })
                      }
                    }
                  }))
                }
                else {
                  const linkSource = `data:${response.documento.tipoMime};base64,${response.documento.contenido}`
                  if (isWeb()) {
                    const downloadLink = window.document.createElement('a')
                    downloadLink.href = linkSource
                    downloadLink.download = response.documento.nombre
                    downloadLink.click()
                  } else {
                    // downloadLink.click() will attempt to force a client-side download, works for web,
                    // for mobile apps blob downloads do not work ATM, code below is an alternative, (hover createFileAndOpenIt for jsdoc).
                    createFileAndOpenIt({ fileName: response.documento.nombre, contentAsBase64: linkSource })
                  }
                }
              }
            }))
          }
        }
      }))
    }
    setIsLoading(false)
  }

  const translateZeusDocName = (docName) => {
    const arrayName = docName.split('_')
    let auxName = arrayName[5]

    if (arrayName.length > 7) {
      arrayName.map((item, i) => {
        if (i > 5 && i < (arrayName.length - 1)) {
          auxName = auxName + '_' + item
        }
      })
      return auxName
    }
    else {
      return auxName
    }
  }

  const getBase64 = (file, cb) => {
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      cb(reader.result)
    }
    reader.onerror = (error) => {
      console.error('Error: ', error)
    }
  }

  const handleDocumentType = () => {
    if (documentType === 'DOCTYP0104') {
      setDocumentTypeIcon(DocumentationPlanIcon)
    } else if (documentType === 'DOCTYP0101') {
      setDocumentTypeIcon(PointerIcon)
    } else {
      setDocumentTypeIcon(AttachedDocumentTypeIcon)
    }
  }

  // uploadState = 1 --> Documento pendiente de carga offline [RECIBIDO]
  // uploadState = 2 --> Documento pendiente de carga offline [REPROCESO]
  // uploadState = 3 --> Documento procesado correctamente [PROCESADO OK]
  // uploadState = 4 --> Documento procesado incorrectamente [PROCESADO KO]
  // uploadState = 5 --> Documento eliminado del FTP por superar el límite de tiempo [ANULADO]

  const handleDocumentStatus = () => {
    if (documentStatus === 'DOCSTA0002') {
      if (!uploadState || uploadState === '3' || uploadState === '') {
        setDocumentStatusIcon(OnRevisionIcon)
        setDocumentStatusDescription('delivered')
      }
    } else if (documentStatus === 'DOCSTA0005') {
      if (uploadState === '1') {
        setDocumentStatusIcon(ProcessingIcon)
        setDocumentStatusDescription('processing')
      } else if (uploadState === '2') {
        setDocumentStatusIcon(ProcessingIcon)
        setDocumentStatusDescription('processing')
      } else if (uploadState === '4') {
        setDocumentStatusIcon(DeniedIcon)
        setDocumentStatusDescription('uploadError')
      } else if (uploadState === '5') {
        setDocumentStatusIcon(DeniedIcon)
        setDocumentStatusDescription('uploadFailed')
      }
    } else if (documentStatus === 'DOCSTA0004') {
      if (!uploadState || uploadState === '3' || uploadState === '') {
        setDocumentStatusIcon(ValidatedIcon)
        setDocumentStatusDescription('accepted')
      }
    } else if (documentStatus === 'DOCSTA0003') {
      setDocumentStatusIcon(DeniedIcon)
    }
  }

  const handleShowTooltip = (e) => {
    e.stopPropagation()
    if (e.target.id === 'attachComment' && !showTooltip) {
      setShowTooltip(true)
    } else if (e.target.id !== 'tooltipInput') {
      setShowTooltip(false)
    }
  }

  /*const handleUploadDocument = (e) => {
    const document = e.target.files[0]

    // TEMPORAL - limitar tamaño de los ficheros
    // if (document.size > maxUploadFileSize) {
    //   let error: string = ''
    //   let errorText: string = ''
    //   if (saveRequest) {
    //     error = t('errors.UP001')
    //     errorText = error.replace('#', (maxUploadFileSize / 1000000).toString())
    //     let dossierData = {
    //       actionType: 'LOAD_DOCUMENT',
    //       document: user.documentNumber,
    //       dossierCod: currentProvision.dossierCod,
    //       information: 'DOC_TYPE: ' + documentType + '; DOC_DESC: ' + documentTypeName + '; FILE_NAME: ' + document.name + '; FILE_SIZE: ' + document.size
    //     }

    //     dispatch(thunkSaveDossierData(dossierData, (response2) => {

    //     }))
    //   } else {
    //     error = t('errors.UP002')
    //     errorText = error.replace('#', (maxUploadFileSize / 1000000).toString())
    //   }

    //   dispatch(setMessage(errorText))

    //   return

    // }
    // TEMPORAL - FIN

    setIsBigFile(e.target.files[0].size > maxUploadFileSize ? true : false)

    let date: any

    date = new Date()

    const auxDate = date.getDate() + '/' + parseInt(date.getMonth() + 1) + '/' + date.getFullYear()

    setInnerDocument(document)

    setDocumentDate(auxDate)

    getBase64(document, (result) => {
      const base64 = result.substring(result.indexOf('base64,') + 7, result.length)

      // Thunk de subida del archivo de este objeto
      const data = {
        dossierCod: currentProvision.dossierCod,
        email: currentProvision.email,
        billingEmail: billingEmail,
        indAceptoFacturaDigital: indAceptoFacturaDigital,
        indPostalInvoice: (indAceptoFacturaDigital) ? 0 : 1,
        applicant: {
          docNumber: user.documentNumber
        },
        documentList: {
          document: [
            {
              // nombre: document.name,
              nombre: '1_' + processBatchID + '_' + currentProvision.dossierCod + '_' + documentType + '_' + user.documentNumber + '_' + innerDocument.name + '_' + formatDateZeus(new Date()),
              processBatchID: processBatchID,
              isBigFile: isBigFile ? '1' : '0',
              uploadDate: formatDateZeus(new Date()),
              extension: document.name && ('.' + document.name.split('.').pop()),
              tipoMime: document.type,
              carpeta: '/Documentos/ZEUDOCUWBS02',
              tipo: 'ZEUDOCUWBS02',
              contenido: base64,
              documentCode: documentCode,
              documentDesc: documentTypeName && documentTypeName,
              comment: innerComment,
              metadatos: [
                {
                  nombre: 'codigo_tipo',
                  valor: documentType
                },
                {
                  nombre: 'cod_expediente',
                  valor: currentProvision.dossierCod
                }
              ]
            }
          ]
        }
      }

      setIsLoading(true)

      dispatch(thunkUpdateDossier(currentProvision.dossierCod, true, data, (response) => {
        if (response && response.dossier) {
          dispatch(setCurrentProvision({
            ...currentProvision,
            dossierStatusId: response.dossier.dossierStatusId,
            documentList: response.dossier.documentList
          }))

          setNewDocumentsRecieved && setNewDocumentsRecieved({
            sentDocument: response.dossier.documentList && response.dossier.documentList.sentDocument ? response.dossier.documentList.sentDocument.map((item) => item) : [],
            nSentDocument: response.dossier.documentList && response.dossier.documentList.nSentDocument ? response.dossier.documentList.nSentDocument.map((item) => item) : []
          })

          if (setUploaded && setSentDocument) {
            const filteredSentDocumentList = currentProvision && currentProvision.documentList && currentProvision.documentList.sentDocument && currentProvision.documentList.sentDocument.filter((item) => item.documentType === 'DOCTYP0203' && item.comment === 'Justificante de la transferencia')

            setSentDocument(filteredSentDocumentList ? filteredSentDocumentList : [])

            setUploaded(true)
          }
          
          let defaultName = t('provisions.defaultName')

          dispatch(thunkGetProvision(currentProvision.dossierCod, defaultName, (response) => {
            if (response) {
              setNewDocumentsRecieved && setNewDocumentsRecieved({
                sentDocument: response && response.documentList && response.documentList.sentDocument ? response.documentList.sentDocument.map((item) => item) : [],
                nSentDocument: response && response.documentList && response.documentList.nSentDocument ? response.documentList.nSentDocument.map((item) => item) : []
              })

              if (setUploaded && setSentDocument) {
                const filteredSentDocumentList = currentProvision && currentProvision.documentList && currentProvision.documentList.sentDocument && currentProvision.documentList.sentDocument.filter((item) => item.documentType === 'DOCTYP0203' && item.comment === 'Justificante de la transferencia')
                setSentDocument(filteredSentDocumentList ? filteredSentDocumentList : [])
                setUploaded(true)
              }

              setIsLoading(false)
            }
          }))
        }

        setIsLoading(false)
      }))
    })
  }*/

  const handleDeleteDocument = () => {
    setIsLoading(true)

    documentAux.firstChild.value = ''

    setInnerDocument('')

    setDocumentDate('')

    const data = {
      dossierCod: currentProvision.dossierCod,
      email: currentProvision.email,
      //billingEmail: billingEmail,
      //indAceptoFacturaDigital: indAceptoFacturaDigital,
      //indPostalInvoice: (indAceptoFacturaDigital) ? 0 : 1,
      applicant: {
        docNumber: user.documentNumber
      },
      documentList: {
        document: [
          {
            id: documentumId,
            documentCode: documentCode,
            statusId: 'DOCSTA0010',
            metadatos: [
              {
                nombre: 'codigo_tipo',
                valor: documentType
              },
              {
                nombre: 'cod_expediente',
                valor: currentProvision.dossierCod
              }
            ]
          }
        ]
      }
    }

    dispatch(thunkUpdateDossier(currentProvision.dossierCod, false, data, (response) => {
      if (response && response.dossier) {
        dispatch(setCurrentProvision({
          ...currentProvision,
          dossierStatusId: response.dossier.dossierStatusId,
          documentList: response.dossier.documentList
        }))

        setNewDocumentsRecieved({
          sentDocument: response.dossier.documentList && response.dossier.documentList.sentDocument ? response.dossier.documentList.sentDocument.map((item) => item) : [],
          nSentDocument: response.dossier.documentList && response.dossier.documentList.nSentDocument ? response.dossier.documentList.nSentDocument.map((item) => item) : []
        })

        /*
        let defaultName = t('provisions.defaultName')

        dispatch(thunkGetProvision(currentProvision.dossierCod, defaultName, (response) => {
          if (response) {
            setNewDocumentsRecieved && setNewDocumentsRecieved({
              sentDocument: response && response.documentList && response.documentList.sentDocument ? response.documentList.sentDocument.map((item) => item) : [],
              nSentDocument: response && response.documentList && response.documentList.nSentDocument ? response.documentList.nSentDocument.map((item) => item) : []
            })
          }

          setIsLoading(false)
        }))
        */
      }

      setIsLoading(false)
    }))
  }

  const handleOpenDialog = () => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    sendGAEvent({
      event: 'request_funnel',
      section_name: 'mi conexion a la red',
      subsection_name: 'detalle de solicitud',
      title_screen: 'mis documentos',
      click_text: 'seleccionar coordenadas en plano',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      request_type: 'quiero una nueva conexion a la red',
      request_step_name: 'datos de la solicitud',
      request_number: currentProvision.dossierCod,
      request_status: getExpStatus(currentProvision.dossierStatusId),
      tab_name: 'mi conexion a la red',
      browsing_type: sessionStorage.getItem('browsing_type'),
      document_type: 'plano ubicacion cgp'
    })
    setPopup(true)
  }

  const handleSendGAEvent = () => {
    // LCS: Enviar evento de GdC a GA - Wave 3

    if (paymentFrame === true) {
      sendGAEvent({
        event: 'request_funnel',
        section_name: 'mi conexion a la red',
        subsection_name: 'detalle de solicitud',
        title_screen: 'importe a pagar',
        click_text: 'subir documento',
        element_type: 'consulta de informacion',
        page_url: window.location.href,
        request_step_name: 'pago',
        request_number: currentProvision.dossierCod,
        request_status: getExpStatus(currentProvision.dossierStatusId),
        tab_name: 'mi conexion a la red',
        browsing_type: sessionStorage.getItem('browsing_type'),
        payment_type: 'no aplica',
        budget_value: budgetValue
      })
    } else {
      sendGAEvent({
      event: 'request_funnel',
      section_name: 'mi conexion a la red',
      subsection_name: 'detalle de solicitud',
      title_screen: 'mis documentos',
      click_text: (documentType !== 'DOCTYP0101' ? 'subir documento' : 'adjuntar croquis'),
      element_type: 'consulta de informacion',
      page_url: window.location.href,
      request_type: 'quiero una nueva conexion a la red',
      request_step_name: 'datos de la solicitud',
      request_number: currentProvision.dossierCod,
      request_status: getExpStatus(currentProvision.dossierStatusId),
      tab_name: 'mi conexion a la red',
      browsing_type: sessionStorage.getItem('browsing_type'),
      document_type: 'plano ubicacion cgp'
    })
  }
    
  }

  const handleOpenCroquis = () => {
    handleSendGAEvent()
    setPopupCroquis(true)
  }

  const handleAddOtherDoc = () => {
    handleSendGAEvent()
    setPopupOtherDoc(true)
  }

  const handleAddDn = () => {
    setPopupDnInfo(true)
  }

  useEffect(() => {
    if (documentUpload) {
      setTextDownload('provisions.documentation.downloadDocument')
      setDocumentStatusIcon(OnRevisionIcon)
      setDocumentStatusDescription('delivered')
    }
  }, [documentUpload, setDocumentUpload])

  useEffect(() => {
    window.addEventListener('mousedown', handleShowTooltip)
    // eslint-disable-next-line
  }, [showTooltip])

  useEffect(() => {
    handleDocumentType()
    // eslint-disable-next-line
  }, [documentType])

  useEffect(() => {
    handleDocumentStatus()
    // eslint-disable-next-line
  }, [documentStatus, uploadState])

  useEffect(() => {
    if (setUploaded) {
      if (innerDocument) {
        setUploaded(true)
      } else {
        setUploaded(false)
      }
    }
    // eslint-disable-next-line
  }, [innerDocument])

  useEffect(() => {
    if (isBlockingDoc) {
      setDocumentStatusIcon(DeniedIcon)
    }
  }, [isBlockingDoc])

  useEffect(() => {
    dispatch(thunkGetMasterData('DOCUMENT_SIZE', 'ES', '', (response) => {
      if (response) {
        setMaxUploadFileSize(parseInt(response[0].value))
      }
    }))
    dispatch(thunkGetMasterData('DOSSIER_CONTROL', 'ES', 'SAVE_REQUEST', (response) => {
      if (response) {
        setSaveRequest(parseInt(response[0].value))
      }
    }))
  }, [])

  useEffect(() => {
    if (documentType === 'DOCTYP0203') {
      if (processBatchID && processBatchID !== '' && processBatchID.startsWith('02')) {
        // El valor inicial '02' del PROCESSBATCHID tan solo sirve para indicar que pertenece a PDS. Pero para lanzar la consulta a nuestra base de datos 
        // UFD_DOCUMENTOS_CARGA_OFFLINE tan solo usamos el resto del ID. Es decir, el id sería el PROCESSBATCHID sin el '02' inicial
        const id = processBatchID.substring(2)
        dispatch(thunkGetDocumentosCargaOffline(id, '', '', '', '', '', '', (response) => {
          if (response && response.length > 0) {
            setDocNameTranslation(response[0].docName)
          }
          else {
            setDocNameTranslation('Documento')
          }
        }))
      } else if (documentName && documentName !== '') {
        if ((documentName.match(/_/g) || []).length >= 6) {
          const auxName = translateZeusDocName(documentName)
          setDocNameTranslation(auxName)
        }
        else {
          setDocNameTranslation(documentName)
        }
      }
    }
  }, [])

  useEffect(() => {
    if (uploadDate && uploadDate !== '') {
      setRealUploadDate(translateDocOfflineDates(uploadDate, true))
      setRealUploadHour(translateDocOfflineDates(uploadDate, false))
    }
  }, [uploadDate])

  return (
    <>
      <AddPlanDialog popup={popup} setPopup={setPopup} setNewDocumentsRecieved={setNewDocumentsRecieved} />
      <Grid item xs='auto' sm='auto' md='auto' className={classes.documentContainer}>
        <div className={showUploaded || isBlockingDoc ? (!innerDocument || isBlockingDoc ? (documentUpload ? classes.item : classes.itemError) : classes.item) : classes.item}>
          <Grid container justifyContent='center' alignItems='center'>
            {
              isLoading &&
              <Spinner />
            }
            <Grid item className={classes.upPart}>
              {documentStatusIcon && (
                <div className={classes.statusInfo}>
                  {documentStatusDescription === 'processing' ?
                    <Tooltip title={t('provisions.documentation.documentDescription.' + documentStatusDescription) + maxUploadFileSize / 1000000 + t('common.units.mb')} placement='bottom'>
                      <img className={classes.statusIcon} src={documentStatusIcon} alt='' />
                    </Tooltip>
                    :
                    <Tooltip title={t('provisions.documentation.documentDescription.' + documentStatusDescription)} placement='bottom'>
                      <img className={classes.statusIcon} src={documentStatusIcon} alt='' />
                    </Tooltip>
                  }

                </div>
              )}
              <Grid container spacing={2} alignItems='center' direction='column'>
                {/* {documentName ? */}
                {docNameTranslation ?
                  <>
                    <Grid item className={classes.documentType}>
                      {/* {documentName} */}
                      {docNameTranslation}
                      <Grid item className={classes.documentType2}>
                        {documentTypeName}
                      </Grid>
                    </Grid>
                  </>
                  :
                  <>
                    <Grid item className={classes.documentType}>
                      {documentTypeName}
                    </Grid>
                  </>
                }
                {(documentTypeIcon && !isBlockingDoc) && <img src={documentTypeIcon} className={classes.icon} alt='' />}
              </Grid>
            </Grid>
            <Grid item className={classes.separator} />
            <Grid container spacing={3} direction='column' className={classes.downPart}>
              {showTooltip && (
                <div className={classes.tooltip} id='tooltipInput'>
                  <div className={classes.input}>
                    {innerComment}
                  </div>
                </div>
              )}
              <Grid item className={classes.fullWidth}>

                <Grid container justifyContent='center' alignItems='center' className={classes.uploadInfo}>
                  {innerComment &&
                    (
                      <Grid className={classes.customDocumentType}>
                        <img id='attachComment' className={classes.attachCommentIco} src={AttachedDocumentTypeIcon} alt='' onMouseDown={handleShowTooltip} />
                      </Grid>
                    )
                  }

                  <Grid container direction='column' justifyContent='center' alignItems='center'>
                    <Grid item className={classes.date}>
                      {(realUploadDate && realUploadDate !== '') ? realUploadDate : formatDate(registerDate)}
                    </Grid>

                    <Grid item className={classes.date}>
                      {(realUploadHour && realUploadHour !== '') ? realUploadHour : formatTime(registerDate)}
                    </Grid>

                  </Grid>

                  {innerDocument && (uploadState !== '1' && uploadState !== '2' && uploadState !== '4') &&
                    documentStatus !== 'DOCSTA0002' &&
                    documentStatus !== 'DOCSTA0004' &&
                    <Grid item className={classes.deleteDocument}>
                      <img src={DeleteArchiveIcon} alt='' onClick={handleDeleteDocument} />
                    </Grid>
                  }
                </Grid>

                {(documentUpload) &&
                  <Grid
                    className={`${classes.documentName} ${classes.downloadDocument}`}
                    onClick={handleDownloadDocument}
                  >
                    {t(textDownload)}
                  </Grid>
                }

                {(uploadState !== '1' && uploadState !== '2' && uploadState !== '4') &&
                  (documentumId && !isBlockingDoc) &&
                  <Grid
                    className={`${classes.documentName} ${classes.downloadDocument}`}
                    onClick={handleDownloadDocument}
                  >
                    {t('provisions.documentation.downloadDocument')}
                  </Grid>
                }
                {documentUpload ? '' : (
                  isBlockingDoc &&
                  <Grid className={classes.blockingDocText}>
                    {t('provisions.documentation.blockedByDoc')}
                  </Grid>
                )}
                {
                  /*
                  documentumId ?
                    <a
                      download={documentumName}
                      href={documentumBase64}
                      className={`${classes.documentName} ${classes.downloadDocument}`}
                    >
                      {documentumName}
                    </a>
                  :
                    <div className={classes.documentName}>{innerDocument && innerDocument.name}</div>
                  */
                }
              </Grid>
              {!adminCheck() &&
                documentStatus !== 'DOCSTA0002' &&
                (documentStatus !== 'DOCSTA0004' && (
                  <div className={`${classes.uploadLink} plan`}>
                    {
                      documentType !== 'DOCTYP0101' ?
                        <>
                          {documentStatus !== 'DOCSTA0003' &&
                            <>
                              {/*<InputBase
                              type='file'
                              onChange={handleUploadDocument}
                              id={'boton-file-' + rand}
                              ref={(ref) => (documentAux = ref)}
                              style={{ display: 'none' }}
                            />*/}

                              <AddOtherDocumentDialog
                                popup={popupOtherDoc}
                                setPopup={setPopupOtherDoc}
                                setNewDocumentsRecieved={setNewDocumentsRecieved}
                                documentTypeName={documentTypeName}
                                documentType={documentType}
                                documentCode={documentCode}
                                setDocumentDate={setDocumentDate}
                                setUploaded={setUploaded}
                                setSentDocument={setSentDocument}
                                billingEmail={billingEmail}
                                indAceptoFacturaDigital={indAceptoFacturaDigital}
                                nameAndSurname={nameAndSurname}
                                address={address}
                                zipcode={zipcode}
                                stateProv={stateProv}
                                town={town}
                                popupDnInfo={popupDnInfo}
                                setPopupDnInfo={setPopupDnInfo}
                                setDocumentUpload={setDocumentUpload}
                                setUploadedDocumentName={setUploadedDocumentName}
                              />

                              <DnInfoDialog
                                popup={popupDnInfo}
                                setPopup={setPopupDnInfo}
                                handleAddOtherDoc={handleAddOtherDoc}
                              />

                              {

                                (documentType === 'DOCTYP0215' && currentProvision.selfConsumption === '1') ? //Resguardo acreditativo de presentación del aval
                                  <Grid className={classes.button} xs={12} justifyContent='center'>
                                    <a className={classes.link} href={'/aval CAM.pdf'}   /* target="_blank"  rel="noopener noreferrer" download="nombre_pretendido_del archivo.pdf" */>
                                      Consulta ejemplo
                                    </a>
                                  </Grid>
                                  :
                                  (documentType === 'DOCTYP0335' && currentProvision.selfConsumption === '1') ? //Acuerdo entre titulares
                                    <Grid className={classes.button} xs={12} justifyContent='center'>
                                      <a className={classes.link} href={'/acuerdo entre titulares.pdf'}   /* target="_blank"  rel="noopener noreferrer" download="nombre_pretendido_del archivo.pdf" */>
                                        Consulta ejemplo
                                      </a>
                                    </Grid>
                                    :
                                    (documentType === 'DOCTYP0208' && currentProvision.selfConsumption === '1') ? //Autorización del propietarios
                                      <Grid className={classes.button} xs={12} justifyContent='center'>
                                        <a className={classes.link} href={'/Autorizacion_Delegacion_Punto_de_suministro.pdf'}   /* target="_blank"  rel="noopener noreferrer" download="nombre_pretendido_del archivo.pdf" */>
                                          Consulta ejemplo
                                        </a>
                                      </Grid>
                                      :
                                      (documentType === 'DOCTYP0307' && currentProvision.selfConsumption === '1') && //Conformidad Aval Órgano Competente
                                      <Grid className={classes.button} xs={12} justifyContent='center'>
                                        <a className={classes.link} href={'/conformidad aval.pdf'}   /* target="_blank"  rel="noopener noreferrer" download="nombre_pretendido_del archivo.pdf" */>
                                          Consulta ejemplo
                                        </a>
                                      </Grid>
                              }

                              {documentStatus === 'DOCSTA0005' && (uploadState === '5' || uploadState === '') &&
                                (documentTypeName === 'DNI/Poderes' || documentTypeName === 'DNI/poderes' || documentTypeName === 'DNI/Powers of attorney') &&
                                (documentUpload === false) ?

                                <label htmlFor={'boton-file-' + rand}>
                                  {documentUpload ? '' : (
                                    <IconTextButton
                                      icon={<img src={UploadArchiveIcon} alt='' />}
                                      text={t(textDownload)}
                                      onClick={handleAddDn}
                                      justifyCenter
                                    />
                                  )}
                                </label>

                                :
                                <label htmlFor={'boton-file-' + rand}>
                                  {documentUpload ? '' : (
                                    <IconTextButton
                                      icon={<img src={UploadArchiveIcon} alt='' />}
                                      text={t(textDownload)}
                                      onClick={handleAddOtherDoc}
                                      justifyCenter
                                    />
                                  )}
                                </label>
                              }
                            </>
                          }
                        </>
                        :
                        <div className={classes.plan}>
                          <div className={classes.paddingLeftTextButton} onClick={handleOpenDialog}>
                            {documentUpload ? '' : (
                              <IconTextButton
                                icon={<img src={UploadArchiveIcon} alt='' />}
                                text={t('provisions.documentation.attachPlan')}
                              />
                            )}
                          </div>

                          {documentUpload ? '' : (
                            <div className={classes.orLabel}>{t('common.conjunctions.or')}</div>
                          )}

                          <div className={classes.paddingLeftTextButton}>
                            {/*<InputBase
                            type='file'
                            onChange={handleUploadDocument}
                            id={'boton-file-' + rand}
                            ref={(ref) => (documentAux = ref)}
                            style={{ display: 'none' }}
                          />*/}

                            <AddOtherDocumentDialog
                              popup={popupCroquis}
                              setPopup={setPopupCroquis}
                              setNewDocumentsRecieved={setNewDocumentsRecieved}
                              documentTypeName={documentTypeName}
                              documentType={documentType}
                              documentCode={documentCode}
                              setDocumentDate={setDocumentDate}
                              setUploaded={setUploaded}
                              setSentDocument={setSentDocument}
                              billingEmail={billingEmail}
                              indAceptoFacturaDigital={indAceptoFacturaDigital}
                              nameAndSurname={nameAndSurname}
                              address={address}
                              zipcode={zipcode}
                              stateProv={stateProv}
                              town={town}
                              setDocumentUpload={setDocumentUpload}
                              setUploadedDocumentName={setUploadedDocumentName}
                            />

                            <label htmlFor={'boton-file-' + rand}>
                              {documentUpload ? '' : (
                                <IconTextButton
                                  icon={<img src={UploadArchiveIcon} alt='' />}
                                  text={t('provisions.documentation.attachSketch')}
                                  onClick={handleOpenCroquis}
                                />
                              )}
                            </label>
                          </div>
                        </div>
                    }
                  </div>
                ))}
            </Grid>
            {(uploadState === '1' || uploadState === '2' || uploadState === '4') &&
              <>
                <Grid item className={classes.separator} />
                <Grid container spacing={3} direction='column' className={classes.messagePart}>

                  <Grid container direction='column' justifyContent='center' alignItems='center'>
                    <Grid item className={classes.message}>
                      {t('provisions.documentation.uploadMessage')}
                      {/* <Link
                      to={''}
                      className={classes.messageLink}
                    >
                      {t('provisions.documentation.sendRequest')}
                    </Link> */}
                    </Grid>
                  </Grid>

                </Grid>
              </>
            }
          </Grid>
        </div>
      </Grid>
    </>
  )
}

export default DocumentUploadFrame
