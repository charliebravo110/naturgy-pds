import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'relative',
    marginTop: 20,
    [theme.breakpoints.down('md')]: {
      minWidth: '100%'
    }
  },
  noResults: {
    width: '100%',
    textAlign: 'center',
    padding: 40,
    border: 'solid 1px #E1E9EE',
    borderRadius: 4,
    marginTop: 20
  },
  icon: {
    width: 64
  },
  text: {
    marginTop: 20
  }
}))

export default useStyles
