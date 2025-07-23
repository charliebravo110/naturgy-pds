import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  alert: {
    position: 'fixed',
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#F1F5F8',
    justifyContent: 'space-between',
    boxShadow: '0 -2px 2px rgba(0, 0, 0, 0.1)',
    zIndex: 5
  },
  closeIcon: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 10,
    cursor: 'pointer'
  },
  container: {
    alignItems: 'center',
    padding: '14px 28px'
  },
  logo: {
    width: 24,
    height: 24,
    marginRight: 10,
    '& img': {
      width: 24,
      height: 24
    }
  },
  label: {
    color: '#1674D1',
    fontSize: 14,
    textDecoration: 'underline',
    cursor: 'pointer'
  }
}))

export default useStyles
