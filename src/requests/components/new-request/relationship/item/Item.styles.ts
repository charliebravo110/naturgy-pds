import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  box: {
    position: 'relative',
    boxSizing: 'border-box',
    padding: 20,
    border: 'solid 1px #E1E9EE',
    borderRadius: 4,
    marginTop: 32,
    cursor: 'pointer',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: '32px 0 0'
    },
    '&:first-child': {
      marginTop: 0
    },
    '& a': {
      textDecoration: 'none'
    },
    '&:hover': {
      backgroundColor: '#F8F7F5',
      borderColor: '#81BBC3'
    }
  },
  arrow: {
    position: 'absolute',
    top: 16,
    right: 16
  },
  icon: {
    width: 54,
    height: 54,
    '&.job-execution': {
      transform: 'scale(.8)'
    }
  },
  title: {
    color: '#004571'
  },
  description: {
    color: '#868686',
    fontSize: 14,
    marginTop: 16
  }
}))

export default useStyles
