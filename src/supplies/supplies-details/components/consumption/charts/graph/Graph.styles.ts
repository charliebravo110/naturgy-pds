import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: 50,
    '& canvas': {
      width: '100% !important'
    }
  }
}))

export default useStyles
