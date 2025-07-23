import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { DialogContent, InputBase } from '@material-ui/core'
import { DialogActions } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'

import Spinner from '../../../../../common/components/spinner/Spinner'
import TextButton from '../../../../../common/components/text-button/TextButton'
import Button from '../../../../../common/components/button/Button'
import CloseIcon from '../../../../../assets/icons/cerrar.svg'
import DocumentIcon from '../../../../../assets/icons/plano_documento_adjunto.svg'

import Select from '../../../../../common/components/select/Select'
import Input from '../../../../../common/components/input/Input'

import useStyles from './Content.styles'
import { formatDateAndHourString, formatDateAndHourZeus, formatDateZeus } from '../../../../../common/lib/FormatLib'
import { useDispatch, useSelector } from 'react-redux'
import { thunkCreateDocumentoCargaOffline, thunkGetDocumentosCargaOffline, thunkUpdateDossier } from '../../../../store/actions/ProvisionsThunkActions'
import { setCurrentProvision } from '../../../../store/actions/ProvisionsActions'

const Content = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const [reasonsList, setReasonsList] = useState(['REVISIÓN TÉCNICA', 'REVISIÓN ECONÓMICA', 'REVISIÓN TÉCNICO-ECONÓMICA'])
  const [reason, setReason] = useState('')
  const [explain, setExplain] = useState('')
  const [characters, setCharacters] = useState(260)

  const [error, setError] = useState<string>('')
  const [documentName, setDocumentName] = useState('')
  const [isBigFile, setIsBigFile] = useState(false)
  const [fileSize, setFileSize] = useState('')
  const [maxUploadFileSize, setMaxUploadFileSize] = useState<number>(2000000)
  const [innerDocument, setInnerDocument] = useState<any>()
  const [innerComment, setInnerComment] = useState('')
  const [innerComment1, setInnerComment1] = useState('')
  const [documentTypeName, setDocumentTypeName] = useState<String>('Doc. Revisión PP')

  const [isLoading, setIsLoading] = useState(false)

  const {
    setShowing,
    handleCloseDialog,
    setRevisedBudget,
    propPrev,
    indAceptoFacturaDigital,
    setNewDocumentsRecieved,
    setUploaded,
    setSentDocument,
    setBigFilePopup,
  } = props

  const user = useSelector((state: any) => state.user.profile)
  const currentProvision = useSelector((state: any) => state.provisions.currentProvision)

  const [loading, setLoading] = useState(false)

  let documentAux: any

  const openFileDialog = () => {
    documentAux.firstChild.click()
  }

  const handleSelect = (e) => {
    setReason(e.target.value)
  }

  const handleInput = (e) => {
    setExplain(e.target.value)
    setCharacters(260 - e.target.value.length)
  }

  const handleAcceptDialog = () => {
    if (innerDocument && innerDocument.name) {
      handleSendFile()
    } else {
      let subtipology = ''

      if (reason === 'REVISIÓN TÉCNICA') {
        subtipology = 'TYMOTREV01'
      } else if (reason === 'REVISIÓN ECONÓMICA') {
        subtipology = 'TYMOTREV02'
      } else if (reason === 'REVISIÓN TÉCNICO-ECONÓMICA') {
        subtipology = 'TYMOTREV03'
      }


      setRevisedBudget({
        click: true,
        subtipology: subtipology,
        comment: explain
      })

      handleCloseDialog()
    }


    setLoading(true)
  }

  /* ADN - 05/09/2023 - Añadir doc propuesta previa */


  const handleUploadDocument = (e) => {
    setIsBigFile(e.target.files[0].size > maxUploadFileSize ? true : false)
    setFileSize((e.target.files[0].size).toString())

    setInnerDocument(e.target.files[0])
    setDocumentName(e.target.files[0].name)
  }

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

  const handleSendFile = () => {
    const actualDateString = formatDateAndHourString(new Date())
    const actualDate = new Date()
    let processBatchID = ''
    let fileNameWithoutExtension = innerDocument && innerDocument.name.split('.')[0]

    if (indAceptoFacturaDigital) {
      let docCargaOfflineData = {
        id: '',
        expediente: currentProvision.dossierCod,
        cups: '',
        doctype: user.documentType,
        fechaRealSubida: actualDateString,
        docName: innerDocument && innerDocument.name,
        docSize: fileSize
      }

      setIsLoading(true)

      dispatch(thunkCreateDocumentoCargaOffline(docCargaOfflineData, (response) => {
        if (response) {
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
                  applicant: {
                    docNumber: user.documentNumber
                  },
                  documentList: {
                    document: [
                      {
                        nombre: '1_' + ('02' + processBatchID) + '_' + currentProvision.dossierCod + '_' + user.documentType + '_' + user.documentNumber + '_' + fileNameWithoutExtension + '_' + formatDateZeus(actualDate),
                        processBatchID: ('02' + processBatchID),
                        isBigFile: isBigFile ? '1' : '0',
                        uploadDate: formatDateAndHourZeus(actualDate),
                        extension: innerDocument.name && ('.' + innerDocument.name.split('.').pop()),
                        tipoMime: innerDocument.type,
                        carpeta: '/Documentos/ZEUDOCUWBS02',
                        tipo: 'ZEUDOCUWBS02',
                        contenido: base64,
                        //documentCode: 'DOCTYP0341'/*documentCode - Nos lo tiene que facilitar Zeus*/,
                        documentDesc: documentTypeName && documentTypeName,
                        comment: innerComment,
                        observations: innerComment1,
                        metadatos: [
                          {
                            nombre: 'codigo_tipo',
                            valor: 'DOCTYP0341'
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
                    dispatch(setCurrentProvision({
                      ...currentProvision,
                      documentList: response.documentList
                    }))

                    if (isBigFile) {
                      setBigFilePopup(true)
                    }

                    //Actualizamos estado
                    let subtipology = ''

                    if (reason === 'REVISIÓN TÉCNICA') {
                      subtipology = 'TYMOTREV01'
                    } else if (reason === 'REVISIÓN ECONÓMICA') {
                      subtipology = 'TYMOTREV02'
                    } else if (reason === 'REVISIÓN TÉCNICO-ECONÓMICA') {
                      subtipology = 'TYMOTREV03'
                    }

                    setRevisedBudget({
                      click: true,
                      subtipology: subtipology,
                      comment: explain
                    })

                    handleCloseDialog()

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
    } else {
      let docCargaOfflineData = {
        id: '',
        expediente: currentProvision.dossierCod,
        cups: '',
        doctype: user.documentType,
        fechaRealSubida: actualDateString,
        docName: innerDocument && innerDocument.name,
        docSize: fileSize
      }

      setIsLoading(true)

      dispatch(thunkCreateDocumentoCargaOffline(docCargaOfflineData, (response) => {
        if (response) {
          dispatch(thunkGetDocumentosCargaOffline('', currentProvision.dossierCod, '', '', actualDateString, '', '', (response) => {
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
                        nombre: '1_' + ('02' + processBatchID) + '_' + currentProvision.dossierCod + '_' + user.documentType + '_' + user.documentNumber + '_' + fileNameWithoutExtension + '_' + formatDateZeus(actualDate),
                        processBatchID: ('02' + processBatchID),
                        isBigFile: isBigFile ? '1' : '0',
                        uploadDate: formatDateAndHourZeus(actualDate),
                        extension: innerDocument.name && ('.' + innerDocument.name.split('.').pop()),
                        tipoMime: innerDocument.type,
                        carpeta: '/Documentos/ZEUDOCUWBS02',
                        tipo: 'ZEUDOCUWBS02',
                        contenido: base64,
                        //documentCode: ''/*documentCode - Nos lo tiene que facilitar Zeus*/,
                        documentDesc: documentTypeName && documentTypeName,
                        comment: innerComment,
                        observations: innerComment1,
                        metadatos: [
                          {
                            nombre: 'codigo_tipo',
                            valor: 'DOCTYP0341'
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
                    dispatch(setCurrentProvision({
                      ...currentProvision,
                      documentList: response.documentList
                    }))

                    if (isBigFile) {
                      setBigFilePopup(true)
                    }

                    //Actualizamos estado
                    let subtipology = ''

                    if (reason === 'REVISIÓN TÉCNICA') {
                      subtipology = 'TYMOTREV01'
                    } else if (reason === 'REVISIÓN ECONÓMICA') {
                      subtipology = 'TYMOTREV02'
                    } else if (reason === 'REVISIÓN TÉCNICO-ECONÓMICA') {
                      subtipology = 'TYMOTREV03'
                    }

                    setRevisedBudget({
                      click: true,
                      subtipology: subtipology,
                      comment: explain
                    })

                    handleCloseDialog()

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
  }


  /* Fin ADN - 05/09/2023 - Añadir doc propuesta previa */

  return (
    <>
      {
        (loading || isLoading) &&
        <Spinner />
      }

      <DialogContent className={classes.container}>
        <Grid container justifyContent='flex-end'>
          <TextButton className={classes.closeButton} onClick={handleCloseDialog}>
            <img src={CloseIcon} alt='' />
          </TextButton>
        </Grid>

        <div className={classes.modalText}>
          <Grid container direction='column' justifyContent='center' alignItems='center' spacing={1}>

            <Grid item className={classes.title}>
              {propPrev ? t('provisions.provisionsDetails.reasonReview.title') : t('provisions.provisionsDetails.reasonReview.titlePresup')}
            </Grid>
          </Grid>
        </div>

        <Grid item>
          <Grid container direction='column' justifyContent='center' alignItems='center'>

            <Grid item className={classes.subtitle2}>{''}</Grid>
          </Grid>
        </Grid>


        <Grid item className={classes.inputBlock}>
          <div className={classes.label2}>{t('provisions.provisionsDetails.reasonReview.selectLabel')}</div>

          <Select
            fullWidth
            values={reasonsList}
            value={reason}
            onChange={handleSelect}
          />
        </Grid>

        {/* ADN - 1009227 - Añadir doc en revisión propuesta previa*/}

        <Grid container className={classes.documentSpacingTop}>
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
              }
            </>
          </Grid>
        </Grid>

        <Grid container className={classes.documentSpacingBottom}>
          <label className={classes.fileFormatAdvise}>{t('provisions.documentation.fileFormat')}</label>
        </Grid>

        {/* ADN - 1009227 - FIN*/}

        <Grid item className={classes.inputBlock}>
          <div className={classes.label2}>{t('provisions.provisionsDetails.reasonReview.inputLabel')}</div>

          <Input
            fullWidth
            multiline
            rows='5'
            value={explain}
            onChange={handleInput}
            inputProps={{
              maxlength: '260'
            }}
          />

          <Grid container justifyContent='flex-end'>
            <Grid item className={classes.characterCount}>
              {t('provisions.provisionsDetails.reasonReview.characters.part1')}

              {characters}

              {t('provisions.provisionsDetails.reasonReview.characters.part2')}
            </Grid>
          </Grid>
        </Grid>

        <DialogActions>
          <Grid container direction='row' justifyContent='center' className={classes.buttons}>
            <Button
              className={classes.button}
              text={t('common.buttons.cancel')}
              color='inherit'
              size='large'
              variant='contained'
              onClick={handleCloseDialog}
            />

            <Button
              className={classes.button}
              text={t('common.buttons.accept')}
              color='primary'
              size='large'
              variant='contained'
              disabled={reason === '' || explain === ''}
              onClick={handleAcceptDialog}
            />
          </Grid>
        </DialogActions>
      </DialogContent>
    </>
  )
}

export default Content
