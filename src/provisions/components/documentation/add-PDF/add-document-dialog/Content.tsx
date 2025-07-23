import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Grid from '@material-ui/core/Grid'
import InputBase from '@material-ui/core/InputBase'

import DocumentIcon from '../../../../../../src/assets/icons/plano_documento_adjunto.svg'
import Button from '../../../../../common/components/button/Button'
import Input from '../../../../../common/components/input/Input'
import Select from '../../../../../common/components/select/Select'
import Spinner from '../../../../../common/components/spinner/Spinner'


import { setCurrentProvision } from '../../../../store/actions/ProvisionsActions'
import { thunkGetMasterData, thunkUpdateDossier, thunkGetDocumentosCargaOffline, thunkCreateDocumentoCargaOffline } from '../../../../store/actions/ProvisionsThunkActions'

import { formatDateZeus, formatDateAndHourString, formatDateAndHourZeus } from '../../../../../common/lib/FormatLib'

import useStyles from './Content.styles'
import { useEffect } from 'react'
import AddOtherDocument from '../../../../../gestionAverias/components/averiasNavigation/searchCups/components/AddOtherDocument/AddOtherDocument'
import BusquedaAvanzada from '../../../../../gestionAverias/components/averiasNavigation/searchCups/components/BusquedaAvanzada/BusquedaAvanzada'

