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
  title: {
    fontSize: 36,
    color: 'rgba(0, 69, 113, 1)',
    textAlign: 'center',
    margin: '146px 0 30px',
    padding: '1px 1px',
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
    padding: '32px 20px',
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
  }
}))

export default useStyles
