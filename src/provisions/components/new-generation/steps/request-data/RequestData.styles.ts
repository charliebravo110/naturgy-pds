import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '10px 0 0',
    justifyContent: 'center'
  },
  maxWidthForBigScreens: {
    maxWidth: 1200,
    width: '100%'
  },
  title: {
    fontSize: 30,
    color: '#004571',
    textAlign: 'center',
    margin: '18px 0 20px'
  },
  text: {
    fontSize: 15,
    color: '#838383',
    textAlign: 'center',
    marginBottom: 15
  },
  textComboBox: {
    fontSize: 14,
    color: '#004571',
    textAlign: 'left',
    marginTop: 20,
    marginBottom: 5
  },
  containerCombobox: {
    width: '70%',
    margin: '0 auto'
  },
  button: {
    justifyContent: 'center',
    marginTop: 100,
    '& button': {
      margin: '0 16px'
    }
  }

}))

export default useStyles
