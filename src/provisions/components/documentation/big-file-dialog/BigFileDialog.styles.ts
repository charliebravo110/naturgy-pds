import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  modalContainer: {
    border: '2px solid rgb(61, 114, 147)',
    outline: 'none'
  },
  modalText: {
    textAlign: 'center',
    marginBottom: 12
  },
  infoIcon: {
    height: '50px',
    paddingBottom: '20px'
  },
  closeButton: {
    marginTop: -5,
    marginRight: -5,
    padding: '4px 0'
  },
  title: {
    fontSize: 28,
    color: 'rgba(0, 69, 113, 1)',
    marginBottom: '20px'
  },
  text: {
    marginBottom: '35px'
  }
}))

export default useStyles
