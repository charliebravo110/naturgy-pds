import { makeStyles, withStyles } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell'

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    marginTop: 150,
    maxWidth: 1200
  },
  title: {
    width: '100%',
    fontSize: 36,
    color: 'rgba(0, 69, 113, 1)',
    textAlign: 'center',
    marginBottom: 46
  },
  subtitle: {
    color: '#2C648A',
    fontWeight: 'bold',
    marginBottom: '30px',
    textAlign: 'left'
  },
  suggestionText: {
    color: '#B0B0B0',
    display: 'block',
    textAlign: 'left'
  },
  separator: {
    width: '100%',
    alignSelf: 'center',
    height: '1px',
    backgroundColor: '#E3EBEF',
    margin: '20px 0 55px 0'
  },
  fullWidth: {
    width: '100%'
  },
  block: {
    padding: '20px 40px',
    // border: '1px solid #E3EBEF',
    textAlign: 'center',
    [theme.breakpoints.down('sm')] : {
      padding: '20px 20px'
    }
  },
  mosaicContainer: {
    marginTop: 20
  },
  table: {
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 20
  },
  row: {
    backgroundColor: '#F8F7F6',
    border: 'solid 2px transparent',
    borderTop: 0,
    '&.selected': {
      backgroundColor: '#E6F2FB',
      borderColor: '#1674D1'
    }
  },
  paginationContainer: {
    margin: '20px 0'
  },
  noItems: {
    textAlign: 'center',
    justifyContent: 'center',
    paddingTop: 20
  },
  text: {
    marginTop: 16
  },
  button2: {
    display: 'inline-block',
    backgroundColor: 'rgba(0, 69, 113, 1)',
    '&:hover': {
      backgroundColor: 'rgba(0, 69, 113, 0.75)',
      boxShadow: '0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)'
    },
    transition: '.2s',
    color: '#FFF',
    padding: 12,
    borderRadius: 4,
    marginBottom: 10,
    cursor: 'pointer'
  }
}))

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: '#EBE9E6',
    color: '#004571',
    fontSize: 14,
    fontWeight: 'bold',
    padding: '14px 10px'
  },
  body: {
    fontSize: 12,
    padding: '14px 8px',
    border: 0
  }
}))(TableCell)

export default useStyles

export { StyledTableCell }
