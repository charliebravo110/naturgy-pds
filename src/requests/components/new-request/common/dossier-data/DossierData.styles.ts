import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: '#F8F6F7',
    padding: 24,
    borderRadius: 4,
    marginTop: 24
  },
  section: {
    color: '#7A7977',
    '&:last-child': {
      marginTop: 12
    },
    '& b': {
      color: '#245475'
    }
  }
}))

export default useStyles
