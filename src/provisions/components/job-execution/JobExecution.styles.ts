import { makeStyles, withStyles } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell'
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import colors from '../../../assets/colors/colors';


const useStyles = makeStyles((theme) => ({
  documentIcon: {
    textAlign: 'center',
    width: 40,
    height: 33,
    padding: '20px 60px',
  },
  container: {
    justifyContent: 'center'
  },
  tableRow: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column'
    }
  },
  tableBodyRow: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column'
    }
  },
  download: {
    display: 'flex',
    fontSize: 16,
    color: '#3B8AD8',
    cursor: 'pointer',
    '&.disabled': {
      filter: 'grayscale(1)',
      cursor: 'default'
    }
  },
  downloadIcon: {
    width: 25
  },
  downloadText: {
    textAlign: 'left',
    marginLeft: 15
  },
  suppliesTable: {
    marginTop: 20,
    borderRadius: 4,
    overflow: 'hidden',
    // '& .MuiTableCell-root:last-child': {
    //   [theme.breakpoints.up('sm')]: {
    //     paddingRight: '60px'
    //   }
    // }
    maxWidth: '100%'
  },
  title: {
    color: '#004571',
    fontSize: 36,
    margin: '26px 0 46px',
    textAlign: 'center'
  },
  noJobExecutionContainer: {
    padding: '0px',
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      padding: '16px 0'
    }
  },
  inner: {
    display: 'block'
  },
  innerMargin: {
    display: 'block',
    marginTop: '20px'
  },
  Containercups: {
    padding: '30px 72px',
    margintop: 40,
    boxShadow: '0 0 2px #868686',
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      padding: '20px 36px'
    }
  },
  noJobExecutionTitle: {
    fontSize: 26,
    color: '#004571'
  },
  confirmButton: {
    marginTop: '10px',
  },
  marginBottomLi: {
    textAlign: 'center',
    justifyContent: 'center',
    marginBottom: '20px'
  },
  maxPowerTitle: {
    fontWeight: 'bold',
    color: '#004571',
    marginBottom: '10px'
  },
  maxPowerDescription: {
    color: '#004571'
  },
  extensionRightsTitle: {
    marginTop: '10px',
    fontWeight: 'bold',
    color: '#004571',
    marginBottom: '10px'
  },
  extensionRightsDescription: {
    color: '#004571'
  },
  messageTr9: {
    fontSize: 26,
    color: '#004571',
    marginLeft: '20px',
    marginRight: '20px',
    marginBottom: '20px',
    [theme.breakpoints.down('md')]: {
      textAlign:'center',
      //maxWidth:'75%'
    },
  },
  messageTr9NoBottomMargin: {
    fontSize: 26,
    color: '#004571',
    marginLeft: '20px',
    marginRight: '20px',
  },
  messageBoldTr9: {
    fontWeight: 'bold',
    fontSize: 26,
    marginTop: '10px',
    marginLeft: '20px',
    marginRight: '20px',
    marginBottom: '20px',
    color: '#004571'
  },
  whiteContainerTr9: {
    padding: '30px 72px',
    boxShadow: '0 0 2px #868686',
    textAlign: 'center',
    marginTop: '40px',
    [theme.breakpoints.down('sm')]: {
      padding: '20px 36px'
    }
  },
  whiteResponseBlock: {
    backgroundColor: '#fff',
    textAlign: 'center',
    marginTop: '10px',
    paddingBlock: '15px',
    marginInline: 0
  },
  whiteResponseBlockText: {
    margin: '8px auto',
    fontSize: '16px',
    color: 'rgba(0, 69, 113, 1.0)',
    textAlign:'center',
    paddingInline: 8
  },
  whiteResponseBlockTextBold: {
    margin: '8px auto',
    fontSize: '16px',
    color: 'rgba(0, 69, 113, 1.0)',
    textAlign:'center',
    fontWeight: 'bold'
  },
  message: {
    fontSize: 18,
    marginTop: '10px',
    color: '#004571',
    paddingInline: 24,
    [theme.breakpoints.down('md')]: {
      paddingInline: 0
    }
  },
  messageBold: {
    fontWeight: 'bold',
    fontSize: 26,
    margintop: 40,
    color: '#004571'
  },
  noJobExecutionTitle2: {
    fontSize: 16,
    color: '#FF0000'
  },
  noJobExecutionTitle3: {
    fontSize: 16,
    color: '#000000'
  },
  icon: {
    color: '#004571',
    width: 10,
    cursor: 'pointer'
  },
  iconSupply:{
    color: '#004571',
    width: 30,
    marginTop: 5,
    marginBottom: 15,
  },
  iconBig: {
    color: '#004571',
    width: 50,
    marginTop: 15,
    marginBottom: 5
  },
  iconSmall: {
    color: '#004571',
    width: 24,
    marginTop: 15,
    marginBottom: 5
  },
  block: {
    padding: '20px 60px',
    border: '1px solid #E3EBEF',
    textAlign: 'center',
    [theme.breakpoints.only('xs')]: {
      padding: '20px 40px',
    }
  },
  anomaliesContainer: {
    backgroundColor: '#F8F7F6',
    border: '1px solid #E3EBEF',
  },
  anomaliesContainerOnlyBorder: {
    border: '1px solid #E3EBEF',
    marginBottom: 24,
    paddingBottom: 16,
  },
  buttonBorderMessage:{
    border: '1px solid #E3EBEF',
    padding: '10px'
  },
  dateBlock: {
    borderBottom: '1px solid #E3EBEF',
    padding: 20,
    [theme.breakpoints.only('xs')]: {
      marginBottom: 20,
    }
  },
  date: {
    display: 'flex',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#004571'
  },
  dateIcon: {
    width: 35
  },
  dateText: {
    textAlign: 'left',
    marginLeft: 30,
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
      textAlign: 'center',
      marginTop: 15
    }
  },
  datePrevision: {
    paddingTop: 20,
    paddingBottom: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E57000'
  },
  adviseAnomaly: {
    paddingTop: 20,
    paddingBottom: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E57000'
  },
  advise: {
    width: '100%',
    marginTop: 30,
    fontSize: 15,
    textAlign: 'center',
    color: '#ABABAB',
    [theme.breakpoints.only('xs')]: {
      textAlign: 'left'
    },
    '& div': {
      marginTop: 4,
      '&:first-child': {
        marginTop: 0
      }
    }
  },
  separator: {
    backgroundColor: 'white',
    height: '4px',
    width: '100%',
    margin: '1rem auto 1rem auto'
  },
  comunicationsUFD: {
    margin: '2rem auto auto auto',
    padding: '1.5rem 1.5rem',
    border: '1px solid #F2F5F8',
    '& h3': {
      color: '#004571'
    },
    '& img': {
      width: '3.5rem'
    }
  },
  selfJobsDateContainer: {
    backgroundColor: '#F1F5F8',
    padding: '0.5rem 0.3rem 0.5rem 0.3rem'
  },
  selfJobsCalendarIcon: {
    height: '1rem',
    width: '1rem!important'
  },
  changeSelfJobsDate: {
    color: '#1674D1',
    cursor: 'pointer'
  },
  comunicationDate: {
    fontSize: '1rem',
    color: '#E57000',
    margin: 'auto auto auto 1.2rem'
  },
  cantUpdateDate: {
    color: '#004571',
    fontSize: '0.6rem'
  },
  buttonContainer: {
    margin: '1rem auto auto auto'
  },
  comunicationText: {
    fontSize: '0.95rem',
    height: '100%',
    color: '#004571',
  },
  button: {
    fontSize: '0.7rem',
  },
  confirmedText: {
    color: '#004571;',
    margin: 'auto auto auto  1.2rem;'
  },
  dialogSelfJobs: {
    '& .MuiPaper-root.MuiDialog-paper': {
      width: 630,
      border: '2px solid rgb(61, 114, 147)'
    },
    '& .MuiDialogContent-root': {
      minHeight: 530,
      padding: 36,
      overflow: 'hidden'
    }
  },
  dialogSelfJobsContainer: {
    minHeight: '530px',
    textAlign: 'center'
  },
  dialogComunicateInstalation: {
    '& .MuiPaper-root.MuiDialog-paper': {
      width: 750,
      border: '2px solid rgb(61, 114, 147)'
    },
    '& .MuiDialogContent-root': {
      minHeight: 350,
      padding: 36,
      overflow: 'hidden'
    }
  },
  dialogIsTr9: {
    '& .MuiPaper-root.MuiDialog-paper': {
      width: 650,
      border: '2px solid rgb(61, 114, 147)'
    },
    '& .MuiDialogContent-root': {
      minHeight: 250,
      padding: 36,
      overflow: 'hidden'
    }
  },
  dialogError: {
    '& .MuiPaper-root.MuiDialog-paper': {
      width: 650,
      border: '2px solid rgb(61, 114, 147)'
    },
    '& .MuiDialogContent-root': {
      minHeight: 250,
      padding: 36,
      overflow: 'hidden'
    }
  },
  dialogTitle: {
    color: '#004571',
    fontSize: '1.6rem',
    margin: '10px auto 25px auto',
    textAlign: 'center'
  },
  dialogIcon: {
    width: '5rem'
  },
  dialogErrorIcon: {
    width: '3rem'
  },
  dialogContainer: {
    height: '100%',
    textAlign: 'center'
  },
  dialogContainerNotif: {
    height: '100%',
    textAlign: 'left'
  },
  previewDateText: {
    color: '#004571'
  },
  datepickerInput: {
    textAlign: 'center'
  },
  closeButton: {
    position: 'absolute',
    top: 18,
    right: 18,
    cursor: 'pointer'
  },
  dialogBody: {
    color: '#696969'
  },
  datepicker: {
    margin: '10px auto auto auto'
  },
  dateBlock2: {
    //borderBottom: '1px solid #E3EBEF',
    marginTop: 40
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
  dialogNotif: {
    '& .MuiPaper-root.MuiDialog-paper': {
      width: 850,
      border: '2px solid rgb(61, 114, 147)'
    },
    '& .MuiDialogContent-root': {
      padding: 48
    }
  },
  noItems: {
    textAlign: 'left',
    justifyContent: 'left',
    '& .row': {
      display: 'block',
      textAlign: 'left',
      marginTop: 24
    },
    '& .title': {
      color: '#004571',
      fontSize: 18
    },
    '& .description': {
      color: '#777'
    },
  },
  alertIcon: {
    height: '100%'
  },
  alertBlock: {
    [theme.breakpoints.only('xs')]: {
      textAlign: 'center'
    }
  },
  text: {
    textAlign: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 20,
    fontSize: 18,
    color: 'rgba(0, 69, 113, 1)'
  },
  text2Negrita: {
    textAlign: 'left',
    justifyContent: 'left',
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 0,
    paddingLeft: 5,
    fontSize: 13,
    color: 'rgba(0, 69, 113, 1)'
  },
  text2: {
    fontSize: 13,
    textAlign: 'left',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
    color: '#1674D1',
    fontWeight: 'normal'
  },
  text2Nota: {
    fontSize: 10,
    textAlign: 'left',
    justifyContent: 'center',
    marginTop: 20,
    color: '#1674D1',
    fontWeight: 'normal'
  },
  button2: {
    display: 'block',
    right: 20,
    bottom: 20,
    left: 20,
    backgroundColor: 'rgba(0, 69, 113, 1)',
    color: '#FFF',
    textDecoration: 'none',
    padding: 12,
    paddingRight: 50,
    paddingLeft: 50,
    borderRadius: 4,
    marginTop: 30,
    marginLeft: 300,
    cursor: 'pointer'
  },
  expansionPanelSummaryIcon: {
    width: 32
},
expansionPanelSummaryText: {
  color: '#004571',
  fontSize: 17,
  fontWeight: 'bold',
  marginLeft: 10,
  textAlign:'left',
  alignContent: 'center'
},
middle_icon_red_lightning: {
  marginRight:'auto',
  marginLeft: 'auto'
},
tr9ButtonContainer: {
  justifyContent:'center',
  alignItems:'center',
  backgroundColor: '#F2F5F8',
  marginBlock: '24px', 
  paddingBottom: '5px',
  [theme.breakpoints.down('md')]: {
    paddingInline: '10px',
    paddingBottom: 16
  }
},
tr9ButtonBack: {
  [theme.breakpoints.down('md')]: {
    order: 2,
    margin: 0
  }
},
tr9ButtonStart:{
  [theme.breakpoints.down('md')]: {
    order: 1,
    margin: '10px 0'
  }
},
tr9Space:{
  width: '24px',
  height: '24px',
  [theme.breakpoints.down('md')]: {
    width: 0
  },
  '@media (min-width: 992px) and (max-width: 998px)': {
    width: 12,
  }
},
tr9ButtonContainerNoColor: {
  justifyContent:'space-between',
  spacing: 4,
},
tr9ButtonContainerWhite: {
  justifyContent:'space-between',
  alignItems:'center' ,
  textAlign:'center',
  spacing: 4,
  marginBottom: 20,
  backgroundColor: '#FFFFFF',
  [theme.breakpoints.down('sm')]: {
    margin: 16,
    backgroundColor: '#F2F5F8',
  }
},
tr9ContainerInfoWhite: {
  display: 'grid', 
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
  gridAutoRows: 'minmax(100px, 130px)',
  gap: '20px',
  marginBottom: 20,
  marginInline: 24
},
tr9ContainerInfo: {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  backgroundColor: 'white',
  height: '130px'
},
tr9ContainerImage: {
  width: '50%',
  height: '100%'
},
tr9Image: {
  width: '100%',
  height: '100%',
  [theme.breakpoints.down('md')]: {
    height: '90%',
    marginTop: '5%'
  }
},
tr9ContainerText: {
  width: '50%',
  height: '100%',
  color: '#004571',
  fontSize: '20px',
  padding: '10px',
  alignContent: 'center',
  textAlign: 'left'
},
tr9ButtonContainerRed: {
  justifyContent:'center',
  alignItems:'center' ,
  spacing: 4,
  marginBottom: 20,
  backgroundColor: '#F3e3e6',
  paddingInline: 48,
  paddingBlock: 24,
  marginInline: 16,
  width: '100%'
},
tr9ContainerAlign: {
  paddingInline: 24, 
  justifyContent: 'center',
  width: '100%',
  [theme.breakpoints.down('md')] : {
    paddingInline: 12
  }
},
titleBold: {
  color: '#004571',
  fontWeight:'bold',
  fontSize:'1.1rem'
},
subtitle: {
  color:'#427393'
},
alignLeft:{
  textAlign:'left'
},
inputV4: {
  width: '75%',
  height: '24px',
  fontSize: '14px',
  textAlign: 'left',
  textOverflow: 'ellipsis',
  padding: '15px 14px',
  border: '1px solid ' + colors.lightBlue,
  borderRadius: '4px',
  outline: 'none',
  [theme.breakpoints.down('md')] : {
    width: '91%',
    //paddingRigth: 10
  }
},
paddingLeftTop:{
  paddingLeft:'16px',
  // paddingTop:'16px'
},
paddingFix:{
  [theme.breakpoints.down('md')] : {
    padding: '0 16px',
  }
},
input: {  
  color: '#868686',
  '& .MuiFormControl-root': {
    backgroundColor: '#FFF'
  },
  '& .MuiInputBase-input': {
    color: '#868686'
  },
 '& .MuiInputBase-input.Mui-disabled': {
    backgroundColor: 'palegreen',
    borderRadius: '5%'
  },
  [theme.breakpoints.down('md')] : {
    paddingRight: 0
  }
},
inputMunicipe: {
  paddingRight: 15,
  [theme.breakpoints.down('md')] : {
    paddingRight: 0
  }
},
containerAddress:{
  // marginBlock: '5px', 
  // marginRight: '12px',
  // [theme.breakpoints.down('md')] : {
  //   marginBlock: 0,
  //   marginRight: 0
  // }
  paddingBlock: 8
},
inputAddressTypeContainer: {
  //paddingRight: 30,
  [theme.breakpoints.down('md')] : {
    paddingRight: 7
  }
},
inputAddressType: {
  //width: '80%',
  [theme.breakpoints.down('md')] : {
    width: '93%',
  }
},
inputAddressContainer: {
  [theme.breakpoints.down('md')] : {
    paddingTop: 16
  }
},
inputAddress:{
  width: '90%',
  [theme.breakpoints.down('md')] : {
    width: '91%',
  }
},
inputCodePostal: {
  [theme.breakpoints.down('md')] : {
    paddingTop: 16
  }
},
searchButtonContainer: {
  display: 'flex', 
  //paddingBottom: 10, 
  flexDirection: 'column-reverse', 
  //paddingLeft: 12,
  [theme.breakpoints.down('md')] : {
    //paddingLeft: 16
    paddingBlock: 8
  }
},
inputAddressNumberContainer: {
  paddingRight: 8
},
inputAddressNumber: {
  [theme.breakpoints.down('md')] : {
    width: '93%',
  }
},
inputDuplicator: {
  [theme.breakpoints.down('md')] : {
    width: '93%',
  }
},
inputDuplicatorContainer: {
  [theme.breakpoints.down('md')] : {
    paddingLeft: 0,
    paddingRight: 8,
    paddingTop: 10
  }
},
smallTitle: {
  margin: '8px 0px',
  fontSize: '16px',
  color: 'rgba(0, 69, 113, 1.0)',
  fontWeight:'bold',
  textAlign:'left'
},
buttonsContainer: {
  marginBottom: '-3px',
  marginLeft: '2px'
},
noPaddingItemContainer: {
  padding: '16px 6px',
},
alignPaddingItemContainer: {
  padding: '16px 0',
  display: 'block',
},
imageContainer: {
  [theme.breakpoints.up('md')] : {
    display: 'flex', 
    justifyContent: 'end'
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
radioButtonText: {
  color: 'rgba(0, 69, 113, 1.0)',
  fontSize: '15px',
  marginLeft: '6px',
  marginRight: '8px',
  float: 'left'
},
dashedDivider: {
  borderTop: ' 2.7px dashed #c3e0f3',
  backgroundColor:' #ffffff',
  marginTop:'20px',
  marginBottom:'20px',
  marginLeft:'16px',
  marginRight:'16px',
},
characterCount: {
  backgroundColor: '#F3F7FB',
  width: '220px',
  color: 'rgba(0, 69, 113, 1)',
  fontSize: '13px',
  padding: '5px 8px',
  textAlign: 'center',
  fontWeight: 'bold',
  float:'right'
},
whiteButton:{
  backgroundColor: '#004571',
  color: 'rgb(0, 69, 113)',
  borderRadius: '4px',
  cursor: 'pointer',
},
backButton:{
  backgroundColor: '#004571',
  color: 'rgb(0, 69, 113)',
  borderRadius: '4px',
  cursor: 'pointer',
  border: '1px solid rgb(0, 69, 113)',
  [theme.breakpoints.down('md')]: {
    margin:'10px 0',
  },
},
buttonsContainerMobile: {
  display: 'flex',
  flexDirection: 'column', 
  alignItems: 'center',  
  paddingBottom: '25px',  
  '& > .continueButton': {
    order: 1, 
  },
  '& > .cancelButton': {
    order: 2, 
  },
  '& > .saveButton': {
    order: 3, 
  },
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    '& > .cancelButton': {
      order: 1, 
    },
    '& > .continueButton': {
      order: 2, 
    },
  },
},
saveDraftContainer: {
  display: 'flex', // Muestra el contenido en fila
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px', // Espaciado entre el texto y la fecha
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column', // Cambia a columna en pantallas pequeñas
    textAlign: 'center', // Centra el texto en móviles
  },
},
saveDraftSubtitle:{ 
  fontSize: '18px',
  fontWeight: 700,
  color: '#004571',
  marginTop:'10px',
  marginBottom:'15px',
  textAlign: 'center',
  [theme.breakpoints.down('md')]: {
    fontSize: 15,
  },
},
errorDraftSubtitle:{
  fontSize: '17px',
  color: '#004571',
  textAlign: 'center',
  marginBottom:'15px',
  [theme.breakpoints.down('md')]: {
    fontSize: 15,
  },
},
errorHidden:{
  display: 'block',
  fontSize: '17px',
  fontWeight: 700,
  color: '#004571',
  textAlign: 'center',
  marginBottom:'15px',
  [theme.breakpoints.down('md')]: {
    display: 'none',
    fontSize: 15,
  },
},
errorHidden2:{
  display: 'none',
  fontSize: '17px',
  fontWeight: 700,
  color: '#004571',
  textAlign: 'center',
  marginBottom:'15px',
  [theme.breakpoints.down('md')]: {
    display: 'block',
    fontSize: 15,
  },
},
cancelButton: {
  //width: 80,
  height: 20,
  fontSize: 14,
  position: 'relative',
  backgroundColor: '#004571',
  color: 'rgb(0, 69, 113)',
  padding: '7px 12px 9px 15px',
  marginTop: '14px',
  borderRadius: '4px',
  cursor: 'pointer',
  border: '1px solid rgb(0, 69, 113)'
},
saveButton:{
  height: 20,
  fontSize: 14,
  position: 'relative',
  backgroundColor: '#004571',
  color: 'rgb(0, 69, 113)',
  minWidth: '12.5rem',
  minHeight: '3.15rem',
  marginTop: '14px',
  borderRadius: '4px',
  cursor: 'pointer',
  border: '1px solid rgb(0, 69, 113)',
  [theme.breakpoints.down('md')]: {
    fontSize: 13,
  },
},
acceptBtn: {
  //width: 80,
  height: 20,
  fontSize: 14,
  position: 'relative',
  backgroundColor: '#004571',
  color: '#FFF',
  padding: '7px 12px 9px 15px',
  marginTop: '14px',
  borderRadius: '4px',
  cursor: 'pointer',
  [theme.breakpoints.down('md')]: {

  },
  justifyItems: 'center'
},
searchBtn: {  
  '& .MuiButton-root': {
    fontSize: 16, 
    height: 46
  },
    textAlign: 'center',
    fontSize: 12, 
    height: 54,
  [theme.breakpoints.down('md')]: {
    marginTop: 10,
    paddingRight: 0,
    paddingLetf: 0,    
    //marginLeft: 10
  },
},
  gridManualContainer: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    paddingInline: 0,
    //paddingTop: 8,
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column'
    }
  },
