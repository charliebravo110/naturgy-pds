import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  modalContainer: {
    outline: 'none'
  },
  modalText: {
    textAlign: 'center',
    marginBottom: 48
  },
  closeButton: {
    marginTop: -5,
    marginRight: -5
  },
  title: {
    fontSize: 22,
    color: 'rgba(0, 69, 113, 1)',
    marginBottom: 24
  },
  subTitle: {
    fontSize: 17,
    color: '#838383'
  }
}))

export default useStyles