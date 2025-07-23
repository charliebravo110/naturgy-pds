import { makeStyles, withStyles } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell'

const useStyles = makeStyles((theme) => ({
  suppliesTable: {
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
  suppliesBoldCell: {
    fontWeight: 'bold',
    '&.name': {
      paddingLeft: 0
    }
  },
  headTableCell: {
    paddingRight: 10,
    '&.name': {
      paddingLeft: 0
    },
    '&.extra': {
      width: '11%'
    },
    [theme.breakpoints.down('sm')]: {
      width:'initial !important'
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
    paddingRight: 18
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
    //padding: '8px 20px',
    borderRadius: 4,
    textAlign: 'center'
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
  inputTitle: {
    width: '100%',
    justify: 'flex-start',
    color: 'rgba(0, 69, 113, 1.0)',
    fontSize: '0.8rem',
    marginTop: '10px',
    marginBottom: '5px',
    [theme.breakpoints.up('sm')]: {
      height: '28px',
      display: 'flex',
      alignItems: 'flex-end'
    }
  },
  button: {
    width: 80,
    height: 20,
    fontSize: 14,
    justify: 'flex-start',
    backgroundColor: '#FFF',
    color: '#004571',
    marginTop: '42px',
    borderRadius: '4px',
    cursor: 'pointer',
    '&.MuiButton--large': {
      minWidth: 0
    }
  },
  dateContainer: {
    paddingBottom: 15
  },
  rowMosaic: {
    marginTop: 14
  },
  title: {
    color: '#1674D1',
    fontSize: 'inherit',
    fontWeight: 'bold'
  },
  value: {
    fontSize: 'inherit',
    marginTop: 6,
    '&.bold' : {
      fontWeight: 'bold'
    },
    '& a': {
      color: '#1674D1'
    }
  },
  item: {
    backgroundColor: '#F8F7F6',
    textAlign: 'center',
    padding: '12px 20px 26px',
    border: 'solid 2px transparent',
    borderRadius: 4,
    '&.selected': {
      backgroundColor: '#E6F2FB',
      borderColor: '#1674D1'
    }
  },
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
  mobileFullWidth: {
    height: 47,
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  mobileFullWidth2: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginBottom:'10px'
    }
  },
  searcher: {
    marginBottom: 10,
    justifyContent: 'flex-end',
    paddingRight: 8,
    paddingTop: 6,
    [theme.breakpoints.down('sm')]: {
      paddingRight: 0,
      paddingBottom: 14
    }
  },
  
  itemText: {
    color: 'rgba(0, 69, 113, 1.0)',
    fontSize: '17px',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
    marginTop: '10px',
    fontWeight:'bold'
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
