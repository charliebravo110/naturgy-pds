import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '20px 0',
    marginTop: 128,
    [theme.breakpoints.only('xs')]: {
      marginTop: 70
    }
  },
  maxWidthForBigScreens: {
    maxWidth: 1200,
    width: '100%'
  },
  headerTitle: {
    fontFamily: 'Arial, Helvetica, Arial, serif',
    fontSize: '36px',
    color: 'rgba(0, 69, 113, 1.0)',
    textAlign: 'center',
    margin: '26px 0 30px',
    maxWidth: 1200
  },
  notRegisteredHeaderTitle: {
    fontFamily: 'Arial, Helvetica, Arial, serif',
    fontSize: '36px',
    color: 'rgba(0, 69, 113, 1.0)',
    textAlign: 'center',
    margin: '26px 0 30px',
    maxWidth: 1200,
    [theme.breakpoints.up('md')]: {
      marginTop: 43
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: 93
    }
  },
  headerSubTitle: {
    fontFamily: 'Arial, Helvetica, Arial, serif',
    color: 'rgb(131, 131, 131)',
    textAlign: 'center',
    marginLeft: '10%',
    marginRight: '10%',
    marginBottom: '4%',
    maxWidth: 1200
  },
  iframe: {
    width: '100%',
    height: 450,
    border: 0,
    [theme.breakpoints.down('lg')]: {
      width: '100%'
    }
  },
  content: {
    maxWidth: 1200
  }
}))

export default useStyles
