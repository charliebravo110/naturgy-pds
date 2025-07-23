import { makeStyles, withStyles } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell'

const useStyles = makeStyles((theme) => ({
  table: {
    borderRadius: 4,
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
  boldCell: {
    fontWeight: 'bold'
  },
  wrappedCell: {
    [theme.breakpoints.down('sm')]: {
      maxWidth: 40,
      wordBreak: 'break-word'
    }
  },
  actionCell: {
    '& span': {
      visibility: 'hidden',
      color: '#1674D1',
      textDecoration: 'underline',
      cursor: 'pointer'
    },
    '& span.visible': {
      visibility: 'visible'
    }
  },
  input: {
    color: '#868686',
    '& .MuiFormControl-root': {
      backgroundColor: '#FFF'
    },
    '& .MuiInputBase-input': {
      color: '#868686'
    },
    '& .MuiFormHelperText-root': {
      backgroundColor: '#F8F7F6',
      padding: '8px 12px 0',
      margin: 0
    }
  },
  lastInput: {
    color: '#868686',
    '& .MuiSelect-root': {
      color: '#868686'
    },
    '& textarea': {
      color: '#868686'
    }
  },
  stateLabel: {
    color: '#868686',
    width: '100%'
  },
  inputTableFirst: {
    '& .MuiFormControl-root': {
      width: '180px',
      backgroundColor: '#FFF'
    },
    '& .MuiInputBase-input': {
      color: '#868686'
    },
    '& .MuiFormHelperText-root': {
      backgroundColor: '#F8F7F6',
      padding: '8px 12px 0',
      margin: 0
    }
  },
  inputCommentTable: {
    '& .MuiFormControl-root': {
      width: '180px',
      marginTop: '24px',
      backgroundColor: '#FFF'
    },
    '& .MuiInputBase-input': {
      color: '#868686'
    },
    '& .MuiFormHelperText-root': {
      backgroundColor: '#F8F7F6',
      padding: '8px 12px 0',
      margin: 0
    }
  },
  inputTable: {
    '& .MuiFormControl-root': {
      backgroundColor: '#FFF'
    },
    '& .MuiInputBase-input': {
      color: '#868686'
    },
    '& .MuiFormHelperText-root': {
      backgroundColor: '#F8F7F6',
      padding: '8px 12px 0',
      margin: 0
    }
  },
  errorInputPadding: {
    [theme.breakpoints.down(1000)]: {
      paddingTop: 42
    },
    [theme.breakpoints.down(1299)]: {
      paddingTop: 32
    },
    [theme.breakpoints.up(1300)]: {
      paddingTop: 19
    }
  },
  deleteIcon: {
    width: 18,
    cursor: 'pointer'
  },
  addIcon: {
    width: 14
  },
  commentContainer: {
    marginTop: 5,
    fontSize: 14
  },
  inputContainer: {
    marginBottom: 30
  },
  label: {
    marginBottom: 7,
    color: '#004571'
  },
  mobileInput: {
    width: '100%'
  },
  mobileRow: {
    backgroundColor: '#F8F7F5',
    padding: '20px',
    margin: '0 -20px',
    marginBottom: '10px'
  },
  lastRow: {
    borderTop: 'solid 2px white'
  },
  lastRowTitle: {
    color: '#004571',
    fontSize: 14,
    fontWeight: 'bold'
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
    padding: '14px 8px',
    border: 0,
    verticalAlign: 'text-top',
  }
}))(TableCell)

export default useStyles

export { StyledTableCell }