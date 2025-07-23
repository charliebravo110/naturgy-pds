import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: 32
  },
  description: {
    color: '#004571',
    fontWeight: 'bold'
  },
  descriptionMargin: {
    color: '#004571',
    fontWeight: 'bold',
    marginTop: '30px'
  },
  inputs: {
    width: 740,
    justifyContent: 'space-between',
    margin: '24px auto 0',
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  label: {
    color: '#004571',
    fontSize: 14,
    marginBottom: 8
  },
  characterCount: {
    backgroundColor: '#F3F7FB',
    width: 220,
    color: '#004571',
    fontSize: '13px',
    padding: '5px 8px',
    borderRadius: '0 0 4px 4px',
    textAlign: 'center'
  },
  titleLocation: {
    fontSize: '30px',
    color: '#004571',
    textAlign: 'center',
    margin: '20px 0 20px'
  },
  textLocation: {
    fontSize: 15,
    color: '#838383',
    textAlign: 'center',
    boxSizing: 'border-box',
    marginBottom: 25
  },
  textLink: {
    color: '#1674D1',
    cursor: 'pointer',
    textDecoration: 'underline'
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
  },
  containerInput: {
    margin: '30px auto 0',
    justifyContent: 'center',
    [theme.breakpoints.up('sm')]: {
      width: '100%'
    }
  },
  textBlue: {
    display: 'block',
    fontSize: 14,
    color: '#004571'
  },
  selectContainer: {
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
  inputSearch: {
    width: '100%',
    '& fieldset': {
      border: 'solid 1px #004571 !important',
      borderRadius: '4px 4px 4px 4px'
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
  imgAlert: {
    width: 25,
    margin: '5px 16px 0 0',
  },
  containerData: {
    display: 'block',
    marginTop: 25,
    marginBottom: 10,
    [theme.breakpoints.up('sm')]: {
      width: '100%'
    }
  },
  textBlueBold: {
    fontSize: 14,
    color: '#004571',
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 10
  },
}))

export default useStyles
