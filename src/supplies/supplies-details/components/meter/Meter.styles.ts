import { makeStyles } from '@material-ui/core/styles'
import { Height } from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({
  container: {
    margin: '0 auto',
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      padding: 2
    }
  },
  maxWidthForBigScreens: {
    maxWidth: 1200,
    width: '100%'
  },
  title: {
    fontSize: 36,
    color: 'rgba(0, 69, 113, 1)',
    textAlign: 'center',
    marginBottom: 40,
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      display: 'block'
    }
  },
  backLink: {
    fontSize: 16,
    color: '#1674D1',
    alignItems: 'center',
    marginRight: 18,
    cursor: 'pointer',
    [theme.breakpoints.down('sm')]: {
      margin: '0 0 6px'
    }
  },
  backIcon: {
    width: 7,
    marginRight: 10
  },
  icon: {
    width: 50,
    marginTop: 20,

  },
  description: {
    color: '#555555',
    textAlign: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },
  descriptionText: {
    color: 'rgba(0, 69, 113, 1)',
    textAlign: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },
  descriptionBold: {
    color: '#C78330',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center'
  },
  contactBlock: {
    color: 'rgba(0, 69, 113, 1)'
  },
  contactIcon: {
    marginRight: 15
  },
  contactDescription: {
    textAlign: 'left',
    fontSize: 14,
    fontWeight: 'bold'
  },
  contactPhone: {
    textAlign: 'left',
    fontSize: 36
  },
  button: {
    marginTop: 100
  },
  items: {
    width: 800,
    margin: '0 auto',
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  buttonPadding:{
    marginTop:'10px',
    marginBottom:'30px'
  },
  topContainer:{
    justifyContent: 'space-between',
    display: 'flex',
    marginBottom: '20px',
    flexDirection: 'row',
  },
  consultContainer:{
    justifyContent: 'center',
    border: '1px solid #E1E9EE',
  },
  mainContainer: {
    justifyContent: 'center',
    marginBottom: '10px',
    marginTop: '10px',
    // border: '1px solid #E1E9EE',
    // gridAutoColumns: '50%'
  },
  innerArea: {
    border: '1px solid #E1E9EE',
    backgroundColor: '#F7F7F7',
    margin: '20px 20px 20px 20px',
    justifyContent: 'space-between',
    height: 100
    // gridAutoColumns: '50%'
  },

}))

export default useStyles
