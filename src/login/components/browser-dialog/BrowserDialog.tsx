import React from 'react'
import { useTranslation } from 'react-i18next'

import { DialogContent } from '@material-ui/core'

import Dialog from '../../../common/components/dialog/Dialog'
import Button from '../../../common/components/button/Button'
import CloseIcon from '../../../assets/icons/cerrar.svg'
import NaturgyLogo from '../../../assets/img/logotipo_UFD.svg'
import ChromeSettingsIcon from '../../../assets/img/chrome-settings.png'
import FirefoxSettingsIcon from '../../../assets/img/firefox-settings.png'
import SafariSettingsIcon from '../../../assets/img/safari-settings.png'
import MsieSettingsIcon from '../../../assets/img/msie-settings.png'

import { checkBrowser } from '../../../common/lib/ValidationLib'

import useStyles from './BrowserDialog.styles'

const BrowserDialog = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const {
    isBrowserDialogVisible,
    handleCloseBrowserDialog
  } = props

  const browser = checkBrowser()

  return (
    <Dialog className={classes.dialog} open={isBrowserDialogVisible} onClose={handleCloseBrowserDialog}>
      <DialogContent className={classes.container}>
        <img className={classes.closeButton} src={CloseIcon} alt='' onClick={handleCloseBrowserDialog} />

        <img className={classes.naturgyLogo} src={NaturgyLogo} alt='' />

        {
          browser === 'firefox' ?
            <>
              <div className={classes.description1}>{t('login.browserDialog.firefox.description1.string1')} <b>{t('login.browserDialog.firefox.description1.string2')}</b>.</div>

              <div className={classes.description2}>{t('login.browserDialog.firefox.description2')} <img className='firefox' src={FirefoxSettingsIcon} alt='' />.</div>
            </>
          :
            browser === 'safari' ?
              <>
                <div className={classes.description1}>{t('login.browserDialog.safari.description1.string1')} <b>{t('login.browserDialog.safari.description1.string2')}</b>.</div>

                <div className={classes.description2}>{t('login.browserDialog.safari.description2')} <img className='safari' src={SafariSettingsIcon} alt='' />.</div>
              </>
            :
              browser === 'msie' ?
                <>
                  <div className={classes.description1}>{t('login.browserDialog.msie.description1.string1')} <b>{t('login.browserDialog.msie.description1.string2')}</b>.</div>

                  <div className={classes.description2}>{t('login.browserDialog.msie.description2')} <img className='msie' src={MsieSettingsIcon} alt='' />.</div>
                </>
              :
                <>
                  <div className={classes.description1}>{t('login.browserDialog.chrome.description1.string1')} <b>{t('login.browserDialog.chrome.description1.string2')}</b>.</div>

                  <div className={classes.description2}>{t('login.browserDialog.chrome.description2')} <img className='chrome' src={ChromeSettingsIcon} alt='' />.</div>
                </>
        }

        <Button
          className={classes.button}
          text={t('common.buttons.close')}
          color='primary'
          size='large'
          variant='contained'
          onClick={handleCloseBrowserDialog}
        />
      </DialogContent>
    </Dialog>
  )
}

export default BrowserDialog
