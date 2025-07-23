import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 20
  },
  containerteleoperable: {
    backgroundColor: '#E5ECF0',
    padding: 20,
    borderRadius: 4,
    marginTop: 20,
    color: 'rgba(0, 69, 113, 1)',
    display: 'flex'
  },
  icon: {
    marginRight: 20,
    width: 30,
    alignItems: 'center'
  },
  text: {
    color: 'rgba(0, 69, 113, 1)',
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 24,
    verticalAlign: 'middle',
    display: 'flex'
  },
  message: {
    alignItems: 'center'
  }
}))

export default useStyles
