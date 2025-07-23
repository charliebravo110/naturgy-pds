import React, { useState, useEffect } from 'react'
import { Grid, DialogContent, TextField } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import useStyles from './DialogRequestDetail.styles'
import Button from '../../../../common/components/button/Button'
import Input from '../../../../common/components/input/Input'

const CommentDialog = (props: any) => {
    const classes = useStyles({})
    const { t } = useTranslation()
    const [inputText, setInputText] = useState('')

    const { setShowingDialog,
        optionDialog,
        setOptionDialog,
        datosPeticion,
        setDatosPeticion,
        thanksDialog,
        setThanksDialog,
        sendPetition,
        setSendPetition
    } = props

    const handleInput = (e) => {
        setInputText(e.target.value)
    }

    const handleAcceptDialog = () => {
        let field = ''
        if (optionDialog === 'C') {
            field = 'comment'
        } else {
            field = 'reiteration'
        }

        setDatosPeticion({
            ...datosPeticion,
            petitionType: optionDialog,
            [field]: inputText
        })

        handleSendDatosPeticion()
    }

    const handleSendDatosPeticion = () => {
        // Aqui se pondrá la llamada para subir el comentario.
        // Si es reiteracion hay que validar previamente que se pueda realizar.
        setSendPetition(false)
        setThanksDialog(true)
    }

    const handleCloseCommentDialog = () => {
        setOptionDialog('')
        setShowingDialog(false)
    }

    return (
        <Grid container>
            {!thanksDialog &&
                <>
                    {optionDialog === 'C' ?
                        <Grid container className={classes.titleCommentDialog}>
                            {t('requests.requestDetail.dialogRequestDetail.comment')}
                        </Grid>
                        :
                        <Grid container className={classes.titleCommentDialog}>
                            {t('requests.requestDetail.dialogRequestDetail.repeat1')}
                        </Grid>
                    }

                    <Input
                        fullWidth
                        multiline
                        rows='5'
                        value={inputText}
                        onChange={handleInput}
                        inputProps={{
                            maxlength: '4000'
                        }}
                    />

                    <Grid container className={classes.buttons}>
                        <Button
                            text='Cancelar'
                            color='primary'
                            size='large'
                            variant='outlined'
                            onClick={handleCloseCommentDialog}
                        />
                        <Button
                            text='Aceptar'
                            color='primary'
                            size='large'
                            variant='contained'
                            onClick={handleAcceptDialog}
                        />
                    </Grid>
                </>
            }

            {thanksDialog && sendPetition &&
                <Grid container>
                    {optionDialog === 'C' ?
                        <Grid container className={classes.titleCommentDialog}>
                            {t('requests.requestDetail.dialogRequestDetail.thanksComment1')}
                            {t('requests.requestDetail.dialogRequestDetail.thanksComment2')}
                        </Grid>
                        :
                        <Grid container className={classes.titleCommentDialog}>
                            {t('requests.requestDetail.dialogRequestDetail.thanksComment1')}
                            {t('requests.requestDetail.dialogRequestDetail.thanksComment3')}
                        </Grid>
                    }
                    <Button
                        text='Aceptar'
                        color='primary'
                        size='large'
                        variant='outlined'
                        onClick={handleCloseCommentDialog}
                    />
                </Grid>
            }

            {thanksDialog && !sendPetition &&
                <Grid container>
                    {optionDialog === 'C' ?
                        <Grid container className={classes.titleCommentDialog}>
                            {t('requests.requestDetail.dialogRequestDetail.commentKo')}
                        </Grid>
                        :
                        <Grid container className={classes.titleCommentDialog}>
                            {t('requests.requestDetail.dialogRequestDetail.noticeRepeat')}
                            {t('requests.requestDetail.dialogRequestDetail.repeat2')}
                            {t('requests.requestDetail.dialogRequestDetail.repeat3')}
                            {t('requests.requestDetail.dialogRequestDetail.repeat4')}
                            {t('requests.requestDetail.dialogRequestDetail.repeat3')}
                        </Grid>
                    }
                    <Button
                        text='Volver'
                        color='primary'
                        size='large'
                        variant='outlined'
                        onClick={handleCloseCommentDialog}
                    />
                </Grid>
            }
        </Grid>

    )
}

export default CommentDialog