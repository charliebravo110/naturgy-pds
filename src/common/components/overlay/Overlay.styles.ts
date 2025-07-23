import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  overlay: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1
  }
}))

export default useStyles
