import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '20px 0',
    marginTop: 126
  },
  maxWidthForBigScreens: {
    maxWidth: 1200
  },
  headerTitle: {
    fontFamily: 'Arial, Helvetica, Arial, serif',
    fontSize: '36px',
    color: 'rgba(0, 69, 113, 1.0)',
    textAlign: 'center',
    margin: '26px 30px'
  },
  headerSubTitle: {
    fontFamily: 'Arial, Helvetica, Arial, serif',
    color: 'rgb(131, 131, 131)',
    textAlign: 'center',
    marginTop: '2%',
    marginLeft: '10%',
    marginRight: '10%',
    marginBottom: '4%',
  },
  return: {
    color: '#1674D1'
  },
  searchBar: {
    marginBottom: 20
  },
  newDelegate: {
    color: '#1674D1',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    '& img': {
      paddingRight: 5
    },
    '&.disabled': {
      pointerEvents: 'none',
      color: '#BBB',
      cursor: 'default',
      '& img': {
        filter: 'grayscale(100%)'
      }
    }
  },
  removeDelegate: {
    color: '#1674D1',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'flex-end',
    cursor: 'pointer',
    '&.disabled': {
      color: '#BBB',
      cursor: 'default',
      '& img': {
        filter: 'grayscale(100%)'
      }
    },
    '& img': {
      paddingRight: 5,
      paddingBottom: 5
    },
    [theme.breakpoints.down('md')]: {
      marginBottom: 20
    }
  },
  delegatesContainer: {
    padding: '32px 20px',
    marginTop: 20,
    '-webkit-box-shadow': '0px 0px 3px 1px rgba(207,205,207,1)',
    '-moz-box-shadow': '0px 0px 3px 1px rgba(207,205,207,1)',
    boxShadow: '0px 0px 3px 1px rgba(207,205,207,1)',
  },
  button: {
    position: 'relative',
    backgroundColor: '#1674D1',
    color: '#FFF',
    fontSize: 28,
    lineHeight: 1,
    padding: '13px 16px',
    border: 'solid 1px #004571',
    borderColor: '#1674D1',
    borderRadius: '0 4px 4px 0',
    marginLeft: -2,
    cursor: 'pointer'
  }
}))

export default useStyles
