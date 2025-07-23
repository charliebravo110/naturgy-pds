

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  
  searcher: {
    justifyContent: 'flex-end',
    paddingRight: 8,
    paddingTop: 6,
    [theme.breakpoints.down('sm')]: {
      paddingRight: 0,
      paddingBottom: 14,
      width: '100%'
    },
    marginBottom:'40px'
  },
  mobileFullWidth: {
    height: 47,
    [theme.breakpoints.down('sm')]: {
      width: '100%',      
      marginRight:  '6px'
    }
  },
  mobileFullWidth2: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginBottom:'10px',      
      marginRight:  '6px'
    }
  },
  exportButton:{
    height: 47,
    marginRight:10
  }

}))

export default useStyles