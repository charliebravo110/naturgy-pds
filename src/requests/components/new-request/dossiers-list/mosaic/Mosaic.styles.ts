import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  stateLabel: {
    color: '#868686',
    width: '100%'
  },
  inputContainer: {
    marginBottom: 30
  },
  label: {
    marginBottom: 7,
    color: '#004571'
  },
  mobileInput: {
    width: '100%'
  },
  input: {
    color: '#868686',
    '& .MuiFormControl-root': {
      backgroundColor: '#FFF'
    },
    '& .MuiInputBase-input': {
      color: '#868686'
    },
    '& .MuiFormHelperText-root': {
      backgroundColor: '#F8F7F6',
      padding: '8px 12px 0',
      margin: 0
    }
  },
  paginationContainer: {
    margin: '20px 0'
  },
  mobileRow: {
    backgroundColor: '#F8F7F5',
    padding: '20px',
    margin: '20px',
  },
  button: {
    margin: 10,
    color: '#004571'
  }
}))

export default useStyles
