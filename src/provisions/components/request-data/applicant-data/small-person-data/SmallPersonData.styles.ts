import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  inputContainer: {
    marginBottom: 30
  },
  label: {
    marginBottom: 7,
    color: '#004571'
  },
  stateLabel: {
    color: '#868686'
  },
  input: {
    color: '#868686',
    '& .MuiSelect-root': {
      color: '#868686'
    }
  },
  marginLeft: {
    marginLeft: 10
  },
  checkBoxWrapper: {
    background: '#F1F5F8',
    color: '#004571',
    margin: '0 -72px',
    marginBottom: 25,
    padding: '20px 77px',
    width: 'calc(100% + 144px)'
  },
  checkBox: {
    marginRight: 60
  }
}))

export default useStyles