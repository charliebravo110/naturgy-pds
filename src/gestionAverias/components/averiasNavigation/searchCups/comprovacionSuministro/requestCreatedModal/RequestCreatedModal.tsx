import React from 'react'

import { DialogContent } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'

import { useTranslation } from 'react-i18next'

import Dialog from '../../../../../../common/components/dialog/Dialog'
import TextButton from '../../../../../../common/components/text-button/TextButton'
import Button from '../../../../../../common/components/button/Button'
import CloseIcon from '../../../../../../assets/icons/cerrar.svg'
import OkIcon from '../../../../../../assets/icons/aviso_ok.svg'

import useStyles from './RequestCreatedModal.styles'

const RequestCreatedModal = (props: any) => {
    const classes = useStyles({})
    const { t } = useTranslation()

    const { open, closeFunction } = props

    return (
        <Dialog open={open} onClose={closeFunction}>
            <DialogContent className={classes.modalContainer}>
                <Grid container justifyContent='flex-end'>
                    <TextButton className={classes.closeButton} onClick={closeFunction}>
                        <img src={CloseIcon} alt='' />
                    </TextButton>
                </Grid>

                <Grid className={classes.modalText}>
                    <Grid container direction='column' justifyContent='center' alignItems='center' spacing={1}>
                        <Grid item>
                            <img src={OkIcon} alt='' />
                        </Grid>

                        <Grid item className={classes.title}>
                            {t('averias.management.searchCups.comprovacionesSuministro.requestModal.requestCreated')}
                        </Grid>

                        <Grid item>
                            <Button
                                className={classes.button}
                                text={t('common.buttons.close')}
                                color='primary'
                                size='large'
                                variant='contained'
                                onClick={closeFunction}
                            />
                        </Grid>

                    </Grid>
                </Grid>

            </DialogContent>
        </Dialog>
    )
}

export default RequestCreatedModal