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
  closeButton: {
    marginTop: -5,
    marginRight: -5,
    padding: '4px 0'
  },
  buttons: {
    [theme.breakpoints.up('sm')] : {
      marginTop: 24
    }
  },
  button: {
    margin: 8
  },
  title: {
    fontSize: 22,
    color: 'rgba(0, 69, 113, 1)'
  },
  subTitle: {
    fontSize: 17,
    color: '#838383'
  }
}))

export default useStyles
