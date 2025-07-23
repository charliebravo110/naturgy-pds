import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  dialog: {
    '& .MuiPaper-root.MuiDialog-paper': {
      width: 700,
      border: '2px solid rgb(61, 114, 147)'
    },
    '& .MuiDialogContent-root': {
      padding: 48
    }
  },
  dialogContainer: {
    position: 'relative',
    padding: 36
  },
  closeButton: {
    position: 'absolute',
    top: 18,
    right: 18,
    cursor: 'pointer'
  },
  noItems: {
    textAlign: 'center',
    justifyContent: 'center',
    '& .row': {
      display: 'block',
      textAlign: 'center',
      marginTop: 24
    },
    '& .title': {
      color: '#004571',
      fontSize: 18
    },
    '& .description': {
      color: '#777'
    },
    '& .buttons': {
      justifyContent: 'center',
      marginTop: 36
    }
  },
  container: {
    padding: '20px 0',
    [theme.breakpoints.up('md')]: {
      marginTop: 126
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: 66
    }
  },
  maxWidthForBigScreens: {
    maxWidth: 1200
  },
  headerTitle: {
    fontFamily: 'Arial, Helvetica, Arial, serif',
    fontSize: '36px',
    color: 'rgba(0, 69, 113, 1.0)',
    textAlign: 'center',
    margin: '26px 30px'
  },
  orangeSubtitle: {
    fontSize: '24px',
    color: '#e57200'
  },
  headerSubTitle: {
    fontFamily: 'Arial, Helvetica, Arial, serif',
    color: 'rgb(131, 131, 131)',
    textAlign: 'center',
    marginTop: '2%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: '4%',
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
  buttonWrapper: {
    justifyContent: 'center',
    padding: '30px 0'
  },
  inactive: {
    pointerEvents: 'none',
    userSelect: 'none',
    '& p': {
      color: 'rgb(220, 220, 220)'
    },
    '& .MuiButton-containedPrimary': {
      background: 'rgb(220, 220, 220)'
    }
  },
  innerLimitBox:{
    backgroundColor: '#F8FCFC',
    padding: '20px 50px'
  },

  limitText: {
    color: '#004571',
    alignContent: 'center',
    textAlign: 'center',
    ontSize: '16px'
  },

  limitIcon: {
    '& img': {
      width: '24px',
      height: '24px',
    }
  }
}))

export default useStyles
