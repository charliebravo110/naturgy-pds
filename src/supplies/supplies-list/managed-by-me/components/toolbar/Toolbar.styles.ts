import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  toolbar: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingRight: 8,
    marginTop: 10
  },
  toolbarRight: {

    [theme.breakpoints.down('xs')]: {
      width: '100%'
    }
  },
  checkTxtCont: {
    marginBottom: '10px'
  },
  checkboxCont: {
    marginRight: '5px',
  },
  margin: {
    backgroundColor: '#eceff3',
    padding: '15px',
    borderRadius: '5px',
    display:'none',
    visible:{
      display:'block'
    },
    [theme.breakpoints.down('xs')]: {
      marginBottom:50
    } 
  },
  visible:{
    display:'block'
  },
  action: {
    color: '#1674D1',
    fontSize: 14,
    marginLeft: 18,
    cursor: 'pointer',
    '&.disabled': {
      color: '#BBB',
      cursor: 'default'
    },
    '&.marginBottom': {
      marginBottom: '10px'
    }
  },
  text1: {
    color: '#1674D1',
    fontSize: 14,
    marginLeft: 18,
    cursor: 'pointer',
    '&.disabled': {
      color: '#BBB',
      cursor: 'default'
    }
  },
  mobileFullWidth2: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginBottom:'10px'
    }
  },
  selectedItemsCounter: {
    display: 'block',
    backgroundColor: '#E5ECF0',
    color: '#004571',
    whiteSpace: 'pre-wrap',
    textAlign: 'center',
    padding: 12,
    borderRadius: 4,
    marginBottom: 5
  },
  exportButton:{
    height: 40,
    marginRight:10
  }
}))

export default useStyles
