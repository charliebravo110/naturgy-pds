import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    maxWidth: 1200
  },
  label: {
    color: 'rgba(0, 69, 113, 1)'
  },
    arrowUp: {
    transform: 'rotate(180deg)'
  },
  arrowIcon: {
    width: 9,
    height: 24,
    marginLeft: 3,
    '& img': {
      width: '100%',
      height: '100%',
      marginLeft: 3
    }
  },
  arrowIconMobile: {
    position: 'relative',
    right: 10,
    top: 10
  },    
   menu: {
    position: 'relative',
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  menuItem: {
    alignItems: 'flex-end'
  },

  userInfoMobile: {
    position: 'relative',
    backgroundColor: '#FFF',
    color: '#155279',
    borderRadius: '2px 2px 0 0',
    cursor: 'pointer',
    width: 0
  },
  userInfo: {
    position: 'relative',
    backgroundColor: '#FFF',
    color: '#155279',
    padding: '6px 12px',
    borderRadius: '2px 2px 0 0',
    cursor: 'pointer',
    marginBottom: '-1px',
    borderBottom: '1px solid white'
  },
  containerMobile: {
    height: 50,
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  }
}))

export default useStyles
