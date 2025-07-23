import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import { thunkGetDocument } from '../../../store/actions/ProvisionsThunkActions'

import useStyles from './NoBudgetAnticipated.styles'
import { isWeb } from '../../../../mobile-apps/common/detectPlatform'
import createFileAndOpenIt from '../../../../mobile-apps/local-downloads/createFileAndOpenIt'

const NoBudgetAnticipated = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const { setIsLoading } = props

  const currentProvision = useSelector((state: any) => state.provisions.currentProvision)

  const handleDownloadDocument = () => {
    setIsLoading(true)

    const communications = currentProvision.communicationList.map(item => {
      if (item.idCommunicationType && item.idCommunicationType === 'COMTYP292') {
        return item
      } else {
        return false
      }
    })

    const documentumId = communications.filter(item => item.documentumId)[0].documentumId

    dispatch(thunkGetDocument(documentumId, (response) => {
      if (response && response.documento) {
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

      setIsLoading(false)
    }))
  }

  return (
    <Grid item container md={12} direction='column' justifyContent='center' alignItems='center' className={classes.container}>
      <Grid item className={classes.title}>
        {t('provisions.budget.noBudgetAnticipated.title')}
      </Grid>
      <Grid item className={classes.subtitle}>
        <span>{t('provisions.budget.noBudgetAnticipated.subtitle')}</span>
        <span className={classes.link} onClick={handleDownloadDocument}>
          {t('provisions.budget.noBudgetAnticipated.link')}
        </span>
        <span>{t('provisions.budget.noBudgetAnticipated.last')}</span>
      </Grid>
    </Grid>
  )
}

export default NoBudgetAnticipated
