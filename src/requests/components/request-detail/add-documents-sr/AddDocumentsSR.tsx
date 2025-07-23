import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Grid } from '@material-ui/core'
import InputBase from '@material-ui/core/InputBase'

import TickIcon from '../../../../assets/icons/ok_list.svg'
import Input from '../../../../common/components/input/Input'
import { formatDateZeus, formatDateAndHourString, formatDateAndHourZeus } from '../../../../common/lib/FormatLib'
import { thunkGetMasterData } from '../../../../provisions/store/actions/ProvisionsThunkActions'
import { useSelector, useDispatch } from 'react-redux'
import AddIcon from '../../../../assets/icons/mas.svg'
import DeleteIcon from '../../../../assets/icons/misdocumentos_eliminar.svg'
import Button from '../../../../common/components/button/Button'
import { thunkCreateDocument, thunkGetDocumentosCargaOffline, thunkCreateDocumentoCargaOffline, thunkUpdateRequest } from '../../../store/actions/RequestsThunkActions'
import { resetNewRequestDataDocument, setNewRequestDataDocument } from '../../../store/actions/RequestsActions'
import Tooltip from '../../../../common/components/tooltip/Tooltip'
import ProcessingIcon from '../../../../assets/icons/ico_procesando.svg'

import useStyles from './AddDocumentsSR.styles'

