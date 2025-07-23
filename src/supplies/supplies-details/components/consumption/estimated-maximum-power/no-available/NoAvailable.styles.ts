import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    justifyContent: 'space-between'
  },
  bannerContainer: {
    textAlign: 'center'
  },
  banner: {
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
      margin: '0 auto'
    }
  },
  title: {
    color: '#004B87',
    fontSize: '1.375rem',
    marginTop: 32
  },
  description: {
    marginTop: 24
  },
  button: {
    alignItems: 'center',
    cursor: 'pointer',
    marginTop: 32
  },
  checkbox: {
    '& img': {
      width: 21,
      height: 21,
      borderRadius: 3
    }
  },
  buttonText: {
    color: '#06c',
    fontSize: 14,
    margin: '-4px 0 0 16px'
  },
  box: {
    marginTop: 24
  },
  boxText: {
    fontSize: 14,
    marginTop: 12,
    '&:first-child': {
      marginTop: 0
    }
  },
  counter: {
    width: 300,
    marginTop: 12
  },
  footer: {
    fontSize: 14,
    borderTop: 'solid 1px #B2C9DB',
    paddingTop: 32,
    marginTop: 32,
    '& a': {
      color: '#06c'
    }
  }
}))

export default useStyles
