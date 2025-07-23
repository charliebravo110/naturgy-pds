import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  loadingContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(255, 255, 255, .8)',
    zIndex: 1000,
    '&.hidden': {
      opacity: 0,
      visibility: 'hidden'
    },
    '&.fixed': {
      position: 'fixed'
    }
  },
  loadingAnimation: {
    position: 'absolute',
    top: 'calc(50% - 32px)',
    left: 'calc(50% - 32px)',
    display: 'block',
    width: 64,
    margin: '0 auto'
  }
}))

export default useStyles
