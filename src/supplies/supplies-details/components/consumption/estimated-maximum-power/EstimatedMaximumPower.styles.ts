import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container2: {
    backgroundColor: '#F8F7F5',
    padding: 30,
    borderRadius: 10,
    marginTop: 40
  },
  legendItemContainer: {
    justifyContent: 'center'
  },
  container4: {
    backgroundColor: '#E5ECF0',
    borderRadius: 10,
    marginRight: 'initial',
    marginTop: 20
  },
  container5: {
    justifyContent: 'flex-end',
    paddingRight: 20,
    paddingBottom: 15
  },
  exportIcon: {
    marginRight: 10,
    '& img': {
      width: 24,
      height: 20
    }
  },
  button: {
    backgroundColor: '#004571',
    color: '#FFF',
    alignItems: 'center',
    padding: '12px 18px',
    borderRadius: 4,
    cursor: 'pointer',
    [theme.breakpoints.up('xs')]: {
      minWidth: 280
    }
  },
  button2: {
    color: '#2c70b7',
    marginBottom: 25,
    paddingLeft: 15,
    //alignItems: 'center',
    padding: '0px 0px',
    borderRadius: 4,
    cursor: 'pointer',
    [theme.breakpoints.up('xs')]: {
      minWidth: 280
    },
    '&.active': {
      fontWeight: 'bold',
      borderColor: '#E57200'
    },
  },

  label2: {
    color: '#777',
    [theme.breakpoints.only('xs')]: {
      marginTop: 2
    }
  },

  section: {
    '&.border': {
      paddingTop: 20,
      //borderTop: 'solid 1px #D9D8D6',
      marginTop: 20
    }
  },
  item: {
    alignItems: 'center',
    marginBottom: 5,
    [theme.breakpoints.down('sm')]: {
      marginBottom: 10
    }
  },
  labelTitle: {
    marginRight: 10,
    color: 'rgba(0, 69, 113, 1)',
    fontWeight: 'bold'
  },
  labelTitle2: {
    marginRight: 10,
    marginLeft: 10,
    color: 'rgba(0, 69, 113, 1)',
    fontWeight: 'bold'
  },
  container: {
    margin: '0 auto',
    [theme.breakpoints.down('sm')]: {
      padding: 2
    }
  },
  maxWidthForBigScreens: {
    maxWidth: 1200,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  title: {
    fontSize: 36,
    color: 'rgba(0, 69, 113, 1)',
    textAlign: 'center',
    justifyContent: 'center',
    borderBottom: 'solid 1px #E1E9EE',
    paddingBottom: 20
  },
  year: {
    color: '#004571',
    paddingTop: 15
  },
  description2: {
    paddingBottom: 25,
    fontSize: 20,
    marginTop: 0,
    color: '#004571',
    lineHeight: '20px',
    paddingTop: 15,
    paddingLeft: 15,

  },
  description: {
    paddingBottom: 20,
    marginTop: 16,
    color: '#555555',
    lineHeight: '20px'
  },
  label: {
    color: 'rgba(0, 69, 113, 1)'
  },


  adolfoDescription: {
    padding: 10,
    color: 'rgba',
    marginLeft: 200
  },

  adolfoDescription1: {
    padding: 10,
    fontWeight: 'bold',
    color: 'rgba'
  },

  containerUno: {
    margin: '0 auto',
    [theme.breakpoints.down('sm')]: {
      padding: 0
    }
  },

  menu: {
    marginTop: 6,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      justifyContent: 'center'
    }
  },

  menuUnoPaco: {
    display: 'block',
    border: 'solid 4px #F0F3F4',
    height: '50%',
    padding: 1,
    margin: 5,
    '&.active': {
      fontWeight: 'bold',
      borderColor: '#E57200'
    },
  },

  menuUno: {
    padding: 10,
    border: 'solid 4px #F0F3F4',
    borderLeft: '4px solid #CE242C',
    color: 'rgba ',
    borderRadius: 8,
    cursor: 'pointer',
    marginLeft: 40,
    '&:first-child': {
      marginLeft: 0
    },
    '&.active': {
      fontWeight: 'bold',
      borderColor: '#E57200'
    },

  },

  menuDos: {
    padding: '12px 20px',
    border: 'solid 1px #E1E9EE',
    color: '#004571',
    borderRadius: 4,
    cursor: 'pointer',
    marginLeft: 4,
    '&:first-child': {
      marginLeft: 0
    },
    '&.active': {
      fontWeight: 'bold',
      borderColor: '#E57200'
    },
    [theme.breakpoints.down('sm')]: {
      width: '32.5%',
      textAlign: 'center'
    }
  },

  menuItem: {
    margin: '20px 0'
  },
  menuItemCompare: {
    padding: '7px',
    border: 'solid 1px #E1E9EE',
    color: '#004571',
    borderRadius: 4,
    cursor: 'pointer',
    marginBottom: 15,
    '&:first-child': {
      marginLeft: 0
    },
    '&.active': {
      fontWeight: 'bold',
      borderColor: '#E57200'
    },
    [theme.breakpoints.down('sm')]: {
      width: '32.5%',
      textAlign: 'center'
    }
  },
  graphBlock: {
    marginTop: 150
  },
  graphContainer: {
    height: 150,
    width: '65%',
    borderBottom: '2px solid #F0F3F4',
    position: 'relative'
  },
  graphContainerMobile: {
    height: 75,
    borderBottom: '2px solid #F0F3F4',
    position: 'relative'
  },
  graphConsumed: {
    height: '100%',
    width: '0%',
    maxWidth: 1000,
    position: 'relative',
    backgroundColor: '#44B5BD',
    transition: 'width 1s ease-in-out'
  },
  graphConsumedNeg: {
    height: '100%',
    width: '0%',
    maxWidth: 1000,
    position: 'relative',
    backgroundColor: '#E5F4F7',
    transition: 'width 1s ease-in-out'
  },
  graphDifference: {
    height: '100%',
    width: '0%',
    position: 'relative',
    backgroundColor: '#E5F4F7',
    transition: 'width 1s ease-in-out'
  },
  graphDifferenceNegative: {
    height: '100%',
    width: '0%',
    left: '0',
    position: 'absolute',
    transition: 'width 1s ease-in-out',
    backgroundColor: '#44B5BD',
    zIndex: 1
  },
  graphBlank: {
    height: '100%',
    position: 'relative',
  },
  barConsumed: {
    position: 'absolute',
    height: 'calc(100% + 34px)',
    top: '-17px',
    right: '-2px',
    borderLeft: '4px dashed #1E98A1',
    zIndex: 1,
    [theme.breakpoints.only('xs')]: {
      borderLeft: '2px dashed #1E98A1'
    }
  },
  barMax: {
    position: 'absolute',
    height: 'calc(100% + 34px)',
    top: '-17px',
    right: '-2px',
    borderLeft: '4px solid #CE242C',
    zIndex: 1,
    [theme.breakpoints.only('xs')]: {
      borderLeft: '2px solid #CE242C'
    }
  },
  infoConsumed: {
    position: 'absolute',
    right: 0,
    top: '-100px',
    minWidth: 110
  },
  infoConsumedNeg: {
    position: 'absolute',
    left: '100%',
    top: '-100px'
  },
  infoMax: {
    position: 'absolute',
    left: 0,
    top: '-100px',
    width: '190px'
  },
  infoMaxNeg: {
    position: 'absolute',
    right: 0,
    top: '-100px',
    width: '190px'
  },
  infoLabel: {
    fontSize: 18,
    textAlign: 'right',
    letterSpacing: '1px',
    color: 'rgba(0, 69, 113, 1)'
  },
  infoW: {
    fontSize: 18,
    color: '#96A6B4',
    position: 'absolute',
    top: 10,
    right: -40,
    [theme.breakpoints.only('xs')]: {
      top: 7,
      right: -35,
    }
  },
  infoNumberConsumed: {
    width: 'fit-content',
    display: 'table',
    fontSize: 56,
    letterSpacing: 1,
    marginRight: 40,
    color: '#1E98A1',
    position: 'relative',
    [theme.breakpoints.only('xs')]: {
      fontSize: 46
    }
  },
  infoNumberMax: {
    width: 'fit-content',
    display: 'table',
    fontSize: 56,
    letterSpacing: 1,
    marginRight: 40,
    color: '#CE242C',
    position: 'relative',
    [theme.breakpoints.only('xs')]: {
      fontSize: 46
    }
  },
  rulerContainer: {
    height: 15,
    marginBottom: 30,
    width: '65%'
  },
  rulerPart: {
    position: 'relative',
    borderLeft: '2px solid #F0F3F4'
  },
  rulerW: {
    position: 'absolute',
    fontSize: 14,
    bottom: '-20px',
    left: '-15px',
    color: 'rgba(0, 69, 113, 1)'
  },
  mobileLabelsContainer: {
    marginBottom: -120,
    paddingTop: 30
  },
  mobileMargin: {
    marginBottom: 20
  },
  selectYear: {
    paddingTop: 5,
    paddingBottom: 15
  },
  header: {
    alignItems: 'flex-start'
  },
  exportImg: {
    marginLeft: 10
  },
  formTitle: {
    fontSize: 15,
    marginTop: 0,
    color: 'rgba(0, 69, 113, 1)',
    lineHeight: '20px',
    paddingTop: 15,
    paddingLeft: 15,
    fontWeight: 'bold'
  },
  formItem: {
    fontSize: 15,
    marginTop: 0,
    color: 'rgba(0, 69, 113, 1)',
    lineHeight: '20px',
    paddingTop: 15,
    paddingLeft: 15
  },
  alertContainer: {
    paddingTop: 15,
    paddingLeft: 15
  },
  infoContainer: {
    paddingTop: 15,
    paddingLeft: 15
  },
  comerContainer: {
    paddingTop: 15,
    paddingLeft: 15,
    paddingBottom: 10,
    fontSize: 15,
    color: 'rgba(0, 69, 113, 1)',
    lineHeight: '20px',
    fontWeight: 'bold'
  },
  comerContainer1: {
    paddingTop: 15,
    justifyContent: 'left',
    paddingBottom: 10,
    fontSize: 15,
    color: 'rgba(0, 69, 113, 1)',
    lineHeight: '20px',
    fontWeight: 'bold'
  },
  linkContainer: {
    textDecoration: 'underline',
    color: 'rgba(0, 69, 113, 1)',
    paddingBottom: 10,
    fontWeight: 'bold'
  },
  buttonContainer2: {
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 10
  },
  textNormal: {
    fontSize: 15,
    color: 'rgba(0, 69, 113, 1)',
    lineHeight: '20px'
  },
  textBold: {
    fontSize: 15,
    color: 'rgba(0, 69, 113, 1)',
    lineHeight: '20px',
    fontWeight: 'bold',
    paddingBotom: 5
  },
  textBold2: {
    fontSize: 15,
    color: 'rgba(0, 69, 113, 1)',
    lineHeight: '20px',
    fontWeight: 'bold',
    paddingBotom: 5,
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: 10
  },
  textRed: {
    fontSize: 15,
    color: 'rgba(255, 0, 0, 1)',
    lineHeight: '20px',
    fontWeight: 'bold'
  },
  formHiredPower: {
    fontSize: 15,
    marginTop: 0,
    color: 'rgba(0, 69, 113, 1)',
    lineHeight: '20px',
    paddingLeft: 5,
    fontWeight: 'normal'
  },
  divider: {
    width: '100%',
    marginTop: 15,
    marginBottom: 15
  },
  input: {
    width: '100%',
    '& input': {
      padding: 14,
      backgroundColor: 'white'
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%'
    }
  },
  box: {
    top: 'calc(100% + 2px)',
    right: 0,
    left: 0,
    height: '10rem',
    overflow: 'auto',
    backgroundColor: '#FFF',
    border: 'solid 1px #004571',
    borderRadius: 4,
    zIndex: 9999999,
    [theme.breakpoints.up('xs')]: {
      marginLeft: 8,
      marginRight: 8
    }
  },
  formInput: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 15
  },
  closeButton: {
    marginTop: -5,
    marginRight: -5,
    padding: '4px 0'
  },
  closeButtonCompare: {
    padding: 4,
    color: '#004571',
    marginLeft: 3
  },
  closeIcon: {
    top: 14,
    right: 14,
    width: 14
  },
  formIcon: {
    top: 25,
    right: 25,
    width: 25
  },
  topContainer: {
    padding: 30,
    borderRadius: 10,
    marginTop: 40,
    justifyContent: 'center',
    textAlign: 'center'
  },
  topContainer2: {
    borderRadius: 10,
    justifyContent: 'center',
    textAlign: 'center',
    paddingRight: 30,
    paddingLeft: 30
  },
  labelTop: {
    color: '#777',
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 10,
    '& span': {
      color: '#004571',
      fontWeight: 'bold',
      marginRight: 20
    },
    [theme.breakpoints.only('xs')]: {
      marginTop: 2
    }
  },
  labelDate: {
    color: '#777',
    //marginLeft: 10,
    //marginRight: 25,
    '& span': {
      color: '#004571',
    },
    [theme.breakpoints.only('xs')]: {
      marginTop: 2,
      width: '100%'
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    },
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
  noItems: {
    textAlign: 'center',
    justifyContent: 'center',
    '& .row': {
      display: 'block',
      textAlign: 'center',
      marginTop: 24
    },
    '& .title': {
      color: '#004571',
      fontSize: 18
    },
    '& .description': {
      color: '#777'
    },
    '& .buttons': {
      justifyContent: 'center',
      marginTop: 36
    }
  },
  hourSelectors: {
    marginTop: 18,
    justifyContent: 'center'
  },
  hourSelectorsItem: {
    display: 'flex',
    alignItems: 'center',
    marginRight: 30,
    '& span': {
      marginLeft: 6
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      justifyContent: 'center'
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
  radioButtonGrey: {
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
      backgroundColor: 'rgba(191, 184, 174, 1)',
      content: '""',
      borderRadius: '50%',
      cursor: 'default'
    }
  },
  radioButtonRed: {
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
      backgroundColor: '#d3222a',
      content: '""',
      borderRadius: '50%',
      cursor: 'default'
    }
  },
  radioButtonOrange: {
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
      backgroundColor: '#e57200',
      content: '""',
      borderRadius: '50%',
      cursor: 'default'
    }
  },
  radioButtonYellow: {
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
      backgroundColor: '#edab46',
      content: '""',
      borderRadius: '50%',
      cursor: 'default'
    }
  },
  radioButtonGreen: {
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
      backgroundColor: '#bfbf60',
      content: '""',
      borderRadius: '50%',
      cursor: 'default'
    }
  },
  radioButtonDarkGreen: {
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
      backgroundColor: '#5fad83',
      content: '""',
      borderRadius: '50%',
      cursor: 'default'
    }
  },
  radioButtonBlue: {
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
      backgroundColor: '#009aa6',
      content: '""',
      borderRadius: '50%',
      cursor: 'default'
    }
  },
  text: {
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: 10
  },
  buttonCompare: {
    padding: '3px 20px 4px',
    height: 44,
    '& span[class^="MuiButton-label"]': {
      fontSize: 16
    },
    [theme.breakpoints.only('xs')]: {
      paddingLeft: '20px',
      height: '44px',
      width: '50%',
      minWidth: '100%'
    }
  },
  buttonContainer: {
    marginLeft: 'auto',
    marginRight: 20,
    paddingBottom: 15,
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
      marginTop: 16
    },
    [theme.breakpoints.up('sm')]: {
      width: 'auto',
      flexBasis: 'auto'
    },
  },
  buttonMobile: {
    [theme.breakpoints.down('sm')]: {
      marginLeft: 8,
      marginBottom: 5
    },
    [theme.breakpoints.down('xs')]: {
      marginLeft: 8,
      marginBottom: 5
    },
  },
  filtersmenu: {
    paddingTop: 15,
    paddingBottom: 15,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      justifyContent: 'center'
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      justifyContent: 'center'
    }
  },
  filtersmenuItem: {
    padding: '7px',
    fontSize: 20,
    border: 'solid 1px #E1E9EE',
    color: '#004571',
    borderRadius: 4,
    cursor: 'pointer',
    marginLeft: 4,
    '&:first-child': {
      marginLeft: 0
    },
    '&.active': {
      fontWeight: 'bold',
      borderColor: '#E57200'
    },
    [theme.breakpoints.down('sm')]: {
      width: '32.5%',
      textAlign: 'center'
    }
  },
  dialogPadding: {
    padding: 5,
    [theme.breakpoints.down('sm')]: {
      pading: 0
    }
  },
  alertIcon: {
    height: '100%'
  },
  alertBlock: {
    [theme.breakpoints.only('xs')]: {
      textAlign: 'center'
    }
  },
  gridDisabled: {
    pointerEvents: 'none',
    backgroundColor: '#e0e0e0',
    color: '#bcbcbc',
    alignItems: 'center',
    padding: '12px 18px',
    borderRadius: 4,
    cursor: 'pointer',
    [theme.breakpoints.up('xs')]: {
      minWidth: 280
    }
  },
  whiteTextRed: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d3222a',
    color: '#ffffff',
    borderRadius: 1,
    fontSize: 11,
    textAlign: 'center'
  },
  whiteTextRed2: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e99094',
    color: '#ffffff',
    borderRadius: 1,
    fontSize: 11,
    textAlign: 'center'
  },
  whiteTextRed3: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f6d3d4',
    color: '#ffffff',
    borderRadius: 1,
    fontSize: 11,
    textAlign: 'center'
  },
  whiteTextOrange: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e57200',
    color: '#ffffff',
    borderRadius: 1,
    fontSize: 11,
    textAlign: 'center'
  },
  whiteTextOrange2: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2b880',
    color: '#ffffff',
    borderRadius: 1,
    fontSize: 11,
    textAlign: 'center'
  },
  whiteTextOrange3: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fae3cc',
    color: '#ffffff',
    borderRadius: 1,
    fontSize: 11,
    textAlign: 'center'
  },
  whiteTextYellow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#edab46',
    color: '#ffffff',
    borderRadius: 1,
    fontSize: 11,
    textAlign: 'center'
  },
  whiteTextYellow2: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f6d5a3',
    color: '#ffffff',
    borderRadius: 1,
    fontSize: 11,
    textAlign: 'center'
  },
  whiteTextYellow3: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fbeeda',
    color: '#ffffff',
    borderRadius: 1,
    fontSize: 11,
    textAlign: 'center'
  },
  whiteTextGreen: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#bfbf60',
    color: '#ffffff',
    borderRadius: 1,
    fontSize: 11,
    textAlign: 'center'
  },
  whiteTextGreen2: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#c7c980',
    color: '#ffffff',
    borderRadius: 1,
    fontSize: 11,
    textAlign: 'center'
  },
  whiteTextGreen3: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e8e9cc',
    color: '#ffffff',
    borderRadius: 1,
    fontSize: 11,
    textAlign: 'center'
  },
  whiteTextDarkGreen: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5fad83',
    color: '#ffffff',
    borderRadius: 1,
    fontSize: 11,
    textAlign: 'center'
  },
  whiteTextDarkGreen2: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#92c7aa',
    color: '#ffffff',
    borderRadius: 1,
    fontSize: 11,
    textAlign: 'center'
  },
  whiteTextDarkGreen3: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#c7e5d5',
    color: '#ffffff',
    borderRadius: 1,
    fontSize: 11,
    textAlign: 'center'
  },
  whiteTextBlue: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#009aa6',
    color: '#ffffff',
    borderRadius: 1,
    fontSize: 11,
    textAlign: 'center'
  },
  whiteTextBlue2: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#80ccd3',
    color: '#ffffff',
    borderRadius: 1,
    fontSize: 11,
    textAlign: 'center'
  },
  whiteTextBlue3: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ccebed',
    color: '#ffffff',
    borderRadius: 1,
    fontSize: 11,
    textAlign: 'center'
  },
  whiteTextDarkBlue: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#004571',
    color: '#ffffff',
    borderRadius: 1,
    fontSize: 11,
    textAlign: 'center'
  },
  whiteTextDarkBlue2: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#66c3ca',
    color: '#ffffff',
    borderRadius: 1,
    fontSize: 11,
    textAlign: 'center'
  },
  whiteTextGrey: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#bfb8ae',
    color: '#ffffff',
    borderRadius: 1,
    fontSize: 11,
    textAlign: 'center'
  },
  whiteTextDarkBlue3: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4d7d9c',
    color: '#ffffff',
    borderRadius: 1,
    fontSize: 11,
    textAlign: 'center'
  },
  whiteTextDarkBlue4: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#90bad5',
    color: '#ffffff',
    borderRadius: 1,
    fontSize: 11,
    textAlign: 'center'
  }
}))

export default useStyles
