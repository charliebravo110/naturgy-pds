import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  editLabel: {
    paddingLeft: 4,
    color: 'rgba(0, 69, 113, 1)',
    fontWeight: 'bold',
    '&.disabled': {
      '& button.MuiButtonBase-root': {
        cursor: 'default !important'
      },
      '& img': {
        filter: 'grayscale(100%)'
      },
      '& p': {
        color: '#BBB'
      }
    }
  },
  editIcon: {
    marginRight: 6
  },
  editText: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  textButton: {
    bottom: 4
  }
}))

export default useStyles
