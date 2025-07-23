import { makeStyles, withStyles } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell'

const useStyles = makeStyles((theme) => ({
  suppliesTable: {
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden'
  },
  suppliesBoldCell: {
    fontWeight: 'bold',
    '&.name': {
      paddingLeft: 0
    }
  },
  headTableCell: {
    '&.name': {
      paddingLeft: 50
    }
  },
  tableRow: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column'
    }
  },
  tableBodyRow: {
    '&.disabled': {
      opacity: .7,
      filter: 'grayscale(1)'
    },
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column'
    }
  },
  onlyDesktop: {
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  suppliesTableWrappedCell: {
    [theme.breakpoints.down('sm')]: {
      wordBreak: 'break-word'
    }
  },
  suppliesTableButtonCell: {
    [theme.breakpoints.down('sm')]: {
      paddingLeft: 20,
      paddingRight: 0
    }
  },
  editButton: {
    display: 'flex',
    color: '#1674D1',
    textDecoration: 'underline',
    cursor: 'pointer',
    '&.disabled': {
      color: 'rgba(0, 0, 0, .87)',
      textDecoration: 'none',
      cursor: 'default'
    }
  },
  noResults: {
    height: 60,
    textAlign: 'center'
  },
  alertIcon: {
    height: 16
  },
  lockIcon: {
    height: 18,
  },
  iconCell: {
    width: 16
  },
  withAction: {
    borderBottom: 0
  },
  actionRow: {
    '& td': {
      paddingTop: 0
    }
  },
  actionBox: {
    display: 'inline-flex',
    width: 'auto',
    backgroundColor: '#E1EDF0',
    color: '#164258',
    alignItems: 'center',
    padding: '8px 20px',
    borderRadius: 4
  },
  lockBox: {
    display: 'inline-flex',
    width: 'auto',
    alignItems: 'center',
    padding: '8px 20px',
    borderRadius: 4
  },
  alertLabel: {
    marginLeft: 8
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
    alignItems: 'center',
    color: '#004571',
  },
  loadingAnimation: {
    display: 'block',
    width: 52,
  },
  paginationContainer: {
		margin: '20px 0'
	},
  cell20: {
    width: '20%',
  },
  cell10: {
    width: '10%',
  },
}))

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: '#EBE9E6',
    color: '#004571',
    fontSize: 14,
    fontWeight: 'bold',
    height: 42,
    boxSizing: 'border-box',
    textAlign:'left',
    verticalAlign:'center',
    padding: '10px 8px 10px 16px'
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
