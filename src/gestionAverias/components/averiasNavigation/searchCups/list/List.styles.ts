import { makeStyles, withStyles } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell'

const useStyles = makeStyles((theme) => ({

  table: {
    overflow: 'hidden',
    marginTop: 16,
    border: 'none'
  },
  row: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column'
    },
    border: 'none'
  },
  pointer: {
    cursor: 'pointer'
  },
  suppliesTable: {
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: '20px',
    '& .MuiTableSortLabel-icon': {
      marginRight: 0,
      marginLeft: 0
    }
  },
  suppliesBoldCell: {
    fontWeight: 'bold',
    '&.name': {
      paddingLeft: 0
    }
  },
  headTableCell: {
    paddingRight: 10,
    '&.name': {
      paddingLeft: 0
    },
    '&.extra': {
      width: '11%'
    },
    '&.center': {
      textAlign: 'center'
    }
  },
  headTableCellCenter: {
    textAlign: 'center',
    paddingRight: 10,
    '&.name': {
      paddingLeft: 0
    },
    '&.extra': {
      width: '11%'
    },
    '&.center': {
      textAlign: 'center'
    }
  },
  bodyTableCell: {
    textAlign: 'center'
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
    }
  },
  tableBodyRowColored: {
    '&.disabled': {
      opacity: .7,
      filter: 'grayscale(1)'
    },
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column'
    },
    backgroundColor: '#f0f4f7',
    border:'2px #588bbe solid',
    
    '& td': {
      backgroundColor:'#f0f4f7',
    },
  },
  onlyDesktop: {
    [theme.breakpoints.down('sm')]: {
      display: 'none'
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
  editButton: {
    display: 'flex',
    color: '#1674D1',
    textDecoration: 'underline',
    cursor: 'pointer',
    '&.disabled': {
      color: 'rgba(0, 0, 0, .87)',
      textDecoration: 'none',
      cursor: 'default'
    }
  },
  noResults: {
    height: 60,
    textAlign: 'center'
  },
  alertIcon: {
    height: 16
  },
  lockIcon: {
    height: 18
    //paddingRight: 18
  },
  iconCell: {
    width: 16
  },
  withAction: {
    borderBottom: 0
  },
  actionRow: {
    '& td': {
      paddingTop: 0
    }
  },
  actionBox: {
    display: 'inline-flex',
    width: 'auto',
    backgroundColor: '#E1EDF0',
    color: '#164258',
    alignItems: 'center',
    padding: '8px 20px',
    borderRadius: 4
  },
  lockBox: {
    display: 'inline-flex',
    width: 'auto',
    alignItems: 'center',
    //padding: '8px 20px',
    borderRadius: 4,
    textAlign: 'center'
  },
  alertLabel: {
    marginLeft: 8
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
    alignItems: 'center',
    color: '#004571',
  },
  loadingAnimation: {
    display: 'block',
    width: 52,
  },
  paginationContainer: {
    margin: '0px 0'
  },
  inputTitle: {
    width: '100%',
    justify: 'flex-start',
    color: 'rgba(0, 69, 113, 1.0)',
    fontSize: '0.8rem',
    marginTop: '10px',
    marginBottom: '5px',
    [theme.breakpoints.up('sm')]: {
      height: '28px',
      display: 'flex',
      alignItems: 'flex-end'
    }
  },
  button: {
    width: 80,
    height: 20,
    fontSize: 14,
    justify: 'flex-start',
    backgroundColor: '#FFF',
    color: '#004571',
    marginTop: '42px',
    borderRadius: '4px',
    cursor: 'pointer',
    '&.MuiButton--large': {
      minWidth: 0
    }
  },
  buttonCrearAviso: {
    '&.MuiButton--small': {
      padding: '0px, 10px'
    }
  },
  dateContainer: {
    paddingBottom: 15
  },

  topContainer: {
    border: 'solid 2px #E1E9EE',
    marginTop: 10
  },
  inTopContainer: {
    boxSizing: 'border-box',
    padding: 10,
    fontSize: 14
  },
  expansionPanelSummaryIcon: {
    width: 24
  },
  expansionPanelSummaryText: {
    color: '#004571',
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 10,
    marginTop: 13,
    '& a': {
      textDecoration: 'none',
      fontWeight: 'normal',
      color: '#000000'
    }
  },
  expansionPanelSummaryText2: {
    fontSize: 17,
    marginTop: 7
  },
  line: {
    borderTop: 'solid 1px #E1E9EE',
    width: '98%',
    margin: '0 auto 0 auto'
  },
  subTitle: {
    color: '#004571',
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 10
    //marginLeft: 24
  },
  link: {
    paddingTop: 12,
    color: '#6ea8e2',
    textDecoration: 'underline',
    cursor: 'pointer'
  },
  end: {
    justifyContent: 'flex-end',
    textAlign: 'end'
  },
	tooltip: {
		fontSize: 14,
		color: '#004571',
		textDecoration: 'underline'
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
    fontSize: 12,
    paddingTop: 10,
    paddingBottom: 10
  }
}))(TableCell);

export default useStyles

export { StyledTableCell }
