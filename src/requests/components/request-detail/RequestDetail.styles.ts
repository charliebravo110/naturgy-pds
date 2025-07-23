import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  block: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    marginTop: 128,
    [theme.breakpoints.only('xs')]: {
      marginTop: 70
    },
    '&.without-margin': {
      marginTop: -46
    },
    '&.with-margin': {
      marginTop: 128
    }
  },
  container: {
    padding: '20px 0',
    justifyContent: 'center'
  },
  maxWidthForBigScreens: {
    maxWidth: 1200,
    width: '100%'
  },
  linkEffect: {
    cursor: 'pointer'
  },
  arrow: {
    transform: 'rotate(180deg)',
    width: '9px',
    marginRight: '10px'
  },
  returnText: {
    color: '#3586d6',
    fontSize: '19px'
  },
  returnLink: {
    display: 'flex',
    textDecoration: 'none'
  },
  userSkeleton: {
    width: 150,
    height: 35,
    backgroundColor: '#d4cece',
    borderRadius: 5
  },
  title: {
    fontSize: 36,
    color: 'rgba(0, 69, 113, 1)',
    marginTop: 26,
    textAlign: 'center',
    marginBottom: 50,
    '&.without-margin': {
      marginTop: 0
    }
  },
}))

export default useStyles
