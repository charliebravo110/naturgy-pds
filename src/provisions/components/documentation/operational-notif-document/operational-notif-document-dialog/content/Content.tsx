import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import InputBase from '@material-ui/core/InputBase'

import DocumentIcon from '../../../../../../assets/icons/plano_documento_adjunto.svg'

import Button from '../../../../../../common/components/button/Button'
import Input from '../../../../../../common/components/input/Input'
import Spinner from '../../../../../../common/components/spinner/Spinner'
import Select from '../../../../../../common/components/select/Select'

import { setCurrentProvision } from '../../../../../store/actions/ProvisionsActions'
import { thunkUpdateDossier } from '../../../../../store/actions/ProvisionsThunkActions'

import useStyles from './Content.styles'

const Content = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const {
    setNewDocumentsRecieved,
    setPopup
  } = props

  const user = useSelector((state: any) => state.user.profile)
  const currentProvision = useSelector((state: any) => state.provisions.currentProvision)
  const totalPowerInstall = useSelector((state: any) => state.provisions.currentProvision.techData.totalPowerInstall)
  const significanceIt = useSelector((state: any) => state.provisions.currentProvision.techData.significanceIt)

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

  const [ isLoading, setIsLoading ] = useState(false)
  const [innerDocument, setInnerDocument] = useState<any>()
  // const [ innerComment, setInnerComment ] = useState('')
  const [ documentName, setDocumentName ] = useState('')
  const [ docType, setDocType ] = useState('')
  const [ selectedText, setSelectedText ] = useState('')

  const [ docsList, setDocsList ] = useState([])

  let documentAux: any

  const openFileDialog = () => {
    documentAux.firstChild.click()
  }

  const handleUploadDocument = (e) => {
    setInnerDocument(e.target.files[0])

    setDocumentName(e.target.files[0].name)
  }

  const handleSendFile = () => {
    getBase64(innerDocument, (result) => {
      const base64 = result.substring(result.indexOf('base64,') + 7, result.length)
      // Thunk de subida del archivo de este objeto
      const data = {
        dossierCod: currentProvision.dossierCod,
        email: currentProvision.email,
        applicant: {
          docNumber: user.documentNumber
        },
        documentList: {
          document: [
            {
              nombre: innerDocument && innerDocument.name,
              extension: innerDocument && innerDocument.name.substring(innerDocument.name.indexOf('.'), innerDocument.name.length),
              tipoMime: innerDocument && innerDocument.type,
              carpeta: '/Documentos/ZEUDOCUWBS02',
              tipo: 'ZEUDOCUWBS02',
              contenido: base64,
              documentDesc: 'NOTIF OPER DOC',
              comment: '',
              // comment: innerComment,
              metadatos: [
                {
                  nombre: 'codigo_tipo',
                  valor: docType
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

          setNewDocumentsRecieved({
            sentDocument: response.dossier.documentList && response.dossier.documentList.sentDocument ? response.dossier.documentList.sentDocument.map((item) => item) : [],
            nSentDocument: response.dossier.documentList && response.dossier.documentList.nSentDocument ? response.dossier.documentList.nSentDocument.map((item) => item) : []
          })

          setPopup(false)

          /*
          let defaultName = t('provisions.defaultName')

          dispatch(thunkGetProvision(currentProvision.dossierCod, defaultName, (response) => {
            if (response) {
              setNewDocumentsRecieved({
                sentDocument: response && response.documentList && response.documentList.sentDocument ? response.documentList.sentDocument.map((item) => item) : [],
                nSentDocument: response && response.documentList && response.documentList.nSentDocument ? response.documentList.nSentDocument.map((item) => item) : []
              })
            }

            setIsLoading(false)

            setPopup(false)
          }))
          */
        }

        setIsLoading(false)
      }))
    })
  }

  const handleSelect = (e) => {
    const value = e.target.value
    setSelectedText(e.target.value)

    switch (value) {
      case t('provisions.documentation.operNotifDocDialog.select.certificateGrd'):
        setDocType('DOCTYP0314')
        break
      case t('provisions.documentation.operNotifDocDialog.select.certificateOs'):
        setDocType('DOCTYP0315')
        break
      case t('provisions.documentation.operNotifDocDialog.select.reportPrevIonOs'):
        setDocType('DOCTYP0316')
        break
      case t('provisions.documentation.operNotifDocDialog.select.reportPrevFonOs'):
        setDocType('DOCTYP0317')
        break
      case t('provisions.documentation.operNotifDocDialog.select.certificateMge'):
        setDocType('DOCTYP0318')
        break
      case t('provisions.documentation.operNotifDocDialog.select.systemAgreement'):
        setDocType('DOCTYP0319')
        break
      case t('provisions.documentation.operNotifDocDialog.select.auxiliaryServicesContract'):
        setDocType('DOCTYP0320')
        break
      case t('provisions.documentation.operNotifDocDialog.select.technicalAccessContract'):
        setDocType('DOCTYP0264')
        break
    }
  }

  useEffect(() => {
    const list = []

    if (significanceIt === 'A') {      
      list.push(t('provisions.documentation.operNotifDocDialog.select.certificateMge'))
      setDocsList(list)
    } 
    else if (significanceIt === 'B' || significanceIt === 'C' || significanceIt === 'D') {
      list.push(t('provisions.documentation.operNotifDocDialog.select.systemAgreement'))
      list.push(t('provisions.documentation.operNotifDocDialog.select.auxiliaryServicesContract'))
      list.push(t('provisions.documentation.operNotifDocDialog.select.technicalAccessContract'))
      list.push(t('provisions.documentation.operNotifDocDialog.select.certificateMge'))

      if (totalPowerInstall !== '') {
        if (totalPowerInstall <= 450) {
          list.push(t('provisions.documentation.operNotifDocDialog.select.certificateGrd'))
        }
        else if (totalPowerInstall > 450 && totalPowerInstall <= 1000) {
          list.push(t('provisions.documentation.operNotifDocDialog.select.certificateOs'))
        }
        else if (totalPowerInstall > 1000 && totalPowerInstall <= 5000) {
          list.push(t('provisions.documentation.operNotifDocDialog.select.reportPrevIonOs'))
        }

        if (totalPowerInstall > 5000) {
            list.push(t('provisions.documentation.operNotifDocDialog.select.reportPrevFonOs'))     
        }
      }

      setDocsList(list)
    }
  }, [])

  return (
    <Grid container spacing={1}>
      <Grid container direction='column' className={classes.inputContainer}>
        {
          isLoading &&
            <Spinner />
        }
        <Grid container>
          <Grid item md={10} sm={10} xs={10} className={classes.label}>
            <Grid container alignItems='center' spacing={1}>
              <Grid item>{t('provisions.documentation.operNotifDocDialog.docName')}</Grid>
              <Grid item><img src={DocumentIcon} alt='' /></Grid>
            </Grid>
          </Grid>
          <Grid item md={2} sm={2} xs={2} />
        </Grid>
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
              <InputBase
                type='file'
                onChange={handleUploadDocument}
                ref={(ref) => (documentAux = ref)}
                style={{ display: 'none' }}
              />
              <Button
                color={'primary'}
                variant={'contained'}
                text={t('provisions.documentation.operNotifDocDialog.search')}
                onClick={openFileDialog}
                className={classes.searchButton}
              />
            </>
          </Grid>
        </Grid>

        <Grid container>
          <label className={classes.fileFormatAdvise}>{t('provisions.documentation.fileFormat')}</label>
        </Grid>

        <Grid item className={classes.inputContainer}>
          <Grid container alignItems='center' spacing={1} className={classes.label}>
            <Grid item>{t('provisions.documentation.operNotifDocDialog.description')}</Grid>
            <Grid item><img src={DocumentIcon} alt='' /></Grid>
          </Grid>
          <Select
            fullWidth
            values={docsList}
            value={selectedText}
            onChange={handleSelect}
          />
        </Grid>
      </Grid>

      <Grid container justifyContent='center' alignItems='center'>
        <Grid item>
          <Button
            color={'primary'}
            variant={'contained'}
            size='large'
            text={t('provisions.documentation.operNotifDocDialog.send')}
            disabled={documentName === '' || docType === ''}
            onClick={handleSendFile}
          />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Content
