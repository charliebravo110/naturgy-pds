import { makeStyles } from '@material-ui/core/styles';
import colors from '../../../assets/colors/colors'
// import { lightBlue } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  separator: {
    backgroundColor: '#E3E6E8',
    height: '1.5px',
    width: '100%',
    marginTop: 0,
    marginBottom: '1rem',
    '&.variant': {
        height: '3px',
    }
  },
  btnQuestions: {
    borderRadius: '150px'
  },
  btnQuestionsPosit: {
    borderRadius: '150px',
    '& span': {
      position:'relative',
      right:'12px'
    }

  },
  btnRed: {
    backgroundColor: 'red',
    color: 'white'
  },
  modalesContainer: {
    minHeight: '160px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  extraInfo: {
    backgroundColor: '#f7fbfe',
    marginTop: '1.33em',
    padding: '20px',
  },
  extraInfo_2: {
    gap: '5px',
    display:'block',
    backgroundColor: '#f8e6e6',
    padding:'23px'
  },
  right: {
    float: 'right',
  },
  tabSelector: {
    '& div[role="tablist"]': {
      justifyContent: 'flex-end !important'
    },
    '& .MuiTabs-flexContainer': {
      height: '100%'
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
    '&.active::before': {
      display: 'block',
      width: '100%',
      height: '100%',
      backgroundColor: '#039BA8',
      content: '""',
      borderRadius: '50%',
      cursor: 'default'
    }
  },
  tabs: {
    height: '100%',
    borderBottom: 0,
    marginRight: -20
  },
  tabsMobile: {
    height: '100%',
    borderBottom: 0,
    display: 'inline',
    zIndex: 1,
    '& > div': {
      boxShadow: '-2px -2px 2px -1px rgba(0,0,0,0.6)',
      width: '225px',
      backgroundColor: '#FFF',
      position: 'relative',
      top: -20,
      zIndex: 1
    }
  },
  tab: {
    width: 'auto',
    minWidth: 'auto',
    height: '100%',
    padding: 0,
    overflow: 'visible',
    marginRight: 0,
    '&:last-child': {
      marginRight: 0
    },
    '&.Mui-selected': {
      fontWeight: 'normal'
    },
    '&:focus': {
      fontWeight: 'normal'
    },
    '& a': {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'center',
      color: '#155279',
      textDecoration: 'none'
    },
    '& .MuiTab-wrapper': {
      display: 'flex',
      position: 'relative',
      top: 0,
      left: 0,
      height: '100%',
      padding: '0 20px'
    }
  },
  inactive: {
    pointerEvents: 'none',
    userSelect: 'none',
    '& p': {
      color: 'rgb(220, 220, 220)'
    },
    '& .MuiButton-containedPrimary': {
      background: 'rgb(220, 220, 220)'
    }
  },
  buttonWrapper: {
    justifyContent: 'center',
    padding: '30px 0'
  },
  inputsWrapper: {
    marginTop: '15px'
  },
  inputsWrapper2: {
    background: 'white',
    marginBottom: 18
  },
  inputsWrapper3: {
    marginTop: 30,
    height: '350px',
    border: '2px solid #f0eeec',
    backgroundColor: '#F7F7F7',
  },
  inputsArea: {
    paddingTop: '5px',
    paddingLeft: '10px',
    background: 'white',
  },
  orangeSubtitle: {
    fontSize: '16px',
    color: '#e57200'
  },
  inputTitle: {
    color: 'rgba(0, 69, 113, 1.0)',
    fontSize: '16px',
    paddingBottom: '5px',
    textAlign: 'left'
  },
  inputTitleEmail: {
    paddingRight: '20px'
  },
  userData: {
    color: 'rgb(131, 131, 131)',
    fontSize: '15px',
    paddingTop: '6px'
  },
  input: {
    width: '85%',
    fontSize: '14px',
    backgroundColor: 'rgb(247, 247, 247)',
    '& input, & .MuiSelect-selectMenu': {
      background: '#FFF',
      paddingTop: '15px',
      paddingBottom: '15px'
    }
  },
  inputFull: {
    width: '100%',
    fontSize: '14px',
    backgroundColor: 'rgb(247, 247, 247)',
    '& input, & .MuiSelect-selectMenu': {
      background: '#FFF',
      paddingTop: '15px',
      paddingBottom: '15px'
    }
  },
  input4: {
    padding: '10px',
    '& input, & .MuiSelect-selectMenu': {
      background: '#FFF',
      paddingTop: '15px',
      paddingBottom: '15px'
    }
  },
  editIcon: {
    marginRight: 6
  },
  infoIcon15: {
    marginLeft: 10,
    width: '19.5px',
    position: 'relative',
    top: '5px'
  },
  editText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  textButton: {
    bottom: 6,
    marginTop: '10px',
  },
  textoAveria: {
    justifyContent: 'flex-start',
    color: 'rgba(0, 69, 113, 1.0)',
    fontSize: '16px',
    marginTop: '10px',
    fontWeight: 'bold',
    [theme.breakpoints.up('sm')]: {
      height: '28px',
      display: 'flex',
      alignItems: 'flex-end'
    }
  },
  priorityHover: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    color: 'rgba(0, 69, 113, 1.0)',
    fontSize: '16px',
    marginTop: '20px',
    [theme.breakpoints.up('sm')]: {
      height: '20px',
      display: 'flex',
      alignItems: 'center'
    },
    '&:hover': {
      cursor: 'pointer'
    },
    '&.notMobile': {
      marginLeft: '20px'
    }
  },
  priorityIcon: {
    height: '22.5px',
    weight: '22.5px',
    '&.notMobile': {
      marginRight: '20px',
    }
  },
  priorityDiv: {
    weight: '20px',
    '&.notMobile': {
      marginRight: '10px'
    }
  },
  linkDiv: {
    weight: '20px',
    color: '#0066CC',
    '&.notMobile': {
      marginRight: '10px'
    }
  },
  priorityText: {
    margin: '20px 60px 0px 60px'
  },
  div: {
    marginRight: '10px',
    [theme.breakpoints.down('sm')]: {
      margin: '10px'
    }
  },
  switchAveria: {
    marginleft: '10px',
  },
  container: {
    padding: '20px 0',
    marginTop: 126
  },
  maxWidthForBigScreens: {
    minWidth: 1200,
    maxWidth: 1200
  },
  expansionPanelsArea: {
    marginTop: 15
  },
  table: {
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 16
  },
  row: {
    '&.unread td': {
      fontWeight: 'bold'
    },
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column'
    }
  },
  cell: {
    paddingRight: 10,
    '&.name': {
      paddingLeft: 0
    }
  },
  cell2: {
    width: 90
  },
  cell3: {
    width: 50
  },
  wrappedCell: {
    [theme.breakpoints.down('sm')]: {
      wordBreak: 'break-word'
    }
  },
  peticionesAveria: {
    fontSize: 10
  },
  button: {
    marginTop: 24,
    justifyContent: 'center',
    '& button': {
      margin: '0 16px'
    }
  },
  searchImg: {
    width: 14,
    height: 14,
    padding: '5px 3px 0px 2px'
  },
  incidenceIcon: {
    width: 25,
    height: 25
  },
  searchText: {
    position: 'relative',
    bottom: '1.5px'
  },
  title: {
    fontSize: 36,
    color: 'rgba(0, 69, 113, 1)'
  },
  Link: {
    fontSize: 14,
    color: '#0066CC',
    marginTop: 20,
    alignItems: 'flex-end',
    textDecoration: 'none',
    justifyContent: 'flex-end'
  },
  Link2: {
    fontSize: 12,
    color: '#0066CC',
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  Link3: {
    fontSize: 12,
    color: '#0066CC',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    cursor: 'pointer'
  },
  arrowIcon2: {
    width: 9,
    height: 17,
    marginLeft: '10px',
    '& img': {
      width: '100%',
      height: '53%'
    }
  },
  ArrowIcon: {
    filter: 'invert(22%) sepia(100%) saturate(1966%) hue-rotate(197deg) brightness(101%) contrast(101%)'
  },
  backLink: {
    fontSize: 16,
    color: '#1674D1',
    alignItems: 'center',
    marginRight: 18,
    cursor: 'pointer',
    [theme.breakpoints.down('sm')]: {
      margin: '0 0 6px'
    }
  },
  backIcon: {
    width: 7,
    marginRight: 10
  },
  headerTitle: {
    fontFamily: 'Arial, Helvetica, Arial, serif',
    fontSize: '36px',
    fontWeight: 100,
    color: 'rgba(0, 69, 113, 1.0)',
    textAlign: 'center',
    margin: '26px 30px',
  },
  subContainer: {
    padding: '0rem 4rem 4rem 4rem',
  },
  basicWrapper: {
    paddingBottom: '0.8rem',
  },
  dataWrapper: {
    border: 'solid 1px #EBE9E6',
    borderRadius: '18px',
    marginRight: 20,
    padding: '0px 15px',
  },
  dataWrapper2: {
    width: 396,
    border: 'solid 1px #EBE9E6',
    borderRadius: '18px',
    paddingTop: '0px 15px',
  },
  dataWrapper3: {
    width: '97.1%',
    border: 'solid 1px #EBE9E6',
    borderRadius: '18px',
    marginTop: 20,
    padding: '0px 15px',
    paddingBottom: '15px'
  },
  dataTitle: {
    fontSize: 18,
    textAlign: 'center',
    color: 'rgba(0, 69, 113, 1.0)',
    marginTop: 14
  },
  datepickerContainer: {
    marginTop: 10,
    padding: '0px 20%'
  },
  datepickerTitle: {
    fontSize: 12,
    color: 'rgba(0, 69, 113, 1.0)',
  },
  SearchButton: {
    cursor: 'pointer',
  },
  container5: {
    paddingTop: '70px',
  },
  endButton: {
    marginRight: 20
  },
  questionContainer: {
    marginBottom: '1rem',
    '&.mobile': {
      textAlign: 'center'
    }
  },
  buttonsCont: {
    marginTop: '15px'
  },
  buttonRow: {
    marginTop: '2rem',
  },
  loadingButton: {
    margin: '20px 0px'
  },
  emptyList: {
    marginTop: '1rem',
  },
  innerArea: {
    border: '2px solid #f0eeec',
    backgroundColor: '#F7F7F7',
    padding: '15px 0px',
    justifyContent: 'space-between'
  },
  icon: {
    margin: '5px 0px 0px 5px',
    width: 15
  },
  warningIcon: {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    width:'2.4%',
    marginBottom:'26px'
  },
  innerDescriptionText: {
    margin: '5px 5px 0px 5px',
    textAlign: 'right',
    fontSize: 14,
    float: 'left',
    color: colors.primary,
    fontWeight: 'bold'
  },
  innerPointInformation: {
    margin: '5px 5px 0px 5px',
    textAlign: 'left',
    fontSize: 14,
    color: '#6a6a6a',
  },
  closeButton: {
    marginTop: -5,
    marginRight: -5,
    padding: '4px 0'
  },
  modalContainer: {
    border: '2px solid rgb(61, 114, 147)',
    outline: 'none',
    [theme.breakpoints.down('sm')]: {
      overflow: 'auto'
    }
  },
  block: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  inputsContainer: {
    width: '92%'
  },
  wrapperTitle: {
    width: '100%',
    marginTop: '20px',
    color: 'rgba(0, 69, 113, 1.0)',
    fontWeight: 'bold'
  },
  radioButtonsContainer: {
    paddingTop: 20
  },
  radioButtonText: {
    marginLeft: '0px',
    color: 'rgba(0, 69, 113, 1.0)',
    fontSize: '15px',
    float: 'left',
    marginRight: '0px',
    fontWeight: 'bold',
    marginTop: '5px',
    marginBottom: '20px',
    justifyContent: 'start',
    alignItems: 'center'
  },
  textArea: {
    padding: '35px 0px',
    '& .MuiOutlinedInput-multiline': {
      color: '#6a6a6a',
    }
  },
  innerArea2: {
    // height: '350px',
    border: '2px solid #f0eeec',
    backgroundColor: '#F7F7F7',
    padding: '20px',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      paddingLeft: '15px',
      paddingRight: '15px'
    }
  },
  innerArea3: {
    // height: '350px',
    border: '2px solid #f0eeec',
    backgroundColor: '#F9F8F7',
    padding: '20px',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      paddingLeft: '15px',
      paddingRight: '15px'
    },
    marginTop: '1.33em',
  },
  innerArea4: {
    // height: '350px',
    padding: '20px',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      paddingLeft: '15px',
      paddingRight: '15px'
    }
  },
  cancelButton: {
    marginTop: 24,
    color: colors.primary,
    justifyContent: 'center',
    '& button': {
      margin: '0 16px'
    }
  },
  requiredFields: {
    color: '#939498',
    fontSize: '14px',
    textAlign: 'center',
    marginTop: '50px'
  },
  questionsTitle: {
    width: '100%',
    fontSize: '14px',
    color: 'rgba(0, 69, 113, 1.0)',
    fontWeight: 'bold'
  },
  borderRight: {
    borderRight: '2px solid #f0eeec'
  },
  questionText: {
    fontSize: '14px',
    paddingTop: '12px',
    color: '#6ea8e2',
    textDecoration: 'underline',
    cursor: 'pointer'
  },
  contactDataCont: {
    paddingTop: '20px'
  },
  selectorCont: {
    paddingTop: '10px'
  },
  errorGrid: {
    backgroundColor: '#F2F5F8',
    display: 'flex',
    gap: '1rem',
    padding: '20px',
    alignContent: 'center',
    alignItems: 'center',
    '& div': {
      display: 'flex',
      flexDirection: 'column',
      '& p': {
        margin: 0,
        color: '#004571',
        fontWeight: 'bold',
        fontSize:'16px'
      }
    }
  },
  credentialError: {
    fontSize: '14px',
    color: '#df5f65',
},
}))

export default useStyles;
