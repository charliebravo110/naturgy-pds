import React from 'react'
import { createStyles, Theme, withStyles } from '@material-ui/core/styles'
import Switch from '@material-ui/core/Switch'
import { COLOR_CLIENT_TURQUOISE } from '../../configAndConstants'

const trackColor = '#BFB8AE'
const uncheckedThumbColor = '#979797'

const CustomSwitch = withStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 38,
      height: 18,
      padding: 0,
    },
    switchBase: {
      padding: 0,
      '&$checked': {
        transform: 'translateX(20px)',
        '& + $track': {
          backgroundColor: trackColor,
        },
        '& $thumb': {
          backgroundColor: COLOR_CLIENT_TURQUOISE,
        },
      },
      '&.Mui-disabled': {
        opacity: 0.2,
        '& + $track': {
          backgroundColor: trackColor,
          opacity: 0.2,
        },
        '& + $thumb': {
          opacity: 0.2,
        },
      },
    },
    thumb: {
      width: 18,
      height: 18,
      backgroundColor: uncheckedThumbColor,
      boxShadow: 'none',
    },
    track: {
      borderRadius: 18 / 2,
      backgroundColor: trackColor,
    },
    checked: {},
    focusVisible: {},
  })
)(Switch)

const ModdedSwitch = (props: any) => {
  return <CustomSwitch {...props} />
}

export default ModdedSwitch
