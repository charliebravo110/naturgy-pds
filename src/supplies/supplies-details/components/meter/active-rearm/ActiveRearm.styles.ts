import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    border: '2px solid #E1E9EE',
    padding: '32px'
  },
  title: {
    fontSize: 30,
    color: 'rgba(0, 69, 113, 1)'
  },
  icon: {
    width: 60
  },
  shutDownICP:{
    fontSize: 25,
    color: '#FF0000',
    textAlign: 'center'
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
  certificate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgba(0, 69, 113, 1)',
    marginBottom: 30,
    textDecorationLine: 'underline',
    cursor: 'pointer',
    marginLeft: 4,
  },
  triPhasePowers: {
    fontSize: 40,
    color: 'rgba(0, 69, 113, 1)',
    letterSpacing: 3
  },
  phaseLabel3: {
    color: '#96A6B4',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 20,
    marginLeft:-35
  },
  triPhasePeriodTitle: {
    fontSize: 40,
    color: 'rgba(0, 69, 113, 1)',
    letterSpacing: 3,
    position: 'relative',
    width: 'fit-content',  
  },
  phaseBlock: {
    width: 'fit-content',
    display: 'table',
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  onePowerTypeFive: {
    position: 'absolute',
    fontSize: 20,
    top: 9,
    color: '#96A6B4',
    right: -60
  },
  phaseLabel2: {
    color: 'rgba(0, 69, 113, 1)',
    fontSize: 40,
    textAlign: 'left'
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
  phaseLabelTotalizador: {
    color: '#96A6B4',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'left',
    marginTop: 20,
    marginBottom: 20,
  },
  onePowerTypeThree: {
    position: 'absolute',
    fontSize: 20,
    top: 13,
    color: '#96A6B4',
    left: 107
  },
  onePowerTypeFour: {
    position: 'absolute',
    fontSize: 20,
    top: 5,
    color: '#96A6B4',
    right: -60
  },
  triPhasePeriodPowers: {
    fontSize: 30,
    color: 'rgba(0, 69, 113, 1)',
    letterSpacing: 3,
    left: -75,
    top: -1.0,
  },
  triPowerTypeOne: {
    position: 'absolute',
    fontSize: 18,
    top: 17,
    color: '#96A6B4',
    right: -35
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
  phaseContainer: {
    position: 'relative',
    width: 'fit-content',
    display: 'table',
    [theme.breakpoints.down('sm')]: {
      marginBottom: 10
    }
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
  triphasicBox: {
    justifyContent: 'space-between',
    paddingRight: 45
  },
  triphasicContainer2: {
    width: 'fit-content',
    display: 'table',
    minWidth: 100,
    marginLeft:-15,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginBottom: 30
    }
  },
  triphasicContainer3: {
    width: 'fit-content',
    display: 'table',
    minWidth: 194,
    marginLeft:-15,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginBottom: 30
    }
  },
  description: {
    fontSize: 30,
    color: '#FF0000'
  }
}))

export default useStyles