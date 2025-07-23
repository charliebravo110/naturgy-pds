import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  block: {
    position: 'relative',
    justifyContent: 'center'
  },
  container: {
    backgroundColor: '#004571',
    color: '#FFF',
    padding: '28px 36px',
    borderRadius: 8,
    maxWidth: 1200,
    zIndex: 1,
    [theme.breakpoints.up('md')]: {
      padding: '16px 20px',
      marginTop: 120,
    },
    [theme.breakpoints.down('sm')]: {
      padding: '16px 20px',
      marginTop: 75,
    },
  },
  notRegisteredContainer: {
    backgroundColor: '#004571',
    color: '#FFF',
    padding: '28px 36px',
    borderRadius: 8,
    maxWidth: 1200,
    zIndex: 1,    
    [theme.breakpoints.up('md')]: {
      padding: '16px 20px',
      marginTop: 165,
    },
    [theme.breakpoints.down('sm')]: {
      padding: '16px 20px',
      marginTop: 150
    }
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
    fontWeight: 'bold'
  },
  centerColumn: {
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center'
    }
  },
  nameIcon: {
    fontSize: 36,
    marginRight: 10
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
  cupsBlock: {
    marginTop: 24
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
  nonPaymentBlock: {
    position: 'absolute',
    bottom: '-80px',
    left: 0,
    backgroundColor: '#D3222A',
    borderRadius: 8,
    maxWidth: 1200,
    height: '100%',
    [theme.breakpoints.only('xs')]: {
      marginBottom: '-200px'
    },
    [theme.breakpoints.up(1500)]: {
      marginLeft: 'calc(50% - 1200px/2)'
    }
  },
  nonPayment: {
    color: '#FFF',
    position: 'absolute',
    bottom: 0,
    marginBottom: 20,
    [theme.breakpoints.down('sm')]: {
      marginBottom: 10
    },
    [theme.breakpoints.only('xs')]: {
      marginBottom: 30
    }
  },
  alertIcon: {
    width: 40
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
  rightColumn: {
    alignItems: 'start',
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
    },
    [theme.breakpoints.up('md')]: {
      paddingLeft: '20%'
    }
  },
  buttonIcon: {
    width: 14
  },
  meterContainer: {
    [theme.breakpoints.up('md')]: {
      paddingLeft: '20%'
    }
  },
  detailButton:{
    maxWidth: 190,
    width: '100%',
    fontSize: 16,
    marginTop: 12,
    cursor: 'pointer',
    borderRadius: 5,
    backgroundColor: '#FFF',
    padding: '7px 7px 7px 10px',
    color: 'rgba(0, 0, 0, 0.38)',
    fontWeight: 'bold',
    justifyContent: 'space-around'
  },
  meterButton: {
    maxWidth: 190,
    width: '100%',
    fontSize: 14,
    marginTop: 12,
    cursor: 'pointer',
    backgroundColor: '#FFF',
    borderRadius: 5,
    padding: '7px 7px 7px 10px',
    color: 'rgba(0, 69, 113, 1)',
    fontWeight: 'bold',
    justifyContent: 'space-around',
    '&.disabled': {
      cursor: 'default',
      color: 'rgba(0, 0, 0, 0.38)'
    }
  },
  meterButton2: {
    maxWidth: 190,
    width: '100%',
    fontSize: 14,
	textAlign: 'center',
    marginTop: 12,
    cursor: 'pointer',
    backgroundColor: 'rgba(0, 69, 113, 1)',
    borderRadius: 5,
	borderColor: 'white',
	borderStyle: 'solid',
	borderWidth: '1px',
    padding: '7px 7px 7px 10px',
    color: '#FFF',
    //fontWeight: 'bold',
    justifyContent: 'space-around',
    '&.disabled': {
      cursor: 'default',
      color: 'rgba(0, 0, 0, 0.38)'
    }
  },
  meterLabel: {
    [theme.breakpoints.down('sm')]: {
      marginRight: 10
    }
  },
  meterIconBlock: {
    height: '24.95px'
  },
  meterIcon: {
    height: 'inherit'
  },
  buttonLabel: {
    fontSize: 13,
    marginLeft: 8
  },
  sectionTitle: {
    marginBottom: 2
  }
}))

export default useStyles
