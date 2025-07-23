import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'relative'
  },
  button: {
    padding: '2px 8px'
  },
  icon: {
    height: 14,
    '& svg': {
      fontSize: 14
    }
  },
  label: {
    fontSize: 14
  },
  box: {
    position: 'absolute',
    top: 'calc(100% + 4px)',
    left: 0,
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: '#FFF',
    padding: 6,
    borderRadius: '0 0 2px 2px',
    boxShadow: '0 2px 2px rgba(0, 0, 0, .2)',
    zIndex: 2
  },
  languageButton: {
    display: 'block',
    width: '100%',
    marginTop: 4,
    '&:first-child': {
      marginTop: 0
    },
    '&.active': {
      backgroundColor: 'rgba(63, 81, 181, 0.08)',
      cursor: 'auto'
    },
    '& p': {
      fontSize: 14
    }
  }
}))

export default useStyles
