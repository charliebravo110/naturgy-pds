import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  item: {
    position: 'relative',
    backgroundColor: '#F8F7F6',
    textAlign: 'center',
    padding: '16px 20px',
    borderRadius: 4
  },
  radioButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 17,
    height: 17,
    boxSizing: 'border-box',
    backgroundColor: '#FFF',
    padding: 3,
    border: 'solid 1px #C4D2DA',
    borderRadius: '50%',
    cursor: 'pointer',
    '&.active::before': {
      display: 'block',
      width: '100%',
      height: '100%',
      backgroundColor: '#039BA8',
      content: '""',
      borderRadius: '50%',
      cursor: 'default'
    }
  },
  row: {
    marginTop: 16,
    '&:first-child': {
      marginTop: 0
    }
  },
  rowLabel: {
    color: '#004571'
  },
  rowValue: {
    marginTop: 4
  }
})

export default useStyles
