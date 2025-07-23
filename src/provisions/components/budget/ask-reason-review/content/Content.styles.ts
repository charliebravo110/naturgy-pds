import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'relative',
    padding: '36px 64px'
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
  label2: {
    color: 'rgba(0, 69, 113, 1)',
    fontSize: '17px',
    marginBottom: '10px'
  },
  modalText: {
    textAlign: 'center'
  },
  closeButton: {
    marginTop: -5,
    marginRight: -5,
    padding: '4px 0'
  },
  buttons: {
    [theme.breakpoints.up('sm')] : {
      marginTop: 24
    }
  },
  button: {
    margin: 8
  },
  title: {
    fontSize: 22,
    color: 'rgba(0, 69, 113, 1)',
    marginTop: 8,
    marginBottom: 20
  },
  subTitle: {
    fontSize: 17,
    color: '#838383',
    marginTop: 8
  },
  subtitle2: {
    fontSize: '17px'
  },
  inputBlock: {
    width: '100%',
    textAlign: 'left'
  },
  fileFormatAdvise: {
    marginTop: '7px',
    fontSize: 13,
    color: '#838383',
    fontWeight: 'bold'
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
  buttonContainer: {
    marginLeft: '15px'
  },
  fileError: {
    marginTop: '7px',
    marginBottom: '7px',
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FF0000'
  },
  label: {
    color: '#004571',
    fontSize: 16,
    textAlign: 'left',
    marginBottom: 7
  },
  documentSpacingTop: {
    marginTop: '10px'
  },
  documentSpacingBottom: {
    marginBottom: '10px'
  }
}))

export default useStyles
