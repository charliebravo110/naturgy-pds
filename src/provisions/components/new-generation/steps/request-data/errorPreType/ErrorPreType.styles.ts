import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container2: {
    paddingTop: 40
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
  prueba1: {
    height: 80,
    textAlign: 'center',
    display: 'table'
  },
  gridError: {
    height: 90,
    background: '#F2F5F8'
  },
  gridError2: {
    display: 'table'
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
  buttons1: {
    display: 'table-cell',
    color: '#FFFFFF',
    background: '#004671',
    verticalAlign: 'middle',
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
    textAlign: 'left'
  },
  input2: {
    fontSize: '18px',
    justifyContent: 'center',
    color: '#1674D1'
  },
  input4: {
    fontSize: '18px',
    paddingTop: 20,
    cursor: 'pointer',
    color: '#1674D1'
  },
  input5: {
    fontSize: '18px',
    color: '#004571'
  },
  gridCertificado: {
    height: 50,
    textAlign: 'center',
    color: '#FFFFFF',
    background: '#004671',
    border: 'solid 2px #E1E9EE',
    borderRadius: 10,
    marginTop: 20
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
  text1b: {
    textAlign: 'center',
    paddingTop: 20
  },
  gridCloseIcon: {
    paddingTop: 5,
    textAlign: 'center'
  },
  lockIcon: {
    width: 40
  },
  lockIconError: {
    width: 20
  },
  medalIcon: {
    width: 25
  }
}))

export default useStyles
