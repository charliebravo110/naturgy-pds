import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '20px 0',
    marginTop: 126,
    [theme.breakpoints.only('xs')]: {
      marginTop: 70
    }
  },
  maxWidthForBigScreens: {
    maxWidth: 1200,
    width: '100%'
  },
  headerTitle: {
    fontSize: 36,
    color: 'rgba(0, 69, 113, 1)',
    textAlign: 'center',
    margin: '26px 0 30px'
  },
  formBlock: {
    '-webkit-box-shadow': '0px 0px 3px 1px rgba(207, 205, 207, 1)',
    '-moz-box-shadow': '0px 0px 3px 1px rgba(207, 205, 207, 1)',
    boxShadow: '0px 0px 3px 1px rgba(207, 205, 207, 1)',
    padding: 40
  },
  newProvisionLink: {
    color: '#1674D1',
    alignItems: 'center',
    marginBottom: 16,
    cursor: 'pointer',
    '& .marginLeft': {
      marginLeft: 10
    }
  },
  newProvisionLinkIcon: {
    width: 18,
    height: 18,
    alignItems: 'center',
    '& img': {
      width: 18
    }
  },
  subtitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'rgba(0, 69, 113, 1)'
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: '#838383'
  },
  link: {
    color: '#1674D1'
  },
  label: {
    fontSize: 16,
    color: 'rgba(0, 69, 113, 1)',
    height: 16,
    marginBottom: 8
  },
  button: {
    marginTop: 40
  },
  newServiceLink: {
    color: '#1674D1',
    textDecoration: 'none'
  },
  iconTextButton: {
    width: 18
  },
}))

export default useStyles
