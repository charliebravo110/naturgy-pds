

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
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
  text: {
    color: '#5b5a5a',
    fontSize: 17,
    textAlign: 'center',
    margin:'0px 0px 15px 0px'
  },
  box: {
    position: 'relative',
    padding: 32,
    border: 'solid 1px #E1E9EE',
    borderRadius: 4,
    marginTop: 20
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
    color: '#FFF'
  },
  loadingContainer: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(255, 255, 255, .8)',
    zIndex: 1000
  },
  loadingAnimation: {
    position: 'absolute',
    top: 'calc(50% - 32px)',
    left: 'calc(50% - 32px)',
    display: 'block',
    width: 64,
    margin: '0 auto'
  }
}))

export default useStyles