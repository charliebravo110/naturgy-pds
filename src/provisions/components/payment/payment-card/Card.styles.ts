import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  mobileBox: {
    [theme.breakpoints.only('xs')]: {
      width: '100%'
    }
  },
  container: {
    width: '250px',
    padding: '15px',
    margin: '20px',
    border: '3px solid #87A6BC',
    borderRadius: '10px',
    cursor: 'pointer',
    [theme.breakpoints.only('xs')]: {
      width: '200px'
    }
  },
  containerSelected: {
    width: '250px',
    padding: '15px',
    margin: '20px',
    border: '3px solid #B1BA28',
    borderRadius: '10px',
    backgroundColor: '#F5F6E5',
    position: 'relative',
    '&::after': {
      content: '" "',
      position: 'absolute',
      width: '20px',
      height: '20px',
      backgroundColor: '#FFF',
      left: '233.5px',
      top: 60,
      transform: 'rotate(45deg)',
      borderLeft: '3px solid #B1BA28',
      borderBottom: '3px solid #B1BA28',
      borderRadius: '3px',
      [theme.breakpoints.only('xs')]: {
        left: '183.5px',
      }
    },
    [theme.breakpoints.only('xs')]: {
      width: '200px'
    }
  },
  title: {
    color: '#2C648A',
    fontWeight: 'bold',
    fontSize: 17
  }
}))

export default useStyles
