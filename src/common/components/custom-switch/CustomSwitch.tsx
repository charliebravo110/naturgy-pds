import React from 'react'
import { useTranslation } from 'react-i18next'

import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Switch from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography'

import useStyles from './CustomSwitch.styles'

const StyledSwitch = withStyles({
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


const CustomSwitch = (props: any) => {
  const classes = useStyles({});
  const {
    value1,
    value2,
    checked
  } = props;
  
  return (
    <Grid container alignItems='center' className={classes.container}>
      <Typography className={!props.disabled ? !checked ? classes.checked : classes.notChecked : classes.disabled}>{value1}</Typography>
      <StyledSwitch {...props} />
      <Typography className={!props.disabled ? checked ? classes.checked : classes.notChecked : classes.disabled}>{value2}</Typography>
    </Grid>
  )
}

export default CustomSwitch;
