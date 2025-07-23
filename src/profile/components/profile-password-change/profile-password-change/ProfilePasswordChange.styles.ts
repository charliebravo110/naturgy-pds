import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '20px 0',
    marginTop: 73,
    '&.logged': {
      marginTop: 140
    }
  },
  headerTitle: {
    fontSize: 36,
    color: 'rgba(0, 69, 113, 1)',
    textAlign: 'center',
    marginTop: 26,
    marginBottom: 46
  },
  dossierDateAdviseTitle: {
    height: 110,
    padding: 5,
    fontWeight: 'bold',
    color: '#256094',
    [theme.breakpoints.only('xs')]: {
      textAlign: 'left',
      height: 50,
    }
  },
  dossierDateAdviseContainer: {
    backgroundColor: '#F2F5F8',
    marginBottom: 46,
    padding: '15px',
    borderRadius: '5px',
    fontSize: '16px'
    },
  dossierDateAdviseBox: {
    margin: '0 auto',
    marginTop: 6,
    marginBottom: 6

    },
  dossierDateAdviseBlue: {
    color: '#256094',
    [theme.breakpoints.only('xs')]: {
      textAlign: 'left'
    }
  },
  profileBlock: {
    '-webkit-box-shadow': '0px 0px 3px 1px rgba(207, 205, 207, 1)',
    '-moz-box-shadow': '0px 0px 3px 1px rgba(207, 205, 207, 1)',
    boxShadow: '0px 0px 3px 1px rgba(207, 205, 207, 1)'
  },
  profileBlockLeft: {
    backgroundColor: '#F8F7F5',
    [theme.breakpoints.up('md')]: {
      paddingTop: 64,
      paddingLeft: 32
    },
    [theme.breakpoints.down('sm')]: {
      padding: 32
    }
  },
  profileBlockRight: {
    paddingBottom: 16,
    [theme.breakpoints.only('xs')] : {
      paddingTop: 32,
    },
    [theme.breakpoints.up('sm')] : {
      paddingTop: 64,
    }
  },
  avatar: {
    color: '#E77202',
    width: 72,
    zIndex: 1,
    position: 'relative'
  },
  avatarContainer: {
    marginRight: 24,
    position: 'relative',
    [theme.breakpoints.up('md')] : {
      marginLeft: -36
    },
    [theme.breakpoints.down('sm')] : {
      marginLeft: 16
    },
  },
  titleContainer: {
    [theme.breakpoints.up('md')] : {
      paddingTop: 12
    },
    [theme.breakpoints.down('sm')] : {
      marginLeft: 24
    }
  },
  title: {
    fontSize: 32,
    color: 'rgba(0, 69, 113, 1)'
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#525659',
    [theme.breakpoints.only('xs')] : {
      marginTop: 12,
      marginLeft: -80
    }
  },
  data: {
    [theme.breakpoints.up('sm')]: {
      paddingTop: 40,
      paddingBottom: 24
    }
  },
  inputs: {
    [theme.breakpoints.up('md')] : {
      paddingLeft: 56,
      paddingRight: 56,
      paddingTop: 80
    },
    [theme.breakpoints.down('sm')] : {
      paddingTop: 56,
      paddingLeft: 16
    }
  },
  inputContainer: {
    width: '100%',
    [theme.breakpoints.down('sm')] : {
      width: '95%',
      paddingRight: 16
    }
  },
  strengthAdapter: {
    [theme.breakpoints.only('xs')] : {
      paddingTop: 16
    }
  },
  textField: {
    marginTop: 8,
    marginBottom: 8
  },
  label: {
    marginRight: 12,
    color: 'rgba(0, 69, 113, 1)'
  },
  required: {
    fontSize: 16,
    color: '#525659'
  },
  buttons: {
    [theme.breakpoints.only('xs')] : {
      marginTop: 32
    },
    [theme.breakpoints.up('sm')] : {
      marginTop: 96
    }
  },
  button: {
    margin: 16,
    [theme.breakpoints.only('xs')] : {
      width: '100%'
    }
  },
  tooltipImage: {
    height: 16,
    marginTop: 4
  },
  oldPasswordInputCont: {
    padding: '50px 0 30px 0',
  },
  errorAlert: {
    maxWidth: '300px',
    backgroundColor: '#F2F5F8',
    color: '#D3222A',
    alignItems: 'center',
    padding: '12px 18px',
    border: 'solid 1px #D3222A',
    borderRadius: 4,
    margin: '0 auto 30px auto',
    '& .icon': {
      display: 'inline-block',
      width: 32,
      height: 32,
      boxSizing: 'border-box',
      backgroundColor: '#D3222A',
      textAlign: 'center',
      padding: 8,
      borderRadius: '50%',
      '& img': {
        width: 14
      }
    },
    '& .text': {
      width: '82%',
      fontSize: 12,
      textAlign: 'left',
      marginLeft: 12,
      [theme.breakpoints.down('sm')]: {
        textAlign: 'center',
        margin: '10px 0 0'
      }
    }
  },
  recoverPassword: {
    marginTop: 12,
    color: 'rgba(51, 51, 51, 1)',
    textAlign: 'center'
  },
  recoverPasswordLink: {
    color: 'rgba(0, 102, 204, 1)',
    textDecoration: 'underline'
  },
  tooltipContainer: {
    position: 'relative',
    marginTop: 20
  },
  textField2: {
    margin: 16,
    width: '85%',
    [theme.breakpoints.down('sm')]: {
      margin: 0
    }
  },
  dossierDateAdviseBoxMargin: {
    margin: '0 auto',
    maxWidth: 1000,
    marginTop: 30,
    marginBottom: 6

    }
}))

export default useStyles
