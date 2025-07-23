import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  dialog: {
    '& .MuiPaper-root.MuiDialog-paper': {
      width: 900,
      border: '2px solid rgb(61, 114, 147)'
    },
    '& .MuiDialogContent-root': {
      minHeight: 160,
      padding: '36px 48px',
      [theme.breakpoints.only('xs')]: {
        padding: '36px 32px'
      }
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
  title: {
    color: '#004571',
    fontSize: 24
  },
  contents: {
    textAlign: 'left',
    marginTop: 24,
    [theme.breakpoints.only('xs')]: {
      textAlign: 'center'
    }
  },
  subtitle: {
    color: '#E97000',
    fontSize: 16,
    fontWeight: 'bold'
  },
  pagraphs: {
    marginTop: 12
  },
  pagraph: {
    color: '#004571',
    fontSize: 14,
    marginTop: 12,
    '&:first-child': {
      marginTop: 0
    }
  },
  banner: {
    width: '100%',
    [theme.breakpoints.only('xs')]: {
      marginTop: 15
    }
  },
  button: {
    marginTop: 24
  }
}))

export default useStyles
