import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  dialog: {
    '& .MuiPaper-root.MuiDialog-paper': {
      width: 780,
      border: '2px solid rgb(61, 114, 147)'
    },
    '& .MuiDialogContent-root': {
      minHeight: 160,
      padding: 36,
      overflow: 'hidden'
    }
  },
  container: {
    position: 'relative',
    textAlign: 'center',
    padding: 36,
    '& p': {
      fontSize: 14,
      '& a': {
        color: '#0066CC'
      }
    }
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
  textParagraph: {
    overflowY: 'auto',
    overflowX: 'hidden',
    maxHeight: 270
  },
  button: {
    marginTop: 24
  }
}))

export default useStyles
