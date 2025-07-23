import { makeStyles, withStyles } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell'

const useStyles = makeStyles((theme) => ({
  modalContainer: {
    border: '2px solid rgb(61, 114, 147)',
    outline: 'none',
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: {
      overflow: 'auto'
    }
  },
  block: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  container: {
    padding: '10px 0 10px',
    justifyContent: 'center'
  },
  title: {
    fontSize: 30,
    color: '#004571',
    textAlign: 'center',
    marginBottom: 20
  },
  text: {
    color: '#838383',
    textAlign: 'center',
    boxSizing: 'border-box',
    marginBottom: 25
  },
  closeButton: {
    marginTop: -5,
    marginRight: -5,
    padding: '4px 0'
  },
  locationTable: {
    borderRadius: 4,
    overflow: 'hidden',
    '& thead': {
      display: 'block',
      backgroundColor: '#EBE9E6',
      paddingRight: 34
    },
    '& tbody': {
      display: 'block',
      maxHeight: 230,
      overflowY: 'scroll',
      overflowX: 'hidden'
    },
    '& .MuiTableCell-root': {
      width: '25%'
    }
  },
  button: {
    marginTop: 24,
    justifyContent: 'center',
    '& button': {
      margin: '0 16px'
    }
  },
  radioButton: {
    width: 17,
    height: 17,
    boxSizing: 'border-box',
    backgroundColor: '#FFF',
    padding: 3,
    border: 'solid 1px #C4D2DA',
    borderRadius: '50%',
    cursor: 'pointer',
    '&.active::before': {
      display: 'block',
      width: '100%',
      height: '100%',
      backgroundColor: '#039BA8',
      content: '""',
      borderRadius: '50%',
      cursor: 'default'
    }
  },
  mosaicContainer: {
    maxHeight: 278,
    overflow: 'auto'
  }
}))

const StyledTableCell = withStyles(theme => ({
    head: {
      backgroundColor: '#EBE9E6',
      color: '#004571',
      fontSize: 14,
      fontWeight: 'bold',
      paddingRight: 1
    },
    body: {
      backgroundColor: '#F8F7F6',
      fontSize: 12,
      paddingRight: 1
    }

  }))(TableCell);

  export default useStyles

  export { StyledTableCell }
