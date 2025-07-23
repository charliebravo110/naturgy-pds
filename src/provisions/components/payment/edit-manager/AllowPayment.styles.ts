import { makeStyles } from '@material-ui/core/styles'
import { Height } from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({
  modalContainer: {
    border: '2px solid rgb(61, 114, 147)',
    outline: 'none'
  },
  modalText: {
    textAlign: 'center',
    marginBottom: 12
  },
  closeButton: {
    marginTop: -5,
    marginRight: -5,
    padding: '4px 0'
  },
  title: {
    fontSize: 22,
    color: 'rgba(0, 69, 113, 1)'
  },
  greySubtitle: {
    marginTop: 10,
    fontSize: 14,
    color: '#62625d'
  },
  infoIcon: {
    width: 33
  },
  closeIcon: {
    width: 12
  },
  buttons: {
    justifyContent: 'center',
    marginTop: 25,
    marginBot: 25,
    paddingBot: 20,
    '& button': {
      margin: '15px 16px',
      [theme.breakpoints.only('xs')]: {
        '&:first-child': {
          marginBottom: 16
        }
      }
    }
  },
}))

export default useStyles
