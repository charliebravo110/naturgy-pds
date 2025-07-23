import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import InputBase from '@material-ui/core/InputBase'

import Input from '../../../../../common/components/input/Input'
import Button from '../../../../../common/components/button/Button'

import { setNewRequestDataDocument } from '../../../../store/actions/RequestsActions'
import { thunkCreateDocument } from '../../../../store/actions/RequestsThunkActions'

import useStyles from './DocumentAttachment.styles'

const BASE_URL = process.env.REACT_APP_API_ENDPOINT

const DocumentAttachment = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const user = useSelector((state: any) => state.user)
  const requests = useSelector((state: any) => state.requests)

  const { setLoading, setIsLoading } = props

  let auxAttachedDocument: any

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

  const handleClickExamineDocument = () => {
    auxAttachedDocument.firstChild.click()
  }

  const handleUploadDocument = (e) => {
    setIsLoading ? setIsLoading(true) : setLoading(true)

    const file = e.target.files[0]

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
            valor: user.profile.documentNumber
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

            dispatch(setNewRequestDataDocument(documentData))
          }

          setIsLoading ? setIsLoading(false) : setLoading(false)
        }))
      })
    }
  }

  return (
    <div className={classes.container}>
      {
        (requests.newRequestData.documents && requests.newRequestData.documents.length <= 1) &&
          <div className={classes.description}>{t('requests.newRequest.form.documentAttachment.description')}</div>
      }

      <Grid container className={classes.attach} spacing={2}>
        <Grid item md={9} sm={12} xs={12}>
          <Input fullWidth disabled />
        </Grid>

        <Grid item md={3} sm={12} xs={12}>
          <InputBase
            type='file'
            onChange={handleUploadDocument}
            ref={ref => auxAttachedDocument = ref}
            style={{ display: 'none' }}
          />

          <Button
            className={classes.button}
            text={t('common.buttons.addDocument')}
            color='primary'
            size='large'
            variant='contained'
            onClick={handleClickExamineDocument}
          />
        </Grid>
      </Grid>

      <div className={classes.help}>{t('requests.newRequest.form.documentAttachment.help')}</div>
    </div>
  )
}

export default DocumentAttachment
