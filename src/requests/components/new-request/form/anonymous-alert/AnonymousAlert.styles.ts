import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    width: 800,
    boxSizing: 'border-box',
    backgroundColor: '#F1F5F8',
    color: '#1D4A61',
    textAlign: 'center',
    padding: '32px 96px',
    borderRadius: 4,
    margin: '64px auto 0',
    '& img': {
      width: 50
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  text: {
    marginTop: 32
  },
  button: {
    marginTop: 32
  }
}))

export default useStyles
