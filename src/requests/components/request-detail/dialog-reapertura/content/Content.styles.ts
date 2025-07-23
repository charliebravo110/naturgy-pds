import { makeStyles } from '@material-ui/core/styles'
import { Autorenew } from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: 'absolute',
    top: 18,
    right: 18,
    cursor: 'pointer'
  },
  bellIcon: {
    width: '64px',
    [theme.breakpoints.down('sm')]: {
       width: '55px',
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
      fontSize:'14px',
    }
  },
  gridText: {
    display:'flex',
  },
  color: {
    '& .MuiInputBase-root': {
      color: '#808286',
    }
  },
  spanTitle: {
    fontSize:'1.9em',
    width:'75%',
    textAlign:'center',
    color:'#004571',
    marginTop:'21px',
  },
  spanSubtitle: {
    width: '65%',
    marginTop:'30px',
    textAlign: 'center',
    fontSize:'1.03em',
    marginBottom: '7px',
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
  buttons: {
    marginTop:'40px',
  },
  cancelButtonGrid: {
    margin:'10px',
  },
  acceptButtonGrid: {
    margin:'10px'
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