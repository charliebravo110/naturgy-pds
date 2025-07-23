import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  box: {
    position: 'relative',
    padding: 32,
    border: 'solid 1px #E1E9EE',
    marginTop: 15
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
    '&.Mui-selected': {
      fontWeight: 'normal'
    },
    '&:focus': {
      fontWeight: 'normal'
    },
  },
  badge: {
    paddingRight: 10
  },
  customBadge: {
    backgroundColor: '#CF0E11',
    color: '#FFF'
  },
  views: {
    width: '100%',
    marginTop: 22,
    '& div[data-swipeable="true"]': {
      overflow: 'hidden !important'
    }
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
