import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    marginRight: 12
  },
  button: {
    height: 40,
    cursor: 'pointer',
    '&.active': {
      cursor: 'auto'
    },
    '&.mosaic': {
      marginLeft: 12
    },
    '& img': {
      width: 40,
      height: 40
    }
  }
}))

export default useStyles
