import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'relative',
    backgroundColor: '#004571',
    color: '#FFF',
    padding: '28px 36px',
    borderRadius: 8,
    marginTop:'28px',
    maxWidth: 1200,
    zIndex: 2,
    [theme.breakpoints.only('xs')]: {
      marginBottom: '-120px',
      padding: '16px 20px'
    },
    '&.canceled': {
      filter: 'grayscale(1)'
    }
  },
  infoIcon:  {
    width: 14
  },
  canceledDossier: {
    position: 'absolute',
    top: 8,
    right: 8,
    fontWeight: 'bold'
  },
  leftColumn: {
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center'
    }
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  boldText: {
    minHeight: 19,
    fontWeight: 'bold'
  },
  centerColumn: {
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center'
    }
  },
  nameIcon: {
    fontSize: 36
  },
  nameLabel: {
    color: 'rgba(255, 255, 255, .5)',
    fontSize: 17,
    fontWeight: 'bold',
    lineHeight: '1.5',
    marginLeft: 8,
    '&.textField': {
      marginTop: 1
    },
    '&.textField:before': {
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, .5)'
    },
    '&.textField:hover:before': {
      borderWidth: 1,
      borderColor: '#FFF'
    },
    '&.textField:after': {
      borderWidth: 1,
      borderColor: '#FFF'
    },
    '&.textField:hover:after': {
      borderWidth: 1
    }
  },
  cups: {
    display: 'inline-block',
    backgroundColor: '#009AA6',
    fontWeight: 'bold',
    padding: '10px 32px',
    borderRadius: '20em',
    marginTop: 8,
    [theme.breakpoints.down('sm')]: {
      padding: '10px 54px'
    },
    [theme.breakpoints.down('xs')]: {
      padding: '10px 24px'
    }
  },
  divider: {
    height: '1px',
    marginTop: '10px',
    backgroundColor: 'rgba(255, 255, 255, .5)'
  },
  name: {
    [theme.breakpoints.down('sm')]: {
      marginTop: 20
    }
  },
  nameContainer: {
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center'
    }
  },
  addressContainer: {
    marginTop: 20
  },
  typeContainer: {
    marginTop: 20
  },
  typeContainer2: {
    marginTop: 10
  },
  rightColumn: {
    alignItems: 'start',
    flexDirection: 'row',
    [theme.breakpoints.down('sm')]: {
      marginTop: 10
    }
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 12,
    cursor: 'pointer',
    height: '1.1875rem',
    '&.disabled': {
      opacity: .5,
      cursor: 'default'
    }
  },
  buttonIcon: {
    width: 14
  },
  buttonpadlockIcon: {
    marginLeft: 'auto'
  },
  buttonLabel: {
    fontSize: 13,
    marginLeft: 8
  },
  sectionTitle: {
    marginBottom: 2
  },
  sectionTitle2: {
    marginTop: 25,
    marginBottom: 2
  }
}))

export default useStyles
