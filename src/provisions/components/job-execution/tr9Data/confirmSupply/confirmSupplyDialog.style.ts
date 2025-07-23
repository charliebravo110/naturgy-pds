import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  dialog1: {
    '& .MuiPaper-root.MuiDialog-paper': {
        width: 800,
        border: '2px solid rgb(61, 114, 147)'
    },
    '& .MuiDialogContent-root': {
        padding: 48,
        
        [theme.breakpoints.down('sm')]: {
          padding: 22
        }
    }
  },
  dialog2: {
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
  closeButton: {
    position: 'absolute',
    top: 13,
    right: 13,
    cursor: 'pointer',
    width: 14
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

  gridText: {
    display:'flex',
    fontWeight: 600,
    textAlign: 'center',
    color: '#9b9a9a',
    [theme.breakpoints.down('sm')]: {
        fontSize:'16px',
      }
  },
  spanTitle: {
      textAlign:'center',
      color:'#004571',
      width: '75%',
      fontSize:'1.7em',
      marginBottom:'18px',
      [theme.breakpoints.down('sm')]: {
        width:'initial',
        fontSize:'1.3em',
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
  
  

  cancelarImage: {
      position: 'relative',
      marginLeft: 600,
      marginBottom: 5,
  },

  buttons: {
    display: 'flex',
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: '10px',
    flexDirection: 'row',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column-reverse',
      flexWrap: 'wrap', 
    },
  },
  buttonGrid: {
    textAlign: 'center',
    margin: 10,
  },
  cancelButton: {
    border: '1px solid rgb(0, 69, 113)',
    color: 'rgb(0, 69, 113)',
    backgroundColor: '#004571',
    borderRadius: '4px',
    width: '100%', 
    [theme.breakpoints.down('sm')]: {
        width: '85%', 
      },
  },
  acceptButton: {
    color: 'white',
    backgroundColor: '#004571 !important',
    borderRadius: '4px',
    width: '100%', 
    [theme.breakpoints.down('sm')]: {
        width: '85%', 
      },
  },

  paragraph: {
    textAlign: 'center', 
    whiteSpace: 'normal', 
    lineHeight: '1.5', 
    wordBreak: 'break-word', 
    fontSize: '1.7rem',
    [theme.breakpoints.down('sm')]: {
        fontSize: '1.2rem',
      },
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