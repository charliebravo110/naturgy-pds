import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'

const textColor = 'rgba(0, 69, 113, 1)'
const inputOutlineColor = 'rgba(0, 69, 113, 0.5)'

const NaturgySelect = withStyles({
  root: {
    '& .MuiSelect-root.MuiSelect-select': {
      paddingRight: '14px'
    },
    '& label.MuiFormLabel-root': {
      fontSize: '14px'
    },
    '& .MuiSelect-icon': {
      display: 'none'
    },
    '& .MuiOutlinedInput-adornedEnd': {
      paddingRight: 0
    },
    '& label.Mui-focused': {
      color: textColor
    },
    '& .Mui-disabled': {
      opacity: .7,
      filter: 'grayscale(1)',
      '& img': {
        opacity: .4
      }
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: inputOutlineColor
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: inputOutlineColor
      },
      '&:hover fieldset': {
        borderColor: inputOutlineColor
      },
      '&.Mui-focused fieldset': {
        borderColor: inputOutlineColor
      }
    },
    '& .MuiInputAdornment-positionEnd': {
      marginLeft: 0,
      marginRight: '5px',
      position: 'absolute',
      right: '7px',
      width: '20px',
      height: '5px',
      cursor: 'pointer',
      pointerEvents: 'none',
      '& img': {
        width: '100%'
      }
    }
  }
})(TextField)

export default NaturgySelect
