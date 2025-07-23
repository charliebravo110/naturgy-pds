import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    border: '2px solid #E1E9EE',
    padding: '32px'
  },
  title: {
    fontSize: 30,
    marginTop: 10,
    textAlign: 'center',
    color: 'rgba(0, 69, 113, 1)'
  },
  subTitle: {
    fontSize: 15,
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
  },
  icon: {
    width: 60
  },
  divider: {
    height: 2,
    backgroundColor: '#E1E9EE',
    margin: '40px 0'
  },
  date: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#E57000',
    marginBottom: 40
  },
  certificate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgba(0, 69, 113, 1)',
    marginBottom: 30,
    textDecorationLine: 'underline',
    cursor: 'pointer',
    marginLeft: 4,
  },
    documentIcon: {
    marginRight: 10,
    marginLeft: 500,
    width: 25,
    marginBottom: 15,
    '& a': {
      textDecoration: 'none',
      color: '#5193bd',
      cursor: 'pointer',
    }
  },
  onePhasePowers: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'rgba(0, 69, 113, 1)',
    letterSpacing: 3,
    [theme.breakpoints.only('xs')]: {
      fontSize: 30
    }
  },
  triPhasePowers: {
    fontSize: 40,
    color: 'rgba(0, 69, 113, 1)',
    letterSpacing: 3
  },
  triPhasePeriodTitle: {
    fontSize: 40,
    color: 'rgba(0, 69, 113, 1)',
    letterSpacing: 3,
    position: 'relative',
    width: 'fit-content',  
  },
  triPhasePeriodPowers: {
    fontSize: 30,
    color: 'rgba(0, 69, 113, 1)',
    letterSpacing: 3,
    left: -75,
    top: -1.0,
  },
  phaseBlock: {
    width: 'fit-content',
    display: 'table',
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  phaseContainer: {
    position: 'relative',
    width: 'fit-content',
    display: 'table',
    [theme.breakpoints.down('sm')]: {
      marginBottom: 10
    }
  },
  onePowerTypeOne: {
    position: 'absolute',
    fontSize: 20,
    top: 18,
    color: '#96A6B4',
    right: -40
  },
  onePowerTypeTwo: {
    position: 'absolute',
    fontSize: 20,
    top: 17,
    color: '#96A6B4',
    right: -55
  },
  onePowerTypeThree: {
    position: 'absolute',
    fontSize: 20,
    top: 13,
    color: '#96A6B4',
    left: 107
  },
  triPowerTypeThree: {
    position: 'absolute',
    fontSize: 40,
    fontWeight: 'bold',
    top: -1.0,
    color: '#96A6B4',
    righ: 25
  },
  onePowerTypeFour: {
    position: 'absolute',
    fontSize: 20,
    top: 5,
    color: '#96A6B4',
    right: -60
  },
  onePowerTypeFive: {
    position: 'absolute',
    fontSize: 20,
    top: 9,
    color: '#96A6B4',
    right: -60
  },
  onePowerTypeSix: {
    position: 'absolute',
    fontSize: 20,
    top: 17,
    color: '#96A6B4',
    right: -60
  },
  triPowerTypePeriod: {
    position: 'absolute',
    fontSize: 40,
    fontWeight: 'bold',
    top: -1.0,
    color: '#96A6B4',
  },
  triPowerTypeOne: {
    position: 'absolute',
    fontSize: 18,
    top: 17,
    color: '#96A6B4',
    right: -35
  },
  triPowerTypeTwo: {
    position: 'absolute',
    fontSize: 18,
    top: 17,
    color: '#96A6B4',
    right: -45
  },
  triPowerTypeTree: {
    position: 'absolute',
    fontSize: 18,
    top: 17,
    color: '#96A6B4',
    right: -55
  },
  phaseLabel: {
    color: '#96A6B4',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'left'
  },
  phaseLabelTotalizador: {
    color: '#96A6B4',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'left',
    marginTop: 20,
    marginBottom: 20
  },
  
  phaseLabel2: {
    color: 'rgba(0, 69, 113, 1)',
    fontSize: 40,
    textAlign: 'left'
  },
  phaseLabel3: {
    color: '#96A6B4',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 20
  },
  triphasicBox: {
    justifyContent: 'space-between',
    paddingRight: 45
  },
  triphasicContainer: {
    width: 'fit-content',
    display: 'table',
    minWidth: 100,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginBottom: 30
    }
  },
  triphasicContainer2: {
    width: 'fit-content',
    display: 'table',
    minWidth: 100,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginBottom: 30
    }
  },
  triphasicContainer3: {
    width: 'fit-content',
    display: 'table',
    minWidth: 194,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginBottom: 30
    }
  }
}))

export default useStyles