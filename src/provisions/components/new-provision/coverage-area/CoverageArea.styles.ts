import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  block: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    marginTop: 128,
    [theme.breakpoints.only('xs')]: {
      marginTop: 70
    }
  },
  container: {
    padding: '20px 0 46px',
    justifyContent: 'center'
  },
  maxWidthForBigScreens: {
    maxWidth: 1200,
    width: '100%'
  },
  title: {
    color: '#004571',
    fontSize: 36,
    margin: '26px 0 24px',
    [theme.breakpoints.only('xs')]: {
      textAlign: 'center'
    }
  },
  description: {
    color: '#004571',
    fontWeight: 'bold',
    [theme.breakpoints.only('xs')]: {
      textAlign: 'center'
    }
  },
  map: {
    width: '100%',
    height: 400,
    border: 0,
    marginTop: 32
  },
  buttons: {
    justifyContent: 'center',
    marginTop: 32,
    '& button': {
      margin: '0 16px',
      [theme.breakpoints.only('xs')]: {
        '&:first-child': {
          marginBottom: 16
        }
      }
    }
  }
}))

export default useStyles
