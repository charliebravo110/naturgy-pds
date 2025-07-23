import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  inputsWrapper: {
    paddingBottom: '30px',
    borderBottom: '2px solid rgb(220, 220, 220)'
  },
  inputTitle: {
    color: 'rgba(0, 69, 113, 1.0)',
    fontSize: '14px',
    marginTop: '20px',
    [theme.breakpoints.up('sm')]: {
      height: '28px',
      display: 'flex',
      alignItems: 'flex-end'
    }
  },
  input: {
    width: '100%',
    backgroundColor: '#FFF',
    '& input, & .MuiSelect-selectMenu': {
      background: '#FFF',
      paddingTop: '15px',
      paddingBottom: '15px'
    }
  },
  inactive: {
    pointerEvents: 'none',
    userSelect: 'none',
    '& p, & label, & .explanation, & .MuiSelect-root.MuiSelect-select': {
      color: 'rgb(220, 220, 220)'
    },
    '& .MuiInputAdornment-positionEnd::after':{
      display: 'none'
    },
    '& fieldset.MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgb(220, 220, 220)',
      color: 'rgb(220, 220, 220)'
    }
  }
}))

export default useStyles
