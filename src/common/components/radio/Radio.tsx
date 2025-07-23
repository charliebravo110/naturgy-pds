import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Radio } from '@material-ui/core'

const NaturgyRadio = withStyles({
  root: {
    '&$checked': {
      color: 'rgb(0, 69, 113)',
    }
  },
  checked: {},
})((props) => <Radio color='default' {...props} />)

export default NaturgyRadio