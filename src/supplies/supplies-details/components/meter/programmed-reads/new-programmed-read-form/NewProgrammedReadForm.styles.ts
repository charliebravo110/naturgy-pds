import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    textAlign: 'left',
    paddingBottom: 32,
    borderBottom: 'solid 1px #E1E9EE',
    marginBottom: 40
  },
  title: {
    color: '#004571',
    fontWeight: 'bold'
  },
  description: {
    color: '#555',
    paddingBottom: 20,
    borderBottom: 'solid 1px #E1E9EE',
    marginTop: 16
  },
  form: {
    marginTop: 20
  },
  logo: {
    width: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  marginButton: {
    marginTop: 10,
    marginBottom: 10,
    color: '#004571',
    fontSize: 14,
    fontWeight: 'bold',
  },
  existingProgrammedForm: {
    backgroundColor: '#E5ECF0',
    marginTop: 20,
    alignItems: 'center'
  },
  existingProgrammedFormDescription: {
    color: '#004571',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 15
  },
  inputLabel: {
    color: '#004571',
    marginBottom: 6
  },
  disabled: {
    opacity: .5
  },
  recurrentContainer: {
    color: '#004571',
    alignItems: 'center',
    marginTop: 20,
    [theme.breakpoints.down('md')]: {
      marginTop: 0
    }
  },
  recurrentLabel: {
    paddingLeft: 0
  },
  radioGroup: {
    flexDirection: 'row',
    '& .MuiButtonBase-root.Mui-checked': {
      color: '#1674D1'
    }
  },
  endDateContainer: {
    width: '100%'
  },
  buttonContainer: {
    justifyContent: 'space-between',
  },
  buttonContainer2: {
    justifyContent: 'right',
  },
  button: {
    textAlign: 'center',
    width: '100%'
  },
  button2: {
    textAlign: 'center',
    width: '50%'
  },
  button3: {
    textAlign: 'center',
    width: '100%',
    color: 'rgba(0, 69, 113, 1)',
  },
  cancelButton: {
    maxWidth: 190,
    width: '100%',
    fontSize: 14,
    marginTop: 12,
    cursor: 'pointer',
    backgroundColor: '#FFF',
    borderRadius: 5,
    padding: '7px 7px 7px 10px',
    color: 'rgba(0, 69, 113, 1)',
    fontWeight: 'bold',
    justifyContent: 'space-around',
    '&.disabled': {
      cursor: 'default',
      color: 'rgba(0, 0, 0, 0.38)'
    }
  },
  textIconButton: {
    width: 16,
    marginRight: '10px',
  },
  marginCenter: {
    fontWeight: 'bold',
    marginTop: '30px',
    marginBottom:'10px',
    textAlign: 'center',
    justifyContent: 'right',
    alignContent:'center',
    alignItems:'center',
    display: 'flex'
  },
  newRequest: {
    color: '#1674D1',
    textDecoration: 'none'
  },
  infoTextContainer: {
    justifyContent: 'right',
    marginTop: 20
  }
}))

export default useStyles
