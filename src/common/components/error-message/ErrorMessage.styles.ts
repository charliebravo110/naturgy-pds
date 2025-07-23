import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  errorMessage: {
    position: 'absolute',
    flexWrap: 'nowrap',
    boxShadow: '0 2px 2px rgba(0, 0, 0, .2)',
    boxSizing: 'border-box',
    width: '100%',
    padding: '15px 5%',
    color: 'white',
    background: '#ff7070',
    alignItems: 'center'
  },
  container: {
    width: '100%',
    maxWidth: 1200
  },
  text: {
    maxWidth: '92%'
  },
  closeIcon: {
    cursor: 'pointer',
    position: 'relative',
    width: '30px',
    height: '15px',
    '& img': {
      width: '15px',
      height: '15px',
      position: 'absolute',
      right: 0
    }

  },
}))

export default useStyles
