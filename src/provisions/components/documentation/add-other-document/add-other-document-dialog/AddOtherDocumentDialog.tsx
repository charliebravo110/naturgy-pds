import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import { DialogContent } from '@material-ui/core'

import CloseIcon from '../../../../../assets/icons/cerrar.svg'

import Dialog from '../../../../../common/components/dialog/Dialog'
import TextButton from '../../../../../common/components/text-button/TextButton'

import Content from './content/Content'
import ContentNewGeneration from './content-new-generation/ContentNewGeneration'

import useStyles from './AddOtherDocumentDialog.styles'
import BigFileDialog from '../../big-file-dialog/BigFileDialog'

//TEST push

const AddOtherDocumentDialog = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const currentProvision = useSelector((state: any) => state.provisions.currentProvision)

  const { popup, setPopup, setNewDocumentsRecieved, documentTypeName, documentType, documentCode, setDocumentDate, setUploaded, setSentDocument, billingEmail, indAceptoFacturaDigital, nameAndSurname, address, zipcode, stateProv, town,  popupDnInfo, setPopupDnInfo, setDocumentUpload, setUploadedDocumentName, setRefresh, setIsLoadingDocumentation } = props

  const [bigFilePopup, setBigFilePopup] = useState(false)

  return (
    <>
    <BigFileDialog 
      popup={bigFilePopup}
      setPopup={setBigFilePopup}
    />

    <Dialog open={popup} onClose={() => setPopup(false)}>
      <DialogContent className={classes.modalContainer}>
        <Grid container justifyContent='flex-end'>
          <TextButton className={classes.closeButton} onClick={() => setPopup(false)}>
            <img src={CloseIcon} alt='' />
          </TextButton>
        </Grid>
        <Grid className={classes.modalText}>
          <Grid container justifyContent='center' alignItems='center'>
            {/*<Grid item className={classes.title}>
              {t('provisions.documentation.addOtherDocDialog.title')}
            </Grid>*/}
            {!documentTypeName ?
              <Grid item className={classes.title}>
                {t('provisions.documentation.addOtherDocDialog.title')}
              </Grid>
              :
              <Grid item className={classes.title}>
                {documentTypeName}
              </Grid>
            }
          </Grid>
          {currentProvision.idDossierTypeId && currentProvision.idDossierTypeId === 'DOSTYP001' ?
            //Consumos
            <Content billingEmail={billingEmail} indAceptoFacturaDigital={indAceptoFacturaDigital} setPopup={setPopup} setNewDocumentsRecieved={setNewDocumentsRecieved} documentTypeName={documentTypeName} documentType={documentType} documentCode={documentCode} setDocumentDate={setDocumentDate} setUploaded={setUploaded} setSentDocument={setSentDocument} nameAndSurname={nameAndSurname} address={address} zipcode={zipcode} stateProv={stateProv} town={town} setBigFilePopup={setBigFilePopup} setDocumentUpload={setDocumentUpload} setUploadedDocumentName={setUploadedDocumentName} setRefresh={setRefresh} setIsLoadingDocumentation={setIsLoadingDocumentation} />
          :
            //Generación && Autoconsumos
            <ContentNewGeneration billingEmail={billingEmail} indAceptoFacturaDigital={indAceptoFacturaDigital} setPopup={setPopup} setNewDocumentsRecieved={setNewDocumentsRecieved} documentTypeName={documentTypeName} documentType={documentType} documentCode={documentCode} setDocumentDate={setDocumentDate} setUploaded={setUploaded} setSentDocument={setSentDocument} nameAndSurname={nameAndSurname} address={address} zipcode={zipcode} stateProv={stateProv} town={town} setBigFilePopup={setBigFilePopup} popupDnInfo={popupDnInfo} setPopupDnInfo={setPopupDnInfo} setDocumentUpload={setDocumentUpload} setUploadedDocumentName={setUploadedDocumentName}/>
          }
        </Grid>
      </DialogContent>
    </Dialog>
    </>
  )
}

export default AddOtherDocumentDialog
