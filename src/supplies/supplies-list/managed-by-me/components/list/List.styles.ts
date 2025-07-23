import { makeStyles, withStyles } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell'

const useStyles = makeStyles((theme) => ({
  table: {
    overflow: 'hidden'
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
  disabledAction: {
    pointerEvents: 'none',
    color: '#BBB',
    cursor: 'default'
  },
  boldCell: {
    fontWeight: 'bold'
  },
  wrappedCell: {
    '& a': {
      color: '#1674D1'
    },
    [theme.breakpoints.down('sm')]: {
      maxWidth: 40,
      wordBreak: 'break-word'
    }
  },
  actionCell: {
    textAlign: 'center',
    width: 75,

    '& span': {
      fontSize: 14,
      visibility: 'hidden',
      display:'none',
      color: '#1674D1',
      textDecoration: 'underline',
      cursor: 'pointer',
    },
    '& span.visible': {
      visibility: 'visible',
      display:'initial'
    },
    '&.disabled span': {
      pointerEvents: 'none',
      color: '#BBB',
      cursor: 'default'
    }
  },
  iconCell:{
    display: 'flex', 
    justifyContent: 'center'
  },
  buttonCell: {
    width: 50,
    '& a': {
      fontSize: 14,
    },
    [theme.breakpoints.down('sm')]: {
      paddingLeft: 0,
      paddingRight: 0
    }
  },
  button: {
    color: '#1674D1'
  },
  checkboxCell: {
    paddingLeft: 10,
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
    color: '#004571',
    paddingTop: '5px'
  },
  pointer: {
    cursor:'pointer',
  },
  loadingBox: {
    backgroundColor:'#f2f6f8',
    height: 'auto',
    justifyContent: 'flex-start',
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    fontSize: 16,
    color: '#004571',
    marginTop: 12
  },
  loadingAnimation: {
    display: 'block',
    width: 45,
    height: 45,
    marginLeft: '10px',
    marginRight: '10px'
  },
  loadingText: {
    overflowWrap: 'break-word',
    wordBreak: 'break-word',
    maxWidth: 'calc(100% - 40px)',
    flex: '1'
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
    paddingBottom: 10,
    paddingLeft: 5,

    '& div' : {
      lineHeight:'1.43',
    }
  },
  body: {
    fontSize: 12,
    padding: '10px 0px 10px 0px'
  }
}))(TableCell)

export default useStyles

export { StyledTableCell }
