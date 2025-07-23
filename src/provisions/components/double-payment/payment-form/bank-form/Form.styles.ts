import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    padding: '25px 30px',
    backgroundColor: '#F8F7F6',
    textAlign: 'left',
    borderRadius: '10px',
    '& input': {
      color: '#B0B0B0'
    }
  },
  title: {
    color: '#004571',
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 5
  },
  subtitle: {
    color: '#004571',
    fontSize: 17
  },
  subtitleGray: {
    color: '#B0B0B0',
    fontSize: 17,
    fontWeight: 'bold'
  },
  text: {
    color: '#B0B0B0',
    marginBottom: 3
  }
}))

export default useStyles