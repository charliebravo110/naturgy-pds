import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  select: {
    position: 'relative'
  },
  button: {
    position: 'relative',
    minHeight: 43,
    boxSizing: 'border-box',
    color: '#777',
    padding: '11px 12px',
    border: 'solid 1px #004571',
    borderRadius: 4,
    cursor: 'pointer',
    '&.active': {
      borderRadius: '4px 4px 0 0'
    },
    marginBottom: '10'
  },
  items: {
    fontSize: 14,
    position: 'absolute',
    top: '100%',
    left: 0,
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: '#FFF',
    padding: 8,
    border: 'solid 1px #004571',
    borderTop: 0,
    borderRadius: '0 0 4px 4px',
    zIndex: 2
  },
  item: {
    fontSize: 14,
    marginTop: 8,
    cursor: 'pointer',
    '&:first-child': {
      marginTop: 0
    }
  },
  arrowDown: {
    position: 'absolute',
    top: 15,
    right: 12
  }
}))

export default useStyles
