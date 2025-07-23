import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    justifyContent: 'center',
    margin: '0 auto',
    [theme.breakpoints.down('sm')]: {
      padding: 2
    }
  },
  maxWidthForBigScreens: {
    width: '100%',
    maxWidth: 1200
  },
  title: {
    color: '#004571',
    fontSize: 36
  },
  inRevision: {
    color: '#555555',
    lineHeight: '20px',
    paddingBottom: 20,
    margin: '16px 0 20px'
  },
  description: {
    color: '#555555',
    lineHeight: '20px',
    paddingBottom: 20,
    borderBottom: 'solid 1px #E1E9EE',
    margin: '16px 0 20px'
  },
  documentViewer: {
    '& iframe': {
      width: '100%',
      height: 500
    }
  }
}))

export default useStyles
