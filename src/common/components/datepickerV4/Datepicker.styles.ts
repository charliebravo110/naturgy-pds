import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor:'white', 
    position: 'relative',
    margin: '6px 12px 0 0'
  },
  containerFullWidth: {
    position: 'relative',
  },
  disabled: {
    filter: 'grayscale(1)'
  },
  icon: {
    position: 'absolute',
    top: 12,
    right: 12,
    cursor: 'pointer',
    '& img': {
      width: 24
    }
  },
}))

export default useStyles
