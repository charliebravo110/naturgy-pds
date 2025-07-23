import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  block: {
    display: 'block'
  },
  container: {
    padding: '10px 0 10px',
    justifyContent: 'center'
  },
  title: {
    fontSize: '30px',
    color: '#004571',
    textAlign: 'center',
    margin: '20px 0 20px'
  },
  text: {
    fontSize: 15,
    color: '#838383',
    textAlign: 'center',
    boxSizing: 'border-box',
    marginBottom: 25
  },
  containerMap: {
    position: 'relative'
  },
  containerLocation: {
    margin: '0 auto',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputContainer: {
    marginRight: 12,
    [theme.breakpoints.only('xs')]: {
      marginRight: 0
    }
  },
  locationButton: {
    marginLeft: 12,
    [theme.breakpoints.only('xs')]: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: 24,
      marginLeft: 0
    }
  },
  textLink:{
    color: '#1674D1',
    cursor: 'pointer',
    textDecoration: 'underline'
  },
  inputSearch: {
    width: '100%',
    '& fieldset': {
      border: 'solid 1px #004571 !important',
      borderRadius: '4px 4px 4px 4px'
    }
  },
  map: {
    width: '100%',
    height: 490,
    border: 0,
    marginTop: 35
  },
  containerResult: {
    margin: '35px auto 0',
    backgroundColor: '#F2F1EF',
    textAlign: 'center',
    padding: '9px 0',
    '& span': {
      position: 'relative',
      top: -6,
      color: '#004571',
      fontWeight: 'bold'
    },
    [theme.breakpoints.up('sm')]: {
      width: '100%'
    }
  },
  containerData: {
    display: 'block',
    marginTop: 25,
    marginBottom: 10,
    [theme.breakpoints.up('sm')]: {
      width: '100%'
    }
  },
  imgAlert:{
    width: 25,
    margin: '5px 16px 0 0',
  },
  textBlueBold:{
    fontSize: 14,
    color: '#004571',
    fontWeight: 'bold',
    marginTop:25,
    marginBottom: 10
  },
  textBlue:{
    display: 'block',
    fontSize: 14,
    color: '#1674D1'
  },
  containerInput: {
    margin: '30px auto 0',
    justifyContent: 'center',
    [theme.breakpoints.up('sm')]: {
      width: '100%'
    }
  },
  selectContainer:{
    marginTop: 6
  },
  inputAddress: {
    display: 'block',
    marginTop: 6,
    '& fieldset': {
      border: 'solid 1px #004571 !important',
      borderRadius: '4px 4px 4px 4px'
    },
    '& input': {
      height: 'auto',
      boxSizing: 'border-box'
    },
    '& .MuiInputBase-root': {
      display: 'flex'
    },
    '& .makeStyles-inputAddress-430': {
      display: 'flex'
    },
    '& .MuiSvgIcon-root': {
      fill: '#004571',
      position: 'absolute'
    }
  },
  searchIcon: {
    '& .MuiSvgIcon-root': {
      fill: '#004571',
      position: 'absolute'
    }
  },
  hr: {
    width: '100%',
    marginTop: 45,
    marginBottom: 45,
    border: '1px solid',
    color: '#C0C0C0'
  },
  button: {
    marginTop: 35,
    justifyContent: 'center',
    '& button': {
      margin: '0 16px'
    },
    [theme.breakpoints.only('xs')]: {
      '& button:first-child': {
        marginBottom: 16
      }
    }
  },
  containerWithoutCR: {
    justifyContent: 'center',
    marginBottom: 16
  },
  checkboxWithoutCR: {
    paddingLeft: 6
  },
  checkboxLabelWithoutCR: {
    color: '#0066CC',
    fontSize: 14,
    marginLeft: 4
  }
}))

export default useStyles
