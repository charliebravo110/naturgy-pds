import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.only('xs')]: {
      marginTop:20
    }
  },

  button: {
    height: 40,
    cursor: 'pointer',
    '&.active': {
      cursor: 'auto'
    },
    '&.table': {
      marginLeft: 12
    }
  }
}))

export default useStyles
