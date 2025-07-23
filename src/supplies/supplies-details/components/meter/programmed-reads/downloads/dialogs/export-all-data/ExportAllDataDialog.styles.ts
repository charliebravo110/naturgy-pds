import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  dialog: {
    '& .MuiPaper-root.MuiDialog-paper': {
      width: 700,
      border: '2px solid rgb(61, 114, 147)'
    }
  },
  container: {
    position: 'relative',
    padding: 36
  }
}))

export default useStyles
