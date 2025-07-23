import { makeStyles, withStyles } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell'

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: 'absolute',
    top: 18,
    right: 18,
    cursor: 'pointer'
  },
  noItems: {
    textAlign: 'center',
    justifyContent: 'center',
    '& .row': {
      display: 'block',
      textAlign: 'center',
      marginTop: 24
    },
    '& .title': {
      color: '#004571',
      fontSize: 18
    },
    '& .description': {
      color: '#777'
    },
    '& .button': {
      marginTop: 36
    }
  },
  managers: {
    '& .title': {
      display: 'block',
      color: '#004571',
      fontSize: 26,
      textAlign: 'center',
      marginBottom: 16,
      [theme.breakpoints.only('xs')]: {
        marginTop: 12
      }
    },
    '& .description': {
      display: 'block',
      textAlign: 'center',
      marginBottom: 32
    },
    '& .list': {
      border: 'solid 1px #D0D0D0',
      borderRadius: 4,
      '& .manager': {
        position: 'relative',
        width: '100%',
        boxSizing: 'border-box',
        backgroundColor: '#F8F7F6',
        padding: 12,
        marginTop: 12,
        '&:first-child': {
          borderRadius: '4px 4px 0 0',
          margin: 0
        },
        '&:last-child': {
          borderRadius: '0 0 4px 4px'
        },
        '& .radioButton': {
          position: 'absolute',
          top: 12,
          right: 12
        },
        '& .name': {
          width: 'calc(100% - 30px)',
          fontWeight: 'bold',
          wordBreak: 'break-word'
        },
        '& .email': {
          wordBreak: 'break-word',
          marginTop: 10
        },
        '& .dni': {
          wordBreak: 'break-word',
          marginTop: 10,
          '& span': {
            color: '#1B5980',
            fontWeight: 'bold'
          }
        }
      }
    },
    '& .buttons': {
      justifyContent: 'center',
      marginTop: 32,
      '& button': {
        margin: '0 12px',
        [theme.breakpoints.only('xs')]: {
          margin: '12px 0 0'
        }
      }
    }
  },
  table: {
    '& .row': {
      backgroundColor: '#F8F7F6',
      border: 'solid 2px transparent',
      borderTop: 0,
      borderBottom: 0,
      '&.selected': {
        backgroundColor: '#E6F2FB',
        borderColor: '#1674D1'
      }
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
  checkbox: {
    position: 'absolute',
    top: 12,
    right: 12,
    margin: 0
  },
  periods: {
    marginTop: 16,
    '& .title': {
      color: '#004571',
      fontSize: 14,
      fontWeight: 'bold',
      textAlign: 'left',
      marginBottom: 10
    },
    '& .label': {
      color: 'rgba(0, 69, 113, 1)',
      fontSize: 14
    }
  },
  dateContainer: {
    [theme.breakpoints.only('xs')]: {
      width: '100%',
      '& div[class^="makeStyles-container"]': {
        marginRight: 0
      }
    }
  },
  endDateContainer: {
    [theme.breakpoints.only('xs')]: {
      marginTop: 12
    }
  }
}))

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: '#EBE9E6',
    color: '#004571',
    fontSize: 14,
    fontWeight: 'bold'
  },
  body: {
    fontSize: 12,
    padding: '14px 18px'
  }
}))(TableCell)

export default useStyles

export { StyledTableCell }
