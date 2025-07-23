import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

import Dialog from '../../../common/components/dialog/Dialog';
import TextButton from '../../../common/components/text-button/TextButton';
import InfoIcon from '../../../assets/icons/info.svg';
import CloseIcon from '../../../assets/icons/cerrar.svg';
import Button from '../../../common/components/button/Button';
import useStyles from './MfaOption.styles';

const SmsConfirmModal = (props: any) => {
  const {
		handleCloseDialog,
		handleAcceptDialog,
	} = props;

  const classes = useStyles({})
  const { t } = useTranslation()
  const [ open, setOpen ] = useState(false);

  const handleClose = () => {
    setOpen(false)
    handleCloseDialog();
  }

  return (
    <Dialog open={open} onClose={handleClose} {...props}>
      <DialogContent className={classes.modalContainer}>
        <Grid container justify='flex-end'>
          <TextButton className={classes.closeButton} onClick={handleClose}>
            <img src={CloseIcon} alt='' />
          </TextButton>
        </Grid>

        <DialogContentText className={classes.modalText}>
          <Grid container direction='column' justify='center' alignItems='center' spacing={1}>
            <Grid item>
              <img src={InfoIcon} alt='' />
            </Grid>
            <Grid item className={classes.title}>
              {t('profile.mfa.smsModalText')}
            </Grid>
          </Grid>
        </DialogContentText>
        
        <DialogActions>
          <Grid container alignItems='center' justify='center' className={classes.buttons}>
            <Button
              text={t('common.buttons.cancel')}
              color='inherit'
              size='large'
              variant='contained'
              onClick={handleCloseDialog}
            />
            <Button
              text={t('common.buttons.accept')}
              color='primary'
              size='large'
              variant='contained'
              onClick={handleAcceptDialog}
            />
          </Grid>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}

export default SmsConfirmModal