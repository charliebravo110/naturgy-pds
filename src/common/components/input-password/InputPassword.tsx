import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'

import useStyles from './InputPassword.styles'
import Input from '../input/Input'

const InputPassword = (props: any) => {
  const [showPassword, setShowPassword] = useState(false)
  const classes = useStyles({})
  const { t } = useTranslation()

  const inputProps = {
    endAdornment: (
      <InputAdornment position='end'>
        <IconButton
          className={classes.icon}
          edge='end'
          aria-label={t('login.InputPassword.label')}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    )
  }

  return (
    <Input
      type={showPassword ? 'text' : 'password'}
      InputProps={inputProps}
      {...props}
    />
  )
}

export default InputPassword
