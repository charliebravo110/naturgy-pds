import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  pagination: {
    justifyContent: 'center',
    marginTop: 16
  },
  icon: {
    width: 10,
    cursor: 'pointer'
  },
  icon2: {
    width: 10,
    cursor: 'pointer',
    border: 'solid 1px rgba(0, 69, 113, 0.5)',
    borderRadius: 2,
    padding: 7
  },
  label: {
    fontSize: '0.875rem',
    margin: '-2px 12px 0'
  },
  label2: {
    border: 'solid 1px rgba(0, 69, 113, 0.5)',
    color: '#1674d1',
    borderRadius: 2,
    padding: 7,
    '&.checked': {
      backgroundColor: 'rgba(0, 69, 113, 0.1)',
      fontWeight: 'bold'
    }
  }
}))

export default useStyles
