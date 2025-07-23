import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  dialog: {
    '& .MuiPaper-root.MuiDialog-paper': {
      width: 900,
      border: '2px solid rgb(61, 114, 147)'
    },
    '& .MuiDialogContent-root': {
      minHeight: 160,
      padding: 36
    }
  },
  container: {
    position: 'relative',
    textAlign: 'center',
    padding: 36
  },
  closeButton: {
    position: 'absolute',
    top: 18,
    right: 18,
    cursor: 'pointer'
  },
  title: {
    color: '#004571',
    fontSize: 26,
    marginBottom: 24
  },
  description: {
    marginBottom: 24
  },
  banner: {
    width: '90%'
  },
  button: {
    marginTop: 24
  }
}))

export default useStyles
