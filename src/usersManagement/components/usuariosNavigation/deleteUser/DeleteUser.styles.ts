import { makeStyles, withStyles } from '@material-ui/core/styles'
import colors from '../../../../assets/colors/colors'

const useStyles = makeStyles((theme) => ({
  center: {

    justifyContent:'center',

    [theme.breakpoints.down('sm')]: {
      justifyContent:'center !important'
    },
    [theme.breakpoints.down('xs')]: {
      justifyContent:'center !important'
    }
    
  },
  table: {
    // margin: '2rem auto auto auto',
  },
  inputsAreaWrapper: {
    marginBottom: '4%',
    [theme.breakpoints.up('sm')]: {
      padding: '20px',
      '-webkit-box-shadow': '0px 0px 3px 1px rgba(207,205,207,1)',
      '-moz-box-shadow': '0px 0px 3px 1px rgba(207,205,207,1)',
      boxShadow: '0px 0px 3px 1px rgba(207,205,207,1)'
    }
  },
  inputsArea: {
    background: 'white',
    '-webkit-box-shadow': '0px 0px 3px 1px rgba(207,205,207,1)',
    '-moz-box-shadow': '0px 0px 3px 1px rgba(207,205,207,1)',
    boxShadow: '0px 0px 3px 1px rgba(207,205,207,1)',
    [theme.breakpoints.up('sm')]: {
      backgroundColor: 'rgb(247, 247, 247)',
      '-webkit-box-shadow': 'none',
      '-moz-box-shadow': 'none',
      boxShadow: 'none'
    }
  },
  inputTitle: {
    color: 'rgba(0, 69, 113, 1.0)',
    fontSize: '14px',
    marginTop: '20px',
    marginBottom: '10px',
    [theme.breakpoints.up('sm')]: {
      height: '28px',
      display: 'flex',
      alignItems: 'flex-end'
    }
  },
  input: {
    width: '100%',
    backgroundColor: '#FFF',
    marginBottom: '25px',
    '& input, & .MuiSelect-selectMenu': {
      background: '#FFF',
      paddingTop: '15px',
      paddingBottom: '15px'
    }
  },
  listContainer: {
    marginBottom: '15px'
  }
}));

export default useStyles
