import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
// import InputBase from '@material-ui/core/InputBase'

import TextButton from '../../../../../common/components/text-button/TextButton'

import AddArchiveIcon from '../../../../../assets/icons/mas.svg'

import AddOtherDocumentDialog from '../add-other-document-dialog/AddOtherDocumentDialog'

import useStyles from './AddOtherDocumentFrame.styles'

const AddOtherDocumentFrame = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const {
    setDocument,
    setNewDocumentsRecieved,
    documentTypeName,
    billingEmail,
    indAceptoFacturaDigital,
    setBigFilePopup,
    setRefresh,
    setIsLoadingDocumentation
  } = props

  const [popup, setPopup] = useState(false)

  const handleOpenDialog = () => {
    setPopup(true)
  }

  return (
    <>
      <AddOtherDocumentDialog
        popup={popup}
        setPopup={setPopup}
        setDocument={setDocument}
        setNewDocumentsRecieved={setNewDocumentsRecieved}
        documentTypeName={documentTypeName}
        billingEmail={billingEmail}
        indAceptoFacturaDigital={indAceptoFacturaDigital}
        setBigFilePopup={setBigFilePopup}
        setRefresh={setRefresh}
        setIsLoadingDocumentation={setIsLoadingDocumentation}
      />

      <Grid item xs='auto' sm='auto' md='auto' className={classes.documentContainer}>
        <div className={classes.item}>
          <Grid container justifyContent='center' alignItems='center' spacing={1} className={classes.container}>
            <Grid item>
              <img onClick={handleOpenDialog} src={AddArchiveIcon} className={classes.icon} alt='' />
            </Grid>
            <Grid item>
              <TextButton onClick={handleOpenDialog}>{t('provisions.documentation.addOtherDoc')}</TextButton>
            </Grid>
          </Grid>
        </div>
      </Grid>
    </>
  )

}

export default AddOtherDocumentFrame
