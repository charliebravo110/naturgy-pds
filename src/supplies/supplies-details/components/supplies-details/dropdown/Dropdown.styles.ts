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
    padding: '20px 0',
    marginTop: 20
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
