import { makeStyles, withStyles } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell'

const useStyles = makeStyles((theme) => ({
  suppliesTable: {
    overflow: 'hidden'
  },
  suppliesBoldCell: {
    fontWeight: 'bold',
    '& a': {
      color: '#1674D1'
    }
  },
  headTableCell: {
    paddingRight: 10
  },
  tableRow: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column'
    }
  },
  tableBodyRow: {
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
    fontSize: 14,
    '& p': {
      marginTop: 0,
      marginBottom: 0
    }
  },
  noResults: {
    height: 60,
    textAlign: 'center'
  },
  supplyTypeIcon: {
    '& img': {
      width: 16,
      height: 16
    }
  },
  supplyTypeLabel: {
    marginLeft: 2
  },
  periodDate: {
    display: 'block'
  },
  managerName: {
    fontWeight: 'bold',
    color: '#E97000'
  },
  consultantName: {
    fontWeight: 'bold',
    color: '#004571'
  }
}))

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: '#EBE9E6',
    color: '#004571',
    fontSize: 14,
    fontWeight: 'bold',
    height: 42,
    boxSizing: 'border-box',
    paddingTop: 10,
    paddingBottom: 10
  },
  body: {
    backgroundColor: '#F8F7F6',
    fontSize: 12,
    padding: '10px 18px'
  }
}))(TableCell);

export default useStyles

export { StyledTableCell }
