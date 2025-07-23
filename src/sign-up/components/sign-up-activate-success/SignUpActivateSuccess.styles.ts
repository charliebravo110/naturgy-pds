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
    padding: '40px 60px',
    backgroundColor: '#FFF',
    border: 'solid 2px rgb(0, 69, 113)',
    justifyContent: 'center'
  },
  title: {
    fontSize: 26,
    color: 'rgba(0, 69, 113, 1)',
    textAlign: 'center',
    marginTop: 28
  },
  text: {
    textAlign: 'center',
    marginTop: 20,
  },
  button: {
    marginTop: 32
  }
}))

export default useStyles
