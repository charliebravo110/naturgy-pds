import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: 20,
    '& canvas': {
      width: '100% !important'
    }
  }
}))

export default useStyles
