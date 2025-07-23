import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  generalCont: {
    position: 'absolute',
    right: '0',
    backgroundColor: '#e57200',
    width: '100px',
    height: '100px',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    borderTopRightRadius: '0',
    color: '#ffffff',
    overflow: 'hidden',
    cursor: 'pointer',
    [theme.breakpoints.only('xs')]: { 
      width: '50px',
      height: '50px'
    }
  },
  iconCont: {
    [theme.breakpoints.up('sm')]: {
      paddingBottom: '10px'
    }
  },
  icon: {
    width: '30px',
    transform: 'rotate(135deg)',
    filter: 'invert(100%) sepia(100%) saturate(0%) hue-rotate(57deg) brightness(103%) contrast(103%)',
    [theme.breakpoints.only('xs')]: {
      width: '25px',
    }
  }
}))

export default useStyles
