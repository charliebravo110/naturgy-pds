import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '10px 0 0',
    justifyContent: 'center'
  },
  title: {
    fontSize: 30,
    color: '#004571',
    textAlign: 'center',
    margin: '20px 0 20px'
  },
  text: {
    fontSize: 15,
    color: '#838383',
    textAlign: 'center',
    marginBottom: 15
  },
  selectContainer: {
    marginTop: 20
  },
  textComboBox: {
    fontSize: 14,
    color: '#004571',
    textAlign: 'left',
    marginBottom: 5
  },
  containerCombobox: {
    position: 'relative',
    width: '70%',
    minHeight: 120,
    margin: '0 auto'
  },
  button: {
    justifyContent: 'center',
    marginTop: 100,
    '& button': {
      margin: '0 16px'
    },
    [theme.breakpoints.only('xs')]: {
      '& button:first-child': {
        marginBottom: 16
      }
    }
  }

}))

export default useStyles
