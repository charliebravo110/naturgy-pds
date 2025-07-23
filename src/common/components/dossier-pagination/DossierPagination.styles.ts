import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    justifyContent: 'center',
    marginTop: 16
  },
  icon: {
    width: 10,
    cursor: 'pointer',
    '&.disabled': {
      filter: 'grayscale(1)',
      opacity: .5,
      cursor: 'default'
    }
  },
  label: {
    fontSize: '0.875rem',
    margin: '-2px 12px 0'
  }
}))

export default useStyles
