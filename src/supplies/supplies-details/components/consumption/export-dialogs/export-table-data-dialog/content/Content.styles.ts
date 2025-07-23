import { blue } from '@material-ui/core/colors'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: 'absolute',
    top: 18,
    right: 18,
    cursor: 'pointer'
  },
  resumebox: {
    backgroundColor: '#F2F5F8',
    padding: '1.3rem 1.3rem 0.5rem 1.3rem',
},
  title: {
    fontSize: 22,
    color: 'rgba(0, 69, 113, 1)',
    textAlign: 'center',
    padding: '18px 0'
  },
  options: {
    backgroundColor: '#F1F5F8',
    color: '#535456',
    padding: 24,
    borderRadius: 4,
    marginTop: 24
  },
  subtitle: {
    margin: '0.8em auto 1.3rem auto',
    '& span': {
        color: blue,
        fontWeight: 'bold',
    },
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
  textCenter: {
    marginTop: 12,
    textAlign: 'center',
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
  },
  errorIcon: {
    width: '40px'
  }
}))

export default useStyles
