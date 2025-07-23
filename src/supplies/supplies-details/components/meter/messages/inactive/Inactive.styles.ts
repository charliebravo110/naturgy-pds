import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    border: '2px solid #E1E9EE',
    padding: '32px'
  },
  title: {
    fontSize: 30,
    color: 'rgba(0, 69, 113, 1)'
  },
  icon: {
    width: 60
  },
  description: {
    color: '#555555'
  },
  date: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#E57000',
  },
}))

export default useStyles