import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  inputsWrapper: {
    paddingBottom: '30px'
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
  numberExplanation: {
    fontSize: '14px',
    color: 'rgba(0, 69, 113, 1.0)',
    background: 'rgba(236, 240, 243, 1)',
    padding: '5px 10px',
    borderRadius: '5px'
  },
  error: {
    fontSize: '14px',
    color: 'red',
    padding: '5px 10px'
  }
}))

export default useStyles
