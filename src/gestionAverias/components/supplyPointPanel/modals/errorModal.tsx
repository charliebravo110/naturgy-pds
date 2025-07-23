import React from 'react'

import Dialog from '../../../../common/components/dialog/Dialog'
import Grid from '@material-ui/core/Grid'
import { DialogContent } from '@material-ui/core'
import useStyles from './modals.styles'
import TextButton from '../../../../common/components/text-button/TextButton'
import Button from '../../../../common/components/button/Button';
import CloseIcon from '../../../../assets/icons/cerrar.svg'
import AlertIcon from '../../../../assets/icons/aviso_alerta_pop_up.svg'
import { useTranslation } from 'react-i18next'


const ErrorModal = (props: any) => {

    const classes = useStyles([]);
    const { t } = useTranslation()

    const {
        isErrorModalVisible,
        closeDialog,
    } = props

    const handleCloseDialog = () => {
        closeDialog(false)
    }

    return (
        <Dialog className={classes.dialog} open={isErrorModalVisible} onClose={handleCloseDialog} {...props}>
            <DialogContent className={classes.modalContainer}>
                <Grid container className={classes.block}>
                    <Grid container justifyContent='flex-end'>
                        <TextButton className={classes.closeButton} onClick={handleCloseDialog}>
                            <img src={CloseIcon} alt='' />
                        </TextButton>
                    </Grid>
                </Grid>
                <Grid container className={classes.container}>
                    <Grid item>
                        <img className={classes.icon} src={AlertIcon} alt='' />
                    </Grid>
                    <Grid container justifyContent='center' className={classes.title}>
                        <Grid item>
                            {'No se ha podido enviar el aviso debido a un error del sistema, intentalo más tarde.'}
                        </Grid>
                    </Grid>
                    <Grid container justifyContent='center' className={classes.buttonsArea}>
                        <Grid item>
                            <Button
                                text={t('common.buttons.close')}
                                color={'primary'}
                                size={'large'}
                                variant={'contained'}
                                onClick={handleCloseDialog}
                            />
                        </Grid>
                    </Grid>

                </Grid>
            </DialogContent>
        </Dialog>
    )
}

export default ErrorModal;