const Content = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const {
    setNewDocumentsRecieved,
    setPopup,
    documentTypeName,
    documentType,
    documentCode,
    setUploaded,
    setSentDocument,
    billingEmail,
    indAceptoFacturaDigital,
    address,
    zipcode,
    stateProv,
    town,
    setBigFilePopup,
    setDocumentUpload,
    setUploadedDocumentName,
    payerExists,
    ownerExists,
    setPayerDocument,
    setOwnerDocument,
    payerOrOwner,

    setRefresh = () => { },
    setIsLoadingDocumentation = () => { }
  } = props

  const user = useSelector((state: any) => state.user.profile)
  const currentProvision = useSelector((state: any) => state.provisions.currentProvision)

  const [loadingDocumentList, setLoadingDocumentList] = useState(false)

  const getBase64 = (file, cb) => {
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      cb(reader.result)
    }
    reader.onerror = (error) => {
      console.log('Error: ', error)
    }
  }

  const [isLoading, setIsLoading] = useState(false)
  const [innerDocument, setInnerDocument] = useState<any>()
  const [innerComment, setInnerComment] = useState('')
  const [innerComment1, setInnerComment1] = useState('')
  const [documentName, setDocumentName] = useState('')
  const [characters, setCharacters] = useState(60)
  const [characters1, setCharacters1] = useState(60)

  const [maxUploadFileSize, setMaxUploadFileSize] = useState<number>(2000000)
  const [isBigFile, setIsBigFile] = useState(false)
  const [fileSize, setFileSize] = useState('')
  const [saveRequest, setSaveRequest] = useState<number>(0)
  const [error, setError] = useState<string>('')

  const [hideOtherDoc, setHideOtherDoc] = useState(false as boolean)

  interface iDocument {documentCode: string, documentName: string, value}

  const [nameFromSelect2, setNameFromSelect2] = useState<iDocument | null>(null)

  const [nameFromSelect, setNameFromSelect] = useState('')
  const [documentTypeCode, setDocumentTypeCode] = useState('')
  const [documentTypeDesc, setDocumentTypeDesc] = useState('')
  const [selectValues, setSelectValues] = useState([])
  const [documentList, setDocumentList] = useState([])

  const rand = Math.round(1 + Math.random() * (1000 - 1))

  let documentAux: any

  const openFileDialog = () => {
    documentAux.firstChild.click()
  }

  const handleUploadDocument = (e) => {
    // TEMPORAL - limitar tamaño de los ficheros
    // setError('')

    // if (e.target.files[0].size > maxUploadFileSize) {
    //   let error: string = ''
    //   let errorText: string = ''
    //   if (saveRequest) {
    //     error = t('errors.UP001')
    //     errorText = error.replace('#', (maxUploadFileSize / 1000000).toString())

    //     let dossierData = {
    //       actionType: 'LOAD_DOCUMENT',
    //       document: user.documentNumber,
    //       dossierCod: currentProvision.dossierCod,
    //       information: 'DOC_TYPE: DOCTYP0203; DOC_DESC: OTRA; FILE_NAME: ' + e.target.files[0].name + '; FILE_SIZE: ' + e.target.files[0].size
    //     }

    //     dispatch(thunkSaveDossierData(dossierData, (response2) => {

    //     }))
    //   } else {
    //     error = t('errors.UP002')
    //     errorText = error.replace('#', (maxUploadFileSize / 1000000).toString())
    //   }
    //   setError(errorText)

    //   return
    // }
    // TEMPORAL - FIN

    setIsBigFile(e.target.files[0].size > maxUploadFileSize ? true : false)
    setFileSize((e.target.files[0].size).toString())

    setInnerDocument(e.target.files[0])
    setDocumentName(e.target.files[0].name)
  }

  const handleUploadDocument2 = (e) => {

    // TEMPORAL - limitar tamaño de los ficheros
    // if (e.target.files[0].size > maxUploadFileSize) {
    //   let error: string = ''
    //   let errorText: string = ''
    //   if (saveRequest) {
    //     error = t('errors.UP001')
    //     errorText = error.replace('#', (maxUploadFileSize / 1000000).toString())
    //     let dossierData = {
    //       actionType: 'LOAD_DOCUMENT',
    //       document: user.documentNumber,
    //       dossierCod: currentProvision.dossierCod,
    //       information: 'DOC_TYPE: ' + documentType + '; DOC_DESC: ' + documentTypeName + '; FILE_NAME: ' + e.target.files[0].name + '; FILE_SIZE: ' + e.target.files[0].size
    //     }

    //     dispatch(thunkSaveDossierData(dossierData, (response2) => {

    //     }))
    //   } else {
    //     error = t('errors.UP002')
    //     errorText = error.replace('#', (maxUploadFileSize / 1000000).toString())
    //   }

    //   return

    // }
    // TEMPORAL - FIN

    setIsBigFile(e.target.files[0].size > maxUploadFileSize ? true : false)
    setFileSize((e.target.files[0].size).toString())

    let date: any

    date = new Date()

    //const auxDate = date.getDate() + '/' + parseInt(date.getMonth() + 1) + '/' + date.getFullYear()

    setInnerDocument(e.target.files[0])
    setDocumentName(e.target.files[0].name)
    //setDocumentDate(auxDate)
  }

  const handleComment = (e) => {
    setInnerComment(e.target.value)
    setCharacters(60 - e.target.value.length)
  }

  const handleComment1 = (e) => {
    setInnerComment1(e.target.value)
    setCharacters1(60 - e.target.value.length)
  }

  const handleSendFile = () => {
    const actualDateString = formatDateAndHourString(new Date())
    const actualDate = new Date()
    let processBatchID = ''
    let fileNameWithoutExtension = innerDocument && innerDocument.name.split('.')[0]

    if (!documentTypeName) {
      if (indAceptoFacturaDigital) {
        let docCargaOfflineData = {
          id: '',
          expediente: '',
          cups: '',
          doctype: documentTypeCode,
          fechaRealSubida: actualDateString,
          docName: (innerComment + innerDocument.name.substring(innerDocument.name.indexOf('.'), innerDocument.name.length)),
          docSize: fileSize
        }

        setIsLoading(true)

        dispatch(thunkCreateDocumentoCargaOffline(docCargaOfflineData, (response) => {
          if (response) {

            dispatch(thunkGetDocumentosCargaOffline('', user.documentNumber, '', '', actualDateString, '', '', (response) => {
              if (response && response.length > 0) {
                processBatchID = (response[0].id).toString()

                getBase64(innerDocument, (result) => {
                  const base64 = result.substring(result.indexOf('base64,') + 7, result.length)
                  // Thunk de subida del archivo de este objeto
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
                          nombre: '1_' + ('02' + processBatchID) + '_' + currentProvision.dossierCod + '_' + documentTypeCode + '_' + user.documentNumber + '_' + innerComment + '_' + formatDateZeus(actualDate),
                          processBatchID: ('02' + processBatchID),
                          isBigFile: isBigFile ? '1' : '0',
                          uploadDate: formatDateAndHourZeus(actualDate),
                          extension: innerDocument && innerDocument.name.substring(innerDocument.name.indexOf('.'), innerDocument.name.length),
                          tipoMime: innerDocument && innerDocument.type,
                          carpeta: '/Documentos/ZEUDOCUWBS02',
                          tipo: 'ZEUDOCUWBS02',
                          contenido: base64,
                          documentDesc: documentTypeDesc,
                          comment: innerComment,
                          documentName: '1_' + ('02' + processBatchID) + '_' + currentProvision.dossierCod + '_' + documentTypeCode + '_' + user.documentNumber + '_' + innerComment + '_' + formatDateZeus(actualDate),
                          observations: 'Nombre documento: ' + innerComment + ' / Observaciones: ' + innerComment1,
                          metadatos: [
                            {
                              nombre: 'codigo_tipo',
                              valor: documentTypeCode,
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
                    if (response && response.documentList && response.documentList && response.documentList.document) {
                      setDocumentUpload(true)
                      setIsLoadingDocumentation(true)
                      setUploadedDocumentName(data.documentList.document[0].nombre + '.txt')
                      dispatch(setCurrentProvision({
                        ...currentProvision,
                        documentList: response.documentList
                      }))

                      setNewDocumentsRecieved({
                        sentDocument: response.documentList && response.documentList.sentDocument ? response.documentList.document.map((item) => item) : [],
                        nSentDocument: response.documentList && response.documentList.document ? response.documentList.document.map((item) => item) : []
                      })

                      if (isBigFile) {
                        setBigFilePopup(true)
                      }
                      setUploaded(true)
                    }
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

                      if (isBigFile) {
                        setBigFilePopup(true)
                      }
                    }
                    setPopup(false)
                    setIsLoading(false)
                    setIsLoadingDocumentation(true)
                    setRefresh(true)
                  }))
                })
              }
              else {
                setIsLoading(false)
                setIsLoadingDocumentation(true)
                setRefresh(true)
              }
            }))
          }
          else {
            setIsLoading(false)
            setIsLoadingDocumentation(true)
            setRefresh(true)
          }
        }))
      } else {
        let docCargaOfflineData = {
          id: '',
          expediente: currentProvision.dossierCod,
          cups: '',
          doctype: documentTypeCode,
          fechaRealSubida: actualDateString,
          docName: (innerComment + innerDocument.name.substring(innerDocument.name.indexOf('.'), innerDocument.name.length)),
          docSize: fileSize
        }

        setIsLoading(true)

        dispatch(thunkCreateDocumentoCargaOffline(docCargaOfflineData, (response) => {
          if (response) {
            dispatch(thunkGetDocumentosCargaOffline('', user.documentNumber, '', '', actualDateString, '', '', (response) => {
              if (response && response.length > 0) {
                processBatchID = (response[0].id).toString()

                getBase64(innerDocument, (result) => {
                  const base64 = result.substring(result.indexOf('base64,') + 7, result.length)

                  // Thunk de subida del archivo de este objeto
                  const data = {
                    dossierCod: currentProvision.dossierCod,
                    email: currentProvision.email,
                    //indMail: 1,
                    //billingEmail: billingEmail,
                    //indAceptoFacturaDigital: indAceptoFacturaDigital,
                    //indPostalInvoice: (indAceptoFacturaDigital) ? 0 : 1,
                    applicant: {
                      docNumber: user.documentNumber
                    },
                    documentList: {
                      document: [
                        {
                          nombre: '1_' + ('02' + processBatchID) + '_' + currentProvision.dossierCod + '_' + documentTypeCode + '_' + user.documentNumber + '_' + innerComment + '_' + formatDateZeus(actualDate),
                          processBatchID: ('02' + processBatchID),
                          isBigFile: isBigFile ? '1' : '0',
                          uploadDate: formatDateAndHourZeus(actualDate),
                          extension: innerDocument && innerDocument.name.substring(innerDocument.name.indexOf('.'), innerDocument.name.length),
                          tipoMime: innerDocument && innerDocument.type,
                          carpeta: '/Documentos/ZEUDOCUWBS02',
                          tipo: 'ZEUDOCUWBS02',
                          contenido: base64,
                          documentDesc: documentTypeDesc,
                          comment: innerComment,
                          documentName: '1_' + ('02' + processBatchID) + '_' + currentProvision.dossierCod + '_' + documentTypeCode + '_' + user.documentNumber + '_' + innerComment + '_' + formatDateZeus(actualDate),
                          observations: 'Nombre documento: ' + innerComment + ' / Observaciones: ' + innerComment1,
                          metadatos: [
                            {
                              nombre: 'codigo_tipo',
                              valor: documentTypeCode,
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
                    if (response && response.documentList && response.documentList && response.documentList.document) {
                      setDocumentUpload(true)
                      setIsLoadingDocumentation(true)
                      setUploadedDocumentName(data.documentList.document[0].nombre + '.txt')
                      dispatch(setCurrentProvision({
                        ...currentProvision,
                        documentList: response.documentList
                      }))

                      setNewDocumentsRecieved({
                        sentDocument: response.documentList && response.documentList.sentDocument ? response.documentList.document.map((item) => item) : [],
                        nSentDocument: response.documentList && response.documentList.document ? response.documentList.document.map((item) => item) : []
                      })

                      if (isBigFile) {
                        setBigFilePopup(true)
                      }
                      setUploaded(true)
                    }
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

                      if (isBigFile) {
                        setBigFilePopup(true)
                      }
                    }
                    setPopup(false)
                    setIsLoading(false)
                    setIsLoadingDocumentation(true)
                    setRefresh(true)
                  }))
                })
              }
              else {
                setIsLoading(false)
                setIsLoadingDocumentation(true)
                setRefresh(true)
              }
            }))
          }
          else {
            setIsLoading(false)
            setIsLoadingDocumentation(true)
            setRefresh(true)
          }
        }))
      }
    } else {
      if (indAceptoFacturaDigital) {
        let docCargaOfflineData = {
          id: '',
          expediente: currentProvision.dossierCod,
          cups: '',
          doctype: documentType,
          fechaRealSubida: actualDateString,
          docName: innerDocument && innerDocument.name,
          docSize: fileSize
        }

        setIsLoading(true)

        dispatch(thunkCreateDocumentoCargaOffline(docCargaOfflineData, (response) => {
          if (response) {
            dispatch(thunkGetDocumentosCargaOffline('', '', '', '', actualDateString, '', '', (response) => {
              if (response && response.length > 0) {
                processBatchID = (response[0].id).toString()

                getBase64(innerDocument, (result) => {
                  const base64 = result.substring(result.indexOf('base64,') + 7, result.length)
                  // Thunk de subida del archivo de este objeto
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
                          nombre: '1_' + ('02' + processBatchID) + '_' + currentProvision.dossierCod + '_' + documentType + '_' + user.documentNumber + '_' + fileNameWithoutExtension + '_' + formatDateZeus(actualDate),
                          processBatchID: ('02' + processBatchID),
                          isBigFile: isBigFile ? '1' : '0',
                          uploadDate: formatDateAndHourZeus(actualDate),
                          extension: innerDocument.name && ('.' + innerDocument.name.split('.').pop()),
                          tipoMime: innerDocument.type,
                          carpeta: '/Documentos/ZEUDOCUWBS02',
                          tipo: 'ZEUDOCUWBS02',
                          contenido: base64,
                          documentCode: documentCode,
                          documentDesc: documentTypeName,
                          comment: innerComment,
                          observations: innerComment1,
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
                    if (response && response.documentList && response.documentList && response.documentList.document) {
                      setDocumentUpload(true)
                      setIsLoadingDocumentation(true)
                      setUploadedDocumentName(data.documentList.document[0].nombre + '.txt')
                      dispatch(setCurrentProvision({
                        ...currentProvision,
                        documentList: response.documentList
                      }))

                      setNewDocumentsRecieved && setNewDocumentsRecieved({
                        sentDocument: response.documentList && response.documentList.sentDocument ? response.documentList.document.map((item) => item) : [],
                        nSentDocument: response.documentList && response.documentList.document ? response.documentList.document.map((item) => item) : []
                      })

                      if (setUploaded && setSentDocument) {
                        const filteredSentDocumentList = currentProvision && currentProvision.documentList && currentProvision.documentList.document && currentProvision.documentList.document.filter((item) => item.documentType === 'DOCTYP0203' && item.comment === 'Justificante de la transferencia')

                        setSentDocument(filteredSentDocumentList ? filteredSentDocumentList : [])
                      }

                      if (isBigFile) {
                        setBigFilePopup(true)
                      }
                      setUploaded(true)
                    }
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

                      if (isBigFile) {
                        setBigFilePopup(true)
                      }
                    }
                    setPopup(false)
                    setIsLoading(false)
                    setIsLoadingDocumentation(true)
                    setRefresh(true)
                  }))
                })
              }
              else {
                setIsLoading(false)
                setIsLoadingDocumentation(true)
                setRefresh(true)
              }
            }))
          }
          else {
            setIsLoading(false)
            setIsLoadingDocumentation(true)
            setRefresh(true)
          }
        }))
      } else {
        let docCargaOfflineData = {
          id: '',
          expediente: currentProvision.dossierCod,
          cups: '',
          doctype: documentType,
          fechaRealSubida: actualDateString,
          docName: innerDocument && innerDocument.name,
          docSize: fileSize
        }

        setIsLoading(true)

        dispatch(thunkCreateDocumentoCargaOffline(docCargaOfflineData, (response) => {
          if (response) {
            dispatch(thunkGetDocumentosCargaOffline('', '', '', '', actualDateString, '', '', (response) => {
              if (response && response.length > 0) {
                processBatchID = (response[0].id).toString()

                getBase64(innerDocument, (result) => {
                  const base64 = result.substring(result.indexOf('base64,') + 7, result.length)
                  // Thunk de subida del archivo de este objeto
                  let data = {
                    dossierCod: currentProvision.dossierCod,
                    email: currentProvision.email,
                    //indMail: 1,
                    //billingEmail: billingEmail,
                    //indAceptoFacturaDigital: indAceptoFacturaDigital,
                    //indPostalInvoice: (indAceptoFacturaDigital) ? 0 : 1,
                    applicant: {
                      docNumber: user.documentNumber
                    },
                    documentList: {
                      document: [
                        {
                          nombre: '1_' + ('02' + processBatchID) + '_' + currentProvision.dossierCod + '_' + documentType + '_' + user.documentNumber + '_' + fileNameWithoutExtension + '_' + formatDateZeus(actualDate),
                          processBatchID: ('02' + processBatchID),
                          isBigFile: isBigFile ? '1' : '0',
                          uploadDate: formatDateAndHourZeus(actualDate),
                          extension: innerDocument.name && ('.' + innerDocument.name.split('.').pop()),
                          tipoMime: innerDocument.type,
                          carpeta: '/Documentos/ZEUDOCUWBS02',
                          tipo: 'ZEUDOCUWBS02',
                          contenido: base64,
                          documentCode: documentCode,
                          documentDesc: documentTypeName && documentTypeName,
                          comment: innerComment,
                          observations: innerComment1,
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
                    if (response && response.documentList && response.documentList && response.documentList.document) {
                      setDocumentUpload(true)
                      setIsLoadingDocumentation(true)
                      setUploadedDocumentName(data.documentList.document[0].nombre + '.txt')

                      dispatch(setCurrentProvision({
                        ...currentProvision,
                        documentList: response.documentList
                      }))

                      setNewDocumentsRecieved && setNewDocumentsRecieved({
                        sentDocument: response.documentList && response.documentList.sentDocument ? response.documentList.document.map((item) => item) : [],
                        nSentDocument: response.documentList && response.documentList.document ? response.documentList.document.map((item) => item) : []
                      })

                      if (setUploaded && setSentDocument) {
                        const filteredSentDocumentList = currentProvision && currentProvision.documentList && currentProvision.documentList.document && currentProvision.documentList.document.filter((item) => item.documentType === 'DOCTYP0203' && item.comment === 'Justificante de la transferencia')

                        setSentDocument(filteredSentDocumentList ? filteredSentDocumentList : [])
                      }

                      if (isBigFile) {
                        setBigFilePopup(true)
                      }
                      setUploaded(true)
                    }
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

                      if (isBigFile) {
                        setBigFilePopup(true)
                      }
                    }
                    setPopup(false)
                    setIsLoading(false)
                    setIsLoadingDocumentation(true)
                    setRefresh(true)
                  }))
                })
              }
              else {
                setIsLoading(false)
                setIsLoadingDocumentation(true)
                setRefresh(true)
              }
            }))
          }
          else {
            setIsLoading(false)
            setIsLoadingDocumentation(true)
            setRefresh(true)
          }
        }))
      }
    }
  }

  function ordenarStrings(strings) {
    // Verificamos que la entrada sea un array
    if (!Array.isArray(strings)) {
      throw new TypeError('Se espera un array de strings');
    }

    // Ordenamos el array alfabéticamente
    const stringsOrdenados = [...strings].sort((a, b) => a.localeCompare(b));

    // Devolvemos un objeto con los strings ordenados
    return stringsOrdenados;
  }

  // Función que ordena un array de objetos por la propiedad 'documentName'
  function ordenarDocumentos(array) {
    return array.sort((a, b) => {
      // Comparamos las propiedades 'documentName' de cada objeto
      return a.value.documentName.localeCompare(b.value.documentName);
    });
  }

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
    //esta llamada se encarga de comprobar si tenemos que quitar el adjuntar OTROS documentos
    dispatch(thunkGetMasterData('HIDE_OTHER_DOC_FLAG', 'ES', 'HIDE_OTHER_DOC_FLAG', (response) => {
      if (response !== undefined) {
        if (response[0].value === '1') {
          setHideOtherDoc(true)
          setSelectValues(ordenarStrings([
            t('provisions.documentation.addOtherDocDialog.docTypes.doc1'),
            t('provisions.documentation.addOtherDocDialog.docTypes.doc2'),
            t('provisions.documentation.addOtherDocDialog.docTypes.doc3'),
            t('provisions.documentation.addOtherDocDialog.docTypes.doc4'),
            t('provisions.documentation.addOtherDocDialog.docTypes.doc5'),
            t('provisions.documentation.addOtherDocDialog.docTypes.doc6'),
            t('provisions.documentation.addOtherDocDialog.docTypes.doc7'),
            t('provisions.documentation.addOtherDocDialog.docTypes.doc8'),
            t('provisions.documentation.addOtherDocDialog.docTypes.doc9'),
            t('provisions.documentation.addOtherDocDialog.docTypes.doc10'),
            t('provisions.documentation.addOtherDocDialog.docTypes.doc11'),
            t('provisions.documentation.addOtherDocDialog.docTypes.doc12'),
            t('provisions.documentation.addOtherDocDialog.docTypes.doc13'),
            t('provisions.documentation.addOtherDocDialog.docTypes.doc14'),
            t('provisions.documentation.addOtherDocDialog.docTypes.doc15'),
            t('provisions.documentation.addOtherDocDialog.docTypes.doc16'),
            t('provisions.documentation.addOtherDocDialog.docTypes.doc17'),
            t('provisions.documentation.addOtherDocDialog.docTypes.doc18'),
            t('provisions.documentation.addOtherDocDialog.docTypes.doc19'),
            t('provisions.documentation.addOtherDocDialog.docTypes.doc20'),
            t('provisions.documentation.addOtherDocDialog.docTypes.doc21'),
            t('provisions.documentation.addOtherDocDialog.docTypes.doc22'),
            t('provisions.documentation.addOtherDocDialog.docTypes.doc23'),
            t('provisions.documentation.addOtherDocDialog.docTypes.doc24')
          ]))
          setDocumentList(ordenarDocumentos([
            {
              value: {
                documentCode: '01',
                documentName: t('provisions.documentation.addOtherDocDialog.docTypes.doc1')
              },
              label: t('provisions.documentation.addOtherDocDialog.docTypes.doc1')
            },
            {
              value: {
                documentCode: '02',
                documentName: t('provisions.documentation.addOtherDocDialog.docTypes.doc2')
              },
              label: t('provisions.documentation.addOtherDocDialog.docTypes.doc2')
            },
            {
              value: {
                documentCode: '03',
                documentName: t('provisions.documentation.addOtherDocDialog.docTypes.doc3')
              },
              label: t('provisions.documentation.addOtherDocDialog.docTypes.doc3')
            },
            {
              value: {
                documentCode: '04',
                documentName: t('provisions.documentation.addOtherDocDialog.docTypes.doc4')
              },
              label: t('provisions.documentation.addOtherDocDialog.docTypes.doc4')
            },
            {
              value: {
                documentCode: '05',
                documentName: t('provisions.documentation.addOtherDocDialog.docTypes.doc5')
              },
              label: t('provisions.documentation.addOtherDocDialog.docTypes.doc5')
            },
            {
              value: {
                documentCode: '06',
                documentName: t('provisions.documentation.addOtherDocDialog.docTypes.doc6')
              },
              label: t('provisions.documentation.addOtherDocDialog.docTypes.doc6')
            },
            {
              value: {
                documentCode: '07',
                documentName: t('provisions.documentation.addOtherDocDialog.docTypes.doc7')
              },
              label: t('provisions.documentation.addOtherDocDialog.docTypes.doc7')
            },
            {
              value: {
                documentCode: '08',
                documentName: t('provisions.documentation.addOtherDocDialog.docTypes.doc8')
              },
              label: t('provisions.documentation.addOtherDocDialog.docTypes.doc8')
            },
            {
              value: {
                documentCode: '09',
                documentName: t('provisions.documentation.addOtherDocDialog.docTypes.doc9')
              },
              label: t('provisions.documentation.addOtherDocDialog.docTypes.doc9')
            },
            {
              value: {
                documentCode: '10',
                documentName: t('provisions.documentation.addOtherDocDialog.docTypes.doc10')
              },
              label: t('provisions.documentation.addOtherDocDialog.docTypes.doc10')
            },
            {
              value: {
                documentCode: '11',
                documentName: t('provisions.documentation.addOtherDocDialog.docTypes.doc11')
              },
              label: t('provisions.documentation.addOtherDocDialog.docTypes.doc11')
            },
            {
              value: {
                documentCode: '12',
                documentName: t('provisions.documentation.addOtherDocDialog.docTypes.doc12')
              },
              label: t('provisions.documentation.addOtherDocDialog.docTypes.doc12')
            },
            {
              value: {
                documentCode: '13',
                documentName: t('provisions.documentation.addOtherDocDialog.docTypes.doc13')
              },
              label: t('provisions.documentation.addOtherDocDialog.docTypes.doc13')
            },
            {
              value: {
                documentCode: '14',
                documentName: t('provisions.documentation.addOtherDocDialog.docTypes.doc14')
              },
              label: t('provisions.documentation.addOtherDocDialog.docTypes.doc14')
            },
            {
              value: {
                documentCode: '15',
                documentName: t('provisions.documentation.addOtherDocDialog.docTypes.doc15')
              },
              label: t('provisions.documentation.addOtherDocDialog.docTypes.doc15')
            },
            {
              value: {
                documentCode: '16',
                documentName: t('provisions.documentation.addOtherDocDialog.docTypes.doc16')
              },
              label: t('provisions.documentation.addOtherDocDialog.docTypes.doc16')
            },
            {
              value: {
                documentCode: '17',
                documentName: t('provisions.documentation.addOtherDocDialog.docTypes.doc17')
              },
              label: t('provisions.documentation.addOtherDocDialog.docTypes.doc17')
            },
            {
              value: {
                documentCode: '18',
                documentName: t('provisions.documentation.addOtherDocDialog.docTypes.doc18')
              },
              label: t('provisions.documentation.addOtherDocDialog.docTypes.doc18')
            },
            {
              value: {
                documentCode: '19',
                documentName: t('provisions.documentation.addOtherDocDialog.docTypes.doc19')
              },
              label: t('provisions.documentation.addOtherDocDialog.docTypes.doc19')
            },
            {
              value: {
                documentCode: '20',
                documentName: t('provisions.documentation.addOtherDocDialog.docTypes.doc20')
              },
              label: t('provisions.documentation.addOtherDocDialog.docTypes.doc20')
            },
            {
              value: {
                documentCode: '21',
                documentName: t('provisions.documentation.addOtherDocDialog.docTypes.doc21')
              },
              label: t('provisions.documentation.addOtherDocDialog.docTypes.doc21')
            },
            {
              value: {
                documentCode: '22',
                documentName: t('provisions.documentation.addOtherDocDialog.docTypes.doc22')
              },
              label: t('provisions.documentation.addOtherDocDialog.docTypes.doc22')
            },
            {
              value: {
                documentCode: '23',
                documentName: t('provisions.documentation.addOtherDocDialog.docTypes.doc23')
              },
              label: t('provisions.documentation.addOtherDocDialog.docTypes.doc23')
            },
            {
              value: {
                documentCode: '24',
                documentName: t('provisions.documentation.addOtherDocDialog.docTypes.doc24')
              },
              label: t('provisions.documentation.addOtherDocDialog.docTypes.doc24')
            },

          ]))
        } else if ((response[0].value === '0')) {
          setHideOtherDoc(false)
          setSelectValues(ordenarStrings([
            t('provisions.documentation.addOtherDocDialog.docTypes.doc1'),
            t('provisions.documentation.addOtherDocDialog.docTypes.doc2'),
            t('provisions.documentation.addOtherDocDialog.docTypes.doc3'),
            t('provisions.documentation.addOtherDocDialog.docTypes.doc4'),
            t('provisions.documentation.addOtherDocDialog.docTypes.doc5'),
            t('provisions.documentation.addOtherDocDialog.docTypes.doc6'),
            t('provisions.documentation.addOtherDocDialog.docTypes.doc7'),
            t('provisions.documentation.addOtherDocDialog.docTypes.doc8'),
            t('provisions.documentation.addOtherDocDialog.docTypes.doc9'),
            t('provisions.documentation.addOtherDocDialog.docTypes.doc10'),
            t('provisions.documentation.addOtherDocDialog.docTypes.doc11'),
            t('provisions.documentation.addOtherDocDialog.docTypes.doc12'),
            t('provisions.documentation.addOtherDocDialog.docTypes.doc13'),
            t('provisions.documentation.addOtherDocDialog.docTypes.doc14'),
            t('provisions.documentation.addOtherDocDialog.docTypes.doc15'),
            t('provisions.documentation.addOtherDocDialog.docTypes.doc16'),
            t('provisions.documentation.addOtherDocDialog.docTypes.doc17'),
            t('provisions.documentation.addOtherDocDialog.docTypes.doc18'),
            t('provisions.documentation.addOtherDocDialog.docTypes.doc19'),
            t('provisions.documentation.addOtherDocDialog.docTypes.doc20'),
            t('provisions.documentation.addOtherDocDialog.docTypes.doc21'),
            t('provisions.documentation.addOtherDocDialog.docTypes.doc22'),
            t('provisions.documentation.addOtherDocDialog.docTypes.doc23'),
            t('provisions.documentation.addOtherDocDialog.docTypes.doc24'),
            t('provisions.documentation.addOtherDocDialog.docTypes.doc25')
          ]))
          setDocumentList(ordenarDocumentos([
            {
              value: {
                documentCode: '01',
                documentName: t('provisions.documentation.addOtherDocDialog.docTypes.doc1')
              },
              label: t('provisions.documentation.addOtherDocDialog.docTypes.doc1')
            },
            {
              value: {
                documentCode: '02',
                documentName: t('provisions.documentation.addOtherDocDialog.docTypes.doc2')
              },
              label: t('provisions.documentation.addOtherDocDialog.docTypes.doc2')
            },
            {
              value: {
                documentCode: '03',
                documentName: t('provisions.documentation.addOtherDocDialog.docTypes.doc3')
              },
              label: t('provisions.documentation.addOtherDocDialog.docTypes.doc3')
            },
            {
              value: {
                documentCode: '04',
                documentName: t('provisions.documentation.addOtherDocDialog.docTypes.doc4')
              },
              label: t('provisions.documentation.addOtherDocDialog.docTypes.doc4')
            },
            {
              value: {
                documentCode: '05',
                documentName: t('provisions.documentation.addOtherDocDialog.docTypes.doc5')
              },
              label: t('provisions.documentation.addOtherDocDialog.docTypes.doc5')
            },
            {
              value: {
                documentCode: '06',
                documentName: t('provisions.documentation.addOtherDocDialog.docTypes.doc6')
              },
              label: t('provisions.documentation.addOtherDocDialog.docTypes.doc6')
            },
            {
              value: {
                documentCode: '07',
                documentName: t('provisions.documentation.addOtherDocDialog.docTypes.doc7')
              },
              label: t('provisions.documentation.addOtherDocDialog.docTypes.doc7')
            },
            {
              value: {
                documentCode: '08',
                documentName: t('provisions.documentation.addOtherDocDialog.docTypes.doc8')
              },
              label: t('provisions.documentation.addOtherDocDialog.docTypes.doc8')
            },
            {
              value: {
                documentCode: '09',
                documentName: t('provisions.documentation.addOtherDocDialog.docTypes.doc9')
              },
              label: t('provisions.documentation.addOtherDocDialog.docTypes.doc9')
            },
            {
              value: {
                documentCode: '10',
                documentName: t('provisions.documentation.addOtherDocDialog.docTypes.doc10')
              },
              label: t('provisions.documentation.addOtherDocDialog.docTypes.doc10')
            },
            {
              value: {
                documentCode: '11',
                documentName: t('provisions.documentation.addOtherDocDialog.docTypes.doc11')
              },
              label: t('provisions.documentation.addOtherDocDialog.docTypes.doc11')
            },
            {
              value: {
                documentCode: '12',
                documentName: t('provisions.documentation.addOtherDocDialog.docTypes.doc12')
              },
              label: t('provisions.documentation.addOtherDocDialog.docTypes.doc12')
            },
            {
              value: {
                documentCode: '13',
                documentName: t('provisions.documentation.addOtherDocDialog.docTypes.doc13')
              },
              label: t('provisions.documentation.addOtherDocDialog.docTypes.doc13')
            },
            {
              value: {
                documentCode: '14',
                documentName: t('provisions.documentation.addOtherDocDialog.docTypes.doc14')
              },
              label: t('provisions.documentation.addOtherDocDialog.docTypes.doc14')
            },
            {
              value: {
                documentCode: '15',
                documentName: t('provisions.documentation.addOtherDocDialog.docTypes.doc15')
              },
              label: t('provisions.documentation.addOtherDocDialog.docTypes.doc15')
            },
            {
              value: {
                documentCode: '16',
                documentName: t('provisions.documentation.addOtherDocDialog.docTypes.doc16')
              },
              label: t('provisions.documentation.addOtherDocDialog.docTypes.doc16')
            },
            {
              value: {
                documentCode: '17',
                documentName: t('provisions.documentation.addOtherDocDialog.docTypes.doc17')
              },
              label: t('provisions.documentation.addOtherDocDialog.docTypes.doc17')
            },
            {
              value: {
                documentCode: '18',
                documentName: t('provisions.documentation.addOtherDocDialog.docTypes.doc18')
              },
              label: t('provisions.documentation.addOtherDocDialog.docTypes.doc18')
            },
            {
              value: {
                documentCode: '19',
                documentName: t('provisions.documentation.addOtherDocDialog.docTypes.doc19')
              },
              label: t('provisions.documentation.addOtherDocDialog.docTypes.doc19')
            },
            {
              value: {
                documentCode: '20',
                documentName: t('provisions.documentation.addOtherDocDialog.docTypes.doc20')
              },
              label: t('provisions.documentation.addOtherDocDialog.docTypes.doc20')
            },
            {
              value: {
                documentCode: '21',
                documentName: t('provisions.documentation.addOtherDocDialog.docTypes.doc21')
              },
              label: t('provisions.documentation.addOtherDocDialog.docTypes.doc21')
            },
            {
              value: {
                documentCode: '22',
                documentName: t('provisions.documentation.addOtherDocDialog.docTypes.doc22')
              },
              label: t('provisions.documentation.addOtherDocDialog.docTypes.doc22')
            },
            {
              value: {
                documentCode: '23',
                documentName: t('provisions.documentation.addOtherDocDialog.docTypes.doc23')
              },
              label: t('provisions.documentation.addOtherDocDialog.docTypes.doc23')
            },
            {
              value: {
                documentCode: '24',
                documentName: t('provisions.documentation.addOtherDocDialog.docTypes.doc24')
              },
              label: t('provisions.documentation.addOtherDocDialog.docTypes.doc24')
            },
            {
              value: {
                documentCode: '25',
                documentName: t('provisions.documentation.addOtherDocDialog.docTypes.doc25')
              },
              label: t('provisions.documentation.addOtherDocDialog.docTypes.doc25')
            },

          ]))
        }
      }
    }));
  }, [])

  useEffect(() => {

    if (nameFromSelect === 'Otros documentos') {
      setInnerComment('')
    } else {
      setInnerComment(nameFromSelect)
    }

    switch (nameFromSelect) {
      case t('provisions.documentation.addOtherDocDialog.docTypes.doc1'):
        setDocumentTypeCode('DOCTYP0101')
        setDocumentTypeDesc('PLANO UBICACION CGP')
        break
      case t('provisions.documentation.addOtherDocDialog.docTypes.doc2'):
        setDocumentTypeCode('DOCTYP0242')
        setDocumentTypeDesc('CIE')
        break
      case t('provisions.documentation.addOtherDocDialog.docTypes.doc3'):
        setDocumentTypeCode('DOCTYP0334')
        setDocumentTypeDesc('JUSTIFICANTE DE PAGO')
        break
      case t('provisions.documentation.addOtherDocDialog.docTypes.doc4'):
        setDocumentTypeCode('DOCTYP0207')
        setDocumentTypeDesc('MEMORIA TECNICA / DESCRIPCION DE INSTALACIONES')
        break
      case t('provisions.documentation.addOtherDocDialog.docTypes.doc5'):
        setDocumentTypeCode('DOCTYP0002')
        setDocumentTypeDesc('PROYECTO ')
        break
      case t('provisions.documentation.addOtherDocDialog.docTypes.doc6'):
        setDocumentTypeCode('DOCTYP0201')
        setDocumentTypeDesc('CROQUIS O REFERENCIA CATASTRAL')
        break
      case t('provisions.documentation.addOtherDocDialog.docTypes.doc7'):
        setDocumentTypeCode('DOCTYP0208')
        setDocumentTypeDesc('AUTORIZACION DEL PROPIETARIO')
        break
      case t('provisions.documentation.addOtherDocDialog.docTypes.doc8'):
        setDocumentTypeCode('DOCTYP0222')
        setDocumentTypeDesc('ESQUEMA UNIFILAR')
        break
      case t('provisions.documentation.addOtherDocDialog.docTypes.doc9'):
        setDocumentTypeCode('DOCTYP0299')
        setDocumentTypeDesc('TÍTULO HABILITANTE')
        break
      case t('provisions.documentation.addOtherDocDialog.docTypes.doc10'):
        setDocumentTypeCode('DOCTYP0336')
        setDocumentTypeDesc('PERMISO DE TERCEROS')
        break
      case t('provisions.documentation.addOtherDocDialog.docTypes.doc11'):
        setDocumentTypeCode('DOCTYP0339')
        setDocumentTypeDesc('INFORMACION EQUIPOS DE MEDIDA')
        break
      case t('provisions.documentation.addOtherDocDialog.docTypes.doc12'):
        setDocumentTypeCode('DOCTYP0341')
        setDocumentTypeDesc('DOCUMENTO DE REVISIÓN DE PROPUESTA PREVIA')
        break
      case t('provisions.documentation.addOtherDocDialog.docTypes.doc13'):
        setDocumentTypeCode('DOCTYP0270')
        setDocumentTypeDesc('FORMULARIO DE ACEPTABILIDAD')
        break
      case t('provisions.documentation.addOtherDocDialog.docTypes.doc14'):
        setDocumentTypeCode('DOCTYP0345')
        setDocumentTypeDesc('RENUNCIA A LA SSCC')
        break
      case t('provisions.documentation.addOtherDocDialog.docTypes.doc15'):
        setDocumentTypeCode('DOCTYP0346')
        setDocumentTypeDesc('INSCRIPCIÓN PREVIA EN EL RAIPEE')
        break
      case t('provisions.documentation.addOtherDocDialog.docTypes.doc16'):
        setDocumentTypeCode('DOCTYP0347')
        setDocumentTypeDesc('INFORMACIÓN Y CERTIFICACIÓN DE INVERSORES')
        break
      case t('provisions.documentation.addOtherDocDialog.docTypes.doc17'):
        setDocumentTypeCode('DOCTYP0348')
        setDocumentTypeDesc('SOLICITUD DE CAMBIO DE UBICACIÓN')
        break
      case t('provisions.documentation.addOtherDocDialog.docTypes.doc18'):
        setDocumentTypeCode('DOCTYP0002')
        setDocumentTypeDesc('PROYECTO INSTALACIONES PARTICULARES')
        break
      case t('provisions.documentation.addOtherDocDialog.docTypes.doc19'):
        setDocumentTypeCode('DOCTYP0102')
        setDocumentTypeDesc('PROYECTO INSTALACIONES EXTENSIÓN')
        break
      case t('provisions.documentation.addOtherDocDialog.docTypes.doc20'):
        setDocumentTypeCode('DOCTYP0318')
        setDocumentTypeDesc('CERTIFICADO FINAL DE MGE')
        break
      case t('provisions.documentation.addOtherDocDialog.docTypes.doc21'):
        setDocumentTypeCode('DOCTYP0315')
        setDocumentTypeDesc('CERTIFICADO DE LECTURA DEL OS')
        break
      case t('provisions.documentation.addOtherDocDialog.docTypes.doc22'):
        setDocumentTypeCode('DOCTYP0314')
        setDocumentTypeDesc('CERTIFICADO DE LECTURA GRD')
        break
      case t('provisions.documentation.addOtherDocDialog.docTypes.doc23'):
        setDocumentTypeCode('DOCTYP0349')
        setDocumentTypeDesc('DOCUMENTACIÓN DE LIMITACIÓN POTENCIA INVERSOR')
        break
      case t('provisions.documentation.addOtherDocDialog.docTypes.doc24'):
        setDocumentTypeCode('DOCTYP0350')
        setDocumentTypeDesc('RESERVA DE CRÉDITO')
        break
      case t('provisions.documentation.addOtherDocDialog.docTypes.doc25'):
        setDocumentTypeCode('DOCTYP0203')
        setDocumentTypeDesc('OTRA')
        break
      default:
        setDocumentTypeCode('')
        setDocumentTypeDesc('')
        break
    }

  }, [nameFromSelect])

  return (
    <Grid container spacing={1}>
      <Grid container direction='column' className={classes.inputContainer}>
        {isLoading &&
          <Spinner />
        }

        <Grid container>
          <Grid item md={10} sm={10} xs={10} className={classes.label}>
            <Grid container alignItems='center' spacing={1}>
              <Grid item>{t('provisions.documentation.addOtherDocDialog.docName')}</Grid>
              <Grid item><img src={DocumentIcon} alt='' /></Grid>
            </Grid>
          </Grid>
          <Grid item md={2} sm={2} xs={2} />
        </Grid>

        {(error !== '') &&
          <Grid container>
            <label className={classes.fileError}>{error}</label>
          </Grid>
        }

        <Grid container>
          <Grid item lg={9} md={8} sm={7} xs={6}>
            <Input
              fullWidth
              disabled
              value={documentName}
            />
          </Grid>
          <Grid item md={2} sm={2} xs={2} className={classes.buttonContainer}>
            <>
              {
                !documentTypeName ?
                  <>
                    <InputBase
                      type='file'
                      onChange={handleUploadDocument}
                      ref={(ref) => (documentAux = ref)}
                      style={{ display: 'none' }}
                    />
                    <Button
                      color={'primary'}
                      variant={'contained'}
                      text={t('provisions.documentation.addOtherDocDialog.search')}
                      onClick={openFileDialog}
                      className={classes.searchButton}
                    />
                  </>
                  :
                  <>
                    <InputBase
                      type='file'
                      onChange={handleUploadDocument2}
                      id={'boton-file-' + rand}
                      ref={(ref) => (documentAux = ref)}
                      style={{ display: 'none' }}
                    />
                    <Button
                      color={'primary'}
                      variant={'contained'}
                      text={t('provisions.documentation.addOtherDocDialog.search')}
                      onClick={openFileDialog}
                      className={classes.searchButton}
                    />
                  </>
              }
            </>
          </Grid>
        </Grid>

        <Grid container>
          <label className={classes.fileFormatAdvise}>{t('provisions.documentation.fileFormat')}</label>
        </Grid>



        <Grid item className={classes.inputContainer}>
          {documentType !== 'DOCTYP0334' &&
            <>
              <Grid container alignItems='center' spacing={1} className={classes.label}>
                <Grid item>{t('provisions.documentation.addOtherDocDialog.selectorTitle')}</Grid>
              </Grid>
              <Grid container xs={11} sm={10} md={12} spacing={3}>
                <AddOtherDocument
                  handleChangeInput={setNameFromSelect}
                  loadingDocumentList={loadingDocumentList}
                  documentList={documentList}
                  onSelect={(document) => {
                    setNameFromSelect2(document)
                    setNameFromSelect(document.documentName)
                  }}
                  isClearable={true}
                  onClear={() => {
                    setNameFromSelect2(null)
                    setNameFromSelect('')
                  }}
                  onClick={() => setLoadingDocumentList(false)}
                  error={false}
                  value={nameFromSelect2 ? { value: nameFromSelect2, label: nameFromSelect2.documentName } : null}
                  disabled={false}
                />
                <Grid item xs={12} sm={4} />
              </Grid>
            </>
          }
          <div className={classes.separator} />

          {(!documentTypeName && nameFromSelect === 'Otros documentos') &&
            <>
              <Grid container alignItems='center' spacing={1} className={classes.label}>
                <Grid item>{t('provisions.documentation.addOtherDocDialog.description')}</Grid>
              </Grid>
              <Input
                fullWidth
                multiline
                rows='1'
                value={innerComment}
                onChange={handleComment}
                inputProps={{
                  maxlength: '60'
                }}
              />
              <Grid container justifyContent='flex-end'>
                <Grid item className={classes.characterCountLabel}>
                  {t('provisions.documentation.addOtherDocDialog.characterCount.first')}
                  <span className={classes.characterCount}>{characters}</span>
                  {t('provisions.documentation.addOtherDocDialog.characterCount.last')}
                </Grid>
              </Grid>
            </>
          }

          <Grid container alignItems='center' spacing={1} className={classes.label}>
            <Grid item>{t('provisions.documentation.addOtherDocDialog.comment')}</Grid>
          </Grid>

          <Input
            fullWidth
            multiline
            rows='3'
            value={innerComment1}
            onChange={handleComment1}
            inputProps={{
              maxlength: '60'
            }}
          />

          <Grid container justifyContent='flex-end'>
            <Grid item className={classes.characterCountLabel}>
              {t('provisions.documentation.addOtherDocDialog.characterCount.first')}
              <span className={classes.characterCount}>{characters1}</span>
              {t('provisions.documentation.addOtherDocDialog.characterCount.last')}
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container justifyContent='center' alignItems='center'>
        <Grid item>
          <Button
            color={'primary'}
            variant={'contained'}
            size='large'
            text={t('provisions.documentation.addOtherDocDialog.send')}
            disabled={(innerComment === '' && !documentTypeName) || documentName === ''}
            onClick={handleSendFile}
          />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Content