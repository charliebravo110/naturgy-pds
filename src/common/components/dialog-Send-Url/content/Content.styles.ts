import { makeStyles } from '@material-ui/core/styles'
import { Autorenew } from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({

    header: {
      backgroundColor:'#e57200',
      padding:'12px',
      borderRadius:'0% 0% 3% 3%',
    },
    headerTitle: {
      color:'white',
      marginLeft:'10px',
      fontSize:'1.1em'
    },
    closeButton: {
      position: 'absolute',
      right: 18,
      cursor: 'pointer',
      width:'3.9%',
      top:'17px',
      [theme.breakpoints.down('sm')]: {
        width:'6%',  
      }
    },
    chainIcon: {
      width:'6.3%',
      transform:'rotate(130deg)',
      filter: 'invert(1) brightness(2)',
      [theme.breakpoints.down('sm')]: {
        width:'9.3%',  
      }

    },
    inputV2: {
      width: '95%',
      fontSize: '14px',
      marginTop:'15px',
      '& input, & .MuiSelect-selectMenu': {
        background: '#FFF',
        paddingTop: '15px',
        paddingBottom: '15px'
      }
    },
    radiobtn: {
      margin: '6px 0px 0px 9px',
    },
    radiotext: {
      display:'flex',
      marginLeft:'5px',
      color:'#438eda',
    },
    radioGroup:{
      marginTop:'5px'
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
    divider: {
      marginTop: '14px'
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
      color:'#004571',
      width: '75%',
      fontSize:'1.07em',
      marginTop:'10px',
      marginLeft:'10px',
      [theme.breakpoints.down('sm')]: {
        width:'initial',
        fontSize:'1.6em',
      }
    },
    spanTitleSelect: {
      color:'#004571',
      fontSize:'1em',
      marginLeft:'9px',
      marginTop:'14px',
      marginBottom:'-12px',
    },
    spanTitleStep2: {
      color:'#004571',
      fontSize:'1.35em',
      fontWeight:700
    },
    gridTitleStep3: {
      textAlign:'center'
    },
    gridTitleStep4: {
      margin: '0px 13%',
      textAlign:'center'
    },
    spanTitleStep3: {
      color:'#004571',
      fontSize:'1.3em',
    },
    GridStep2: {
      backgroundColor:'#f2f6f8',
      padding:'125px 17px 125px 17px',
      margin:'17px',
      [theme.breakpoints.down('sm')]: {
        padding:'80px 17px 125px 17px',
      }
    },
    GridStep3: {
      backgroundColor:'#f2f6f8',
      padding:'135px 17px 135px 17px',
      margin:'17px'
    },
    GridStep4: {
      backgroundColor:'#f2f6f8',
      padding:'125px 17px 125px 17px',
      margin:'17px',
      [theme.breakpoints.down('sm')]: {
        padding:'80px 17px 125px 17px',
      }
    },
    spanTextStep2: {
      color:'#51809f',
      marginLeft:'5px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '0.92em'
      }
    },
    spanTextStep22: {
      color:'#51809f',
      marginLeft:'5px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '0.92em',
        marginLeft:'0px',
      }
    },
    
    genericMarginTop: {
      marginTop:'8px'
    },
    checkIconPng: {
      width:'12px'
    },
    mailIcon: {
      width: '17px'
    },
    fullDivider: {
      marginTop:'14px',
      marginBottom:'14px'
    },
    avisoOk: {
      width:'66px',
      margin:'0px 0px 5px 37%',
      [theme.breakpoints.down('sm')]: {
        margin:'0px 0px 5px 33%',
      }
    },
    radioButton: {
      width: 17,
      height: 17,
      boxSizing: 'border-box',
      backgroundColor: '#FFF',
      padding: 3,
      border: 'solid 1px #C4D2DA',
      borderRadius: '50%',
      cursor: 'pointer',
      float: 'left',
      '&.active::before': {
        display: 'block',
        width: '100%',
        height: '100%',
        backgroundColor: '#0066cc',
        content: '""',
        borderRadius: '50%',
        cursor: 'default'
      }
    },
    buttons: {
      
    },
    cancelButtonGrid: {
      margin:'10px',
    },
    acceptButtonGrid: {
      fontWeight:600,
      margin:'16px 10px 10px 10px',
      color: '#023666',
    },
    acceptButtonGrid1: {
      fontWeight:600,
      margin:'16px 48px 10px 10px',
      color: '#023666',
      [theme.breakpoints.down('sm')]: {
        margin:'16px 30px 10px 10px',
      }
    },
    acceptButtonGridStep4: {
      fontWeight:600,
      margin:'16px 10px 10px 5%',
      color: '#023666',
    },
    cancelButtonM: {
      borderColor:'#004571',
      color:'#004571',
      backgroundColor:'white !important',
      minWidth: '9.5rem !important',
      minHeight: '3.15rem !important',
      [theme.breakpoints.down('sm')]: {
        minWidth: '7.5rem !important',
      }
    },
    acceptButtonM: {
      color:'white',
      backgroundColor:'#004571 !important',
      minWidth: '9.5rem !important',
      minHeight: '3.15rem !important',
      [theme.breakpoints.down('sm')]: {
        minWidth: '7.5rem !important',
      }
    },
    buttonStep34: {
      color:'white',
      backgroundColor:'#004571 !important',
      minWidth:'20rem !important',
      [theme.breakpoints.down('sm')]: {
        minWidth:'16rem !important',
      }
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
}))

export default useStyles