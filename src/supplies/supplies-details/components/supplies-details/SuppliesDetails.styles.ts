import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  block: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    marginTop: 126,
    [theme.breakpoints.only('xs')]: {
      marginTop: 70
    }
  },
  container: {
    padding: '20px 0'
  },
  viewsContainer: {
    [theme.breakpoints.up('md')]: {
      padding: '20px 0',
      marginTop: 20
    },
    [theme.breakpoints.down('sm')]: {
      padding: '0px 0',
      marginTop: 0
    }
  },
  notRegisteredViewsContainer: {
    [theme.breakpoints.up('md')]: {
      padding: '0px 0',
      marginTop: 0
    },
    [theme.breakpoints.down('sm')]: {
      padding: '0px 0',
      marginTop: 0
    }
  },
  views: {
    width: '100%',
    overflow: 'hidden',
    '& div[data-swipeable="true"]': {
      overflow: 'hidden !important'
    }
  }
}))

export default useStyles
