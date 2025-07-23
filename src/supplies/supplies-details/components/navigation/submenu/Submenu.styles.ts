import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  tabPadding: {
    padding: '6px 10px'
  },
  submenuInnerTab: {
    color: '#004571',
    width: '100%',
    fontWeight: 400,
    fontSize: '0.8125rem',
    textTransform: 'none',
    alignSelf: 'center',
    cursor: 'pointer',
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
    padding: 14.7,
    '&:hover': {
      opacity: 0.8
    },
    '&.selected': {
      fontWeight: 'bold'
    },
    '&.disabled': {
      filter: 'grayscale(80%)',
      cursor: 'default',
    }
  },
  submenuInnerTabLast: {
    borderBottom: 0
  },
}))

export default useStyles
