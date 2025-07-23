import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

import Dialog from '../../../common/components/dialog/Dialog';
import TextButton from '../../../common/components/text-button/TextButton';
import Select from '../../../common/components/select/Select';
import CloseIcon from '../../../assets/icons/cerrar.svg';
import Button from '../../../common/components/button/Button';
import useStyles from './Modals.styles';

const AsignModal = (props: any) => {
  const {
		handleCloseDialog,
		handleAcceptDialog,
    title
	} = props;

  const classes = useStyles({})
  const { t } = useTranslation()
  const [ open, setOpen ] = useState(false)

  const handleClose = () => {
    setOpen(false);    
    handleCloseDialog(false);
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
            <Grid item className={classes.title}>
              {title}
            </Grid>
            <Grid item className={classes.select}>
              <Select
                className={classes.inputV2}
                label={t('gestionUsuariosCC.filter.rolesLabel')}
                values={['Call Center']}
                value={'Call Center'}
              />
            </Grid>            
          </Grid>
        </DialogContentText>
        <DialogActions>
          <Grid container alignItems='center' justify='space-around'>
            <Button
              text={t('common.buttons.accept')}
              color='primary'
              size='large'
              variant='contained'
              onClick={handleAcceptDialog}
            />
            <Button
              className={classes.button}
              text={t('common.buttons.cancel')}
              color='inherit'
              size='large'
              variant='contained'
              onClick={handleCloseDialog}
            />
          </Grid>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}

export default AsignModal;