import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  boxconsumption: {
    position: 'relative',
    padding: 12,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    border: 'solid 1px #E1E9EE',
    marginTop: 15,
    borderRadius: '8px'
  },
  boxpower: {
    position: 'relative',
    padding: 12,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    border: 'solid 1px #E1E9EE',
    marginTop: 15,
    borderRadius: '8px'
  },
  text: {
    paddingRight: 20,
    paddingLeft: 20
  },
  dossierDateAdviseTitle: {
        color: '#256094',
        position: 'relative',
        padding: 12,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        border: 'solid 1px #E1E9EE',
        marginTop: 15,
        borderRadius: '8px',
        textAlign: 'center',
        [theme.breakpoints.only('xs')]: {
            textAlign: 'center'
        }
    },
    infoIcon: {
      width: 35,
      [theme.breakpoints.down('sm')]: {
          margin: '0 auto',
          marginBottom: '15px',
          display: 'block'
      }
  },
  boxpeticiones: {
    position: 'relative',
    padding: 12,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    border: 'solid 1px #E1E9EE',
    marginTop: 15,
    borderRadius: '8px'
  },
  boxgenerator: {
    position: 'relative',
    padding: 12,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    border: 'solid 1px #E1E9EE',
    marginTop: 15,
    borderRadius: '8px'
  },
  boxSuppliesList: {
    position: 'relative',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    border: 'solid 1px #E1E9EE',
    marginTop: 15,
    borderRadius: '8px',
    padding: 12,
    width: '100%'
  },
  container: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    maxWidth: 1200
  },
  arrowUp: {
    transform: 'rotate(180deg)',
  },
  arrowIcon: {
    transform: 'rotate(90deg)',
    width: 9,
    marginLeft: '10px',
    '& img': {
      width: '100%',
      height: '100%'
    }
  },
  arrowIcon2: {
    width: 9,
    height: 17,
    marginLeft: '10px',
    '& img': {
      width: '100%',
      height: '53%'
    }
  },
  table: {
    width: '100%',
    marginTop: 10
  },
  options: {
    '& .MuiGrid-item.MuiGrid-grid-md-2': {
      maxWidth: '50%',
      flexBasis: '50%',
      [theme.breakpoints.down('sm')]: {
        maxWidth: '100%',
        flexBasis: '100%',
      }
    }
  },
  title: {
    fontSize: 36,
    color: 'rgba(0, 69, 113, 1)'
  },
  potencia: {
    marginTop: 20,
    MarginLeft: 10,
    fontSize: 50,
    textAlign: 'center',
    color: 'rgba(0, 69, 113, 1)'
  },
  info: {
    marginTop: 20,
    marginLeft: 10,
    fontSize: 20,
    color: 'rgba(0, 69, 113, 1)'
  },
  potencia1: {  
    marginLeft: 10,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 40,
    color: 'rgba(0, 69, 113, 1)'
  },
  energyText: {
    fontSize: 15,
    color: 'rgba(0, 69, 113, 1)',
    alignItems: 'center'
  },
  Watt1: {
    fontSize: 15,
    verticalAlign: 'top',  
    color: 'rgba(0, 69, 113, 1)'
  },
  Watt2: {
    fontSize: 14,    
    color: 'black'
  },
  Watt: {
    fontSize: 18,
    textAlign: 'left',
    verticalAlign: 'top',
    color: 'rgba(0, 69, 113, 1)'
  },
  Wattinfo: {
    fontSize: 18,
    textAlign: 'center',
    color: 'rgba(0, 69, 113, 1)'
  },
  Potinfo: {
    textAlign: 'center',
    paddingTop: 20
  },
  Infopot: {
    fontSize: 14,
    textAlign: 'center',
    color: 'rgba(127, 127, 127)'
  },
  Link: {
    fontSize: 14,
    color: '#0066CC',
    marginTop: 20,
    alignItems: 'flex-end',
    textDecoration: 'none',
    justifyContent: 'flex-end'
  },
  userInfo: {
    position: 'relative',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    backgroundColor: '#FFF',
    color: '#0066CC',
    padding: '6px 12px',
    borderRadius: '2px 2px 0 0',
    marginBottom: '-1px',
    borderBottom: '1px solid white',
  },
  suppliesList: {
    position: 'relative',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    backgroundColor: '#FFF',
    color: '#0066CC',
    padding: '6px 12px',
    borderRadius: '2px 2px 0 0',
    marginBottom: '-1px',
    borderBottom: '1px solid white',
    cursor: 'pointer',
  },
  peticiones: {
    color: '#696969',
    marginTop: 15,
    marginLeft: 5
  },
  infoPower: {
    color: '#696969'
  },
  infoEnergy: {
    color: '#696969',
    marginTop: 17,
	  marginLeft: 10
  },
  noItemsAlert: {
	position: 'relative',
    padding: 32,
    border: 'solid 1px #E1E9EE',
    marginTop: 250
  }
}))

export default useStyles
