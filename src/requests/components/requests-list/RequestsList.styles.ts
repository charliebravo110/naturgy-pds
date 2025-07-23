import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  block: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    marginTop: 128,
    [theme.breakpoints.down('sm')]: {
      marginTop: 128
    },
    '&.without-margin': {
      marginTop: -46
    },
    '&.with-margin': {
      marginTop: 128
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
    marginTop: 26,
    marginBottom: 46,
    textAlign: 'center',
    '&.without-margin': {
      marginTop: 0
    }
  },
  notRegisteredTitle: {
    fontSize: 36,
    color: 'rgba(0, 69, 113, 1)',
    marginBottom: 46,
    textAlign: 'center',
    '&.without-margin': {
      marginTop: 0
    },
    [theme.breakpoints.up('md')]: {
      marginTop: 46
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: 46
    }
  },
  box: {
    position: 'relative',
    padding: 32,
    border: 'solid 1px #E1E9EE',
    borderRadius: 4,
    marginTop: 20
  },
  newRequest: {
    color: '#1674D1',
    textDecoration: 'none'
  },
  newRequestDisabled: {
    color: '#d8d8d8',
    textDecoration: 'none',
    marginRight: '15px'
  },
  newRequestDisabledInfo: {
    color: '#004571',
    textDecoration: 'none'
  },
  icon: {
    width: 18
  },
  iconDisabled: {
    width: 18,
    marginRight: '13px'
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
