import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import { DialogContent } from '@material-ui/core'

import CloseIcon from '../../../../../assets/icons/cerrar.svg'

import Dialog from '../../../../../common/components/dialog/Dialog'
import TextButton from '../../../../../common/components/text-button/TextButton'

import ApplicantData from '../../../request-data/applicant-data/ApplicantData'
import Content from './Content'
import useStyles from './AddDocumentDialog.styles'
import BigFileDialog from '../../big-file-dialog/BigFileDialog'

const AddDocumentDialog = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const currentProvision = useSelector((state: any) => state.provisions.currentProvision)

  const { setPDFInfo, popup, setPopup, payerExists, ownerExists,  setOwnerDocument, setPayerDocument, payerOrOwner, setDocCargaOfflineData } = props

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
              <Grid item className={classes.title}>
                {t('Adjuntar documento')}
              </Grid>
            
          </Grid>       


        </Grid>
      </DialogContent>
    </Dialog>
    </>
  )
}

export default AddDocumentDialog