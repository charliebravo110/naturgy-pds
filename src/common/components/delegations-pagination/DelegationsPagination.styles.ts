import { makeStyles, withStyles } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell'

const useStyles = makeStyles((theme) => ({
  icon: {
    width: 10,
    cursor: 'pointer'
  },
  label: {
    fontSize: '0.875rem',
    margin: '0 12px'
  }
}))

const StyledTableCell = withStyles(theme => ({
  footer: {
    paddingBottom: 0,
    borderBottom: 0
  }
}))(TableCell)

export default useStyles

export { StyledTableCell }