gridContainer: {
  paddingTop: 8,
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBlock: 10
  }
},
gridSpaceContainer: {
  width: 0,
  [theme.breakpoints.up('md')]: {
    width: 20
  }
},
greyColor: {
  color:'#838383',
},
infoIcon: {
  filter: 'invert(22%) sepia(100%) saturate(1966%) hue-rotate(197deg) brightness(101%) contrast(101%)',
  width: 18,
  position:'relative',
  top:'4px'
},
underline: {
  color: '#1674D1',
  marginLeft:'19px',
  textDecoration:'underline',
  cursor:'pointer',
  textAlign:'left'
},
verifyTitle: {
  fontSize: 36,
  color: '#004571',
  textAlign:'center',
  marginTop:'30px',
  marginBottom:'20px',
  paddingInline: 24,
  [theme.breakpoints.down('md')]: {
    marginBottom: '10px',
    marginTop:'10px',
    fontSize: 26,
    paddingInline: 0
  },
},
verifySubtitleMulti: {
  fontWeight: 'bold',
  color: '#004571',
  marginTop: '10px',
  marginBottom: '10px',
  textAlign:'center',
  fontSize: 20,
  [theme.breakpoints.down('md')]: {
    fontSize: 18
  }
},
verifySubtitle: {
  fontWeight: 'bold',
  color: '#004571',
  marginTop: '30px',
  marginBottom: '10px',
  textAlign:'center',
  fontSize: 20,
  [theme.breakpoints.down('md')]: {
    fontSize: 18
  }
},

