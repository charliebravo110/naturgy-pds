import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'relative',
    padding: '42px 64px !important',
    border: '2px solid #3D7293',
    outline: 'none'
  },
  closeIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
    cursor: 'pointer'
  },
  content: {
    textAlign: 'center'
  },
  title: {
    fontSize: 22,
    color: '#004571',
    marginTop: 26
  },
  description: {
    fontSize: 17,
    color: '#838383',
    marginTop: 26,
    '& a': {
      color: '#6AA1D8'
    }
  }
}))

export default useStyles
