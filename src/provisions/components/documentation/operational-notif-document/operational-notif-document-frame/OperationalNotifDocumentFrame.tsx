import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
// import InputBase from '@material-ui/core/InputBase'

import TextButton from '../../../../../common/components/text-button/TextButton'

import AddArchiveIcon from '../../../../../assets/icons/mas.svg'

import OperationalNotifDocumentDialog from '../operational-notif-document-dialog/OperationalNotifDocumentDialog'

import useStyles from './OperationalNotifDocumentFrame.styles'

const OperationalNotifDocumentFrame = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const {
    setDocument,
    setNewDocumentsRecieved
  } = props

  const [ popup, setPopup ] = useState(false)

  const handleOpenDialog = () => {
    setPopup(true)
  }

  return (
    <>
      <OperationalNotifDocumentDialog popup={popup} setPopup={setPopup} setDocument={setDocument} setNewDocumentsRecieved={setNewDocumentsRecieved} />
      <Grid item xs='auto' sm='auto' md='auto' className={classes.documentContainer}>
        <div className={classes.item}>
          <Grid container justifyContent='center' alignItems='center' spacing={1} className={classes.container}>
            <Grid item>
              <img onClick={handleOpenDialog} src={AddArchiveIcon} className={classes.icon} alt='' />
            </Grid>
            <Grid item>
              <TextButton onClick={handleOpenDialog}>{t('provisions.documentation.notifOperDoc')}</TextButton>
            </Grid>
          </Grid>
        </div>
      </Grid>
    </>
  )

}

export default OperationalNotifDocumentFrame
