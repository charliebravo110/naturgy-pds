import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  mainCont: {
    marginBottom: '30px'
  },
  title: {
    color: '#004571',
    fontWeight: 'bold'
  },
  menu: {
    marginTop: 6,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      justifyContent: 'center'
    }
  },
  menuItem: {
    padding: '7px',
    fontSize: 16,
    border: 'solid 1px #E1E9EE',
    color: '#004571',
    borderRadius: 4,
    cursor: 'pointer',
    marginLeft: 4,
    '&:first-child': {
      marginLeft: 0
    },
    '&.active': {
      fontWeight: 'bold',
      borderColor: '#E57200'
    },
    [theme.breakpoints.down('sm')]: {
      width: '32.5%',
      textAlign: 'center'
    }
  },
  menuItemDisabled: {
    padding: '7px',
    fontSize: 16,
    border: 'solid 1px #E1E9EE',
    color: 'white',
    borderRadius: 4,
    cursor: 'pointer',
    backgroundColor: '#bdbdbd',
    marginLeft: 4,
    '&:first-child': {
      marginLeft: 0
    },
    '&.active': {
      fontWeight: 'bold',
      borderColor: '#E57200'
    },
    [theme.breakpoints.down('sm')]: {
      width: '32.5%',
      textAlign: 'center'
    }
  }
}))

export default useStyles