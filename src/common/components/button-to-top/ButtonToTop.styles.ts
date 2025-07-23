import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  button: {
    position: 'fixed',
    right: 20,
    bottom: -60,
    backgroundColor: '#E5EFF9',
    padding: '12px 16px 16px',
    borderRadius: 2,
    cursor: 'pointer',
    zIndex: 1000,
    transition: 'bottom 0.4s ease-out 0s',
    '& img': {
      width: 16
    },
    '&.visible': {
      bottom: 20
    },
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  }
}))

export default useStyles
