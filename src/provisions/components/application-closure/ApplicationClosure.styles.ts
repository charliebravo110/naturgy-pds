import { makeStyles, withStyles } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell'

const useStyles = makeStyles((theme) => ({
  container: {
    justifyContent: 'center'
  },
  block: {
    padding: '40px 40px',
    border: '1px solid #E3EBEF',
    textAlign: 'center',
    [theme.breakpoints.only('xs')]: {
      padding: '20px 10px',
    }
  },
  inner: {
    display: 'block'
  },
  title: {
    fontSize: 22,
    color: 'rgba(0, 69, 113, 1)'
  },
  advise: {
    fontSize: 15,
    color: '#ABABAB',
    '& a': {
      color: '#3B8AD8'
    }
  },
  okIcon: {
    marginBottom: 15
  },
  exp: {
    display: 'inline-block',
    backgroundColor: '#009AA6',
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    padding: '10px 32px',
    borderRadius: '20em',
    marginTop: 6,
    [theme.breakpoints.down('sm')]: {
      padding: '10px 54px'
    }
  },
  suppliesTable: {
    borderRadius: 4,
    overflow: 'hidden',
    margin: '25px 0',
    // '& .MuiTableCell-root:last-child': {
    //   [theme.breakpoints.up('sm')]: {
    //     paddingRight: '60px'
    //   }
    // }
  },
  tableRow: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column'
    }
  },
  marginBottomLi: {
    textAlign: 'center',
    justifyContent:'center',
    marginBottom: '20px'
  },
  maxPowerTitle: {
    fontWeight: 'bold',
    color: '#004571',
    marginBottom:'10px'
  },
  maxPowerDescription: {
    color: '#004571'
  },
  extensionRightsTitle: {
    marginTop:'10px',
    fontWeight: 'bold',
    color: '#004571',
    marginBottom:'10px'
  },
  extensionRightsDescription: {
    color: '#004571'
  },
  tableBodyRow: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column'
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
  noResults: {
    height: 60,
    textAlign: 'center'
  },
  download: {
    display: 'flex',
    fontSize: 16,
    color: '#3B8AD8',
    cursor: 'pointer',
    '&.disabled': {
      filter: 'grayscale(1)',
      cursor: 'default'
    }
  },
  downloadIcon: {
    width: 25
  },
  downloadText: {
    textAlign: 'left',
    marginLeft: 15
  },
  noItems: {
    flexDirection: 'column',
    margin: '20px 0'
  },
  noItemsIcon: {

  },
  noItemsTitle: {
    color: '#004571',
    fontSize: 20,
    marginTop: 24
  },
  noItemsDescription: {
    color: '#ABABAB',
    marginTop: 24
  }
}))
const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: '#EBE9E6',
    color: '#004571',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: '10px',
    lineHeight: '1rem',
    padding: '10px',
    [theme.breakpoints.only('xs')]: {
      padding: 20
    }
  },
  body: {
    backgroundColor: '#F8F7F6',
    color: '#ABABAB',
    border: '1.5px solid white',
    textAlign: 'center',
    fontSize: '10px',
    padding: '10px',
    [theme.breakpoints.only('xs')]: {
      padding: 20
    }
  }
}))(TableCell)

export default useStyles

export { StyledTableCell }
