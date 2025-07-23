import { makeStyles, withStyles } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell'

const useStyles = makeStyles((theme) => ({
  table: {
    overflow: 'hidden',
    marginTop: 16,
	  border: 'none'
  },
  row: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column'
    },
	border: 'none'
  },
  emptyList: {
    height: 60,
    textAlign: 'center',
    borderBottom: 0
  },
  cell: {
    paddingRight: 10,
    '&.name': {
      paddingLeft: 0
    }
  },
  wrappedCell: {
    [theme.breakpoints.down('sm')]: {
      wordBreak: 'break-word'
    }
  },
  viewButton: {
    color: '#1674D1',
    fontSize: 14,
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  description: {
	  color: 'rgba(70, 145, 219, 1)',
	  fontSize: 16
  },
  sr: {
	  fontWeight: 'bold',
	  color: 'rgba(0, 69, 113, 1)'
  },
  fecha: {
	  color: '#696969'
  },
  requestDate: {
    verticalAlign: 'top',
    textAlign: 'right',
    width: '10%'
  },
  requestInfo: {
    textAlign: 'left'
  }
}))

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: '#EBE9E6',
    color: '#004571',
    fontSize: 14,
    fontWeight: 'bold',
    paddingRight: 1,
    height: 42,
    boxSizing: 'border-box',
    paddingTop: 10,
    paddingBottom: 10
  },
  body: {
    fontSize: 12,
    paddingRight: 1,
    paddingTop: 10,
    paddingBottom: 10,
	  border: 'none'
  }
}))(TableCell);

export default useStyles

export { StyledTableCell }
