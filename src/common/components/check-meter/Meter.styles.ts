import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    margin: '0 auto',
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      padding: 2
    }
  },
  maxWidthForBigScreens: {
    maxWidth: 1200,
    width: '100%'
  },
  title: {
    fontSize: 36,
    color: 'rgba(0, 69, 113, 1)',
    textAlign: 'left',
    marginBottom: 40,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      display: 'block'
    }
  },
  backLink: {
    fontSize: 16,
    color: '#1674D1',
    alignItems: 'center',
    marginRight: 18,
    cursor: 'pointer',
    [theme.breakpoints.down('sm')]: {
      margin: '0 0 6px'
    }
  },
  backIcon: {
    width: 7,
    marginRight: 10
  },
  description: {
    color: '#555555'
  },
  descriptionText: {
    textAlign: 'center',
    alignSelf: 'center'
  },
  descriptionBold: {
    color: '#C78330',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center'
  },
  contactBlock: {
    color: 'rgba(0, 69, 113, 1)'
  },
  contactIcon: {
    marginRight: 15
  },
  contactDescription: {
    textAlign: 'left',
    fontSize: 14,
    fontWeight: 'bold'
  },
  contactPhone: {
    textAlign: 'left',
    fontSize: 36
  },
  button: {
    marginTop: 100
  },
  items: {
    width: 300,
    margin: 'auto auto',
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  }
}))

export default useStyles
