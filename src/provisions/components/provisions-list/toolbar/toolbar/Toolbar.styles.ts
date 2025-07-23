import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  searchBar: {
    marginBottom: 20,
    marginTop: 5,
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  removeDelegate: {
    color: '#1674D1',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'flex-end',
    cursor: 'pointer',
    '&.disabled': {
      color: '#BBB',
      cursor: 'default'
    },
    '& img': {
      paddingRight: 5,
      paddingBottom: 5
    },
    [theme.breakpoints.down('md')]: {
      marginBottom: 20
    }
  },
  view: {
    marginRight: 10,
    [theme.breakpoints.down('sm')]: {
      marginBottom: 10
    }
  },
  mobileFullWidth: {
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  mobileFullWidth2: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginBottom:'10px'
    }
  },
  exportButton:{
    height: 40,
    marginRight:10
  }
}))

export default useStyles
