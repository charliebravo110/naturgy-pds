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
    textAlign: 'center',
    justifyContent:'center',
    padding: 36,
    [theme.breakpoints.only('xs')]: {
      padding: 0
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
    marginBottom: 24,
    marginTop: 24
  },
  icon: {
    width: 60,
    marginTop: 30
  },
  description: {
    marginBottom: 24,
    
    
  },
  button: {
    margin: 10
  },
  padding: {
    [theme.breakpoints.only('xs')]: {
      paddingLeft: 0,
      paddingRight: 0
    }
  }
}))

export default useStyles
