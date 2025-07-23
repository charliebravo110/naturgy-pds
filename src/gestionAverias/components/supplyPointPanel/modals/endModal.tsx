import React from 'react'

import Dialog from '../../../../common/components/dialog/Dialog'
import Grid from '@material-ui/core/Grid'
import { DialogContent, DialogActions } from '@material-ui/core'
import useStyles from './modals.styles'
import TextButton from '../../../../common/components/text-button/TextButton'
import Button from '../../../../common/components/button/Button';
import CloseIcon from '../../../../assets/icons/cerrar.svg';
import InfoIcon from '../../../../assets/icons/info.svg';
import { Link } from 'react-router-dom';



const EndModal = (props: any) => {

    const classes = useStyles([]);

    const {
        isEndModalVisible,
        closeDialog,
        handleAcceptEndDialog
    } = props

    const handleCloseDialog = () => {
        closeDialog(false)
    }

    return (
        <Dialog className={classes.dialog} open={isEndModalVisible} onClose={handleCloseDialog} {...props}>
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
                        <img className={classes.icon} src={InfoIcon} alt='' />
                    </Grid>
                    <Grid container justifyContent='center' className={classes.title}>
                        <Grid item>
                            {'Al cancelar volverás a la pantalla inicial'}
                        </Grid>
                    </Grid>
                    <Grid container justifyContent='center' className={classes.description}>
                        <Grid item>
                            {'Los datos de esta página no se guardarán'}
                        </Grid>
                    </Grid>
                    <Grid container justifyContent='center' spacing={3} className={classes.buttonsArea}>
                        <Grid item>
                            <Button
                                text={'Cancelar'}
                                color={'primary'}
                                size={'large'}
                                variant={'outlined'}
                                onClick={handleCloseDialog}
                            />
                        </Grid>
                        <Grid item>
                            <Link
                                to={{
                                    pathname: '/gestionAverias',
                                }}
                                className={classes.link}
                            >
                                <Button
                                    text={'Aceptar'}
                                    color={'primary'}
                                    size={'large'}
                                    variant={'contained'}
                                />
                            </Link>

                        </Grid>
                    </Grid>

                </Grid>
            </DialogContent>
        </Dialog>
    )
}

export default EndModal;
