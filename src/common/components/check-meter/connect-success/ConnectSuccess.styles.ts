import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    border: '2px solid #E1E9EE',
    padding: '32px'
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    color: 'rgba(0, 69, 113, 1)'
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
  onePhasePowers: {
    fontSize: 60,
    color: 'rgba(0, 69, 113, 1)',
    letterSpacing: 3,
    [theme.breakpoints.only('xs')]: {
      fontSize: 50
    }
  },
  triPhasePowers: {
    fontSize: 50,
    color: 'rgba(0, 69, 113, 1)',
    letterSpacing: 3
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
    top: 8.5,
    color: '#96A6B4',
    right: -50
  },
  onePowerTypeTwo: {
    position: 'absolute',
    fontSize: 20,
    top: 8.5,
    color: '#96A6B4',
    right: -15
  },
  triPowerTypeOne: {
    position: 'absolute',
    fontSize: 18,
    top: 8.5,
    color: '#96A6B4',
    right: -45
  },
  triPowerTypeTwo: {
    position: 'absolute',
    fontSize: 18,
    top: 8.5,
    color: '#96A6B4',
    right: -10
  },
  phaseLabel: {
    color: 'rgba(0, 69, 113, 1)',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'left'
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
  }
}))

export default useStyles