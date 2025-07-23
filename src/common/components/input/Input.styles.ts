import { withStyles } from '@material-ui/core/styles'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'

const textColor = 'rgba(0, 69, 113, 1)'
const inputOutlineColor = 'rgba(0, 69, 113, 0.5)'

const NaturgyInput = withStyles({
  root: {
    textAlign: 'left',
    textOverflow: 'ellipsis',
    '& label': {
      fontFamily: '"Arial", sans-serif'
    },
    '& input': {
      fontFamily: '"Arial", sans-serif'
    },
    '& .Mui-disabled': {
      filter: 'grayscale(1)'
    },
    '& label.Mui-focused': {
      color: textColor
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
    '& .MuiInputAdornment-root': {
      '& img': {
        height: 20,
        width: 20,
        flexBasis: 'auto'
      }
    }
  }
})(TextField)

export { NaturgyInput }


const useStyles = makeStyles((theme) => ({
  noLabel: {
    '& legend': {
      width: 'auto !important'
    }
  }
}))

export { useStyles }
