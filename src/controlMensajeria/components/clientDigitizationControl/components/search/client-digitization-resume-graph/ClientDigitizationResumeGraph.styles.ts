import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  barCont:{
    padding: '15px 15px 0 15px'
  },
  infoCont: {
    padding: '5px 15px 5px 15px',
    display: 'felx',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: 'rgba(0, 69, 113, 1.0)',
    '&.margin': {
      marginTop: '5px'
    }
  },
  square: {
    width: '15px',
    height: '15px',
    display: 'inline-block',
    marginRight: '10px',
    '&.darkBlue': {
      backgroundColor: '#1a587f'
    },
    '&.lightBlue': {
      backgroundColor: '#66c2c9'
    },
    '&.orange': {
      backgroundColor: '#e57200'
    },
    '&.green': {
      backgroundColor: '#8e9300'
    }
  },
  counter: {
    fontWeight: 'bold',
    fontSize: '16px',
    [theme.breakpoints.only('xs')]: {
      marginTop: '5px',
      textAlign: 'center'
    }
  },
  noResults: {
    width: '100%',
    textAlign: 'center',
    padding: '15px 0 10px 0'
  },
  graphIcon: {
    width: 20,
    '&.first': {
      marginLeft: '87px',
      [theme.breakpoints.only('xs')]: {
        marginLeft: '60px',
      }
    },
    '&.second': {
      marginLeft: '96px',
      [theme.breakpoints.only('xs')]: {
        marginLeft: '40px',
      }
    },
    '&.third': {
      marginLeft: '97px',
      [theme.breakpoints.only('xs')]: {
        marginLeft: '42px',
      }
    },
    '&.fourth': {
      marginLeft: '95px',
      [theme.breakpoints.only('xs')]: {
        marginLeft: '42px',
      }
    }
  },
  alertIcon: {
    width: 64
  },
  text: {
    marginTop: 20
  },
  iconsCont: {
    padding: '0 15px 15px 15px'    
  },
  detailsCont: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
    padding: '5px 15px 5px 15px',
    color: '#227bd3'
  },
  arrowIcon: {
    width: '8px',
    '&.down': {
      transform: 'rotate(90deg)'
    },
    '&.up': {
      transform: 'rotate(270deg)'
    }
  },
  detailsText: {
    textDecoration: 'underline',
    marginLeft: '5px',
    '&:hover': {
      cursor: 'pointer'
    }
  }
}))

export default useStyles