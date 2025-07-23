import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  dialog: {
    '& .MuiPaper-root.MuiDialog-paper': {
      width: 700,
      border: '2px solid rgb(61, 114, 147)'
    },
    '& .MuiDialogContent-root': {
      minHeight: 160,
      padding: 36
    }
  },
  container: {
    position: 'relative',
    padding: 36
  },
  closeButton: {
    position: 'absolute',
    top: 18,
    right: 18,
    cursor: 'pointer'
  },
  content: {
    paddingTop: 24
  },
  title: {
    fontSize: 22,
    color: 'rgba(0, 69, 113, 1)'
  },
  subtitle: {
    fontSize: 17,
    color: '#838383'
  }
}))

export default useStyles