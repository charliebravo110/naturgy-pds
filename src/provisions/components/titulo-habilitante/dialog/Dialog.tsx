import React from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import { DialogContent } from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import Dialog from '../../../../common/components/dialog/Dialog'
import Button from '../../../../common/components/button/Button'

import CloseIcon from '../../../../assets/icons/cerrar.svg'
import Banner from '../../../../assets/img/dossier_documents_dialog.png'
import BannerMobile from '../../../../assets/img/dossier_documents_dialog_mobile.png'

import useStyles from './Dialog.styles'

const ThisDialog = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.only('xs'))

  const {
    isDialogVisible,
    handleCloseDialog
  } = props

  return (
    <Dialog className={classes.dialog} open={isDialogVisible} onClose={handleCloseDialog}>
      <DialogContent className={classes.container}>
        <img className={classes.closeButton} src={CloseIcon} alt='' onClick={handleCloseDialog} />

        <div className={classes.title}>{t('provisions.provisionsEnableTitle.dialog.title')}</div>

        <Grid container className={classes.contents} spacing={2}>
          <Grid item md={5} sm={12} xs={12}>
            <div className={classes.subtitle}>{t('provisions.provisionsEnableTitle.dialog.contents.subtitle')}</div>

            {
              mobile &&
                <Grid item xs={12}>
                  <img className={classes.banner} src={BannerMobile} alt='' />
                </Grid>
            }

            <div className={classes.pagraphs}>
              <div className={classes.pagraph}>
                <span>"</span>

                {t('provisions.provisionsEnableTitle.dialog.contents.pagraph1.one')}

                <strong>{t('provisions.provisionsEnableTitle.dialog.contents.pagraph1.two')}</strong>

                {t('provisions.provisionsEnableTitle.dialog.contents.pagraph1.three')}

                <span>".</span>
              </div>

              <div className={classes.pagraph}>
                <strong>{t('provisions.provisionsEnableTitle.dialog.contents.pagraph2.one')}</strong>

                {t('provisions.provisionsEnableTitle.dialog.contents.pagraph2.two')}
              </div>

              <div className={classes.pagraph}>
                <span>"</span>

                {t('provisions.provisionsEnableTitle.dialog.contents.pagraph3')}

                <span>".</span>
              </div>
            </div>
          </Grid>

          {
            !mobile &&
              <Grid item md={7} sm={12} xs={12}>
                <img className={classes.banner} src={Banner} alt='' />
              </Grid>
          }
          
        </Grid>

        <Button
          className={classes.button}
          text={t('common.buttons.close')}
          color='primary'
          size='large'
          variant='contained'
          onClick={handleCloseDialog}
        />
      </DialogContent>
    </Dialog>
  )
}

export default ThisDialog
