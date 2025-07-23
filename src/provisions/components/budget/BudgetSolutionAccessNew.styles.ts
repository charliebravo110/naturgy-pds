import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    justifyContent: 'center'
  },
  sentDocumentAdviseContainer: {
    backgroundColor: '#F2F5F8',
    marginTop: 20,
    padding: '15px',
    borderRadius: '5px',
    fontSize: '16px'
  },
  sentDocumentAdviseTitle: {
    fontWeight: 'bold',
    color: '#256094'
  },
  title: {
    color: '#004571',
    fontSize: 36,
    margin: '26px 0 46px',
    textAlign: 'center'
  },
  block: {
    padding: '20px 80px',
    border: '1px solid #E3EBEF',
    textAlign: 'center',
    [theme.breakpoints.down('sm')] : {
      padding: '10px 10px'
    }
  },
  info: {
    color: '#2C648A',
    marginBottom: '20px'
  },
  budgetTitle: {
    color: '#2C648A',
    fontWeight: 'bold',
    fontSize: 26,
    marginRight: '10px'
  },
  date: {
    color: '#2C648A',
    marginBottom: 10
  },
  budget: {
    color: '#2C648A',
    fontSize: 24
  },
  iva: {
    color: '#2C648A',
    fontWeight: 'bold'
  },
  advise: {
    color: '#B0B0B0',
    alignSelf: 'center',
    marginTop: 32
  },
  adviseBlock: {
    alignSelf: 'center',
    margin: '15px 0'
  },
  downloadBlock: {
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20
  },
  downloadBlockIE11: {
    [theme.breakpoints.only('xs')]: {
      display: 'block'
    }
  },
  download: {
    display: 'flex',
    fontSize: 16,
    color: '#3B8AD8',
    cursor: 'pointer',
    '&.disabled': {
      cursor: 'default',
      filter: 'grayScale(1)'
    },
    [theme.breakpoints.only('xs')]: {
      marginBottom: 15
    }
  },
  downloadIcon: {
    width: 25
  },
  downloadText: {
    textAlign: 'left',
    marginLeft: 15
  },
  buttons: {
    marginTop: 32
  },
  buttons2: {
    marginTop: 32
  },  
  button: {
    margin: 10
  }
}))

export default useStyles
