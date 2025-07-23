import { makeStyles, withStyles } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell'

const useStyles = makeStyles((theme) => ({
  // fsp-ini
  checkboxCell: {
    paddingLeft: 10
  },
  row: {
    backgroundColor: '#F8F7F6',
    border: 'solid 2px transparent',
    borderTop: 0,
    borderBottom: 0,
    '&.selected': {
      backgroundColor: '#E6F2FB',
      borderColor: '#1674D1'
    }
  },

  tableBodyRow: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column'
    }
  },

  
  // fsp-fin







  delegationsTable: {
    borderRadius: 4,
    overflow: 'hidden'
  },
  delegationsCups: {
    '& a': {
      color: '#1674D1'
    }
  },
  delegationsAddress: {
    maxWidth: 120,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    '&:hover':{
      overflow: 'visible',
      whiteSpace: 'normal'
    }
  },
  delegationsTextLink: {
    marginRight: '50',
    color: '#1674D1 ',
    fontSize: 14
  },
  pagination: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  },
  orange: {
    background: '#E97000',
    width: 10,
    height: 10,
    borderRadius: '50%',
    marginRight: 5
  },
  blue: {
    background: '#004571',
    width: 10,
    height: 10,
    borderRadius: '50%',
    marginRight: 5
  },
  pointContainer: {
    display: 'flex',
    alignItems: 'center'
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
    marginTop: '12px',
    marginBottom: '12px',
    color: '#3b3b3b'
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
