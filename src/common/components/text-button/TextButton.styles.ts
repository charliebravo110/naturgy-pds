import { withStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'

const TextButtonStyle = withStyles({
  root: {
    boxShadow: 'none',
    textTransform: 'none',
    color: '#6AA1D8',
    fontSize: 14,
    '&:hover': {
      boxShadow: 'none'
    }
  }
})(Button)

export { TextButtonStyle }
