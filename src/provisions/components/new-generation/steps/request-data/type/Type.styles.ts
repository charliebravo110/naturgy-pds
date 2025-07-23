import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    justifyContent: 'center'
  },
  title: {
    color: '#004571',
    fontSize: 30,
    textAlign: 'center',
    margin: '20px 0 20px'
  },
  description: {
    color: '#838383',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 15
  },
  innerBox: {
    position: 'relative',
    width: '70%',
    minHeight: 110,
    margin: '0 auto'
  },
  innerContainer: {
    marginTop: 20
  },
  textSelect: {
    color: '#3a6f92',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'left',
    marginBottom: 8
  },
  connections: {
    position: 'relative',
    width: '70%',
    minHeight: 120,
    margin: '0 auto'
  },
  textConnections: {
    color: '#3a6f92',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'left',
    marginBottom: 2
  },
  connectionTypes: {

  },
  connectionTypes_2: {
    display: 'flex',
    gap: '2rem',
    '& *': {
      display: 'flex',
      alignItems: 'center',
      alignContent: 'center',
      gap: '0.5rem'
    },
    margin: '15px 0'
  },
  connectionTypesItem: {
    display: 'flex',
    alignItems: 'left',
    paddingLeft: 0,
    margin: '12px 0',
    '& .label': {
      color: '#3a6f92',
      fontSize: 14,
      cursor: 'pointer',
      marginLeft: 6,
      maxWidth: '90%'
    },
    '& .icon': {
      marginLeft: 0,
      maxWidth: '10%'
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
  radiobuttoText: {
    color: '#3a6f92',
    fontSize: 14
  },
  radioButton_2: {
    width: 17,
    height: 17,
    boxSizing: 'border-box',
    backgroundColor: '#FFF',
    padding: 3,
    border: 'solid 1px #C4D2DA',
    borderRadius: '0%',
    cursor: 'pointer',
    '&.active::before': {
      display: 'block',
      width: '100%',
      height: '100%',
      backgroundColor: '#039BA8',
      content: '""',
      borderRadius: '0%',
      cursor: 'default'
    }
  },
  buttons: {
    justifyContent: 'center',
    marginTop: 80,
    '& button': {
      margin: '0 16px'
    },
    [theme.breakpoints.only('xs')]: {
      '& button:first-child': {
        marginBottom: 16
      }
    }
  },
  selectMenu: {
    '& .MuiSelect-selectMenu': {
      fontSize: 14,
      margin: '5 px 0'
    },
  }
}))

export default useStyles
