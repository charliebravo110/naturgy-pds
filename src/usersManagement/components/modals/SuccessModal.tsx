import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DialogContent, DialogContentText } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

import Dialog from '../../../common/components/dialog/Dialog';
import TextButton from '../../../common/components/text-button/TextButton';
import Button from '../../../common/components/button/Button';
import OkIcon from '../../../assets/icons/aviso_ok.svg';
import CloseIcon from '../../../assets/icons/cerrar.svg';

import useStyles from './Modals.styles';

const SuccessModal = (props: any) => {
  const { 
    title,
    closeaux,
    subTitle
} = props;

  const classes = useStyles({});
  const { t } = useTranslation();
  const [ open, setOpen ] = useState(false);

  const handleClose = () => {
    setOpen(false);
    closeaux(false);
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
              <img src={OkIcon} alt='' />
            </Grid>

            <Grid item className={classes.title}>
              {title}
            </Grid>

            <Button
                text={t('common.buttons.accept')}
                color={'primary'}
                size={'large'}
                variant={'contained'}
                onClick={() => closeaux(false)}
            />
          </Grid>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  )
}

export default SuccessModal;