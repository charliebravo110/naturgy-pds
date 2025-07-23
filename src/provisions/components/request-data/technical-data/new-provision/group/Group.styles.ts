import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  tableTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#004571',
    [theme.breakpoints.down('sm')]: {
      marginTop: 30
    }
  },
  addSupplie: {
    marginTop: 25
  },
  marginTop: {
    marginTop: 30
  },
  totalMobileContainer: {
    backgroundColor: '#F8F7F5',
    padding: '20px',
    marginTop: '30px',
    width: '100%',
    fontSize: 16
  },
  totalRow: {
    marginBottom: '10px'
  },
  totalTitle: {
    color: '#004571',
    fontWeight: 'bold'
  },
  totalSubtitle: {
    color: '#004571'
  },
  totalVariables: {
    color: '#868686'
  },
  space: {
    height: '33px'
  }
}))

export default useStyles