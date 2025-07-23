import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  modalContainer: {
    border: '2px solid rgb(61, 114, 147)',
    outline: 'none',
    height: '400px'
  },
  modalText: {
    textAlign: 'center',
    height: '90%'
  },
  closeButton: {
    marginTop: -5,
    marginRight: -5,
    padding: '4px 0'
  },
  button: {
    margin: 10
  }
}))

export default useStyles
