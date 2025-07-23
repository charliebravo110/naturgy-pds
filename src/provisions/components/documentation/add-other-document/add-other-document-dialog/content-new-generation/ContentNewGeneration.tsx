import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Grid from '@material-ui/core/Grid'
import InputBase from '@material-ui/core/InputBase'

import DocumentIcon from '../../../../../../assets/icons/plano_documento_adjunto.svg'
import Button from '../../../../../../common/components/button/Button'
import Input from '../../../../../../common/components/input/Input'
import Spinner from '../../../../../../common/components/spinner/Spinner'

import { setCurrentProvision } from '../../../../../store/actions/ProvisionsActions'
import { thunkGetMasterData, thunkSaveDossierData, thunkUpdateDossier, thunkGetDocumentosCargaOffline, thunkCreateDocumentoCargaOffline } from '../../../../../store/actions/ProvisionsThunkActions'
import { formatDateZeus, formatDateAndHourString, formatDateAndHourZeus } from '../../../../../../common/lib/FormatLib'

import useStyles from './ContentNewGeneration.styles'
import { useEffect } from 'react'

const ContentNewGeneration = (props: any) => {
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
    popDnInfo,
    setPopupDnInfo,
    setDocumentUpload,
    setUploadedDocumentName,
  } = props

  const user = useSelector((state: any) => state.user.profile)
  const currentProvision = useSelector((state: any) => state.provisions.currentProvision)

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
      let docCargaOfflineData = {
        id: '',
        expediente: currentProvision.dossierCod,
        cups: '',
        doctype: 'DOCTYP0203',
        fechaRealSubida: actualDateString,
        docName: (innerComment + innerDocument.name.substring(innerDocument.name.indexOf('.'), innerDocument.name.length)),
        docSize: fileSize
      }

      setIsLoading(true)

      // Creamos un nuevo registro en nuestra base de datos UFD_DOCUMENTOS_CARGA_OFFLINE
      dispatch(thunkCreateDocumentoCargaOffline(docCargaOfflineData, (response) => {
        if (response) {
          // Recuperamos el ID que ha generado el registro que acabamos de crear
          dispatch(thunkGetDocumentosCargaOffline('', currentProvision.dossierCod, '', '', actualDateString, '', '', (response) => {
            if (response && response.length > 0) {
              processBatchID = (response[0].id).toString()

              getBase64(innerDocument, (result) => {
                const base64 = result.substring(result.indexOf('base64,') + 7, result.length)
                // Thunk de subida del archivo de este objeto
                const data = {
                  dossierCod: currentProvision.dossierCod,
                  email: currentProvision.email,
                  //indMail: '1',
                  //billingEmail: billingEmail,
                  //indAceptoFacturaDigital: indAceptoFacturaDigital,
                  //indPostalInvoice: (indAceptoFacturaDigital) ? 0 : 1,
                  applicant: {
                    docNumber: user.documentNumber
                  },
                  documentList: {
                    document: [
                      {
                        nombre: '1_' + ('02' + processBatchID) + '_' + currentProvision.dossierCod + '_DOCTYP0203_' + user.documentNumber + '_' + innerComment + '_' + formatDateZeus(actualDate),
                        processBatchID: ('02' + processBatchID),
                        isBigFile: isBigFile ? '1' : '0',
                        uploadDate: formatDateAndHourZeus(actualDate),
                        extension: innerDocument && innerDocument.name.substring(innerDocument.name.indexOf('.'), innerDocument.name.length),
                        tipoMime: innerDocument && innerDocument.type,
                        carpeta: '/Documentos/ZEUDOCUWBS02',
                        tipo: 'ZEUDOCUWBS02',
                        contenido: base64,
                        documentDesc: 'OTRA',
                        comment: innerComment,
                        documentName: '1_' + ('02' + processBatchID) + '_' + currentProvision.dossierCod + '_DOCTYP0203_' + user.documentNumber + '_' + innerComment + '_' + formatDateZeus(actualDate),
                        observations: 'Nombre documento: ' + innerComment + ' / Observaciones: ' + innerComment1,
                        metadatos: [
                          {
                            nombre: 'codigo_tipo',
                            valor: 'DOCTYP0203'
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
                }))
              })
            }
            else {
              setIsLoading(false)
            }
          }))
        }
        else {
          setIsLoading(false)
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

      // Creamos un nuevo registro en nuestra base de datos UFD_DOCUMENTOS_CARGA_OFFLINE
      dispatch(thunkCreateDocumentoCargaOffline(docCargaOfflineData, (response) => {
        if (response) {
          // Recuperamos el ID que ha generado el registro que acabamos de crear
          dispatch(thunkGetDocumentosCargaOffline('', currentProvision.dossierCod, '', '', actualDateString, '', '', (response) => {
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
                  //indMail: '1',
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
                }))
              })
            }
            else {
              setIsLoading(false)
            }
          }))
        }
        else {
          setIsLoading(false)
        }
      }))
    }
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
  }, [])

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
          
          {!documentTypeName &&
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
            disabled={(innerComment1 === '' && !documentTypeName) || documentName === ''}
            onClick={handleSendFile}
          />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default ContentNewGeneration