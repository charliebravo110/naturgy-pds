import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 20
  },
  containerAll: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20
  },
  button: {
    padding: '3px 20px 4px',
    height: 44,
    '& span[class^="MuiButton-label"]': {
      fontSize: 16
    },
    [theme.breakpoints.only('xs')]: {
      paddingLeft: '20px',
      height: '44px',
      width: '50%',
      minWidth: '100%'
    }
  },
  buttonContainer: {
    marginLeft: 'auto',
    marginRight: 20,
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
      marginTop: 16
    },
    [theme.breakpoints.up('sm')]: {
      width: 'auto',
      flexBasis: 'auto'
    },
  },
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
  text: {
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: 10
  },
  label: {
    color: 'rgba(0, 69, 113, 1)',
    justifyContent: 'center',
  },
  menuItem: {
    textAlign: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      margin: 0
    }
  },
  dateContainer: {
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  buttonMobile: {
    [theme.breakpoints.down('sm')]: {
      marginLeft: 8,
      marginBottom: 5
    },
    [theme.breakpoints.down('xs')]: {
      marginLeft: 8,
      marginBottom: 5
    },
  },
  closeButtonCompare: {
    color: '#004571',
    marginLeft: 3
  },
  closeIcon: {
    top: 14,
    right: 14,
    width: 14,
    paddingRight: 5
  },
  closeButtonContainer: {
    width: '77%',
    justifyContent: 'flex-end'
  }
}))

export default useStyles
