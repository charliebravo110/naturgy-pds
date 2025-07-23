import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  searchBar: {
    paddingRight: 8,
    marginBottom: 32,
    marginTop: 10,
    '& .MuiInputLabel-formControl': {
      top: '-3px'
    }
  },
  removeDelegate: {
    color: '#1674D1',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    '&.disabled': {
      color: '#BBB',
      cursor: 'default',
      '& img': {
        filter: 'grayscale(100%)'
      }
    },
    '& img': {
      paddingRight: 5,
      paddingBottom: 5
    },
    [theme.breakpoints.down('md')]: {
      marginBottom: 20
    }
  },
  toolbarRight: {
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%'
    }
  },
  mobileFullWidth2: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginBottom:'10px'
    }
  },
  view: {
    display: 'flex',
    marginRight: 10,
    [theme.breakpoints.down('sm')]: {
      marginBottom: 10
    }
  },
  exportButton:{
    height: 40,
    marginRight:10
  }
}))

export default useStyles
