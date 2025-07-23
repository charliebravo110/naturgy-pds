import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  block: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column'
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
  disabled: {
    color: 'gray'
  },
  inputSearch: {
    width: '100%',
    '& fieldset': {
      border: 'solid 1px #004571 !important',
      borderRadius: '4px 4px 4px 4px'
    },
    '& input': {
      padding: '15px'
    }
  },
  containerMap: {
    width: '100%',
    height: 300,
    border: 0,
    marginTop: 10,
    position: 'relative'
  },
  previewMapContainer: {
    width: 100,
    height: 100,
    borderRadius: 5,
    border: '5px solid #FFF',
    position: 'absolute',
    bottom: 20,
    left: 20,
    cursor: 'pointer',
    '& .esri-ui': {
      visibility: 'hidden'
    }
  },
  previewMapText: {
    top: 5,
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: '-20px',
    position: 'absolute',
    width: '100%',
    zIndex: 1
  },
  linkContainer: {
    margin: '20px 0'
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
    width: '70%',
    marginTop: 30
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
      boxSizing: 'border-box',
      padding: 12
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
    }
  }
}))

export default useStyles
