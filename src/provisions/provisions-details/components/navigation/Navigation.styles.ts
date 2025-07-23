import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    zIndex: 1,
    [theme.breakpoints.up('sm')]: {
      height: 150,
      marginTop: -80
    },
    [theme.breakpoints.down('sm')]: {
      paddingTop: 120,
      paddingLeft: 20
    },
    backgroundColor: '#E5ECF0'
  },
  navigation: {
    display: 'flex',
    alignItems: 'flex-end'
  },
  tabs: {
    borderBottom: 0
  },
  tab: {
    minWidth: 'auto',
    width: 'auto',
    marginRight: 40,
    '&.Mui-selected': {
      fontWeight: 'normal'
    },
    '&:focus': {
      fontWeight: 'normal'
    },
    '&:last-child': {
      marginRight: 0
    }
  },
  lastTab: {
    marginRight: 0,
    '&.Mui-selected': {
      fontWeight: 'normal'
    },
    '&:focus': {
      fontWeight: 'normal'
    },
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
