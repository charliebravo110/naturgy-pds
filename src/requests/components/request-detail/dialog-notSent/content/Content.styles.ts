import { makeStyles } from '@material-ui/core/styles'
import { Autorenew } from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({

    closeButton: {
        position: 'absolute',
        top: 18,
        right: 18,
        cursor: 'pointer'
      },
    checkIcon: {
        width: '81px',
        [theme.breakpoints.down('sm')]: {
          width: '66px',
        }
      },

    margin: {
        margin: 'auto',
    },
    gridIcon: {
        display:'flex'
    },
    gridTitle: {
      display:'flex',
      [theme.breakpoints.down('sm')]: {
        fontSize:'10px',
      }
    },
    gridText: {
      display:'flex',
    },
    spanTitle: {
        textAlign:'center',
        color:'#004571',
        width: '75%',
        fontSize:'2.3em',
        marginTop:'18px',
        [theme.breakpoints.down('sm')]: {
          width:'initial',
        }
    },
    spanSubtitle: {
        marginTop:'27px',
        textAlign: 'center',
        fontSize:'1.04em',
        marginBottom: '7px',
        width: '89%',
        color: '#808286'
    },
    container: {
        width: '100%',
        textAlign: 'left'
      },
      label: {
        color: '#004571',
        fontSize: 14,
        marginBottom: 8,
        display:'flex'
      },
      characterCount: {
        backgroundColor: '#F3F7FB',
        width: 220,
        color: '#004571',
        fontSize: '13px',
        padding: '5px 8px',
        borderRadius: '0 0 4px 4px',
        textAlign: 'center',
        marginTop:'10px',
      },
      gridComment: {
        display:'flex',
        marginTop:'13px',
        marginBottom:'11px',
      },
      sentDocuments: {
        marginTop:'40px',
        backgroundColor: '#f7fafd',
        padding:'10px'
      },
      documentBubble: {
        color: '#267cd3',
        display: 'inline-block',
        padding: '7px 20px',
        borderRadius: '20em',
        backgroundColor:'#eff0f0',
        margin: '8px',
      },
      buttons: {
        marginTop:'40px',
      },
      cancelButtonGrid: {
        margin:'10px',
      },
      sentDocumentsGrid: {
        fontWeight:600,
        margin:'10px',
        color: '#023666',
      },
      acceptButtonGrid: {
        fontWeight:600,
        margin:'25px 10px 10px 10px',
        color: '#023666',
      },
      cancelButton: {
        borderColor:'#004571',
        color:'#004571',
        backgroundColor:'white !important'
      },
      acceptButton: {
        color:'white',
        backgroundColor:'#004571 !important',
      },

    dialog: {
        '& .MuiPaper-root.MuiDialog-paper': {
            width: 800,
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