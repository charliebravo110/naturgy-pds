import { makeStyles, withStyles } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell'

const useStyles = makeStyles((theme) => ({
  suppliesTable: {
    overflow: 'hidden'
  },
  suppliesBoldCell: {
    fontWeight: 'bold'
  },
  tableRow: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column'
    }
  },
  tableBodyScrollWrapper: {
    maxHeight: 320,
    overflowY: 'auto'
  },
  tableBodyRow: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column'
    },
    '& .MuiTableCell-root': {
      paddingTop: 0,
      paddingBottom: 0
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
  checkBox: {
    '& .MuiSvgIcon-root path': {
      color: '#1674d1',
      stroke: '1px'
    },
    '&.MuiCheckbox-colorPrimary.Mui-checked': {
      color: '#1674d1'
    }
  },
  editButton: {
    display: 'flex',
    color: '#1674D1',
    textDecoration: 'none',
    '& img': {
      paddingRight: 5
    }
  },
  noResults: {
    height: 60,
    textAlign: 'center'
  },
  blueLink: {
    color: '#1674D1',
    cursor: 'pointer'
  }
}))

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: '#EBE9E6',
    color: '#004571',
    fontSize: 14,
    fontWeight: 'bold'
  },
  body: {
    backgroundColor: '#F8F7F6'
  }
}))(TableCell);

export default useStyles

export { StyledTableCell }
