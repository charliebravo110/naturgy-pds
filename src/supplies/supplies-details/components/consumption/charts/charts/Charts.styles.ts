import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'relative',
    marginTop: 20,
    [theme.breakpoints.down('md')]: {
      minWidth: '100%'
    }
  },
  noResults: {
    width: '100%',
    textAlign: 'center',
    padding: 40,
    border: 'solid 1px #E1E9EE',
    borderRadius: 4,
    marginTop: 20,
    marginBottom: 50
  },
  icon: {
    width: 64
  },
  text: {
    marginTop: 20
  },
  paragraphs: {
    lineHeight: '20px',
    marginTop: 16,
    '& p': {
      color: '#555555',
      margin: 0
    },
    '& p img': {
      position: 'relative',
      top: -4,
      left: 2
    },
    '& p span': {
      position: 'relative',
      top: -8,
      fontSize: 12
    }
  },
}))

export default useStyles
