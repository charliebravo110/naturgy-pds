import { makeStyles, withStyles } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell'

const useStyles = makeStyles((theme) => ({
  selectPds: {
    color: '#0066CC',
    cursor: 'pointer',
    textDecoration: 'underline',
    [theme.breakpoints.down('sm')]: {
      width: '32.5%',
      textAlign: 'center'
    }
  },
  buttonIcon: {
    width: 20,
    marginLeft: 8
  },
  button: {
    color: '#1674D1'
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
  supplyTypeIcon: {
    '& img': {
      width: 16,
      height: 16
    }
  },
  supplyTypeLabel: {
    marginLeft: 2
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
  Star: {
    color: 'Yellow',
    padding: '1px 4px',
    cursor: 'pointer',
    alignItems: 'center',
    justifyContent: 'center',
    '&.active': {
      backgroundColor: '#1674D1',
      color: 'Yellow',
      borderColor: '#1674D1'
    },
    '&.disabled': {
      opacity: .5,
      cursor: 'default'
    },
    '&.error': {
      backgroundColor: '#FFF',
      borderColor: '#F44336',
      color: '#F44336'
    }
  },
  cups: {
    color: '#086bcd',
    cursor: 'pointer'
  },
  supplyName: {
    fontSize: '12px',
    color: '#555555'
  },
  supplyNameCell: {
    width: '10%'
  },
  cupsCell: {
    width: '20%'
  },
  addressCell: {
    width: '35%'
  },
  row: {
    backgroundColor: '#F8F7F6',
    position: 'relative',
    border: 'solid 2px transparent',
    alignItems: 'center',
    justifyContent: 'center',
    borderTop: 0,
    borderBottom: 0,
    '&.selected': {
      backgroundColor: '#E6F2FB',
      borderColor: '#1674D1'
    }
  },
  actionCell: {
    textAlign: 'center',
    width: 75,
    '& span': {
      fontSize: 14,
      visibility: 'hidden',
      color: '#1674D1',
      textDecoration: 'underline',
      cursor: 'pointer'
    },
    '& span.visible': {
      visibility: 'visible'
    },
    '&.disabled span': {
      pointerEvents: 'none',
      color: '#BBB',
      cursor: 'default'
    }
  },
  table: {
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center'
  },
  table2: {
    overflow: 'hidden'
  },
  boldCell: {
    fontWeight: 'bold'
  },
  favorite: {
    marginLeft: 10
  },
  item: {
    position: 'relative',
    backgroundColor: '#F8F7F6',
    textAlign: 'center',
    padding: '12px 20px 26px',
    borderRadius: 4
  },
  title: {
    color: '#1674D1',
    fontSize: 'inherit',
    fontWeight: 'bold'
  },
  value: {
    fontSize: 'inherit',
    marginTop: 6,
    marginBottom: 10
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
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 5
  },
  body: {
    fontSize: 12,
    padding: '10px 10px 10px 5px',
    border: 0
  }
}))(TableCell)

export default useStyles

export { StyledTableCell }
