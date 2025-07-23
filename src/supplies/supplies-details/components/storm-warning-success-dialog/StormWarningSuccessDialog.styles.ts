import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  dialog: {
    '& .MuiPaper-root.MuiDialog-paper': {
      width: 600,
      border: '2px solid rgb(61, 114, 147)'
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
    color: 'rgba(0, 69, 113, 1)',
    textAlign: 'center'
  },
  srCode: {
    fontSize: 18,
    color: 'rgba(0, 69, 113, 1)',
    textAlign: 'center',
    marginTop: 10
  },
  button: {
    marginTop: 20
  }
}))

export default useStyles
