import React from 'react'
import { useTranslation } from 'react-i18next';

import Grid from '@material-ui/core/Grid'
import { DialogContent, DialogContentText } from '@material-ui/core'

import OkIcon from '../../../../assets/icons/aviso_ok.svg'
import Alert from '../../../../assets/icons/aviso_alerta_pop_up.svg'
import CloseIcon from '../../../../assets/icons/cerrar.svg'
import InfoIcon from '../../../../assets/icons/info.svg';

import Dialog from '../../../../common/components/dialog/Dialog'
import TextButton from '../../../../common/components/text-button/TextButton'

import useStyles from './AllowPayment.styles'
import { Link } from 'react-router-dom';
import Button from '../../../../common/components/button/Button';

const AllowPayment = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const { popup, setPopup } = props

  return (
    <Dialog open={popup} onClose={() => setPopup(false)}>
      <DialogContent className={classes.modalContainer}>
        <Grid container justifyContent='flex-end'>
          <TextButton className={classes.closeButton} onClick={() => setPopup(false)}>
            <img className={classes.closeIcon} src={CloseIcon} alt='' />
          </TextButton>
        </Grid>
        <DialogContentText className={classes.modalText}>
          <Grid container direction='column' justify='center' alignItems='center' spacing={1}>
            <Grid item>
              <img className={classes.infoIcon} src={InfoIcon} alt='' />
            </Grid>
            <Grid item className={classes.title}>
              <span>{`${t('provisions.offlinePayment.popup.title')} `}</span>
            </Grid>
            <Grid item className={classes.greySubtitle}>
              <span>{`${t('provisions.offlinePayment.popup.subtitle')} `}<Link to='/'>{t('provisions.offlinePayment.popup.link')}</Link>{t('common.punctuation.dot')}</span>
            </Grid>
            <Grid container justifyContent='center' className={classes.buttons}>
              <Button
                text={t('common.buttons.accept')}
                color='primary'
                size='large'
                variant='contained'
                onClick={() => setPopup(false)}
              />
            </Grid>
          </Grid>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  )
}

export default AllowPayment