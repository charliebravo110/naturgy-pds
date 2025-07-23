import React from 'react'

import { DialogContent } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'

import { useTranslation } from 'react-i18next'

import Dialog from '../../../../../../common/components/dialog/Dialog'
import TextButton from '../../../../../../common/components/text-button/TextButton'
import AlertIcon from '../../../../../../assets/icons/ico_aviso_rojo.svg'
import CloseIcon from '../../../../../../assets/icons/cerrar.svg'

import useStyles from './SystemErrorModal.styles'
import Button from '../../../../../../common/components/button/Button'

const SystemErrorModal = (props: any) => {
    const classes = useStyles({})
    const { t } = useTranslation()

    const { open, closeFunction } = props

    return (
        <Dialog open={open} onClose={closeFunction} className={classes.dialog}>
            <DialogContent className={classes.modalContainer}>
                <Grid container justifyContent='flex-end'>
                    <TextButton className={classes.closeButton} onClick={closeFunction}>
                        <img src={CloseIcon} alt='' />
                    </TextButton>
                </Grid>

                <Grid container className={classes.modalText} direction='column' justifyContent='center' alignItems='center'>
                    <Grid item >
                        <img className={classes.icon} src={AlertIcon} alt='' />
                    </Grid>

                    <Grid item className={classes.title}>
                        {t('averias.management.incidence.insertContactData.systemError')}
                    </Grid>

                    <Grid item md={4} xs={12} sm={6} className={classes.button} >
                        <Button
                            text={t('averias.management.incidence.insertContactData.closeButton')}
                            color={'primary'}
                            size={'large'}
                            variant={'contained'}
                            onClick={closeFunction}
                        />
                    </Grid>
                </Grid>

            </DialogContent>
        </Dialog>
    )
}

export default SystemErrorModal
