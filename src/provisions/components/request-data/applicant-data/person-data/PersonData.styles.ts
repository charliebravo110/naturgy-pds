import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  inputContainer: {
    marginBottom: 20,
    [theme.breakpoints.down('md')]: {
      marginBottom: 10,
    }
  },
  label: {
    marginBottom: 7,
    color: '#004571'
  },
  input: {
    color: '#868686',
    '& .MuiSelect-root': {
      color: '#868686'
    }
  },
  stateLabel: {
    color: '#868686'
  },
  marginLeft: {
    marginLeft: 10
  },
  noInput: {
    '&.MuiGrid-item': {
      [theme.breakpoints.down('md')]: {
        padding: 0
      }
    }
  },
  infoIcon: {
    width: 30,
    height: 30
  },
  info: {
    color: '#868686',
    padding: 12,
    paddingTop: 0
  },
  tagContainer: {
    padding: '12px'
  },
  tag: {
    height: 'fit-content',
    padding: 10,
    backgroundColor: '#d2e0ef9e',
    borderRadius: 5,
    color: '#004571',
    fontSize: 14,
    marginTop: 12,
    [theme.breakpoints.down('sm')]: {
      marginTop: '-15px',
      marginBottom: '15px'
    }
  },
  textColor: {
    color: '#004571'
  },
  textColorTitle : {
    fontSize: '20px',
    fontWeight: 'bold'
  }
}))

export default useStyles