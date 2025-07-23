import React, { useState } from 'react'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'

import LanguageIcon from '@material-ui/icons/Language'

import TextButton from '../text-button/TextButton'

import useStyles from './LanguageSelector.styles'

import { Helmet } from 'react-helmet'

// LCS: Importa la función - Wave 1
import { sendGAEvent } from '../../../core/utils/gtm';

const LanguageSelector = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const [ isBoxVisible, setIsBoxVisible ] = useState(false)

  const handleClickButton = () => {
    setIsBoxVisible(!isBoxVisible)
  }

  const handleClickLanguage = (lang) => {
    sessionStorage.setItem('lang', lang)

    i18next.changeLanguage(lang)
    
    // LCS: Enviar evento a GA - Wave 1
    sendGAEvent({
      event: 'change_language',
      info:{
        action: 'Change language',
        language: lang,
        reactComponent: 'LanguageSelector.tsx - handleClickLanguage',
      }
    });

    setIsBoxVisible(false)
    window.location.reload()
  }

  return (
    <>
    <div className={classes.container}>
      <TextButton className={classes.button} onClick={handleClickButton}>
        <LanguageIcon className={classes.icon} />

        <div className={classes.label}>{t('header.languageSelector.buttonLabel')}</div>
      </TextButton>

      {
        isBoxVisible &&
          <div className={classes.box}>
            <TextButton
              className={`${classes.languageButton} ${i18next.language === 'en' && 'active'}`}
              color='primary'
              onClick={() => handleClickLanguage('en')}
            >
              <div>{t('header.languageSelector.langs.english')}</div>
            </TextButton>

            <TextButton
              className={`${classes.languageButton} ${i18next.language === 'es' && 'active'}`}
              color='primary'
              onClick={() => handleClickLanguage('es')}
            >
              <div>{t('header.languageSelector.langs.spanish')}</div>
            </TextButton>

            <TextButton
              className={`${classes.languageButton} ${i18next.language === 'gl' && 'active'}`}
              color='primary'
              onClick={() => handleClickLanguage('gl')}
            >
              <div>{t('header.languageSelector.langs.galician')}</div>
            </TextButton>
          </div>
      }
    </div>
    <Helmet
      htmlAttributes={{
        lang : sessionStorage.getItem('lang') || 'es',
      }}
    />
    </>
  )
}

export default LanguageSelector
