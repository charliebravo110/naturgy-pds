import { makeStyles } from '@material-ui/core/styles'

const useStyles = props => makeStyles((theme) => {
 const { showBurguer } = props
 return (
  {
  subheader: {
    backgroundColor: '#004571'
  },
  subheaderMobile: {
    border: '1px solid #004571',
    borderRadius: 10,
    height: 55,
    width: 125,
    position: 'absolute',
    top: 10,
    right: showBurguer ? 70 : 8
  },
  subheaderMobileOpen:{
    margin: '10px 0 0 45px',
    border: '1px solid #004571',
    borderRadius: 10,
    width: 225,
    position: 'absolute',
    top: 0,
    right: showBurguer ? 70 : 8,
    backgroundColor: '#FFF'
  },
  subheaderHeightUser: {
    height: 210
  },
  subheaderHeightAdmin: {
    height: 290
  },
  bar: {
    justifyContent: 'center'
  },
  container: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    maxWidth: 1200
  },
  containerMobile: {
    height: 50
  },
  toUfd: {
    fontSize: 14,
    marginRight: 36,
    '& a': {
      color: '#FFF',
      textDecoration: 'none'
    }
  },
  userContainer: {
    position: 'relative',
    paddingTop: 6
  },
  userContainerMobile: {
    position: 'relative',
    padding: '4px 0 0 15px'
  },
  userInfo: {
    backgroundColor: '#FFF',
    color: '#155279',
    alignItems: 'center',
    padding: '6px 12px',
    borderRadius: '2px 2px 0 0',
    cursor: 'pointer',
    marginBottom: '-1px',
    borderBottom: '1px solid white'
  },
  userInfoMobile: {
    backgroundColor: '#FFF',
    color: '#155279',
    borderRadius: '2px 2px 0 0',
    cursor: 'pointer',
    width: 0
  },
  userIcon: {
    width: 30,
    height: 30,
    marginRight: 12,
    '& svg': {
      fill: '#A1AB00',
      width: '100%',
      height: '100%'
    }
  },
  userIconMobile: {
    '& img': {
      width: 45
    }
  },
  hello: {
    fontSize: 11,
    fontWeight: 'bold'
  },
  name: {
    fontSize: 14,
    marginTop: 2
  },
  arrowIcon: {
    width: 9,
    height: 24,
    marginLeft: 36,
    '& img': {
      width: '100%',
      height: '100%'
    }
  },
  arrowUp: {
    transform: 'rotate(180deg)'
  },
  arrowIconMobile: {
    position: 'absolute',
    right: 15,
    top: 15
  },
  userBox: {
    position: 'absolute',
    top: '100%',
    right: 0,
    left: 0,
    backgroundColor: '#FFF',
    fontSize: 14,
    padding: 12,
    borderRadius: '0 0 2px 2px',
    boxShadow: '0 2px 2px rgba(0, 0, 0, .2)',
    zIndex: 2,
    '& a': {
      color: '#0066CC'
    }
  },
  userBoxMobile: {
    position: 'absolute',
    top: '100%',
    right: 0,
    left: 0,
    backgroundColor: '#FFF',
    fontSize: 14,
    padding: 12,
    zIndex: 2,
    color: '#004571',
    '& a': {
      color: '#0066CC'
    }
  },
  boxItem: {
    '& a': {
      display: 'flex',
      textDecoration: 'none'
    },
    '& svg': {
      width: 12
    }
  },
  boxItemSecondUser: {
    marginBottom: '10px',
    color: '#155279'
  },
  itemIcon: {
    width: 18,
    height: 18,
    marginLeft: 6
  },
  closeIcon: {
    width: '10px',
    height: '10px',
    position: 'relative',
    '& img': {
      width: '10px',
      height: '10px',
      position: 'absolute',
      top: 0,
      left: 0
    }

  },
  linkAdminLogout: {
    display: 'flex',
    color: '#0066CC',
    alignItems: 'baseline',
    cursor: 'pointer'
  },
  divider: {
    width: '100%',
    margin: '12px 0'
  },
  button: {
    marginTop: 5,
    marginBottom: 5,
    fontSize: '0.6rem',
    backgroundColor: 'white',
    borderWidth: 0,
    color: '#004571',
    '&:hover': {
      backgroundColor: '#D3D3D3',
      color: '#004571',
      borderWidth: 0
    }
  },
  notRegistered: {
    backgroundColor: 'red',
    justifyContent: 'center'
  },
  notRegisteredMobile: {
    backgroundColor: 'red',
    justifyContent: 'flex-start',
    display: 'flex',
    paddingLeft: 10
  },
  barElement: {
    fontSize: '0.8rem',
    color: 'white',
    fontWeight: 'bold'
  },
  innerBar: {
    maxWidth: 1200,
    alignItems: 'center'
  },
  iconCertificate: {
    marginTop: -20,
    marginLeft: 12,
    [theme.breakpoints.only('xs')]: {
      marginTop: -42,
      marginLeft: 18,
    }
  }
 }
)})

export default useStyles
