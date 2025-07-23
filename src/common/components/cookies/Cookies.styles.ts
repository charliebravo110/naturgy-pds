import { makeStyles, withStyles } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell'


const useStyles = makeStyles((theme) => ({
  container: {
    margin: 'auto',
    marginTop: 80,
    maxWidth: 1080
},
  link: {
    margin: 'auto',
},
  title: {
    fontSize: 46,
    color: '#004b87',
    marginTop: 60
  },
  title1: {
    fontSize: 28,
    color: '#004b87',
    marginTop: 28
  },
  title2: {
    fontSize: 18,
    color: '#004b87',
    marginTop: 28
  },
  text: {
    fontSize: 16,
    color: '#333',
    marginTop: 10
  },  
  suppliesTable: {
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden'
  },
  onlyDesktop: {
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  headTableCell: {
    paddingRight: 10,
    width: '10%',
    textAlign:'center',
    '&.name': {
      paddingLeft: 0
    }
  },
  headTableCell1: {
    paddingRight: 10,
    width: '15%',
    textAlign:'center',
    '&.name': {
      paddingLeft: 0
    }
  },
  headTableCell2: {
    paddingRight: 10,
    width: '75%',
    textAlign:'center',
    '&.name': {
      paddingLeft: 0
    }
  },  
  tableRow: {
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column'
    }
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
  },
  body: {
    backgroundColor: '#F8F7F6',
    fontSize: 12,
    paddingRight: 1,
    paddingTop: 10,
  }
}))(TableCell);

export { StyledTableCell }
export default useStyles
