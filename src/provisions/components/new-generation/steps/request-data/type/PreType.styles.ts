import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    justifyContent: 'center'
  },
  container1: {
    width: '70',
    justifyContent: 'center'
  },
  container2: {
    paddingTop: 40
  },
  container2a: {
    justifyContent: 'flex-end',
    paddingTop: 25
  },
  container2b: {
    justifyContent: 'center',
    paddingTop: 25,
    alignItems: 'center'
  },
  text1: {
    textAlign: 'center',
    fontWeight: 'bold',
    paddingTop: 5
  },
  text1b: {
    textAlign: 'center',
    paddingTop: 20
  },
  buttonsDisable: {
    display: 'table-cell',
    position: 'relative',
    verticalAlign: 'middle',
    border: 'solid 2px #E1E9EE',
    color: '#736F6F',
    fontWeight: 'lighter',
    background: 'silver',
    borderRadius: 10
  },
  buttonsRed: {
    display: 'table-cell',
    verticalAlign: 'middle',
    position: 'relative',
    color: '#F12B2B',
    cursor: 'pointer',
    border: 'solid 2px #E1E9EE',
    borderRadius: 10
  },
  pruebaXs: {
    height: 50,
    textAlign: 'center',
    display: 'table',
    margin: 0,
    padding: 0
  },
  buttonsRP: {
    height: 80,
    textAlign: 'center',
    display: 'table',
    margin: 0,
    padding: 0
  },
  prueba1: {
    height: 120,
    textAlign: 'center',
    display: 'table',
    margin: 0,
    padding: 0
  },
  gridCertificado: {
    display: 'table',
    height: 50,
    textAlign: 'center',
    marginTop: 20
  },
  gridCertificado2: {
    height: 50,
    textAlign: 'center',
    color: '#FFFFFF',
    background: '#004671',
    cursor: 'pointer',
    border: 'solid 2px #E1E9EE',
    borderRadius: 10,
    marginTop: 20
  },
  gridCertificado3: {
    height: 50,
    textAlign: 'left',    
    marginTop: 20
  },
  buttons1: {
    display: 'table-cell',
    color: '#FFFFFF',
    background: '#004671',
    verticalAlign: 'middle',
    //position: 'relative',
    cursor: 'pointer',
    border: 'solid 2px #E1E9EE',
    borderRadius: 10
  },
  buttons2: {
    display: 'table'
  },
  gridItemButtonS1: {
    display: 'table-cell',
    verticalAlign: 'middle',
    textAlign: 'center'
  },
  gridItemButtonS2: {
    display: 'table-cell',
    verticalAlign: 'middle',
    fontSize: '18px'
  },
  gridCandado: {
    display: 'table-cell',
    color: '#1674D1',
    verticalAlign: 'middle',
    position: 'relative',
    border: 'solid 3px #E1E9EE',
    padding: 40,
    borderRadius: 10
  },
  buttons: {
    cursor: 'pointer',
    justifyContent: 'center',
    marginTop: 20,
    '& button': {
      margin: '0 16px'
    },
    [theme.breakpoints.only('xs')]: {
      '& button:first-child': {
        marginBottom: 16
      }
    }
  },
  input2: {
    fontSize: '18px',
    justifyContent: 'center',
    color: '#1674D1'
  },
  input2a: {
    fontSize: '20px',
    fontWeight: 'bold',
    justifyContent: 'center',
    paddingTop: 20,
    color: '#004571'
  },
  input3: {
    fontSize: '18px',
    textAlign: 'left',
    paddingLeft: 10
  },
  buttonAtras: {
    fontSize: '18px',
    cursor: 'pointer',
    color: '#1674D1'
  },
  input4: {
    fontSize: '18px',
    color: '#1674D1'
  },
  input5: {
    fontSize: '18px',
    color: '#004571'
  },
  icon: {
    position: 'relative',
    alignContent: 'center',
    width: 30
  },
  lockIcon: {
    color: '#F12B2B',
    width: 40
  },
  medalIcon: {
    width: 25
  },
  gridCloseIcon: {
    paddingTop: 5,
    textAlign: 'center'
  }
}))

export default useStyles
