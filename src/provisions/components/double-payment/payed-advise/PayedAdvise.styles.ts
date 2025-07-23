import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '20px 36px',
    boxShadow: '0 0 2px #868686',
    textAlign: 'center'
  },
  title: {
    fontSize: 36,
    color: '#004571',
    textAlign: 'center',
    margin: '26px 0 46px'
  },
  payment: {
    color: '#E57000',
    fontWeight: 'bold',
    fontSize: 50
  },
  separator: {
    width: '90%',
    alignSelf: 'center',
    height: '1px',
    backgroundColor: '#E3EBEF',
    margin: '20px 0'
  },
  text: {
    color: '#004571',
    fontWeight: 'bold'
  },
  iconContainer: {
    margin: '0 auto'
  },
  icon: {
    width: 50
  },
  subtitle: {
    fontSize: 18,
    color: '#E57000',
    fontWeight: 'bold'
  },
  link: {
    textDecoration: 'underline', 
    color: '#0c69c6',
    margin:'0px',
  },
  policy: {
    color: '#605e5e',
  },
  tabIcon: {
		filter: 'invert(57%) sepia(68%) saturate(3779%) hue-rotate(189deg) brightness(91%) contrast(84%)',
    width: '5%',
    position: 'relative',
    left: '5px',
    top: '5px'
  }
}))

export default useStyles

