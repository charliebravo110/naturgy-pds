import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    justifyContent: 'center'
  },
  title: {
    color: '#004571',
    fontSize: 30,
    textAlign: 'center',
    margin: '20px 0 20px'
  },
  typologyAndNetwork: {
    color: '#E97000',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15
  },
  description: {
    color: '#838383',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 15
  },
  innerBox: {
    position: 'relative',
    width: '70%',
    minHeight: 120,
    margin: '0 auto'
  },
  innerContainer: {
    marginTop: 20
  },
  cupsContainer: {
    '&.disabled': {
      position: 'relative',
      filter: 'grayscale(100%)',
      '&::before': {
        display: 'block',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        width: '100%',
        height: '100%',
        content: `""`,
        zIndex: 1
      }
    },
    '& input': {
      padding: 14
    }
  },
  question: {
    textAlign: 'right',
    marginTop: 4,
    '& span': {
      color: '#004571',
      fontSize: 13,
      cursor: 'pointer',
      textDecoration: 'underline'
    }
  },
  checkboxContainer: {
    alignItems: 'center',
    marginTop: 20,
    '& .checkbox': {

    },
    '& .label': {
      marginLeft: 6,
      '& span': {
        color: '#004571',
        fontSize: 13,
        cursor: 'pointer',
      }
    }
  },
  consumptionRequestNumberContainer: {
    marginTop: 20,
    '&.disabled': {
      position: 'relative',
      filter: 'grayscale(100%)',
      '&::before': {
        display: 'block',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        width: '100%',
        height: '100%',
        content: `""`,
        zIndex: 1
      }
    }
  },
  inputLabel: {
    color: '#004571',
    fontSize: 14,
    textAlign: 'left',
    marginBottom: 8
  },
  buttons: {
    justifyContent: 'center',
    marginTop: 100,
    '& button': {
      margin: '0 16px'
    },
    [theme.breakpoints.only('xs')]: {
      '& button:first-child': {
        marginBottom: 16
      }
    }
  }
}))

export default useStyles
