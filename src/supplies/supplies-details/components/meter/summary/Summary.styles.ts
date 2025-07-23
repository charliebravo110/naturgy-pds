import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: '#F8F7F5',
    textAlign: 'left',
    alignItems: 'center',
    padding: 30
  },
  rightColumn: {
    paddingLeft: 30,
    borderLeft: 'solid 1px #D9D8D6',
    [theme.breakpoints.down('sm')]: {
      paddingLeft: 0,
      paddingTop: 30,
      borderLeft: 0,
      borderTop: 'solid 1px #D9D8D6',
      marginTop: 30
    }
  },
  label: {
    marginBottom: 14
  },
  button: {
    padding: '3px 20px 4px',
    height: 44,
    '& span[class^="MuiButton-label"]': {
      fontSize: 16
    }
  },
  programButtons: {
    alignItems: 'center',
    '& span': {
      fontSize: 13
    }
  }
}))

export default useStyles
