import React, { useState, useEffect } from 'react'
import { Grid, DialogContent } from '@material-ui/core'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import useStyles from './DialogRequestDetail.styles'

import Dialog from '../../../../common/components/dialog/Dialog'
import Button from '../../../../common/components/button/Button'
import Input from '../../../../common/components/input/Input'
import DeleteIcon from '../../../../assets/icons/misdocumentos_eliminar.svg'
import CommentDialog from './CommentDialog'
import Item from '../../new-request/form/documentation-list/item/Item'

const DialogRequestDetail = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const { showingDialog,
    setShowingDialog,
    optionDialog,
    setOptionDialog,
    datosPeticion,
    setDatosPeticion,
    documentUpload,
    setDocumentUpload,
    documentList,
    fechaPeticion
  } = props

  const [thanksDialog, setThanksDialog] = useState(false)
  const [sendPetition, setSendPetition] = useState(false)

  const handleCloseDialog = () => {
    setOptionDialog('')
    setShowingDialog(false)
    setThanksDialog(false)
    setSendPetition(false)
  }

  return (
    <div>
      <Dialog className={classes.dialog} open={showingDialog} onClose={handleCloseDialog}>
        <DialogContent className={classes.dialogContainer}>

          {(optionDialog === 'R' || optionDialog === 'C') &&
            <CommentDialog
              setShowingDialog={setShowingDialog}
              optionDialog={optionDialog}
              setOptionDialog={setOptionDialog}
              datosPeticion={datosPeticion}
              setDatosPeticion={setDatosPeticion}
              thanksDialog={thanksDialog}
              setThanksDialog={setThanksDialog}
              sendPetition={sendPetition}
              setSendPetition={setSendPetition}
            />
          }

          {optionDialog === 'D' || optionDialog === 'V' &&
            <Grid container >
              <Grid item md={1} className={classes.cancelarImage}>
                <img
                  onClick={handleCloseDialog}
                  src={DeleteIcon}
                  alt=''
                />
              </Grid>
            </Grid>
          }

          {optionDialog === 'V' &&
            <Grid container className={classes.items}>
              <Grid container spacing={5}>
                <Grid item md={3} sm={3} xs={3} className={classes.item}>
                {t('requests.requestDetail.dialogRequestDetail.nombreDocumento')}
                </Grid>
                <Grid item md={3} sm={3} xs={3} className={classes.item}>
                {t('requests.requestDetail.dialogRequestDetail.tipoDocumento')}
                </Grid>
                <Grid item md={3} sm={3} xs={3} className={classes.item}>
                {t('requests.requestDetail.dialogRequestDetail.fechaDocumento')}
                </Grid>
                <Grid item md={3} sm={3} xs={3} className={classes.item}>
                {t('requests.requestDetail.commentary1')}
                </Grid>
              </Grid>
              {
                documentList && documentList.map((item, index) => {
                  return (
                    <Grid container key={index} spacing={5}>
                      <Grid item md={3} sm={3} xs={3} className={classes.item}>
                        {item.documentCode}
                      </Grid>
                      <Grid item md={3} sm={3} xs={3} className={classes.item}>
                        {item.documentType}
                      </Grid>
                      <Grid item md={3} sm={3} xs={3} className={classes.item}>
                        {fechaPeticion}
                      </Grid>
                      <Grid item md={3} sm={3} xs={3} className={classes.item}>
                        {item.documentComment}
                      </Grid>
                    </Grid>
                  )
                })
              }
            </Grid>
          }

          {optionDialog === 'D' &&
            < Grid container className={classes.dialogBody}>
              {documentUpload &&
                <Grid item md={12}>
                  {t('requests.requestDetail.dialogRequestDetail.addDocOk')}
                </Grid>
              }
              {!documentUpload &&
                <Grid item md={12}>
                  {t('requests.requestDetail.dialogRequestDetail.addDocKo')}
                </Grid>
              }
            </Grid>
          }
        </DialogContent>
      </Dialog>
    </div >
  )
}

export default DialogRequestDetail