import React from 'react'
import { useTranslation } from 'react-i18next'

import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Switch from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography'

import useStyles from './Switch.styles'

const CustomSwitch = withStyles({
  root: {
    height: '40px'
  },
  switchBase: {
    color: '#009AA6',
    '&$checked': {
      color: '#009AA6',
    },
    '&.Mui-disabled': {
      color: '#BDBDBD !important'
    },
    '&.Mui-checked:hover': {
      backgroundColor: '#009aa647'
    },
    '&$checked + $track': {
      backgroundColor: '#DFDBD6',
    },
    '&$focusVisible': {
      backgroundColor: '#009AA6'
    },
    width: 21,
    height: 21
  },
  thumb: {
    width: 18,
    height: 15,
    borderRadius: '40%'
  },
  checked: {
    '&.Mui-disabled + $track': {
      backgroundColor: '#000 !important'
    }
  },
  focusVisible: {},
  track: {
    backgroundColor: '#524b4bcc'
  },
})(Switch)

const NaturgySwitch = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  return (
    <Grid container alignItems='center' className={classes.container}>
      <Typography>{t('common.buttons.yes')}</Typography>
      <CustomSwitch {...props} />
      <Typography>{t('common.buttons.no')}</Typography>
    </Grid>
  )
}

export default NaturgySwitch
