import { makeStyles } from '@material-ui/core/styles'

import Background from './../../../assets/img/bg_login.png'

const useStyles = makeStyles((theme) => ({
  block: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    marginTop: 75
  },
  container: {
    padding: '20px 0',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    flexGrow: 1,
    backgroundImage: `url(${Background})`,
    flexDirection: 'row'
  },
  login: {
    backgroundColor: 'white',
    textAlign: 'center',
    padding: '44px 0'
  },
  register: {
    backgroundColor: 'rgba(0, 70, 113, 0.85)',
    textAlign: 'center',
    padding: '44px 0'
  },
  maxWidthForBigScreens: {
    maxWidth: 1200
  }
}))

export default useStyles
