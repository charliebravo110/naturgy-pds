import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  modalText: {
    textAlign: 'center',
    padding: '0 80px',
    [theme.breakpoints.down('sm')] : {
      padding: 0
    }
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
    color: 'rgba(0, 69, 113, 1)',
    marginTop: 8
  },
  subTitle: {
    fontSize: 17,
    color: '#838383',
    marginTop: 8
  }
}))

export default useStyles
