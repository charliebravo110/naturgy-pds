import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  modalContainer: {
        border: '2px solid rgb(61, 114, 147)',
        outline: 'none'
      }, 
  dialog: {
    '& .MuiPaper-root.MuiDialog-paper': {
      width: 800,
      border: '2px solid rgb(61, 114, 147)'
    },
    '& .MuiDialogContent-root': {
      minHeight: 160,
      padding: 36
    }
  }
}))

export default useStyles
