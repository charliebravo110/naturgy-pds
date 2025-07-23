import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'relative',
    [theme.breakpoints.only('xs')]: {
      width: '100%',
      marginTop: 15
    }
  },
  button: {
    backgroundColor: '#004571',
    color: '#FFF',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 18px',
    borderRadius: 4,
    cursor: 'pointer',
    [theme.breakpoints.up('xs')]: {
      minWidth: 300
    }
  },
  arrowIcon: {
    marginLeft: 24
  },
  box: {
    position: 'absolute',
    top: 'calc(100% + 2px)',
    right: 0,
    left: 0,
    backgroundColor: '#FFF',
    border: 'solid 2px #004571',
    borderRadius: 4,
    zIndex: 100,
    [theme.breakpoints.up('xs')]: {
      marginLeft: 8,
      marginRight: 8
    }
  },
  export: {
    color: '#1674D1',
    fontSize: 14,
    padding: '12px 10px',
    cursor: 'pointer'
  },
  exportWithBorder: {
    borderBottom: '1px solid rgba(0, 69, 113, 0.5)'
  },
  exportText: {
    display: 'flex',
    alignItems: 'center'
  },
  exportIcon: {
    marginRight: 10,
    '& img': {
      width: 24,
      height: 20
    }
  }
}))

export default useStyles
