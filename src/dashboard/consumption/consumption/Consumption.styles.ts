import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    margin: '0 auto',
    [theme.breakpoints.down('sm')]: {
      padding: 2
    }
  },
  maxWidthForBigScreens: {
    maxWidth: 1200,
    width: '100%'
  },
  title: {
    fontSize: 36,
    color: 'rgba(0, 69, 113, 1)'
  },
  description: {
    paddingBottom: 20,
    marginBottom: 20,
    borderBottom: 'solid 1px #E1E9EE',
    marginTop: 16,
    color: '#555555',
    lineHeight: '20px'
  },
  dateLabel: {
    color: 'rgba(0, 69, 113, 1)'
  },
  menu: {
    [theme.breakpoints.down('sm')]: {
      marginTop: 0
    }
  },
  menuItem: {
    [theme.breakpoints.down('sm')]: {
      margin: 0
    }
  },
  downloadBlock: {
    backgroundColor: '#F1F5F8',
    padding: '40px',
    marginTop: '40px'
  },
  downloadTextBlock: {
    color: '#7C7D81',
    marginBottom: 20
  },
  downloadTextBold: {
    fontWeight: 'bold'
  },
  text: {
    marginTop: 12,
    lineHeight: '20px',
    color: '#555555',
    '& a': {
      color: '#1674D1'
    }
  },
  export: {
    color: '#1674D1',
    cursor: 'pointer',
    '&.marginLeft': {
      marginLeft: 58
    },
    [theme.breakpoints.down('sm')]: {
      '&.marginTop': {
        marginTop: 12
      },
      '&.marginLeft': {
        marginLeft: 0
      }
    }
  },
  exportContainer: {
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center'
    }
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
    marginLeft: 7
  },
  buttonBlock: {
    marginTop: 40
  }
}))

export default useStyles
