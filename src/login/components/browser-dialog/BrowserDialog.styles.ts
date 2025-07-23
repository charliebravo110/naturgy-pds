import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  dialog: {
    '& .MuiPaper-root.MuiDialog-paper': {
      width: 900,
      border: '2px solid rgb(61, 114, 147)'
    },
    '& .MuiDialogContent-root': {
      minHeight: 160,
      padding: '36px 48px'
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
    width: 18,
    cursor: 'pointer'
  },
  naturgyLogo: {
    width: 80,
    marginBottom: 32
  },
  description1: {
    marginBottom: 12
  },
  description2: {
    fontSize: 14,
    marginBottom: 24,
    '& img': {
      height: 16,
      margin: '0 5px 0 3px',
      '&.chrome': {
        marginBottom: -4
      },
      '&.firefox': {
        height: 14,
        marginBottom: -2
      },
      '&.safari': {
        marginBottom: -3
      },
      '&.msie': {
        height: 4,
        marginBottom: 3
      }
    }
  },
  banner: {
    width: '90%'
  },
  button: {
    marginTop: 24
  }
}))

export default useStyles
