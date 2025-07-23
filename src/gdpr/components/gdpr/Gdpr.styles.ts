import { makeStyles } from '@material-ui/core/styles'

import Background from './../../../assets/img/bg_login.png'

const useStyles = makeStyles((theme) => ({
  block: {
    backgroundColor: '#185276',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    marginTop: 75
  },
  container: {
    padding: '20px 0',
    backgroundSize: '100% 100%',
    backgroundImage: `url(${Background})`,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  box: {
    position: 'relative',
    padding: '40px 60px',
    backgroundColor: '#FFF',
    border: 'solid 2px #004571',
    justifyContent: 'center'
  },
  closeIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
    cursor: 'pointer'
  },
  infoIcon: {
    width: 50
  },
  title: {
    fontSize: 22,
    color: '#004571',
    textAlign: 'center',
    marginTop: 28
  },
  privacyPolicy: {
    width: '100%',
    textAlign: 'center',
    marginTop: 28,
    '& label': {
      marginRight: '6px !important'
    }
  },
  privacyPolicyLabel: {
    marginLeft: 8
  },
  privacyPolicyLink: {
    color: '#0066CC',
    textDecoration: 'underline',
    cursor: 'pointer'
  },
  button: {
    textAlign: 'center',
    width: '100%',
    marginTop: 28
  }
}))

export default useStyles
