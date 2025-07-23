import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  box: {
    position: 'relative',
    height: 276,
    boxSizing: 'border-box',
    textAlign: 'center',
    padding: 20,
    border: 'solid 1px #E1E9EE',
    borderRadius: 4,
    cursor: 'pointer',
    '& a': {
      textDecoration: 'none'
    },
    '&:hover': {
      backgroundColor: '#F8F7F5',
      borderColor: '#81BBC3'
    }
  },
  icon: {
    '&.supplies': {
      marginTop: 24
    },
    '&.dossiers': {
      marginTop: 29
    },
    '&.fraud': {
      width: 66,
      height: 66,
      marginTop: 29
    },
    '&.incidents': {
      marginTop: 30
    },
    '&.works': {
      width: 66,
      height: 66,
      marginTop: 29
    },
    '&.consult': {
      width: 66,
      height: 66,
      marginTop: 29
    },
    '&.selfConsumption': {
      width: 66,
      height: 66,
      marginTop: 29
    }
  },
  title: {
    color: '#004571',
    marginTop: 24
  },
  description: {
    color: '#868686',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16
  }
}))

export default useStyles
