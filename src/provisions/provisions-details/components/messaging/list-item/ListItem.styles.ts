import { makeStyles, withStyles } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell'

const useStyles = makeStyles((theme) => ({
  table: {
    borderRadius: 4,
    overflow: 'hidden'
  },
  row: {
    backgroundColor: '#F8F7F6',
    border: 0,
    '&.border': {
      borderBottom: 'solid 2px #FFF'
    },
    '& .MuiTableCell-root': {
      borderBottom: 0
    }
  },
  responseStatus: {
    margin: '0 auto',
    width: 12,
    height: 12,
    backgroundColor: '#019AA5',
    borderRadius: '50%',
    '&.read': {
      backgroundColor: '#E5E1DE'
    }
  },
  responseSubject: {
    color: '#004571',
    fontSize: 15,
    fontWeight: 'bold',
    '&.read': {
      fontWeight: 'normal'
    }
  },
  responseDate: {
    fontSize: 14,
    color: '#868686',
    fontWeight: 'bold',
    '&.read': {
      fontWeight: 'normal'
    }
  },
  responseLink: {
    fontSize: 14,
    color: '#5193bd'
  },
  expandIcon: {
    marginLeft: 3
  },
  cell: {
    width: 15
  },
  mediumCell: {
    width: 65
  },
  largeCell: {
    width: 350
  },
  viewRow: {
    backgroundColor: '#F8F7F6',
    borderBottom: 'solid 2px #FFF'
  },
  viewCell: {
    border: 0
  },
  viewContainer: {
    padding: 40,
    fontSize: 16
  },
  message: {
    color: '#868686'
  },
  documents: {
    marginTop: 20
  },
  documentContainer: {
    marginBottom: 15,
    '& a': {
      textDecoration: 'none',
      color: '#5193bd',
      cursor: 'pointer',
    }
  },
  documentIcon: {
    marginRight: 10
  },
  documentName: {
    color: '#5A85A1',
    fontSize: 14,
    textAlign: 'center',
    wordBreak: 'break-word'
  },
  documentType: {
    color: '#256085',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  downloadDocument: {
    textDecoration: 'none',
    cursor: 'pointer'
  }
}))

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: '#EBE9E6',
    color: '#004571',
    fontSize: 14,
    fontWeight: 'bold',
    padding: '5px 10px'
  },
  body: {
    fontSize: 12,
    padding: '14px 8px'
  }
}))(TableCell)

export default useStyles

export { StyledTableCell }
