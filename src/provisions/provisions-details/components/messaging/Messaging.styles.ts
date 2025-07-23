import { makeStyles, withStyles } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell'

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    marginTop: 150,
    maxWidth: 1200
  },
  title: {
    width: '100%',
    fontSize: 36,
    color: 'rgba(0, 69, 113, 1)',
    textAlign: 'center',
    marginBottom: 46
  },
  subtitle: {
    fontSize: 20,
    color: '#E57000',
    fontWeight: 'bold'
  },
  fullWidth: {
    width: '100%'
  },
  block: {
    padding: '20px 40px',
    border: '1px solid #E3EBEF',
    textAlign: 'center',
    [theme.breakpoints.down('sm')] : {
      padding: '20px 20px'
    }
  },
  mosaicContainer: {
    marginTop: 20
  },
  table: {
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 20
  },
  row: {
    backgroundColor: '#F8F7F6',
    border: 'solid 2px transparent',
    borderTop: 0,
    '&.selected': {
      backgroundColor: '#E6F2FB',
      borderColor: '#1674D1'
    }
  },
  paginationContainer: {
    margin: '20px 0'
  },
  noItems: {
    textAlign: 'center',
    justifyContent: 'center',
    paddingTop: 20
  },
  text: {
    marginTop: 16
  }
}))

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: '#EBE9E6',
    color: '#004571',
    fontSize: 14,
    fontWeight: 'bold',
    padding: '14px 10px'
  },
  body: {
    fontSize: 12,
    padding: '14px 8px',
    border: 0
  }
}))(TableCell)

export default useStyles

export { StyledTableCell }
