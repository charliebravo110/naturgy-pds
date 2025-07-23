import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: 32
  },
  description: {
    color: '#004571',
    fontWeight: 'bold'
  },
  items: {
    minHeight: 80,
    justifyContent: 'center',
    marginTop: 12
  },
  itemCont: {
    marginTop: '10px'
  }
}))

export default useStyles
