import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: '#e3ebf3',
    padding: '20px 0',
    justifyContent: 'center',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
 
  },
  imagen:{
    marginRight: '10px'
  },
  text: {
    fontSize: 14,
    color: '#376d90',
    [theme.breakpoints.only('xs')]: {
      width: '100%',
      paddingLeft: 24
    }
    
  },
  breakPoint: {
    maxWidth: 1200,
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center'
    }
  },

  menu: {
    [theme.breakpoints.only('xs')]: {
      width: '100%',
      paddingLeft: 24
    },
    '& ul': {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      [theme.breakpoints.down('md')]: {
        marginTop: 24,
      },
      '& li': {
        display: 'inline',
        borderLeft: '1px solid white',
        wordBreak: 'break-word',
        marginLeft: 12,
        paddingLeft: 12,
        [theme.breakpoints.only('xs')]: {
          display: 'block',
          paddingLeft: 0,
          borderLeft: 0,
          margin: '6px 0 0'
        }
      }
    },
    '& li:first-child': {
      border: 0,
      marginLeft: 0,
      paddingLeft: 0,
      [theme.breakpoints.only('xs')]: {
        marginTop: 0
      }
    }
  }
}))

export default useStyles
