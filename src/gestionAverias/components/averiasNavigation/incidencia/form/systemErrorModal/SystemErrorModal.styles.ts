import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  dialog: {
    '& .MuiPaper-root.MuiDialog-paper': {
      width: 800,
      heigth: 700,
      border: '2px solid rgb(61, 114, 147)'
    },
    '& .MuiDialogContent-root': {
      padding: 48
    }
  },
  modalContainer: {
    position: 'relative',
    padding: 36
  },
  modalText: {
    textAlign: 'center',
    marginBottom: 12
  },
  closeButton: {
    marginTop: -5,
    marginRight: -5,
    padding: '4px 0'
  },
  buttons: {
    [theme.breakpoints.up('sm')] : {
      marginTop: 24
    }
  },
  button: {
    marginTop:'25px'
  },
  title: {
    fontSize: 22,
    color: 'rgba(0, 69, 113, 1)',
    marginTop: '10px'
  },
  icon: {
    width: '60px',
    padding: '5px'
},
  subTitle: {
    fontSize: 17,
    color: '#838383'
  }
}))

export default useStyles