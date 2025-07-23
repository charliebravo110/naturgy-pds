
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import InputBase from '@material-ui/core/InputBase'
import Grid from '@material-ui/core/Grid'

import TickIcon from '../../../../../../assets/icons/ok_list.svg'
import AddIcon from '../../../../../../assets/icons/mas.svg'
import DeleteIcon from '../../../../../../assets/icons/misdocumentos_eliminar.svg'
import ProcessingIcon from '../../../../../../assets/icons/ico_procesando.svg'
import { thunkCreateDocument, thunkGetDocumentosCargaOffline, thunkCreateDocumentoCargaOffline } from '../../../../../store/actions/RequestsThunkActions'
import {
  resetNewRequestDataDocument,
  setNewRequestDataDocument
}
  from '../../../../../store/actions/RequestsActions'
import { thunkGetMasterData } from '../../../../../../provisions/store/actions/ProvisionsThunkActions'

import { formatDateZeus, formatDateAndHourString, formatDateAndHourZeus } from '../../../../../../common/lib/FormatLib'

import useStyles from './Item.styles'
import Tooltip from '../../../../../../common/components/tooltip/Tooltip'

const Item2 = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const { item, handleChangeActualRed, setLoading, setBigFilePopup } = props

  let auxAttachedDocument: any
  //let filee : any

  const BASE_URL = process.env.REACT_APP_API_ENDPOINT

  const cups = useSelector((state: any) => state.requests.newRequestData.cups)
  const dossierNumber = useSelector((state: any) => state.requests.newRequestData.dossierNumber)
  const cupsOrDossier = cups ? cups : dossierNumber ? dossierNumber : '0' 
  const documentNumber = useSelector((state: any) => state.requests.newRequestData.documentNumber)

  const [nombreFichero, setNombreFichero] = useState('')
  const [fileSelected, setFileSelected] = useState()
  const [comentario, setComentario] = useState('')

  const [maxUploadFileSize, setMaxUploadFileSize] = useState<number>(2000000)

  const requests = useSelector((state: any) => state.requests)
  const user = useSelector((state: any) => state.user)

  const tipology = useSelector((state: any) => state.requests.newRequestData.tipology)
  const subtipology = useSelector((state: any) => state.requests.newRequestData.subtipology)

  const [uploadDocuments, setUploadDocuments] = useState([] as any)

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

  const updateValue = (value) => {
    setComentario(value)
  }

  const handleDeleteDocument = (file) => {
    setNombreFichero('')
    setComentario('')
    dispatch(resetNewRequestDataDocument(requests.newRequestData.documents.filter(doc => doc !== file)))
    let auxFilter = uploadDocuments.filter(document => document !== file)
    setUploadDocuments(auxFilter)

    if (auxFilter.length === 0) {
      item.anexado = false
    }
  }

  const handleClickExamineDocument = () => {
    auxAttachedDocument.firstChild.click()
  }

  const handleuploadDocumentsList = (doc) => {
    setUploadDocuments([...uploadDocuments, doc])
  }

  const handleSuffix = () => {
    let suffix = ''
    if (tipology === '0870I01') {
      suffix = '_O001'
    }

    if (tipology === '1070I01') {
      suffix = '_O002'
    }

    if (tipology === '1074R00' && subtipology === '1074R0000') {
      suffix = '_R001'
    }

    if (tipology === '1074R00' && subtipology === '1074R0001') {
      suffix = '_R002'
    }

    if (tipology === '0801A01') {
      suffix = '_P001'
    }

    if (tipology === '0867A01') {
      suffix = '_A001'
    }
    return suffix
  }

  const handleuploadDocuments = (e) => {
    // if (fileSelected) {
    //   // hay un documento ya subido se elimina el documento
    //   dispatch(resetNewRequestDataDocument(requests.newRequestData.documents.filter(item => item !== fileSelected)))
    //   item.anexado = false
    // }

    const actualDateString = formatDateAndHourString(new Date())
    const actualDate = new Date()
    const fileSize = (e.target.files[0].size).toString()
    const isBigFile = e.target.files[0].size > maxUploadFileSize ? true : false

    setLoading(true)

    const file = e.target.files[0]
    e.target.value = ''

    if (file) {
      setNombreFichero(file.name)
      let suffix = ''
      if (item.suffix === '') {
        suffix = handleSuffix()
      } else {
        suffix = item.suffix
      }

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
                    valor: requests.newRequestData.tipology
                  },
                  {
                    nombre: 'sector',
                    valor: 'ELECTRICIDAD'
                  },
                  {
                    nombre: 'nif_consumidor',
                    valor: user.profile.documentNumber
                  }
                ]
              } as any
      
      
              let auxFile
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
                    setFileSelected(documentData)
                    handleuploadDocumentsList(documentData)
                    dispatch(setNewRequestDataDocument(documentData))
                    handleChangeActualRed(item)
      
                    if (isBigFile) {
                      setBigFilePopup(true)
                    }
                  }
                  setLoading(false)
                }))
              })
            }
            else {
              setLoading(false)
            }
          }))
        }
        else {
          setLoading(false)
        }
      }))
    }
  }

  const getFileName = (fullName) => {
    const arrayName = fullName.split('_')
    return arrayName[5] ? arrayName[5] : ''
  }

  useEffect(() => {
    // si canvia el comentario, canviar el comentario del documento 
    item.comment = comentario
  }, [comentario])

  useEffect(() => {
    dispatch(thunkGetMasterData('DOCUMENT_SIZE', 'ES', '', (response) => {
      if (response) {
        setMaxUploadFileSize(parseInt(response[0].value))
      }
    }))
  }, [])

  return (
    <Grid container>
      {/* <Grid item className={`${classes.newRequest} ${item.redInput === 'true' && classes.red}}`}> */}
      <Grid container className={classes.container} spacing={2}>
        {/* <Grid container className={classes.container} spacing={2}> */}
        <Grid item>
          <img src={TickIcon} alt='' />
        </Grid>
        {/* en caso de ser obligatorio lo pintariamos de rojo (comentados más abajo aplican a lo mismo)
          <Grid item className={`${classes.text} ${item.redInput === 'true' && 'redEnable'}`} md={8} sm={11} xs={9}>
            {item.text}
          </Grid>
        */}
        <Grid item className={classes.text} md={8} sm={11} xs={9}>
          {item.text}
        </Grid>

        <Grid item>
          <InputBase
            type='file'
            ref={ref => auxAttachedDocument = ref}
            onChange={handleuploadDocuments}
            style={{ display: 'none' }}
          />
        </Grid>

        {/*<Grid item className={`${classes.newRequest} ${item.redInput === 'true' && 'redEnable'}`} onClick={handleClickExamineDocument}>*/}
        <Grid item className={classes.newRequest} onClick={handleClickExamineDocument}>
          <img
            src={AddIcon}
            /*className={`${classes.icon} ${item.redInput === 'true' && 'redEnable'}`}*/
            className={classes.icon}
            alt=''
          />
          {/*<span className={`${classes.iconText} ${item.redInput === 'true' && 'redEnable'}`}>*/}
          <span className={classes.iconText}>
            {t('common.buttons.addDocument')}
          </span>
        </Grid>
      </Grid>

      {/* {/* <Grid item className={classes.examineButton} onClick={handleClickExamineDocument}>
          <Grid item className={classes.addIconCont}>
            <img src={AddIcon} className={classes.icon} alt='' />
          </Grid>
          <Grid item>
            <span className={classes.iconText}>
              {t('common.buttons.addDocument')}
            </span>
          </Grid>
        </Grid>
      </Grid> */}

      {(uploadDocuments.length > 0) &&
        <Grid container>
          {uploadDocuments.map((doc, index) => {
            return (
              <Grid item key={index} className={classes.docContainer} spacing={2}>
                <Grid container className={classes.uploadedFile} spacing={2}>
                  <Grid item className={classes.newRequestRound} spacing={2}>
                    <span className={classes.text}>
                      {getFileName(doc.nombreArchivo)}
                    </span>
                    <img
                      src={DeleteIcon}
                      onClick={() => { handleDeleteDocument(doc) }}
                      className={classes.icon}
                    />
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
            )
          })}
        </Grid>
      }
      <Grid item md={12} sm={12} xs={12}>
        <hr className={classes.dashedLine} />
      </Grid>
    </Grid >
  )
}

// {(uploadDocuments.length > 0) &&

//   <Grid container>
//     {uploadDocuments.map((doc, index) => {
//       return (
//         <Grid item key={index} onClick={() => { handleDeleteDocument(doc) }}>
//           {doc.nombreArchivo}
//           <img src={DeleteIcon} alt='' />
//         </Grid>
//       )
//     })}
//   </Grid>
// }


export default Item2
