import { makeStyles, withStyles } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell'

const useStyles = makeStyles((theme) => ({
  input3: {
    width: '90%',
    fontSize: '50px',
    color: 'rgba(0, 69, 113, 1.0)',
    backgroundColor: 'rgb(247, 247, 247)',
    '& input, & .MuiSelect-selectMenu': {
      background: '#FFF',
      paddingTop: '15px',
      paddingBottom: '15px'
    }
  },
  title: {
    paddingBottom: 20,
    fontSize: 36,
    color: 'rgba(0, 69, 113, 1)',
    textAlign: 'center'
  },
  table: {
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 25,
    marginRight: 9,
  },
  container: {
    margin: 5,
    [theme.breakpoints.down('sm')]: {
      padding: 2,
    }
  },
  emptyList: {
    height: 60,
    textAlign: 'center',
    borderBottom: 0
  },
  cell: {
    paddingRight: 2,
    '&.name': {
      paddingLeft: 0
    }
  },
  infoIcon: {
    paddingLeft: 10,
  },
  wrappedCell: {
    [theme.breakpoints.down('sm')]: {
      wordBreak: 'break-word'
    }
  },
  viewButton: {
    color: '#1674D1',
    fontSize: 14,
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  btn: {
    [theme.breakpoints.down('sm')]: {
      margin: '10px'
    }
  },

  maxWidthForBigScreens: {
    maxWidth: 1200,
    width: '100%'
  },
  containerPagination: {
    justifyContent: 'center',
    marginTop: 16
  },
  icon: {
    width: 10,
    cursor: 'pointer',
    '&.disabled': {
      filter: 'grayscale(1)',
      opacity: .5,
      cursor: 'default'
    }
  },
  label: {
    fontSize: '0.875rem',
    margin: '-2px 12px 0'
  }
}))
const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: '#EBE9E6',
    color: '#004571',
    fontSize: 12,
    fontWeight: 'bold',
    paddingRight: 1,
    height: 42,
    boxSizing: 'border-box',
    paddingTop: 10,
    paddingBottom: 10,
    textAlign: 'center'
  },
  body: {
    backgroundColor: '#F8F7F6',
    fontSize: 12,
    paddingRight: 1,
    paddingTop: 10,
    paddingBottom: 10,
    textAlign: 'center'
  }
}))(TableCell);

export default useStyles
export { StyledTableCell }
