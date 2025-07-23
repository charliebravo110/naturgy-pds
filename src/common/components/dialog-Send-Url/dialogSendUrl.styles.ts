import { makeStyles } from '@material-ui/core/styles'
import { Autorenew } from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({
  dialog: {
    '& .MuiPaper-root.MuiDialog-paper': {
        width: 350,
        border: '2px solid rgb(61, 114, 147)'
    },
   
    '& .MuiDialog-scrollPaper': {
      'justify-content':'end',
     },

    '& .MuiDialogContent-root': {
        padding: '0px 0px 0px 0px',
        overflow:'hidden',
      
        [theme.breakpoints.down('sm')]: {
         
        }
    }
  },
  dialogContainer: {
    position: 'relative',
    padding: 36
  },
}))

export default useStyles