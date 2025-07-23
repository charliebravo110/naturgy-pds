import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  searchIcon: {
    width: '20px',
    marginRight: '10px'
  },
  buttonContent: {
    display: 'flex'
  },
  searchButton: {
    '& span:first-of-type': {
      height: '55px',
      width: '145px',
      [theme.breakpoints.down(1150)]: {
        width: '120px'
      },
      [theme.breakpoints.only('xs')]: {
        width: 'auto'
      }
    },
    '& span:last-of-type': {
      height: '0'
    }
  },
  inputContainer: {
    margin: '25px 0',
    '& textarea': {
      color: '#838383'
    }
  },
  buttonContainer: {
    marginLeft: '15px'
  },
  label: {
    color: '#004571',
    fontSize: 16,
    textAlign: 'left',
    marginBottom: 7
  },
  fileFormatAdvise: {
    marginTop: '7px',
    fontSize: 13,
    color: '#838383',
    fontWeight: 'bold'
  },
  fileError: {
    marginTop: '7px',
    marginBottom: '7px',
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FF0000'
  },
  characterCountLabel: {
    backgroundColor: '#F3F7FB',
    width: '220px',
    color: 'rgba(0, 69, 113, 1)',
    fontSize: '13px',
    padding: '5px 8px',
    textAlign: 'center',
  },
  characterCount: {
    fontWeight: 'bold'
  }
}))

export default useStyles
