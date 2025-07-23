import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  title: {
    color: '#FFF',
    fontSize: 30,
    textAlign: 'center',
    padding: '0 30px',
    marginBottom: 12
  },
  text: {
    margin: '20px 60px 0',
    color: '#FFF',
    textAlign: 'center'
  },
  button: {
    marginTop: 32
  },
  separator: {
    width: '85%',
    align: 'center',
    height: '0.5px',
    backgroundColor: '#E3EBEF',
    margin: '20px 0',
    marginTop: 50,
    marginLeft: 40
  }
}))

export default useStyles
