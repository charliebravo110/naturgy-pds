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
    margin: '26px 0 30px'
  },
  notRegisteredTitle: {
    fontSize: 36,
    color: 'rgba(0, 69, 113, 1)',
    textAlign: 'center',
    margin: '26px 0 30px',
    [theme.breakpoints.up('md')]: {
      marginTop: 73
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: 93
    }
  },
  navContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  secondNavContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  box: {
    position: 'relative',
    padding: 32,
    border: 'solid 1px #E1E9EE',
    borderRadius: 4,
    marginTop: 20
  },
  newServiceLink: {
    color: '#1674D1',
    textDecoration: 'none'
  },
  iconTextButton: {
    width: 18
  },
  infoIcon: {
    width: 35,
    [theme.breakpoints.down('sm')]: {
      margin: '0 auto',
      marginBottom: '15px',
      display: 'block'
    }
  },
  dossierDateAdviseBox: {
    margin: '0 auto',
    marginTop: 20
  },
  dossierDateAdviseContainer: {
    backgroundColor: '#F2F5F8',
    marginBottom: 46,
    padding: '15px',
    borderRadius: '5px',
    fontSize: '16px'
  },
  dossierDateAdviseTitle: {
    fontWeight: 'bold',
    color: '#256094',
    [theme.breakpoints.only('xs')]: {
      textAlign: 'center'
    }
  },
  billsLink: {
    // textAlign: 'right',
    // paddinBottom: 10,
    textDecoration: 'underline',
    // justifyContent: 'flex-end'
  },
  iconBillsButton: {
    width: 12,
    marginBottom: 3
  },
  navigation: {
    margin: '-19px 0 0 -15px'
  },
  tabs: {
    borderBottom: 0,
    '& button': {
      padding: '0 12px',
      marginRight: 12
    }
  },
  tab: {
    '&.MuiTab-root': {
      minWidth: '160px'
    },
    '&.Mui-selected': {
      fontWeight: 'normal'
    },
    '&:focus': {
      fontWeight: 'normal'
    },
  },
  views: {
    width: '100%',
    marginTop: 21,
    overflow: 'hidden !important',
    '& div[data-swipeable="true"]': {
      paddingTop: 1,
      overflow: 'hidden !important'
    }
  },
  badge: {
    paddingRight: '16px'
  },
  customBadge: {
    backgroundColor: '#CF0E11',
    color: '#FFF',
    fontSize: 11
  }
}))

export default useStyles
