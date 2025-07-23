import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    justifyContent: 'center',
    [theme.breakpoints.up('md')]: {
      margin: '-8px -8px -8px 0'
    }
  },
  item: {
    position: 'relative',
    height: 276,
    boxSizing: 'border-box',
    textAlign: 'center',
    padding: 20,
    border: 'solid 1px #E1E9EE',
    borderRadius: 4,
    cursor: 'pointer',
    '&.disabled': {
      filter: 'grayscale(1)',
      opacity: .75,
      cursor: 'default'
    },
    '& a': {
      textDecoration: 'none'
    },
    '&.enabled:hover': {
      backgroundColor: '#F8F7F5',
      borderColor: '#81BBC3'
    }
  },
  icon: {
    width: 42,
    height: 55,
    marginTop: 24
  },
  title: {
    color: '#004571',
    marginTop: 24
  },
  description: {
    color: '#555',
    fontSize: 13,
    marginTop: 8
  }
}))

export default useStyles