colorSub:{
  fontWeight: 'bold',
  color: '#004571',
  fontSize: 18
},
colorSubt:{
  marginTop: '10px',
  color: '#004571',
  fontSize: 18
},
verifyOkSupply:{
  justifyContent: 'center',
  marginTop: '30px',
  boxShadow: '0 0 3px #40749570',
  padding: '30px',
  background: '#00457108'
},
verifyISubtitle: {
  fontWeight: 'bold',
  color: '#004571',
  marginTop: '10px',
  marginBottom: '10px',
  textAlign:'center',
  fontSize:23,

  [theme.breakpoints.down('md')]: {
    maxWidth:'65%',
    margin: '0 auto'
  },

},
containerBoxGrid:{
  width: "100%",
  padding: "0 20px 25px"
},
containerBox:{
  border: "1px solid #d9e1ec",
},
headerBox:{
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  cursor: "pointer",
  fontWeight: "bold",
  borderBottom: "1px solid #e0e0e0",
  padding: "10px 20px"
},
titleBox:{
  color: '#004571',
  fontWeight: "bold"
},
listBox:{
  padding: "10px 20px"
},
listItemBox:{
  paddingLeft: 0,
  paddingRight: 0,
},
commentTextBox:{
  color: "#333",
  fontStyle: "italic"
},
verifyBg:{
  background: "#f47c20",
  color: "white",
  justifyContent: "center",
  borderRadius: "4px",
  padding: "10px 16px"
},
verifyMargin:{
  margin: "0"
},
verifyWith:{
  display: "flex",
  justifyContent: "center",
  marginTop: "45px",
  width: '50%',
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
},
verifyTitleOrange:{
  color: "#f47c20",
  fontWeight: "bold",
  justifyContent: "center",
  margin: "20px 0",
},
linkDraft:{
  fontSize: '1em',
  margin: '10px 0px',
  textDecoration: 'underline',
  cursor: 'pointer',
  color: '#0066CC'
},
linkDraftSave:{
  marginBottom: '25px'
},
verifySubtext: {
  margin: '0px 50px 20px 50px',
  width: '100%',
  fontSize: 16,
  textAlign: 'center',
  color: '#64666A',
  [theme.breakpoints.down('md')]: {
    margin: '0',
    marginBottom:'40px'
  },
},
btnInit:{
  alignItems:'center' ,
  textAlign:'center',
  //marginBottom: '50px', 
  [theme.breakpoints.down('md')]: {
    '& span[class^="MuiButton-label"]': {
      fontSize: 16
    },
  },
},
btnNextDraft:{
  '& span[class^="MuiButton-label"]': {
      fontSize: 16,
      padding: '10px 60px'
  },
  [theme.breakpoints.down('md')]: {
   margin: '10px 0px',
   '& span[class^="MuiButton-label"]': {
      padding: '10px 0px'
  },
  },
},
supplyAnomaliaLoad:{
  color:'#004571',
  textAlign: 'center',
  justifyContent: 'center',
  border: '1px solid #004571',
  padding: '20px 0',
  fontWeight: 'bold',
  [theme.breakpoints.down('md')]: {
    marginTop: '20px',
    padding: '16px',
  },
},
supplyAnomaliaSubtitle:{
  color:'#004571',
  marginTop: '20px',
  fontSize: 18,
  paddingInline: 24,
  [theme.breakpoints.down('md')]: {
    paddingInline: 0
  }
},
verifySubtext2: {
  color:'#004571',
  textAlign: 'center',
  marginBottom: '25px',
  marginTop: "30px",
  fontSize: 16
},
verifySubtext2Bold: {
  color:'#004571',
  textAlign: 'center',
  marginTop: '10px',
  marginBottom: '15px',
  fontWeight: 'bold',
},
verifySubtext2Red: {
  color: '#D3222A',
  textAlign: 'center',
  marginTop: '10px',
  fontSize: 16
},
verifySubtext2BoldRed: {
  color: '#D3222A',
  textAlign: 'center',
  fontWeight: 'bold',
  fontSize: 18,
  [theme.breakpoints.down('sm')]: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 16,
    marginLeft: 0,
  }
},
iconText: {
  color: '#0c69c6',
  fontSize: '18px',
  marginLeft: '10px',
  [theme.breakpoints.down('sm')]: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 16,
    marginLeft: 0,
  }
},
Phototext: {
  minWidth: '300px',
  marginTop: '5px',
  marginBottom: '5px',
  textAlign:'left',
  '&.redEnable': {
    color: '#CF0E11'
  }
},
addDocument: {
  color: '##6AA1D8',
  textDecoration: 'none',
  border: '1px solid #838383',
  cursor: 'pointer',
  padding: '16px !important',
  borderRadius: '5px',
  backgroundColor: '#f2f2f2',

  '&.redEnable': {
    color: '#CF0E11',
    border: '1px solid #CF0E11',
    background: 'none'
  }
},
ico2: {
  width: 18,
  verticalAlign: 'text-top',

  '&.redEnable': {
    color: '#CF0E11'
  }
},
docContainer: {
  alignItems: 'center',
  alignContent: 'center',
  justifyItems: 'center',
  marginLeft:'16px',
  [theme.breakpoints.down('md')]: {
    marginTop:'0px',
    marginLeft:'0px'
  },
},
link: {
  fontSize:'16px',
  textDecoration:'none',
  color: '#0066CC',
  justifyContent: 'center',
  cursor: 'pointer',
  [theme.breakpoints.down('md')]: {
    display: 'block'
  },  
},
resumeTitle: {
  fontSize: '20px',
  margin: '17px 0px 11px 0px',
  color: '#838383',
  fontWeight: 'bold'
},
resumeSubtext: {
  fontSize:'18px',
  margin:0,
  color: '#838383',
},
resumeTitleGrid: {
  background: '#f2f5f8',
  padding: '27px 25px 27px 25px'
},
resumeFormTitle: {
  fontSize:'21px',
  color:'#004571',
  marginTop:'22px'
},
resumeFormSubtitle: {
  color: '#004571',
  margin: '10px 0px 10px 0px',
  fontSize: '17px'
},
fileRound:{
  color: '#74acdc',
  textDecoration: 'none',
  borderRadius: '15px',
  background: '#F8F7F5',
  cursor: 'pointer',
  width: 'min-content',
  padding:'11px'
},
bubbleText: {
 
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
    fontSize: 18,
    color: '#2386db'
  
},
uploadRound: {
  color:' #1674D1',
  margin:'0px',
  width: 'fit-content',
  padding: '0px',
  background: '#eff0f0',
  borderRadius: '14px',
  textDecoration: 'none',
  textAlign: 'center',
  alignItems: 'center'
},
modalBody: {
		color: '#696969'
},
modalTitle: {
		color: '#004571',
		fontSize: 26,
		marginBottom: 24,
		marginTop: 10,

},
noDisplay: {
  [theme.breakpoints.down('md')]: {
     display:'none'
  }
},
errorTitle: {
  color: '#004571',
  fontSize: 18,
  margin: '5px',
  textAlign: 'center',
  fontWeight:'bold'
},
errorSubtitle: {
  color: '#004571',
  fontSize: 18,
  margin: '5px',
  textAlign: 'center',
},
errorBox: {
  marginTop: '30px',
  boxShadow: '0 0 3px #40749570',
  padding: '30px',
  background: '#00457108'
},
errorBoxSupplies: {
  marginTop: '30px',
  boxShadow: '0 0 3px #40749570',
  padding: '30px'
},
warnText: {
  color:'#d7343b',
  margin:'3px 15px 15px 15px',
  fontSize: '16px',
  textAlign: 'center'
},
warnBox: {
  marginTop: '20px',
  marginBottom:'15px',
  padding: '20px',
  backgroundColor:'#fbe9ea'
},
warnTitle: {
  color:'#d7343b',
  fontSize: '21px',
  textAlign: 'center',
  fontWeight:'bold'
},warnIcon: {
  filter:'invert(18%) sepia(66%) saturate(4629%) hue-rotate(244deg) brightness(94%) contrast(78%)'
},
blueBlock: {
  backgroundColor: '#f2f5f8',
  padding: '20px',
  margin: '10px 15px',
  [theme.breakpoints.down('md')]: {
    padding: '16px',
    margin: '10px 16px',
  },
},
blueBlockData: {
  color: 'rgba(0, 69, 113, 1.0)',
  fontWeight: 'bold'
},
blueBlockText: {
  color: 'rgba(0, 69, 113, 1.0)',
},
formFooter: {
  width: '100%',
  textAlign: 'center',
  position: 'relative',
  paddingBlock: 8,
  '& p':{
      marginTop: '35px',
      paddingTop: 0,
      paddingBottom: 0,
      margin: 0,
      padding: '6px',
      position: 'absolute',
      top: '0',
      transformOrigin: 'center',
      left: 'calc(50% + 120px)',
  },
  [theme.breakpoints.down('md')]: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 0,
    '& p':{
      position: 'relative',
      left: '0',
      padding: '0',
      marginTop: '15px',
  },
  },
},
checkboxContainer: {
  marginTop: '20px',
  width: '80%',
  margin: '0 auto',
  
},
checkboxAdressContainer: {
  display: 'flex', 
  flexDirection: 'row',
  marginTop: 10
},
checkboxBotom: {
  display: 'flex', 
  flexDirection: 'row',
  alignItems: 'start'
},
checkBoxTextDisabled: {
  color: '#BDBDBD',
  paddingLeft: 10
},
checkBoxText: {
  color: '#004571',
  paddingLeft: 10
},
linkReset: {
  textDecoration: 'none',
  marginTop: 10
},
alert: {
  '& .MuiPaper-root.MuiDialog-paper': {
    width: '550px',
    heigth: '250px',
    border: '2px solid rgb(61, 114, 147)',
    borderRadius: '10px'
  }
},
alertClose: {
  position: 'absolute',
  top: 18,
  right: 18,
  cursor: 'pointer'
},
alertContainer: {
  padding: 36,
  overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    spacing: 1,
},
alertContainerText: {
  display: 'flex', 
  flexDirection: 'column', 
  alignItems: 'center'
},
alertText: {
  color: 'rgb(0, 69, 113)',
  fontSize: 20,
  textAlign: 'center',
  //display: 'flex', flexDirection: 'column', alignItems: 'center'
}
}))
const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: '##ffffff',
    color: '#004571',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: '10px',
    lineHeight: '1rem',
    padding: '10px',
    [theme.breakpoints.only('xs')]: {
      padding: 20
    }
  },
  body: {
    backgroundColor: '##ffffff',
    color: '#ABABAB',
    border: '1.5px solid white',
    textAlign: 'center',
    fontSize: '10px',
    padding: '10px',
    [theme.breakpoints.only('xs')]: {
      padding: 20
    }
  }
}))(TableCell)

