import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  block: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    marginTop: 128,
    [theme.breakpoints.only('xs')]: {
      marginTop: 70
    }
  },
  container: {
    padding: '20px 0 46px',
    justifyContent: 'center',
  },
  maxWidthForBigScreens: {
    maxWidth: 1200,
    width: '100%'
  },
  title: {
    color: '#004571',
    fontSize: 36,
    textAlign: 'center',
    margin: '26px 0 46px',
    [theme.breakpoints.only('xs')]: {
      textAlign: 'center'
    }
  },
  advise: {
    color: '#004571',
    fontSize: 18,
    margin: '5px 0 26px'
  },
  options: {
    '& .MuiGrid-item.MuiGrid-grid-md-2': {
      maxWidth: '20%',
      flexBasis: '20%',
      [theme.breakpoints.down('sm')]: {
        maxWidth: '100%',
        flexBasis: '100%',
      }
    },
    [theme.breakpoints.up('md')]: {
      margin: '-8px -8px -8px 0'
    }
  },
  box: {
    position: 'relative',
    height: 296,
    boxSizing: 'border-box',
    textAlign: 'center',
    padding: 20,
    border: 'solid 1px #E1E9EE',
    borderRadius: 4,
    [theme.breakpoints.down('sm')]: {
      height: 246
    },
    '& a': {
      textDecoration: 'none'
    }
  },
  newServiceProvisionIcon: {
    marginTop: 42
  },
  supplyModificationIcon: {
    marginTop: 29
  },
  installationsModificationIcon: {
    marginTop: 30
  },
  newGenerationIcon: {
    marginTop: 26
  },
  autoconsumptionIcon: {
    marginTop: 40
  },
  name: {
    color: '#004571',
    fontWeight: 'bold',
    marginTop: 12
  },
  button: {
    display: 'block',
    position: 'absolute',
    right: 20,
    bottom: 20,
    left: 20,
    backgroundColor: '#E97000',
    color: '#FFF',
    fontWeight: 'bold',
    textDecoration: 'none',
    padding: 12,
    borderRadius: 4,
    marginTop: 20,
    cursor: 'pointer'
  },
  button2: {
    display: 'block',
    right: 20,
    bottom: 20,
    left: 20,
    backgroundColor: 'rgba(0, 69, 113, 1)',
    color: '#FFF',
    textDecoration: 'none',
    padding: 12,
    paddingRight: 50,
    paddingLeft: 50,
    borderRadius: 4,
    marginTop: 20,
    cursor: 'pointer'
  },
  closeButton: {
    marginTop: -5,
    marginRight: -5
  },
  description: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16
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
  alertIcon: {
    height: '100%'
  },
  alertBlock: {
    [theme.breakpoints.only('xs')]: {
      textAlign: 'center'
    }
  },
  text: {
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: 10,
    color: 'rgba(0, 69, 113, 1)'
  },
  text2: {
    fontSize: 12,
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: 10,
    color: 'rgba(191, 184, 174, 1)'
  },
  text3: {
    fontSize: 12,
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: 2,
    color: 'rgba(191, 184, 174, 1)'
  },
  text4: {
    fontSize: 14,
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: 10,
    color: 'rgba(0, 69, 113, 1)'
  },
  textBold2: {
    fontSize: 15,
    color: 'rgba(0, 69, 113, 1)',
    lineHeight: '20px',
    fontWeight: 'bold',
    paddingBotom: 5,
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: 10
  },
  warningText: {
    fontSize: 16,
    color: 'red',
    backgroundColor: '#F5F5F5',
    borderBottom: '1px solid #BEBEBE',
    marginTop: '16px'
  }
}))

export default useStyles
