import { makeStyles, withStyles } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell'

const useStyles = makeStyles((theme) => ({
  messagesTable: {
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
  headTableCell: {
    paddingRight: 10,
    '&.name': {
      paddingLeft: 0
    },
    '&.extra': {
      width: '110px'
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
    },
    backgroundColor: '#FFF00'
  },
  rowOpen: {
    backgroundColor: 'rgb(233 242 251)'
  },
  noResults: {
    height: 60,
    textAlign: 'center'
  },
  icon: {
    height: 16
  },
  iconLock: {
    height: 14,
    marginRight: '4px'
  },
  iconAdd: {
    fontSize: '14px',
    color: '#076acd',
    cursor: 'pointer',
    marginLeft: '1rem',
    alignItems: 'center'
  },
  iconAddDisabled: {
    fontSize: '14px',
    color: 'rgba(189, 189, 189, 1)',
    marginLeft: '1rem',
    alignItems: 'center'
  },
  numberRow: {
    display: 'flex',
    alignItems: 'center',
  },
  iconPlus: {
    height: '15px',
  },
  detailText: {
    marginLeft: '4px',
    '&:hover': {
      textDecoration: 'underline'
    }
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
    margin: '10px 0'
  },
  mobileFullWidth: {
    height: 47,
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  titleCont: {
    margin: '25px 0',
    justifyContent: 'space-between'
  },
  buttonContainerSearch: {
    justifyContent: 'center',
    width: '22rem'
  },
  buttonContainer: {
    justifyContent: 'center',
    [theme.breakpoints.only('xs')]: {
      marginTop: '15px'
    }
  },
  footPaginator: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    color: '#004571',
    cursor: 'pointer',
    fontSize: '14px'
  },
  updateIcon: {
    marginRight: '5px',
    height: '1rem'
  },
  updateText: {
    '&:hover': {
      textDecoration: 'underline'
    }
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

const StyledSubTableCell = withStyles(theme => ({
  head: {
    backgroundColor: 'rgba(0, 102, 204, 0.1)',
    color: 'rgba(100, 102, 106, 1)',
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
    backgroundColor: 'rgb(233 242 251)',
    fontSize: 12,
    paddingTop: 10,
    paddingBottom: 10
  }
}))(TableCell);


export default useStyles

export { StyledTableCell, StyledSubTableCell }