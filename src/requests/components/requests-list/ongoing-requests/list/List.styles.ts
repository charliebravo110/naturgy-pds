import { makeStyles, withStyles } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell'

const useStyles = makeStyles((theme) => ({
  table: {
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 10
  },
  row: {
    '&.unread td': {
      fontWeight: 'bold'
    },
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column'
    }
  },
  paginationContainer: {
		margin: '20px 0'
	},
  row2: {
    '&.unread td': {
      fontWeight: 'bold'
    },
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column'
    },
    justifyContent: 'flex-end'
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
  itemsPerPage: {
    justifyContent: 'flex-end',
    marginTop: 10,
    fontSize: 14,
    color: '#004571'
  },
  select: {
    borderRadius: 4,
    borderColor: '#004571',
    color: '#004571'
  },
  totalItems: {
    justifyContent: 'flex-start',
    fontSize: 14,
    color: '#004571'
  },
  bellIcon: {
    width: '25px',
    paddingLeft: '10px'
  },
  requestStatusText: {
    cursor:'pointer',
    textDecoration:'underline',
    alignItems: 'center',
    filter: 'invert(35%) sepia(82%) saturate(800%) hue-rotate(182deg) brightness(92%) contrast(97%)'
  },
  requestStatusTextDis: {
    textDecoration:'underline',
    alignItems: 'center',
    filter: 'invert(86%) sepia(44%) saturate(3%) hue-rotate(37deg) brightness(55%) contrast(93%)'
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
    backgroundColor: '#F8F7F6',
    fontSize: 12,
    paddingRight: 1,
    paddingTop: 10,
    paddingBottom: 10
  }
}))(TableCell);

export default useStyles

export { StyledTableCell }
