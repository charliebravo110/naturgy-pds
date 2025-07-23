import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  button: {
    display: 'flex',
    color: '#1674D1',
    alignItems: 'center',
    cursor: 'pointer'
  },
  justifyCenter: {
    justifyContent: 'center'
  },
  text: {
    marginLeft: 8
  }
}))

export default useStyles
