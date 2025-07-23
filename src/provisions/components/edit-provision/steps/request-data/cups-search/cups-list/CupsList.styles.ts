import { makeStyles, withStyles } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell'

const useStyles = makeStyles((theme) => ({
  table: {
    borderRadius: 4,
    overflow: 'hidden'
  },
  row: {
    backgroundColor: '#F8F7F6',
    border: 'solid 2px transparent',
    borderTop: 0,
    borderBottom: 0,
    '&.selected': {
      backgroundColor: '#E6F2FB',
      borderColor: '#1674D1'
    }
  },
  paginationContainer: {
    margin: '20px 0'
  },
  button: {
    margin: 10,
    color: '#004571'
  }
}))

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: '#EBE9E6',
    color: '#004571',
    fontSize: 14,
    fontWeight: 'bold',
    padding: '14px 14x'
  },
  body: {
    fontSize: 12,
    color: '#868686',
    padding: '14px 14px',
    border: 0
  }
}))(TableCell)

export default useStyles

export { StyledTableCell }