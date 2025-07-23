import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: '#004571',
    color: 'white',
    padding: '30px 0',
    fontWeight: 600,
    fontStyle: 'normal',
    fontSize: 14,
    justifyContent: 'center',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
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
  noFlexBasis: {
    [theme.breakpoints.down('md')]: {
      width: '100%',
      textAlign: 'center'
    },
    [theme.breakpoints.only('xs')]: {
      textAlign: 'left',
      paddingLeft: 24
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
    },
    '& a': {
      color: 'white'
    }
  }
}))

export default useStyles
