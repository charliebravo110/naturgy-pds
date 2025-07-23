import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({

  block: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  container: {
    padding: '0 20px',
    justifyContent: 'center'
  },
  title: {
    fontSize: 30,
    color: '#004571',
    textAlign: 'center',
    margin: '20px 0 20px'
  },
  text: {
    fontSize: 15,
    color: '#838383',
    textAlign: 'center',
    boxSizing: 'border-box',
    marginButtom: 25
  },
  containerDocumentation: {
    position: 'relative',
    boxSizing: 'border-box',
    margin: '0 auto',
    backgroundColor: '#F2F1EF',
    marginTop: 20,
    alignItems: 'center',
    padding: 12
  },
  img: {
    alignItems: 'center',
    [theme.breakpoints.up('md')]: {
      margin: '6px 0 6px 68px',
    },
    [theme.breakpoints.only('md')]: {
      width: 'calc(100% - 48px)',
      marginLeft: 0
    },
    [theme.breakpoints.down('md')]: {
      marginBottom: 32
    },
    [theme.breakpoints.only('xs')]: {
      width: '50%'
    }
  },
  textBlueBold:{
    fontSize: 14,
    color: '#004571',
    fontWeight: 'bold',
    marginBottom: '5px',
    marginTop: '15px'
  },
  textOrange: {
    fontSize: 18,
    color: '#E97000',
    fontWeight: 'bold',
    paddingBottom: 26
  },
  textBlue:{
    fontSize: 14,
    color: '#004571',
    marginTop: 4,
    '& span': {
      fontSize: 20,
      fontWeight: 'bold',
      marginRight: 6
    }
  },
  textBlack: {
    fontSize: 14,
    marginTop: 4
  },
  cieContainer: {
    marginTop: 8
  },
  answersContainer: {
    paddingLeft: 24,
    marginTop: 8
  },
  button: {
    justifyContent: 'center',
    marginTop: 20,
    '& button': {
      margin: '0 8px'
    },
    [theme.breakpoints.only('xs')]: {
      '& button:first-child': {
        marginBottom: 16
      }
    }
  },
  icon: {

  },
  label: {
    marginLeft: 12
  },
  link: {
    color: '#1674D1',
    fontSize: 13,
    cursor: 'pointer'
  },
  openExpedientSupply: {
    height: '95%'
  },
  messageInfoExpedientSupply: {
    paddingRight: 60,
    fontSize: '14px',
    color: '#4b788f',
    fontWeight: 'bold'
  },
  linkDocumentation: {
    color: '#5496d8'
  }
}))

export default useStyles
