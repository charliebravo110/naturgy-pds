import { makeStyles } from '@material-ui/core/styles'
import { Autorenew } from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({

    buttons: {
        justifyContent: 'space-between',
        marginTop: 36
    },
    dialog: {
        '& .MuiPaper-root.MuiDialog-paper': {
            width: 700,
            border: '2px solid rgb(61, 114, 147)'
        },
        '& .MuiDialogContent-root': {
            padding: 48
        }
    },
    dialogContainer: {
        position: 'relative',
        padding: 36
    },
    cancelarImage: {
        position: 'relative',
        marginLeft: 600,
        marginBottom: 5,
    },
    titleCommentDialog: {
        
        fontSize: '2em',
        color: '#004571'
    },
    dialogBody: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    items: {
        minHeight: 110,
        justifyContent: 'center',
        marginTop: 12
      },
      item: {
        alignItems: 'center',
        marginTop: 10
      }
}))

export default useStyles