import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  table: {
    width: '100%',
    minHeight: 62,
    marginTop: 32
  },
  spinner: {
    left: '200%',
    width: '100%',
    position: 'absolute'
  }
}))

export default useStyles
