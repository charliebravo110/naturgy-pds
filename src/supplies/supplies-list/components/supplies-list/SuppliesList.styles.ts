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
    padding:  '0px',
    justifyContent: 'center'
  },
  title: {
    fontSize: 36,
    color: 'rgba(0, 69, 113, 1)',
    textAlign: 'center',
    margin: '26px 0 30px'
  },
  notRegisteredTitle: {
    fontSize: 36,
    color: 'rgba(0, 69, 113, 1)',
    textAlign: 'center',
    [theme.breakpoints.up('md')]: {
      margin: '56px 0 30px'
    },
    [theme.breakpoints.down('sm')]: {
      margin: '93px 0 30px'
    }
  },
  typesTabs: {
    display: 'block',
    width: '100%',
    borderBottom: 0,
    marginBottom: 42,
    '& .MuiTabs-scroller': {
      borderBottom: 'solid 1px #E1E9EE'
    },
    '& .MuiButtonBase-root': {
      margin: '0 12px'
    }
  },
  tab: {
    '&.Mui-selected': {
      fontWeight: 'normal'
    },
    '&:focus': {
      fontWeight: 'normal'
    },
  },
  typesViews: {
    width: '100%'
  },
  box: {
    position: 'relative',
    border: 'solid 1px #E1E9EE',
    marginTop: 15
  },
  navigation: {
    margin: '-19px 0 0 0'
  },
  tabs: {
    borderBottom: 0,
    '& button': {
      padding: '0 12px',
      marginRight: 12
    }
  },
  styledTab: {
    fontSize: 16,
    lineHeight: 1,
    marginBottom: '-11px',
    maxWidth: 'none'
  },
  badge: {
    paddingRight: 16
  },
  customBadge: {
    backgroundColor: '#CF0E11',
    color: '#FFF'
  },
  views: {
    width: '100%',
    marginTop: 32
  },
  maxWidthForBigScreens: {
    maxWidth: 1200,
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    margin: 'auto',
    boxSizing: 'border-box'
  },
  dialog:{
    height: '60%',
  },
  dialogContent: {
    border: '2px solid #004571',
  },
  dialogTitle: {
    color: 'rgba(0, 69, 113, 1)',
    textAlign: 'center',
  },
  typo: {
    fontSize: '3rem'
  },
  typo2: {
    marginTop:'0px',
    fontSize: '2rem'
  },
  iconButton: {
    position: 'absolute',
                right: 8,
                top: 8,
  },
  dialogContent2: {
    width: '60%',
    marginLeft: '17%',
    marginRight: '17%',
    alignSelf: 'center',
  },
  dialogContent3: {
    width: '60%',
    padding:'0px',
    marginLeft: '17%',
    marginRight: '17%',
    alignSelf: 'center',
  },
  dialogActions: {
    width: '60%', 
    margin: 'auto',
    justifyContent:'center',
  },

  btn: {
    color: '#004571',
    marginTop:'0px',
    padding: '10px 0px 10px 0px',
    width: '55%',
    border: '1px #004571 solid !important',
    textTransform: 'capitalize',
  },
  btn2: {
    color: '#fff',
    backgroundColor: '#004571',
    width: '60%',
  },
  btn3: {
    marginTop:'0px',
    color: '#fff',
    backgroundColor: '#004571 !important',
    padding: '10px 0px 10px 0px',
    width: '55%',
    textTransform: 'capitalize',
  }
}))

export default useStyles
