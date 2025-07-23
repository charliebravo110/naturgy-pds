import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    background: '#F1F5F8',
    color: '#004571',
    margin: '20px -60px',
    padding: '32px 60px 2px 60px',
    width: 'calc(100% + 144px)'
  },
  title: {
    color: '#004571',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 60
  },
  inputContainer: {
    marginBottom: 30
  },
  lastInputContainer: {
    marginBottom: 40
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 15
  },
  inputLabel: {
    marginBottom: 7,
    color: '#004571'
  },
  stateLabel: {
    color: '#868686'
  },
  input: {
    color: '#868686',
    '& .MuiInputBase-input': {
      color: '#868686',
      backgroundColor: '#FFF'
    }
  },
  checkBox: {
    color: '#004571'
  },
  disabled: {
    color: '#868686'
  },
  marginLeft: {
    marginLeft: 10
  }
}))

export default useStyles