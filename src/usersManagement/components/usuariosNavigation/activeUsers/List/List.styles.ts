
import { makeStyles, withStyles } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell'

const useStyles = makeStyles((theme) => ({

  activeUsersTable: {
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
    '& .MuiTableSortLabel-icon': {
      marginRight: 0,
      marginLeft: 0
    },
    '&.makeStyles-table': {
      margin: 'auto auto auto auto'
    }
  },
  tableRow: {
    textAlign:'left',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column'
    }
  },
  tableBodyRow: {
    borderTop: '1px solid black',
    '&.disabled': {
      opacity: .7,
      filter: 'grayscale(1)'
    },
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column'
    },
    backgroundColor: '#FFF00'
  },
  headTableCell: {
    textAlign:'left',
    paddingRight: 10,
    '&.name': {
      paddingLeft: 0
    },
    '&.extra': {
      width: '20%'
    },
    [theme.breakpoints.down('sm')]: {
       width: '100%',
    }
  },
  noResults: {
    height: 60,
    textAlign: 'center'
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
  paginationContainer: {
    margin: '20px 0'
  },
  itemText: {
    color: 'rgba(0, 69, 113, 1.0)',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
    marginTop: '10px',
  },
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
    paddingBottom: 10,
    verticalAlign: 'top'
  },
  body: {
    backgroundColor: '#F8F7F6',
    fontSize: 12,
    paddingTop: 10,
    paddingBottom: 10
  }
}))(TableCell);

export default useStyles

export { StyledTableCell }