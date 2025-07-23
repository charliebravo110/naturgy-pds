import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    margin: '0 auto'
  },
  maxWidthForBigScreens: {
    maxWidth: 1200,
    width: '100%'
  },
  title: {
    fontSize: 36,
    color: 'rgba(0, 69, 113, 1)',
    textAlign: 'center',
    justifyContent: 'center',
    borderBottom: 'solid 1px #E1E9EE',
    paddingBottom: 20
  },
  description: {
    paddingBottom: 20,
    marginBottom: 20,
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
  },
  hourSelectors: {
    marginTop: 18
  },
  hourSelectorsItem: {
    display: 'flex',
    alignItems: 'center',
    '&:first-child': {
      marginRight: 12
    },
    '& span': {
      marginLeft: 6
    }
  },
  radioButton: {
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
  radioButton2: {
    marginLeft: 20,
    width: 17,
    height: 17,
    boxSizing: 'border-box',
    backgroundColor: '#FFF',
    border: 'solid 2px #C4D2DA',
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
  menuItemCompare: {
    padding: '7px',
    border: 'solid 1px #E1E9EE',
    color: '#004571',
    borderRadius: 4,
    cursor: 'pointer',
    marginBottom: 15,
    marginLeft: 10,
    width: '30%',
    '&:first-child': {
      marginLeft: 0
    },
    '&.active': {
      fontWeight: 'bold',
      borderColor: '#E57200'
    },
    [theme.breakpoints.down('sm')]: {
      width: '32.5%',
      textAlign: 'center'
    }
  },
  telemedidoAdviseBox: {
    margin: '0 auto'
  },
  telemedidoAdviseContainer: {
    backgroundColor: '#F2F5F8',
    marginBottom: 46,
    padding: '15px',
    borderRadius: '5px',
    fontSize: '16px'
  },
  infoIcon: {
    width: 35,
    [theme.breakpoints.down('sm')]: {
      margin: '0 auto',
      marginBottom: '15px',
      display: 'block'
    }
  },
  telemedidoAdviseTitle: {
    fontWeight: 'bold',
    color: '#256094',
    [theme.breakpoints.only('xs')]: {
      textAlign: 'center'
    }
  },
}))

export default useStyles
