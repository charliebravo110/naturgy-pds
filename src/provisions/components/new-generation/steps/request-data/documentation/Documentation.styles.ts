import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    justifyContent: 'center'
  },
  title: {
    color: '#004571',
    fontSize: 30,
    textAlign: 'center',
    margin: '20px 0 20px'
  },
  description: {
    color: '#838383',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 15
  },
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: '40px 0',
    [theme.breakpoints.down('md')]: {
      textAlign: 'center'
    }
  },
  img: {
    width: 140,
    alignItems: 'center',
    [theme.breakpoints.only('md')]: {
      width: 'calc(100% - 48px)',
      marginLeft: 0
    },
    [theme.breakpoints.down('md')]: {
      marginBottom: 32
    }
  },
  typologyAndNetwork: {
    color: '#E97000',
    fontWeight: 'bold',
    marginBottom: 15
  },
  innerBox: {
    position: 'relative',
    width: '70%'
  },
  innerItem: {
    height: '100%',
    boxSizing: 'border-box',
    backgroundColor: '#F2F1EF',
    padding: 26
  },
  documentationFor: {
    color: '#004571',
    fontSize: 14,
    marginBottom: 6
  },
  procedure: {
    color: '#004571',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 18
  },
  text: {
    color: '#838383',
    fontSize: 14,
    marginBottom: 18
  },
  documentationList: {

  },
  pdfLink: {
    color: '#004571!important',
    cursor: 'pointer'
  },
  documentationItem: {
    fontSize: 14,
    color: '#004571',
    marginTop: 4,
    marginBottom: '0.625rem',
    '&:first-child': {
      marginTop: 0
    },
    '& h1': {
      fontSize: 20,
      fontWeight: 'bold',
      marginRight: 6
    },
    '& img': {
      display: 'inline-block',
      verticalAlign: 'middle'
    },
    '& u': {
      color: '#555555',
      textDecoration: 'underline dotted #004571'
    },
    '& span': {
      color: '#555555'
    },
    '& a': {
      color: '#004571',
      textDecoration: 'none'
    }
  },
  accumulationNote: {
    margin: '10px 0'
  },
  buttons: {
    justifyContent: 'center',
    marginTop: 40,
    '& button': {
      margin: '0 16px'
    },
    [theme.breakpoints.only('xs')]: {
      '& button:first-child': {
        marginBottom: 16
      }
    }
  }
}))


export default useStyles
