import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  label: {
    color: 'rgba(0, 69, 113, 1)'
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
    },'&.hide': {
      display: 'none'
    },
    [theme.breakpoints.down('sm')]: {
      width: '32.5%',
      textAlign: 'center'
    }
  
  },
  menuItem2: {
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
    },'&.hide': {
      display: 'none'
    },
    [theme.breakpoints.down('sm')]: {
      width: '52.5%',
      margin: '5px, 0px',
      textAlign: 'center'
    }
  
  },
  description: {
    marginBottom: 20,
    marginTop: 16,
    color: '#555555',
    lineHeight: '20px'
  },

}))

export default useStyles
