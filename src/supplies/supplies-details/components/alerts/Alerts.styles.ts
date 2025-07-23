import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  dialog:{
    height: '60%',
  },
  actionBox: {
    display: 'inline-flex',
    backgroundColor: '#E1EDF0',
    color: '#164258',
    margin: '40px 80px',
    alignItems: 'end',
    padding: '8px 20px',
    borderRadius: 4,
    [theme.breakpoints.only('xs')]: {
      alignItems: 'normal',
      marginTop: '5px',
      marginBottom:'5px',
      margin: '40px'
      
    },
  },
  alertLabel: {
    marginLeft: 50,
    marginBottom: 15,
    color: '#838383',

  },
  alertTittle: {
    marginLeft: 20,
    alignItems: 'end',
    maxWidth: '670px',
    [theme.breakpoints.only('xs')]: {
      maxWidth: '140px',
      
    },
    

  },
  infoIcon: {
    height: 30,
    marginTop: 30
  },
  dialogContent: {
    border: '2px solid #004571',
  },
  modalText: {
    textAlign: 'center',
    marginBottom: 48,
    '& img': {
      height: '50px'
    }
  },
  
  dialogTitle: {
    color: 'rgba(0, 69, 113, 1)',
    textAlign: 'center',
    marginTop: '20px',
  },
  typo: {
    fontSize: '2rem'
  },
  iconButton: {
    position: 'absolute',
                right: 8,
                top: 8,
  },

  dialogContent2: {
    width: '60%',
    marginLeft: '17%',
    marginRight: '17%',
    alignSelf: 'center',
  },
  dialogActions: {
    width: '60%', 
    margin: 'auto',
    marginBottom: '20px'
  },
  btn: {
    color: '#004571',
    width: '60%'
  },
  section: {
    '&.border': {
      paddingTop: 20,
      borderTop: 'solid 1px #D9D8D6',
      marginTop: 20,
      justifyContent: 'space-between'
    }
  },

  btn2: {
    color: '#fff',
    backgroundColor: '#004571 !important',
    padding: '10px 0px 10px 0px',
    width: '35%',
    textTransform: 'capitalize',
    fontSize: '1.2em',
    margin:'auto'
  },
  submitButton: {
    margin:'10px 15px',
    width: '90%',
    height: '84%',
    justifyContent:'center',
    backgroundColor: '#004571',
    fontSize:'1.2em',
    textTransform:'capitalize',
    '&:hover': {
      backgroundColor: '#004571 !important',
    },
  },

  red: {
    color: 'red',
  },

  containergrey: {
    borderColor: 'grey',
  },

  customBg: {
    backgroundColor: '#fafafa',
  },

  formcontroll: {
    fontSize: '30px',
  },

  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  invisible:{
    display:'none'
  },

  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },

  block: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    marginTop: 128,
    [theme.breakpoints.only('xs')]: {
      marginTop: 70,
    },
  },
  padding_1:{
    [theme.breakpoints.only('xs')]: {
      padding: '24px 24px 0 24px',
    },
  },
  padding_2:{
    [theme.breakpoints.only('xs')]: {
      padding: '0 24px 24px 24px',
    },
  },
  container: {
    padding: '20px 0 46px',
    justifyContent: 'center',
  },
  maxWidthForBigScreens: {
    maxWidth: 1200,
    width: '100%',
  },
  title: {
    fontSize: 36,
    color: '#004571',
    textAlign: 'center',
    margin: '26px 0 36px',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3c6d88',
    textAlign: 'center',
    marginBottom: 26,
    marginTop:'10px',
  },
  span:{
    color:'#4a7494',
  },
  alertaApp: {
    fontSize: 16,
    color: '#838383',
    marginLeft: '30px',
    '& .MuiInputBase-input': {
      color: '#838383 !important',
      border:'none !important'
    },
    border:'none !important',
   '& PrivateNotchedOutline-root-82 MuiOutlinedInput-notchedOutline' : {
    borderColor: 'rgba(0, 0, 0, 0.23) !important',
   },
   '& .MuiOutlinedInput-notchedOutline' : {
    borderColor: '#a6becd !important',
    },
    [theme.breakpoints.only('xs')]: {
      marginLeft: '35px',

    }
  },
  text: {
    fontSize: 16,
    color: '#838383',
    textAlign: 'center',
    marginBottom: 0,
    '& .MuiInputBase-input': {
      color: '#838383 !important',
      border:'none !important'
    },
    border:'none !important',
   '& PrivateNotchedOutline-root-82 MuiOutlinedInput-notchedOutline' : {
    borderColor: 'rgba(0, 0, 0, 0.23) !important',
   },
   '& .MuiOutlinedInput-notchedOutline' : {
    borderColor: '#a6becd !important',
    },
    [theme.breakpoints.only('xs')]: {
      padding: '24px',
    }
  },
  formlabel: {
    color:'#6d6d69',
    [theme.breakpoints.only('xs')]: {
      padding: '0',
    },
  },

  step: {
    fontSize: 16,
    marginBottom: '25px',
    color: '#004571',
  },
  items: {
    [theme.breakpoints.up('lg')]: {
      width: 1052,
      margin: '0 auto',
    },
  },
  item: {
    width: 152,
    boxSizing: 'border-box',
    backgroundColor: '#F2F1EF',
    justifyContent: 'center',
    textAlign: 'center',
    padding: 20,
    borderRadius: 10,
    margin: '0 10px',
    // margin: '0 24px',
    '& img': {
      height: 94,
    },
    [theme.breakpoints.down('md')]: {
      marginBottom: 14,
    },
  },
  buttons: {
    justifyContent: 'center',
    marginTop: 32,
    '& button': {
      margin: '0 16px',
    },
  },

  formcontrol : {
    color:'#4a7494'

  },

  'MuiButtonBase-root-131': {
    color: '#F2F1EF',
  },

  'Mui-disabled' : {
    color: 'rgb(0 0 0 / 20%),'
  },

  root: {
    borderTopRightRadius: '12px',
    borderTopLeftRadius: '12px',
    boxShadow: '0px 5px 40px rgb(0 0 0 / 10%)',
    fontFamily: 'Montserrat',
    overflow: 'hidden',
    '& .MuiPaper-root ': {
      boxShadow: 'none',
    },
    '& .MuiTable-root': {
      color: '#F2F1EF',
      '& .MuiTableHead-root': {
        '& .MuiTableRow-head': {
          '& .MuiTableCell-head': {
            background: 'rgba(90, 0, 90, 0.09)',
            color: '#F2F1EF',
          },
        },
      },
      '& .MuiTableRow-root': {
        '&:nth-child(even)': {
          backgroundColor: '#FAF7FA',
        },
      },
    },

    '.MTableToolbar-highlight-33': {
      backgroundColor: '#F2F1EF',
    },

    'MuiToolbar-root-38': {
      color: '#F2F1EF',
    },
    'MuiIconButton-root-125 MuiPrivateSwitchBase-root-160 MuiCheckbox-root-154 MuiCheckbox-colorSecondary-159 MuiPrivateSwitchBase-checked-161 MuiCheckbox-checked-155':
      {
        color: '#F2F1EF',
      },
    width: '98%',
    'MuiButtonBase-root-131': {
      color: '#F2F1EF',
    },
    '.MuiCheckbox-colorSecondary-159.MuiCheckbox-checked-155': {
      color: '#F2F1EF',
    },

    '& .MuiStepper-alternativeLabel': {
      width: '100%',
      boxSizing: 'border-box',
    },
    '& .MuiStepIcon-active, & .MuiStepIcon-root': {
      color: '#F2F1EF',
      border: 'solid 1px #D8D8D8',
      borderRadius: '50%',
    },
    '& .MuiStepLabel-active, & .MuiStepLabel-label': {
      color: '#004571',
    },
    '& .MuiStepIcon-text': {
      fill: '#004571',
    },
    '& .MuiPaper-root': {
      backgroundColor: 'transparent',
    },
    '& .MuiStepConnector-root': {
      left: 'calc(-50%)',
      right: 'calc(50%)',
      zIndex: -1,
    },
    '& .MuiStepConnector-line': {
      borderColor: '#D8D8D8',
    },
  },
  legalDeadlines: {
    color: '#004571',
    margin: '10px 0',
    '&:hover': {
      textDecoration: 'underline',
      cursor: 'pointer',
    },
  },
  stepper: {
    [theme.breakpoints.up('lg')]: {
      width: 1052,
      margin: '0 auto',
    },
  },
  radiobtn: {
    '& .MuiSvgIcon-root:not(.MuiSvgIcon-root ~ .MuiSvgIcon-root)':
            {
                color: '#a1bbcb',
            },
        '& .MuiSvgIcon-root + .MuiSvgIcon-root': {
            color: '#0066cc',
            width: '0.85em',
            left: '1.8px !important',
        },
  },
  checked: {
    '& .MuiSvgIcon-root + .MuiSvgIcon-root': {
            color: '#0066cc',
            width: '0.85em',
            left: '1.8px !important',
        },
  },
  validationWarning : {
    textAlign: 'right',
    fontSize: 'small',
    margin: '16px 6px 0px 0px',
    color: 'red',

    [theme.breakpoints.down('md')]: {
      textAlign: 'center',
    },

  },
  media: {
    [theme.breakpoints.only('xs')]: {
      maxWidth: '100%',
      flexBasis: '100%'
    },
  },
  margin: {
    marginTop: '20px'
  },
  colorText: {
    color: '#3c6d88'
  }
}));

export default useStyles;
