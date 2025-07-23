import React from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import { DialogContent } from '@material-ui/core'

import CloseIcon from '../../../../../assets/icons/cerrar.svg'
import InfoIcon from '../../../../../assets/icons/info.svg'

import Dialog from '../../../../../common/components/dialog/Dialog'
import TextButton from '../../../../../common/components/text-button/TextButton'
import Button from '../../../../../common/components/button/Button'

import useStyles from './BigFileDialog.styles'

const BigFileDialog = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const { popup, setPopup } = props

  return (
    <Dialog open={popup} onClose={() => setPopup(false)}>
      <DialogContent className={classes.modalContainer}>
        <Grid container justifyContent='flex-end'>
          <TextButton className={classes.closeButton} onClick={() => setPopup(false)}>
            <img src={CloseIcon} alt='' />
          </TextButton>
        </Grid>
        <Grid className={classes.modalText}>
          <Grid container justifyContent='center' alignItems='center'>
            <Grid item xs={12}>
              <img src={InfoIcon} className={classes.infoIcon} alt='' />
            </Grid>
            <Grid item xs={12} className={classes.title}>
              {t('provisions.documentation.bigFilePopup.title')}
            </Grid>
            <Grid item xs={12} className={classes.text}>
              {t('provisions.documentation.bigFilePopup.text')}
            </Grid>
            <Button
              text={t('common.buttons.close')}
              color={'primary'}
              size={'large'}
              variant={'contained'}
              onClick={() => setPopup(false)}
            />
          </Grid>      
        </Grid>
      </DialogContent>
    </Dialog>
  )
}

export default BigFileDialog
