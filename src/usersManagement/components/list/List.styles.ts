import { makeStyles, withStyles } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell'
import Checkbox from '@material-ui/core/Checkbox'

const useStyles = makeStyles((theme) => ({
  titleCont: {
    margin: '25px 0',
    justifyContent: 'center'
  },
  title: {
    color: '#004571',
    display: 'flex',
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: '20px',
    marginTop: '1rem'
  },
  buttonContainer: {
    gap: '2rem',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  buttonContainerSearch: {
    justifyContent: 'center',
    width: '22rem'
  },
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
  noResults: {
    height: 60,
    textAlign: 'center'
  },
  icon: {
    height: 16
  },
  iconV2: {
    height: 20
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
  searcher: {
    justifyContent: 'flex-start',
    [theme.breakpoints.down('sm')]: {
      paddingRight: 0,
      paddingBottom: 14
    }
  },
  mobileFullWidth: {
    height: 47,
    [theme.breakpoints.down('sm')]: {
      width: '100%'
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

const StyledCheckbox = withStyles(theme => ({
  
}))(Checkbox);

export default useStyles

export { StyledTableCell,  StyledCheckbox}