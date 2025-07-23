import { makeStyles, withStyles } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell';
import { NoEncryption } from '@material-ui/icons'
import colors from '../../../../../../assets/colors/colors'

const useStyles = makeStyles((theme) => ({
  container: {
    border: 'solid 1px #E1E9EE',
    borderRadius: 4,
    marginTop: 20
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
  table: {
    textAlign: 'left',
    borderCollapse: 'collapse',
    borderStyle: 'hidden',
    '& td': {
      color: '#1674D1',
      border: 'dashed 2px #E1E9EE',
      '& img': {
        width: 14,
        height: 14,
        margin: '0 8px -2px 0'
      }
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
    width: 15,
    marginRight:5
},
  header: {
    '& th': {
      color: 'rgba(0, 69, 113, 1)',
      fontSize: 13,
      fontWeight: 'bold'
    }
  },
  blueColor:{
    color: '#004571',
},
  headTableCell: {
    paddingRight: 10,
    '&.name': {
      paddingLeft: 0
    },
    '&.extra': {
      width: '11%'
    }
  },
  select: {
    border: 'none',
    width: '150px',
    backgroundColor: '#F8F7F6'
  },
  noItemsCell: {
    textAlign: 'center',
    fontSize: 24,
    padding: 32,
    marginTop: 50,
    marginBottom: 50
  },
  item: {
    position: 'relative',
    backgroundColor: '#F8F7F6',
    textAlign: 'center',
    padding: '12px 20px 26px',
    borderRadius: 4,
    border: 'solid 1px #E1E9EE'
  },
  row: {
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
    paddingTop: 10,
    paddingBottom: 10
  }
}))(TableCell);

export default useStyles

export { StyledTableCell }
