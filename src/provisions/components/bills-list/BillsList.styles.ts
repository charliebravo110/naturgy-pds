
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  block: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    marginTop: 126,
    [theme.breakpoints.only('xs')]: {
      marginTop: 70
    }
  },
  container: {
    padding: '20px 0',
    justifyContent: 'center'
  },
  maxWidthForBigScreens: {
    maxWidth: 1200,
    width: '100%'
  },
  title: {
    fontSize: 36,
    color: 'rgba(0, 69, 113, 1)',
    textAlign: 'center',
    margin: '76px 0 30px'
  },
  notRegisteredTitle: {
    fontSize: 36,
    color: 'rgba(0, 69, 113, 1)',
    textAlign: 'center',
    margin: '76px 0 30px',
    [theme.breakpoints.down('sm')]: {
      marginTop: 93
    }
  },
  message: {
    fontSize: 18,
    textAlign: 'left',
    margin: '30px 0 20px',
    color: '#B0B0B0',
    display: 'block',
  },
  box: {
    position: 'relative',
    padding: 32,
    border: 'solid 1px #E1E9EE',
    borderRadius: 4,
    marginTop: 20
  },
  listContainer: {
    width: '100%',
    margin: '0px 20px'
  },
  listContainerB: {
    width: '100%',
  },
  goBackContainer: {
    //position: 'absolute',
    //top: 55,
    color: '#6AA1D8',
    cursor: 'pointer',
    [theme.breakpoints.only('xs')]: {
      top: 20,
      '&.onDossier': {
        top: -10
      },
      '&.onSupply': {
        top: 100
      },
      container: {
        padding: '20px 0',
        justifyContent: 'center'
      },
      maxWidthForBigScreens: {
        maxWidth: 1200,
        width: '100%'
      },
      title: {
        fontSize: 36,
        color: 'rgba(0, 69, 113, 1)',
        textAlign: 'center',
        margin: '26px 0 30px'
      },
      box: {
        position: 'relative',
        padding: 32,
        border: 'solid 1px #E1E9EE',
        borderRadius: 4,
        marginTop: 20
      },
      listContainer: {
        width: '100%',
        margin: '0px 20px'
      },
      listContainerB: {
        width: '100%',
      },
      goBackContainer: {
        color: '#6AA1D8',
        cursor: 'pointer',
        [theme.breakpoints.only('xs')]: {
          top: 20
        }
      },
      goBack: {
        alignItems: 'center'
      },
      goBackIcon: {
        height: 24
      }
    }
  },
  goBack: {
    alignItems: 'center'
  },
  goBackIcon: {
    height: 24
  }
}))



export default useStyles