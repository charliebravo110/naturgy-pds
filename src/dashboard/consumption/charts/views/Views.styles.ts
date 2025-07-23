import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
      width: '100%',
      justifyContent: 'center'
    },
  menuItem: {
    padding: '12px 20px',
    fontSize: 18,
    color: '#004571',
    cursor: 'pointer',
    '&.active': {
      fontWeight: 'bold',
      width: '33,34',
      textDecorationLine: 'underline',
      color: '#E57200'
    },
    [theme.breakpoints.down('sm')]: {
      width: '33,33%',
      textAlign: 'center'
    }
  }
}))

export default useStyles
