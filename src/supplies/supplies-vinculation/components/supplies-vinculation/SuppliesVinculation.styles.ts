import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '20px 0',
    marginTop: 126
  },
  headerTitle: {
    fontSize: 36,
    color: 'rgba(0, 69, 113, 1)',
    textAlign: 'center',
    margin: '24px 0 24px'
  },
  formBlock: {
    '-webkit-box-shadow': '0px 0px 3px 1px rgba(207, 205, 207, 1)',
    '-moz-box-shadow': '0px 0px 3px 1px rgba(207, 205, 207, 1)',
    boxShadow: '0px 0px 3px 1px rgba(207, 205, 207, 1)',
    padding: '40px 40px 0',
    maxWidth: 1200
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
    color: '#838383',
    flexBasis: 'auto'
  },
  link: {
    color: '#1674D1',
    textDecoration: 'underline',
    cursor: 'pointer'
  },
  label: {
    fontSize: 16,
    color: 'rgba(0, 69, 113, 1)',
    marginBottom: 8
  },
  button: {
    marginTop: 40,
    marginBottom: 40
  }
}))

export default useStyles
