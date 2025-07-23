import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  checkbox: {
    width: 17,
    height: 17,
    boxSizing: 'border-box',
    backgroundColor: '#FFF',
    color: 'transparent',
    fontSize: 10,
    padding: '1px 4px',
    border: 'solid 1px #798996',
    borderRadius: 4,
    margin: '0 auto',
    cursor: 'pointer',
    '&::before': {
      content: '"✓"'
    },
    '&.active': {
      backgroundColor: '#1674D1',
      color: '#FFF',
      borderColor: '#1674D1'
    },
    '&.disabled': {
      opacity: .5,
      cursor: 'default'
    },
    '&.error': {
      backgroundColor: '#FFF',
      borderColor: '#F44336',
      color: '#F44336'
    }
  }
}))

export default useStyles
