import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  actions: {
    [theme.breakpoints.up('sm')]: {
      justifyContent: 'space-between'
    },
    [theme.breakpoints.only('xs')]: {
      marginLeft: 2
    }
  },
  newServiceLink: {
    color: '#1674D1',
    textDecoration: 'none'
  },
  myManagersLink: {
    marginRight: 26
  },
  iconTextButton: {
    width: 18
  },
  iconTextButtonMargin: {
    marginLeft: 8
  },
  delegatesButton: {
    fontSize: 14,
    display: 'flex',
    alignItems: 'center',
    '& a': {
      textDecoration: 'none'
    }
  },
  delegatesInfoButton: {
    paddingLeft: '8px'
  },
  textIconButton: {
    width: 18
  },
  marginRight: {
    marginRight: 34,
    padding: '12px 0'
  }
}))

export default useStyles
