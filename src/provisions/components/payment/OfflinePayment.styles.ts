import { makeStyles,withStyles } from '@material-ui/core/styles'
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import Background from './../../../assets/img/bg_login.png'

const useStyles = makeStyles((theme) => ({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 800
  },
  containerMobile: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  inputFields: {
    width: 550
  },
  inputFieldsMobile: {
    width: '100%'
  },
  errorRows: {
    alignItems: 'left',
    paddingLeft: 10
  },
  centred: {
    align: 'center'
  },
  centredMobile: {
    align: 'center',
    width: '100%'
  },
  paymentBackground: {
    padding: '20px 0',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    flexGrow: 1,
    backgroundImage: `url(${Background})`,
    flexDirection: 'row'
  },
  maxWidthForBigScreens: {
    paddingTop: 100,
    width: 800,
    justifyContent: 'center',
    alignItems: 'center',
    selfAlign: 'center'
  },
  maxWidthForBigScreensMobile: {
    flexDirection: 'column',
    paddingTop: 100,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    selfAlign: 'center'
  },
  form: {
    backgroundColor: 'white',
    textAlign: 'center',
    selfAlign: 'center',
    width: 800
  },
  formMobile: {
    backgroundColor: 'white',
    textAlign: 'center',
    selfAlign: 'center',
    width: '100%'
  },
  form2: {
    backgroundColor: 'white',
    aling: 'center',
    textAlign: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    color: 'rgba(0, 69, 113, 1)',
    textAlign: 'center',
    marginTop: 25,
    marginBottom: 12,
    width: '100%'
  },
  block: {
    margin: '15px 15px 15px 15px',
    border: '1px solid #E3EBEF',
    textAlign: 'center',
    width: 770
  },
  blockMobile: {
    margin: '15px 15px 15px 15px',
    border: '1px solid #E3EBEF',
    textAlign: 'center',
    width: '92%'
  },
  errorBox: {
    backgroundColor: '#004571',
    width: 200
  },
  imageBox: {
    width: 20
  },
  info: {
    color: '#2C648A'
  },
  textField: {
    margin: '16px 0',
    width: '74%',
    '& input': {
      '&:-webkit-autofill': {
        animation: '$onAutoFillStart 2000ms infinite',
        transition: 'background-color 50000s ease-in-out 0s'
      },
      '&:not(:-webkit-autofill)': {
        animation: '$onAutoFillCancel 2000ms infinite'
      }
    }
  },
  paymentTitle: {
    color: '#004571',
    fontSize: 26,
    margin: '25px 0 25px'
  },
  payment: {
    color: '#E57000',
    fontWeight: 'bold',
    fontSize: 50
  },
  paymentSubtitle: {
    color: '#004571',
    fontWeight: 'bold',
    margin: '25px 0 25px'
  },
  blockSubtitle: {
    color: '#004571',
    fontWeight: 'bold',
    paddingTop: 25,
    paddingBottom: 25
  },
  greySubtitle: {
    color: '#62625d',
    alignSelf: 'center',
    margin: '25px 0 25px'
  },
  greySubtitleV2: {
    color: '#62625d',
    alignSelf: 'center',
    margin: '35px 0 10px',
    width: '100%'
  },
  greySubtitleV2Mobile: {
    paddingRight: '8%',
    color: '#62625d',
    alignSelf: 'center',
    margin: '35px 0 10px',
    width: '100%'
  },
  separator: {
    width: '90%',
    alignSelf: 'center',
    height: '1px',
    backgroundColor: '#E3EBEF',
    margin: '20px 0'
  },
  paymentText: {
    color: '#62625d',
    alignSelf: 'center',
    margin: '25px 0 10px'
  },
  paymentTextV2: {
    color: '#62625d',
    alignSelf: 'center',
    margin: '15px 0 10px'
  },
  bluePaymentText: {
    color: '#004571',
    margin: '25px 0 10px'
  },
  error: {
    color: '#F15B70',
    fontWeight: 'bold',
    marginTop: 30
  },
  buttons: {
    justifyContent: 'center',
    marginBot: 25,
    paddingBot: 20,
    '& button': {
      margin: '15px 16px',
      [theme.breakpoints.only('xs')]: {
        '&:first-child': {
          marginBottom: 16
        }
      }
    }
  },
  buttonsMobile: {
    justifyContent: 'center',
    marginBot: 25,
    paddingBot: 5,
    '& button': {
      margin: '15px 16px',
      [theme.breakpoints.only('xs')]: {
        '&:first-child': {
          marginBottom: 16
        }
      }
    }
  },
  button: {
    margin: 10
  },
  forms: {
    margin: '40px 0'
  },
  completedTitle: {
    color: '#004571',
    fontSize: 24,
    margin: '25px 0 25px',
    textAlign: 'center'
  },
  completedDescription: {
    color: '#E97000',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  question: {
    color: '#004571',
    fontWeight: 'bold',
    fontSize: '15px'
  },
  questions: {
    marginTop: 30
  },
  subtitle: {
    color: '#004571',
    marginBottom: 7,
    textAlign: 'left'
  },
  label: {
    textAlign: 'left',
    marginBottom: 7,
    color: '#004571',
    fontSize: '14px'
  },
  questionForm: {
    marginTop: 7,
    padding: '0% 15%'
  },
  input: {
    color: '#868686',
    marginBottom: 12,
    '& .MuiSelect-root': {
      color: '#868686'
    }
  }, 
  functionDisabled: {
    backgroundColor: '#F2F5F8',
    marginBottom: 20,
    padding: '15px',
    borderRadius: '5px',
    fontSize: '16px'
  },
  functionDisabled2: {
    backgroundColor: '#F2F5F8',
    marginBottom: 20,
    marginTop: 20,
    padding: 10,
    width: 400,
    borderRadius: '5px',
    fontSize: '16px',
    alignItems: 'left'
  },
  functionDisabled2Mobile: {
    backgroundColor: '#F2F5F8',
    marginBottom: 20,
    marginTop: 20,
    padding: 10,
    width: '90%',
    borderRadius: '5px',
    fontSize: '16px',
    alignItems: 'left'
  },
  functionDisabled3: {
    width: '100%',
    backgroundColor: '#F2F5F8',
    marginBottom: 20,
    padding: '15px',
    borderRadius: '5px',
    fontSize: '16px'
  },
  alertImg: {
    width: 20,
    height: 'auto',
    border: 0,
    selfAlign: 'start'
  },
  functionDisabledTitle: {
    paddingTop: 6,
    fontWeight: 'bold',
    alignText: 'left',
    selfAlign: 'center',
    color: '#256094'
  },
  iframe: {
    width: '100%',
    height: 54,
    border: 0,
    [theme.breakpoints.down('lg')]: {
      width: '100%'
    }
  },
  iframeExt: {
    width: '100%',
    height: 700,
    border: 0,
    [theme.breakpoints.down('lg')]: {
      width: '100%'
    }
  },
  expansionPanelDetailsTitle: {
    color: '#004571',
    fontWeight: 'bold',
    textAlign: 'left'
  },
  expansionPanelDetailsValue: {
    color: '#62625d',
    marginTop: 6,
    textAlign: 'left'
  },
  paymentContainer: {
    paddingTop: '100px',
    margin: '10px 0'
  },
  credentialError: {
    fontSize: '14px',
    color: '#df5f65',
  },
  link: {
    textDecoration: 'underline', 
    color: '#6AA1D8',
    margin:'0px',
  },
  policy: {
    color: '#605e5e',
  },
  tabIcon: {
		filter: 'invert(57%) sepia(68%) saturate(3779%) hue-rotate(189deg) brightness(91%) contrast(84%)',
    width: '5%',
    position: 'relative',
    left: '5px',
    top: '5px'
  }
  
}))

const ExpansionPanelDetails = withStyles(theme => ({
  root: {
    width: '100%'
  },
}))(MuiExpansionPanelDetails)

export default useStyles

export {
  ExpansionPanelDetails
}