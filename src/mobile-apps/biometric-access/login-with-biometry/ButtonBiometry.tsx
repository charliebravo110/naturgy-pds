import Button from '@material-ui/core/Button'
import React from 'react'
import { useTranslation } from 'react-i18next'
import ico_biometry_fingerprint from '../../../assets/icons/ico_biometry_fingerprint.svg'
import ico_biometry_face from '../../../assets/icons/ico_biometry_face.svg'
import useStyles from './ButtonBiometry.styles'
import { ButtonBiometryProps } from './interfaces'

export default function ButtonBiometry(props: ButtonBiometryProps) {
  const { handleButtonClick, showBtn, disableBtn, iconType } = props
  const classes = useStyles()
  const { t } = useTranslation()

  return !showBtn ? null : (
    <Button
      className={classes.root}
      size={'large'}
      variant={'contained'}
      disabled={disableBtn || false}
      onClick={handleButtonClick}
    >
      <img src={iconType === 'face' ? ico_biometry_face : ico_biometry_fingerprint} alt='biometry-type' />
      {t('mobile-apps.biometric-access.login-button')}
    </Button>
  )
}
