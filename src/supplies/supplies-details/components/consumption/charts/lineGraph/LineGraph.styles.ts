import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: 50,
    '& canvas': {
      width: '100% !important'
    }
  },
  paragraphs: {
    lineHeight: 2.5,
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
  }
}))

export default useStyles