const AddDocumentsSR = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const { 
    // item, 
    setBigFilePopup, 
    requestDetail, 
    setIsLoading,
    setShowPopupSentSuccessfully,
    setShowPopupNotSent,
    setShowPopupInvalidExtension,
    setShowPopupInvalidSize,
    setStringMaxUploadFileSize,
    user,
    setAddDocDone,
    setAuxUploadDocuments
  } = props

  let auxAttachedDocument: any

  const [openSR, setOpenSR] = useState(false)
  const [showAddDoc, setShowAddDoc] = useState(false)
  const [comentario, setComentario] = useState('')
  // const [nombreFichero, setNombreFichero] = useState('')
  // const [fileSelected, setFileSelected] = useState()
  const [maxUploadFileSize, setMaxUploadFileSize] = useState<number>(10000000) // 10MB
  const [uploadDocuments, setUploadDocuments] = useState([] as any)
  const [allowCancelButton, setAllowCancelButton] = useState(false)
  const [allowSendButton, setAllowSendButton] = useState(false)

  const BASE_URL = process.env.REACT_APP_API_ENDPOINT

  const cups = requestDetail.cups
  const dossierNumber = requestDetail.codExpedient
  const cupsOrDossier = cups ? cups : dossierNumber ? dossierNumber : '0'
  const documentNumber = useSelector((state: any) => state.user.profile.documentNumber)

  // Listado de extensiones permitidas
  const extensions = [
    'PDF',
    'JPG',
    'ZIP',
    'XLS',
    'XLSX',
    'XLSM',
    'DXF',
    'DWG',
    'DOC',
    'DOCX',
    'MP4',
    'MPEG',
    'RAR',
    'PPT',
    'PPTX',
    'MSG'
  ]

  const handleuploadDocumentsList = (doc) => {
    setUploadDocuments([...uploadDocuments, doc])
  }

  const getFileBase64 = (file, callback) => {
    let reader = new FileReader()

    reader.readAsDataURL(file)

    reader.onload = () => {
      callback(reader.result)
    }

    reader.onerror = (error) => {
      console.error('Error: ', error)
    }
  }

  const checkExtensions = (file) => {
    let result = false
    if (file.name && file.name !== '') {

      const lastPoint = file.name.lastIndexOf('.')
      const extensionFile = file.name.slice(lastPoint + 1);
      extensions.map((extension => {
        if (extensionFile.toUpperCase().includes(extension)) {
          result = true
        }
      }))
    }
    
    return result
  }

  const handleUploadDocument = (e) => {
    // if (fileSelected) {
    //   // hay un documento ya subido se elimina el documento
    //   dispatch(resetNewRequestDataDocument(requests.newRequestData.documents.filter(item => item !== fileSelected)))
    //   item.anexado = false
    // }

    const actualDateString = formatDateAndHourString(new Date())
    const actualDate = new Date()
    const fileSize = (e.target.files[0].size).toString()
    const isBigFile = e.target.files[0].size > maxUploadFileSize ? true : false

    const file = e.target.files[0]
    e.target.value = ''

    // Permitimos seguir con el proceso si el fichero no excede el tamaño permitido y tiene una extensión válida 
    if (file && checkExtensions(file) && !isBigFile) {
      setIsLoading(true)

      // setNombreFichero(file.name)
      let suffix = ''
      // if (item.suffix === '') {
      //   suffix = handleSuffix()
      // } else {
      //   suffix = item.suffix
      // }
      suffix = handleSuffix()

      let fileName = file.name.split('.')[0] + suffix + '.' + file.name.split('.')[1]
      let fileNameWithoutExtension = file.name.split('.')[0]

      const doctype = '545'  //OTRO
      let processBatchID = ''

      let docCargaOfflineData = {
        id: '',
        expediente: dossierNumber ? dossierNumber : '',
        cups: cups ? cups : '',
        doctype: doctype,
        fechaRealSubida: actualDateString,
        docName: fileName,
        docSize: fileSize
      }

      // Creamos un nuevo registro en nuestra base de datos UFD_DOCUMENTOS_CARGA_OFFLINE
      dispatch(thunkCreateDocumentoCargaOffline(docCargaOfflineData, (response) => {
        if (response) {
          // Recuperamos el ID que ha generado el registro que acabamos de crear
          dispatch(thunkGetDocumentosCargaOffline('', dossierNumber ? dossierNumber : '', cups ? cups : '', '', actualDateString, '', '', (response) => {
            if (response && response.length > 0) {
              processBatchID = (response[0].id).toString()

              let documentumData = {
                nombre: '2_' + ('02' + processBatchID) + '_' + cupsOrDossier + '_' + doctype + '_' + documentNumber + '_' + fileNameWithoutExtension + '_' + formatDateZeus(actualDate),
                extension: file.name && ('.' + file.name.split('.').pop()),
                tipoMime: file.type,
                carpeta: '/Documentos/ZEUDATCWBS01',
                tipo: 'ZEUDATCPRO01',
                isBigFile: isBigFile ? '1' : '0',
                metadatos: [
                  {
                    nombre: 'tipo_sr',
                    valor: requestDetail.tipology
                  },
                  {
                    nombre: 'sector',
                    valor: 'ELECTRICIDAD'
                  },
                  {
                    nombre: 'nif_consumidor',
                    valor: documentNumber
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
                  nombreArchivo: '2_' + ('02' + processBatchID) + '_' + cupsOrDossier + '_' + doctype + '_' + documentNumber + '_' + fileNameWithoutExtension + '_' + formatDateZeus(actualDate),
                  processBatchID: isBigFile ? ('02' + processBatchID) : '',
                  isBigFile: isBigFile ? '1' : '0',
                  uploadDate: formatDateAndHourZeus(actualDate),
                  format: file.name && (file.name.split('.').pop()),
                  comentario: comentario,
        
                  documentType: file.type,
                  documentState: 'DOCSTA0002',
                } as any
        
                // subir el fichero a Documentum
                dispatch(thunkCreateDocument(documentumData, (response) => {
                  if (response) {
                    if (response.idDocumento && response.idDocumento !== '') {
                      documentData = {
                        ...documentData,
                        url: BASE_URL + '/documentum/' + response.idDocumento,
                        idDocumentum: response.idDocumento,
                      }
                    }
                    // setFileSelected(documentData)
                    // dispatch(setNewRequestDataDocument(documentData))
                    handleuploadDocumentsList(documentData)
                    setComentario('')
                    // item.anexado = true
        
                    if (isBigFile) {
                      setBigFilePopup(true)
                    }
                  }
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
    else if (file && !checkExtensions(file)) {
      setShowPopupInvalidExtension(true)
    }
    else if (isBigFile) {
      setShowPopupInvalidSize(true)
    }
  }

  const handleSuffix = () => {
    let suffix = ''
    if (requestDetail.tipology === '0870I01') {
      suffix = '_O001'
    }

    if (requestDetail.tipology === '1070I01') {
      suffix = '_O002'
    }

    // if (requestDetail.tipology === '1074R00' && subtipology === '1074R0000') {
    //   suffix = '_R001'
    // }

    // if (requestDetail.tipology === '1074R00' && subtipology === '1074R0001') {
    //   suffix = '_R002'
    // }

    if (requestDetail.tipology === '0801A01') {
      suffix = '_P001'
    }

    if (requestDetail.tipology === '0867A01') {
      suffix = '_A001'
    }

    return suffix
  }

  const handleClickExamineDocument = () => {
    auxAttachedDocument.firstChild.click()
  }

  const getFileName = (fullName) => {
    const arrayName = fullName.split('_')
    return arrayName[5] ? arrayName[5] : ''
  }

  const handleDeleteDocument = (file) => {
    // setNombreFichero('')
    setComentario('')
    // dispatch(resetNewRequestDataDocument(requests.newRequestData.documents.filter(doc => doc !== fileSelected)))
    let auxFilter = uploadDocuments.filter(document => document !== file)
    setUploadDocuments(auxFilter)

    // if (auxFilter.length === 0) {
    //   item.anexado = false
    // }
  }

  const handleCancel = () => {
    setUploadDocuments([])
  }

  const handleUploadDocuments = () => {
    if (uploadDocuments && uploadDocuments.length > 0) {
      setIsLoading(true)
      const auxSurname1 = user.surName.includes(' ') ? user.surName.split(' ')[0] : user.surName
      const auxSurname2 = user.surName.includes(' ') ? user.surName.split(' ')[1] : ''
      const data = {
        customer: {
          documentType: user.documentType,
          docNumber: user.documentNumber,
          name: user.name,
          surname: auxSurname1,
          surname2: auxSurname2,
          mail: user.email,
          phonemob: user.phone,
          phone: user.phone
        },
        codSR: requestDetail.codSR,
        docNumber: user.documentNumber,
        // descriptionEvent: 'APORTAR INFORMACION',
        documents: uploadDocuments
      }
      setAuxUploadDocuments(uploadDocuments)

      dispatch(thunkUpdateRequest(data, (response) => {
        // if (response && response.resultado) {
        if (response && response.result && response.result.codResult && response.result.codResult === '0000') {
          setShowPopupSentSuccessfully(true)
          setAddDocDone(true)
          setUploadDocuments([])
        }
        else {
          setShowPopupNotSent(true)
        }
        setIsLoading(false)
      }))
    }
  }

  useEffect(() => {
    if (requestDetail.status && requestDetail.status !== 'CERRADA') {
      setOpenSR(true)
    } 
    else {
      setOpenSR(false)
    }
  }, [requestDetail.status])

  useEffect(() => {
    dispatch(thunkGetMasterData('DOCUMENT_SIZE_SR', 'ES', '', (response) => {
      if (response) {
        setMaxUploadFileSize(parseInt(response[0].value))
        setStringMaxUploadFileSize((parseInt(response[0].value)/1000000).toString())
      }
    }))
  }, [])

  useEffect(() => {
    if (uploadDocuments.length > 0) {
      setAllowCancelButton(true)
      setAllowSendButton(true)
    }
    else {
      setAllowCancelButton(false)
      setAllowSendButton(false)
    }
  }, [uploadDocuments])

  return (
    <Grid container className={classes.generalCont}>
      <Grid item>
        {t('requests.newRequestDetail.addDocumentsSR.infoText')}
        {' '}
        <span className={classes.link} onClick={() => {setShowAddDoc(!showAddDoc)}}>
          {t('requests.newRequestDetail.addDocumentsSR.link')}
        </span>
      </Grid>

      {showAddDoc &&
        <>
          <Grid container xs={12} sm={10} md={10} className={classes.addDocsCont}>
            <Grid item className={classes.formatTxt}>
              {t('requests.newRequestDetail.addDocumentsSR.addDoc.formats')}
            </Grid>

            <div className={`${classes.separator} v1`} />

            <Grid container className={classes.uploadDocsCont}>
              <Grid container xs={12} md={3}>
                <Grid item>
                  <img src={TickIcon} alt='' />
                </Grid>

                <Grid item className={classes.text}>
                  {t('requests.newRequestDetail.addDocumentsSR.addDoc.otherDocs')}
                </Grid>
              </Grid>

              {/* <Grid item md={5} className={`${item.redInput === 'true' && classes.red}`}> */}
              <Grid item xs={12} md={5} className={classes.uploadDocsInput}>
                <Input
                  fullWidth
                  placeholder={t('requests.newRequestDetail.addDocumentsSR.addDoc.fileDesc')}
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                />
              </Grid>

              <Grid item>
                <InputBase
                  type='file'
                  ref={ref => auxAttachedDocument = ref}
                  onChange={handleUploadDocument}
                  style={{ display: 'none' }}
                />
              </Grid>

              {/* <Grid item className={`${classes.newRequest} ${item.redInput === 'true' && 'redEnable'}`} onClick={handleClickExamineDocument}> */}
              <Grid item className={`${classes.newRequest}`} onClick={handleClickExamineDocument}>
                <img
                  src={AddIcon}
                  // className={`${classes.icon} ${item.redInput === 'true' && 'redEnable'}`}
                  className={`${classes.icon}`}
                  alt=''
                />
                {/* <span className={`${classes.iconText} ${item.redInput === 'true' && 'redEnable'}`}> */}
                <span className={`${classes.iconText}`}>
                  {t('common.buttons.addDocument')}
                </span>
              </Grid>
            </Grid>

            <div className={`${classes.separator} v2`} />

            {(uploadDocuments.length > 0) &&
              <Grid container>
                {uploadDocuments.map((doc, index) => {
                  return (
                    <>
                      <Grid item key={index} className={classes.docContainer} md={12} sm={12} xs={12} spacing={2}>
                        <Grid item className={classes.text} md={12} sm={12} xs={12} >{doc.comentario}</Grid>
                        <Grid container className={classes.uploadedFile} spacing={2}>
                          <Grid item className={classes.newRequestRound} spacing={2}>
                            <span className={classes.text}>
                              {getFileName(doc.nombreArchivo)}
                            </span>
                            <img src={DeleteIcon} className={classes.icon} onClick={() => { handleDeleteDocument(doc) }} />
                          </Grid>
                          {(doc.isBigFile && doc.isBigFile === '1') &&
                            <Grid item className={classes.iconContainer}>
                              <Tooltip title={t('requests.newRequest.processingDocument') + maxUploadFileSize / 1000000 + t('common.units.mb') + '.'} placement='right'>
                                <img src={ProcessingIcon} className={classes.processingIcon} />
                              </Tooltip>
                            </Grid>
                          }
                        </Grid>
                      </Grid>
                      <div className={`${classes.separator} v2`} />
                    </>
                  )
                })}
              </Grid>
            }

            <Grid container justifyContent='center' spacing={2}>
              <Grid item>
                <Button
                  text={t('requests.newRequestDetail.addDocumentsSR.addDoc.buttons.cancel')}
                  color={'primary'}
                  size={'large'}
                  variant={'contained'}
                  onClick={handleCancel}
                  disabled={!(uploadDocuments.length > 0)}
                />
              </Grid>

              <Grid item>
                <Button
                  text={t('requests.newRequestDetail.addDocumentsSR.addDoc.buttons.send')}
                  color={'primary'}
                  size={'large'}
                  variant={'contained'}
                  onClick={handleUploadDocuments}
                  disabled={!(uploadDocuments.length > 0)}
                />
              </Grid>
            </Grid>
          </Grid>

          <div className={`${classes.separator} v3`} />
        </>
      }      
    </Grid>
  )
}

export default AddDocumentsSR