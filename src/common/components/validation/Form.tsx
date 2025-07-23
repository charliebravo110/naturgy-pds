import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import useStyles from './Form.styles'
import { setPadlock } from '../../store/actions/UserActions'
import { Grid, DialogContent } from '@material-ui/core'
import Dialog from '../../../common/components/dialog/Dialog'
import CloseIcon from '../../../assets/icons/cerrar.svg'

const Form = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const dispatch = useDispatch()

  const {
    setStatusErrorCertificado,
    previousPage,
    initialPage,
    finPreType
  } = props

  const CERT_URL = process.env.REACT_APP_CERT_ENDPOINT
  const CERT_EVENT = process.env.REACT_APP_CERT_EVENT
  const CERT_TOKEN = process.env.REACT_APP_CERT_TOKEN

  const user = useSelector((state: any) => state.user.profile)

  //Controlamos el popup
  const [showingDialogAlert, setShowingDialogAlert] = useState(false)
  const handleCloseDialogAlert = () => {
    setShowingDialogAlert(false)
  }
  {/*const handleOpenDialogAlert = () => {
    setShowingDialogAlert(true)
  }*/}

  const handleMessage = (event) => {
    if (event.origin === CERT_EVENT) {
      const data = { certified: event.data.certified, result: event.data.result, challenge: event.data.challenge }

      if (data.certified === 0) {
        //botón cancelar en el iframe
        previousPage()
      } else if (data.certified === 1) {
        if (data.result === 'ok' && data.challenge === CERT_TOKEN) {
          //seguimos con la contratación
          dispatch(setPadlock('1'))
          finPreType()
        } else if (data.result !== 'ok' && data.challenge === CERT_TOKEN){
          //error en nuestra API (segunda validación) setear error
          setStatusErrorCertificado(2)
          previousPage()
        } else {
          //error sin viajar a nuestra API
          setStatusErrorCertificado(1)
          initialPage()
        }
      }
    }
  }

  useEffect(() => {
    setStatusErrorCertificado(0)
    let hiddenForm = document.getElementById('hiddenForm2') as any
    hiddenForm.submit()

    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  return (
    <>
      <Dialog className={classes.dialog} open={showingDialogAlert} onClose={handleCloseDialogAlert}>
        <DialogContent className={classes.dialogContainer}>
          <img src={CloseIcon} className={classes.closeButton} alt='' onClick={handleCloseDialogAlert} />
          <Grid container className={classes.noItems}>
            <Grid item>
              <Grid container>
                <Grid item xs={12} sm={12} md={12} className={classes.title}>
                  {t('certificate.dialogTitle')}
                </Grid>
                <Grid container className={classes.text}>
                  {t('certificate.legalInfo')}
                </Grid>
                <Grid container className={classes.text}>
                  {t('certificate.legalInfo01')}
                </Grid>
                <Grid container className={classes.text}>
                  {t('certificate.legalInfo02')}
                </Grid>
                <Grid container className={classes.text}>
                  {t('certificate.legalInfo03')}
                </Grid>
                <Grid container className={classes.text}>
                  {t('certificate.legalInfo04')}
                </Grid>
                <Grid container className={classes.text}>
                  {t('certificate.legalInfo05')}
                </Grid>
                <Grid container className={classes.text}>
                  {t('certificate.legalInfo06')}
                </Grid>
                <Grid container className={classes.text}>
                  {t('certificate.legalInfo07')}
                </Grid>
                <Grid container className={classes.text}>
                  {t('certificate.legalInfo08')}
                </Grid>
                <Grid item xs={12} sm={12} md={12} className={classes.text02}>
                  {t('certificate.dialogTitle02')}
                </Grid>
                <Grid container className={classes.text}>
                  {t('certificate.text02')}
                </Grid>
                <Grid item xs={12} sm={12} md={12} className={classes.text02}>
                  {t('certificate.dialogTitle03')}
                </Grid>
                <Grid container className={classes.text}>
                  {t('certificate.text03')}
                </Grid>
                <Grid item xs={12} sm={12} md={12} className={classes.text02}>
                  {t('certificate.dialogTitle04')}
                </Grid>
                <Grid container className={classes.text}>
                  {t('certificate.text04')}
                </Grid>
                <Grid item xs={12} sm={12} md={12} className={classes.text02}>
                  {t('certificate.dialogTitle05')}
                </Grid>
                <Grid container className={classes.text}>
                  {t('certificate.text05')}
                </Grid>
                <Grid container className={classes.text}>
                  {t('certificate.text051')}
                </Grid>
                <Grid container className={classes.text}>
                  {t('certificate.text052')}
                </Grid>
                <Grid container className={classes.text}>
                  {t('certificate.text053')}
                </Grid>
                <Grid item xs={12} sm={12} md={12} className={classes.text02}>
                  {t('certificate.dialogTitle06')}
                </Grid>
                <Grid container className={classes.text}>
                  {t('certificate.text06')}
                </Grid>
                <Grid container className={classes.text}>
                  {t('certificate.text061')}
                </Grid>
                <Grid container className={classes.text}>
                  {t('certificate.text062')}
                </Grid>
                <Grid container className={classes.text}>
                  {t('certificate.text063')}
                </Grid>
                <Grid container className={classes.text}>
                  {t('certificate.text064')}
                </Grid>
                <Grid container className={classes.text}>
                  {t('certificate.text065')}
                </Grid>
                <Grid container className={classes.text}>
                  {t('certificate.text066')}
                </Grid>
                <Grid container className={classes.text}>
                  {t('certificate.text067')}
                </Grid>
                <Grid container className={classes.text}>
                  {t('certificate.text068')}
                </Grid>
                <Grid container className={classes.text}>
                  {t('certificate.text069')}
                </Grid>
                <Grid item xs={12} sm={12} md={12} className={classes.text02}>
                  {t('certificate.dialogTitle07')}
                </Grid>
                <Grid container className={classes.text}>
                  {t('certificate.text07')}
                </Grid>
                <Grid item xs={12} sm={12} md={12} className={classes.text02}>
                  {t('certificate.dialogTitle08')}
                </Grid>
                <Grid container className={classes.text}>
                  {t('certificate.text08')}
                </Grid>
                <Grid item xs={12} sm={12} md={12} className={classes.text02}>
                  {t('certificate.dialogTitle09')}
                </Grid>
                <Grid container className={classes.text}>
                  {t('certificate.text09')}
                </Grid>
                <Grid item xs={12} sm={12} md={12} className={classes.text02}>
                  {t('certificate.dialogTitle10')}
                </Grid>
                <Grid container className={classes.text}>
                  {t('certificate.text10')}
                </Grid>
                <Grid item xs={12} sm={12} md={12} className={classes.text02}>
                  {t('certificate.dialogTitle11')}
                </Grid>
                <Grid container className={classes.text}>
                  {t('certificate.text11')}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      <form
        id='hiddenForm2'
        action={CERT_URL}
        method='POST'
        target='hiddeniFrame'
      >
        {/*NIF/CIF del logado, validar certificado */}
        <input type='hidden' name='token' value={user.documentNumber} />
      </form>
      <iframe id='hiddeniFrame' className={classes.iframe} name='hiddeniFrame' title='hiddeniFrame' />

      <Grid container justifyContent='center'>
        {/*<Grid item className={classes.hyperlink} onClick={handleOpenDialogAlert} justifyContent='center'>
          {t('certificate.link')}
        </Grid>*/}
        <Grid container className={classes.text03bold} justifyContent='center'>
          {t('certificate.requisitos')}
        </Grid>
        <Grid item className={classes.text03}>
          {t('certificate.navegadores')}
        </Grid>
        <Grid item className={classes.text03}>
          {t('certificate.so')}
        </Grid>
        <Grid item className={classes.text03}>
          {t('certificate.goodCertificates')}
        </Grid>
      </Grid>
    </>
  )
}

export default Form
