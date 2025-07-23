import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  box: {
    position: 'relative',
    height: 276,
    boxSizing: 'border-box',
    textAlign: 'center',
    padding: 20,
    border: 'solid 1px #E1E9EE',
    borderRadius: 4,
    cursor: 'pointer',
    '& a': {
      textDecoration: 'none'
    },
    '&:hover': {
      backgroundColor: '#F8F7F5',
      borderColor: '#81BBC3'
    }
  },
  icon: {
    width: 64,
    height: 64,
    marginTop: 24
  },
  title: {
    color: '#004571',
    marginTop: 24
  }
}))

export default useStyles
