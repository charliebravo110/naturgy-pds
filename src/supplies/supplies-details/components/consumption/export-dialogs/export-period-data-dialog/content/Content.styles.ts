import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: 'absolute',
    top: 18,
    right: 18,
    cursor: 'pointer'
  },
  title: {
    fontSize: 22,
    color: 'rgba(0, 69, 113, 1)',
    textAlign: 'center',
    padding: '18px 0'
  },
  advice: {
    color: '#084063',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16
  },
  adviceerror: {
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16
  },
  periodsContainer: {
    justifyContent: 'center',
    marginTop: 24
  },
  periods: {
    width: 400,
    padding: 12,
    border: 'solid 1px #E1E9EE',
    cursor: 'pointer'
  },
  list: {
    maxHeight: 130,
    overflowY: 'auto'
  },
  period: {
    color: '#22465C',
    alignItems: 'center',
    marginTop: 6,
    '&:first-child': {
      margin: 0
    }
  },
  radioButton: {
    width: 17,
    height: 17,
    boxSizing: 'border-box',
    backgroundColor: '#FFF',
    padding: 3,
    border: 'solid 1px #E1E9EE',
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
  options: {
    backgroundColor: '#F1F5F8',
    color: '#535456',
    padding: 24,
    borderRadius: 4,
    marginTop: 24
  },
  boldText: {
    fontWeight: 'bold',
    color: '#555555'
  },
  text: {
    marginTop: 12,
    lineHeight: '20px',
    color: '#555555',
    '& a': {
      color: '#1674D1'
    }
  },
  exports: {
    marginTop: 24
  },
  export: {
    color: '#1674D1',
    cursor: 'pointer',
    '&.marginTop': {
      marginTop: 12
    }
  },
  exportContainer: {
    alignItems: 'center'
  },
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
    '&::before': {
      content: '"✓"'
    },
    '&.active': {
      backgroundColor: '#1674D1',
      color: '#FFF',
      borderColor: '#1674D1'
    }
  },
  icon: {
    marginLeft: 12
  },
  label: {
    flex: 1,
    marginLeft: 7
  },
  buttonContainer: {
    justifyContent: 'center',
    marginTop: 36
  }
}))

export default useStyles
