import React from 'react'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'

import useStyles from './PasswordStrengthMeter.styles'

const PasswordStrengthMeter = (props: any) => {
  const classes = {
    ...useStyles({}),
    parameter: props.className
  }
  const { t } = useTranslation()

  const HIGH_LEVEL = t('common.levels.high')
  const MEDIUM_LEVEL = t('common.levels.medium')
  const SOFT_LEVEL = t('common.levels.soft')

  const PASSWORD_STRENGTHS = [
    {
      label: HIGH_LEVEL,
      minScore: 31,
      maxScore: 100
    },
    {
      label: MEDIUM_LEVEL,
      minScore: 21,
      maxScore: 30
    },
    {
      label: SOFT_LEVEL,
      minScore: 1,
      maxScore: 20
    }
  ]

  const strengthCalculator = () => {
    var intScore = 0
    var passwd = props.password
    var intPasswdLen = passwd.length

    // Verificado de tamaño
    if (intPasswdLen !== 0 && intPasswdLen < 5) {
      intScore += 3
    } else if (intPasswdLen > 4 && intPasswdLen < 8) {
      intScore += 6
    } else if (intPasswdLen > 7 && intPasswdLen < 12) {
      intScore += 12
    } else if (intPasswdLen >= 12) {
      intScore += 18
    }

    // Verificado de al menos una letra minuscula
    if (passwd.match(/[a-z]/)) {
      intScore = intScore + 2
    }

    // Verificado de al menos una letra mayuscula
    if (passwd.match(/[A-Z]/)) {
      intScore = intScore + 6
    }

    // verificado de al menos un numero
    if (passwd.match(/\d+/)) {
      intScore = intScore + 6
    }

    // Verificado de al menos 3 numeros
    if (passwd.match(/(.*[0-9].*[0-9].*[0-9])/)) {
      intScore = intScore + 6
    }

    // Verificado de letras minusculas y mayusculas
    if (passwd.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
      intScore = intScore + 3
    }

    // Verificado de letras y numeros
    if (passwd.match(/([a-zA-Z])/) && passwd.match(/([0-9])/)) {
      intScore = intScore + 3
    }

    // Comprobacion del score total
    const strength = _.find(
      PASSWORD_STRENGTHS,
      (strength) => intScore >= strength.minScore && intScore <= strength.maxScore
    )

    return strength && strength.label
  }

  const res = strengthCalculator()

  const soft = res === SOFT_LEVEL
  const medium = res === MEDIUM_LEVEL
  const hard = res === HIGH_LEVEL

  let softStyle
  let mediumStyle
  let hardStyle

  if (soft) {
    softStyle = classes.soft
  }

  if (medium) {
    softStyle = classes.soft
    mediumStyle = classes.medium
  }

  if (hard) {
    softStyle = classes.soft
    mediumStyle = classes.medium
    hardStyle = classes.hard
  }

  return (
    <Grid container className={classes.parameter} alignItems='center' spacing={1}>
      <Grid item className={classes.boxes}>
        <Grid container alignItems='center'>
          <Box className={`${classes.box} ${softStyle}`} />

          <Box className={`${classes.box} ${softStyle}`} />

          <Box className={`${classes.box} ${mediumStyle}`} />

          <Box className={`${classes.box} ${mediumStyle}`} />

          <Box className={`${classes.box} ${hardStyle}`} />
        </Grid>      
      </Grid>

      <Grid item className={classes.info}>
        {`${t('signUp.passwordStrengthMeter.passwordSecurity')} `}
        (
          <label className={classes.label}>
            {res ? res : SOFT_LEVEL}
          </label>
        )
      </Grid>
    </Grid>
  )
}

export default PasswordStrengthMeter
