import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  dialog: {
    '& .MuiPaper-root.MuiDialog-paper': {
      width: 600,
      border: '2px solid rgb(61, 114, 147)'
    }
  },
  container: {
    position: 'relative',
    padding: 36
  },
  closeButton: {
    position: 'absolute',
    top: 18,
    right: 18,
    cursor: 'pointer'
  },
  content: {
    paddingTop: 24
  },
  icon: {
		width: 50
	},
  title: {
    fontSize: 30,
    color: 'rgba(0, 69, 113, 1)',
    textAlign: 'center',
    marginBottom: 10
  },
  title2: {
    fontSize: 20,
    color: 'rgba(0, 69, 113, 1)',
    textAlign: 'center',
    marginBottom: 10
  },
  button: {
    color: 'rgba(0, 69, 113, 1)',
  },
  description: {
    fontSize: 15,
    color: 'rgba(191, 184, 174, 1)',
    textAlign: 'center',
    marginBottom: 20
  }
}))

export default useStyles