const ExpansionPanel = withStyles({
  root: {
      width: '100%',
      border: '1px solid #E1E9EE',
      boxShadow: 'none',
      borderRadius: 4,
      marginTop: 20,
      '&:before': {
          display: 'none',
      },
      '&:first-child': {
          marginTop: 0
      },
      '&$expanded': {
          marginTop: 20
      }
  },
  expanded: {},
})(MuiExpansionPanel)
const ExpansionPanelv2 = withStyles({
  root: {
      width: '100%',
      border: '1px solid #E1E9EE',
      borderRadius: 4,
      marginTop: 20,
      boxShadow:'none',
      textAlign:'left',
      '&:before': {
          display: 'none',
      },
      '&:first-child': {
          marginTop: 0
      },
      '&$expanded': {
          marginTop: 20
      }
  },
  expanded: {},
})(MuiExpansionPanel)
const ExpansionPanelSummary = withStyles({
  root: {
      //borderBottom: '1px solid #E1E9EE',
      height: '56px',
      backgroundColor: '##ffffff',
      boxShadow:'none',
      justifyContent: 'center',
      '&$expanded': {
        borderBottom: '1px solid #E1E9EE',
      },
      '&:not($expanded)': {
        border: '1px solid #E1E9EE',
          //borderBottom: 0
      },
      '&.colored': {
          backgroundColor: '##ffffff',
          color: '#004571',
          padding: '0 72px'
      }
  },
  content: {
      '&$expanded': {
      },
  },
  expanded: {},
})(MuiExpansionPanelSummary)
const ExpansionPanelSummaryv2 = withStyles({
  root: {
      //borderBottom: '1px solid #E1E9EE',
      height: '56px',
      boxShadow:'none',
      paddingBottom:'6px',
      marginBottom:'6px',
      backgroundColor: '#f7fbfe',
      justifyContent: 'center',
      '&$expanded': {
        borderBottom: '1px solid #E1E9EE',
      },
      '&:not($expanded)': {
          //borderBottom: 0
      },
      '&.colored': {
        backgroundColor: '#f7fbfe',
        color: '#004571',
          padding: '0 72px'
      }
  },
  content: {
      '&$expanded': {
      },
  },
  expanded: {},
})(MuiExpansionPanelSummary)

const ExpansionPanelDetails = withStyles(theme => ({
  root: {
      //padding: '45px',
      //paddingRight: 45,
      //paddingLeft: 45,
      backgroundColor: '##ffffff',
      display: 'block',
      padding:'6px 40px 16px',
      [theme.breakpoints.only('xs')]: {
        padding:'6px 16px 16px',
      }
  },
}))(MuiExpansionPanelDetails)

const ExpansionPanelDetailsv2 = withStyles(theme => ({
  root: {
      //padding: '45px',
      //paddingRight: 45,
      //paddingLeft: 45,
      backgroundColor: '##ffffff',
      display: 'block',
      boxShadow:'none',
      padding:'8px 6px 16px',
      [theme.breakpoints.only('xs')]: {
        padding:'6px 16px 16px',
      }
  },
}))(MuiExpansionPanelDetails)

export default useStyles
export { 
  StyledTableCell,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  ExpansionPanelv2,
  ExpansionPanelSummaryv2,
  ExpansionPanelDetailsv2
  }
