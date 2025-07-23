import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    height: '100%',
    color: '#787873',
    '& .MuiSelect-root': {
      color: '#787873'
    },
    '& textarea': {
      color: '#787873'
    }
  },
  title: {
    fontSize: '36px',
    color: 'rgba(0, 69, 113, 1)',
    marginBottom: '10px'
  },
  subtitle: {
    fontSize: '17px'
  },
  inputBlock: {
    width: '100%',
    textAlign: 'left'
  },
  label: {
    color: 'rgba(0, 69, 113, 1)',
    fontSize: '17px',
    marginBottom: '10px'
  },
  characterCount: {
    backgroundColor: '#F3F7FB',
    width: '220px',
    color: 'rgba(0, 69, 113, 1)',
    fontSize: '13px',
    padding: '5px 8px',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  button: {
    margin: '10px'
  }
}))

export default useStyles
