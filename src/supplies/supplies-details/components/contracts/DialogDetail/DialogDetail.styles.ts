import { makeStyles } from '@material-ui/core/styles'
import { Autorenew } from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({
  dialog: {
    '& .MuiPaper-root.MuiDialog-paper': {
        width: 1010,
        border: '2px solid rgb(61, 114, 147)'
    },
    '& .MuiDialogContent-root': {
        padding: 48,

        [theme.breakpoints.down('sm')]: {
          padding: 22
        }
    }
  },
  dialogContainer: {
    position: 'relative',
    padding: 36
  },
}))

export default useStyles