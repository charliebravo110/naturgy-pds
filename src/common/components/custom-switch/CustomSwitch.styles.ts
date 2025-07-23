import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    color: '#5b91b1'
  }, 
  checked: {
    fontWeight: 600,
    color: 'rgba(0, 69, 113, 1)'
  },
  notChecked : {
    color: 'rgba(0, 69, 113, 1)'
  },
  disabled: {
    color: 'gray'
  }
}))

export default useStyles
