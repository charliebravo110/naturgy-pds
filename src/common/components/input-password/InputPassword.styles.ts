import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  icon: {
    color: 'rgba(0, 69, 113, 0.75)',
    '&:hover': {
      color: 'rgba(0, 69, 113, 1)'
    }
  }
}))

export default useStyles
