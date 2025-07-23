import { makeStyles, withStyles } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell';


const useStyles = makeStyles((theme) => ({

    dialog: {
        '& .MuiPaper-root.MuiDialog-paper': {
            width: 1500,
            border: '2px solid rgb(61, 114, 147)',
            background: '#c4c4c4'
        }
    },

    container: {
        position: 'relative',
    },

    textContainer: {
        marginTop: 10,
        position: 'relative',
        padding: 36,
        fontSize: 15,
        background: '#f2f6f8'
    },
    form: {
        marginTop: 20
    },
    inputLabel: {
        color: '#004571',
        marginBottom: 6,
    },

    inputLabel2: {
        marginTop: 20,
        color: '#004571',
        marginBottom: 6,
    },
    whiteBackground: {
        backgroundColor: '#FFFFFF'
    },
    blueColor: {
        color: '#004571',
    },
    recurrentContainer: {
        color: '#004571',
        alignItems: 'center',
        marginTop: 20,
        [theme.breakpoints.down('md')]: {
            marginTop: 0
        }
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
    recurrentLabel: {
        paddingLeft: 0
    },

    radioGroup: {
        flexDirection: 'row',
        '& .MuiButtonBase-root.Mui-checked': {
            color: '#1674D1'
        }
    },
    closeButton: {
        position: 'absolute',
        top: 18,
        right: 18,
        cursor: 'pointer'
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

    buttonContainer: {
        justifyContent: 'space-between',
        marginTop: 20
    },
    buttonContainer2: {
        justifyContent: 'center',
        marginTop: 20
    },
    button: {
        textAlign: 'center',
        width: '200px'
    },
    button2: {
        textAlign: 'center',
        width: '100%',
        background: '#FFFFFF'
    },
    title: {
        color: '#004571',
        fontWeight: 'bold'
    },
    title2: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#004571'
    },
    description: {
        color: '#555',
        paddingBottom: 20,
        marginTop: 16
    },
    downloadContainer: {
        position: 'relative',
        [theme.breakpoints.only('xs')]: {
            width: '100%',
            marginTop: 15
        }
    },
    arrowIcon: {
        marginLeft: 24
    },

    icon: {
        width: 15,
        marginRight:5
    },
    downloadButton: {
        backgroundColor: '#004571',
        color: '#FFF',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 18px',
        borderRadius: 4,
        cursor: 'pointer',
        [theme.breakpoints.up('xs')]: {
            minWidth: 300
        }
    },
    table: {
        textAlign: 'left',
        borderCollapse: 'collapse',
        borderStyle: 'hidden',
        '& td': {
            border: 'dashed 2px #E1E9EE',
            '& img': {
                width: 14,
                height: 14,
                margin: '0 8px -2px 0'
            }
        }
    },
    header: {
        '& th': {
            color: 'rgba(0, 69, 113, 1)',
            fontSize: 16,
            fontWeight: 'bold'
        }
    },
    toolbar: {
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    noItemsCell: {
        textAlign: 'center',
        fontSize: 24,
        padding: 32,
        marginTop: 50,
        marginBottom: 50
    },
    select: {
        border: 'none',
        backgroundColor: '#f8f7f6',
        width: '150px'
    },
    whiteBackgroundColor: {
        '& .react-datepicker': {
            backgroundColor: 'white'
        }

    },
    box: {
        position: 'absolute',
        top: 'calc(100% + 2px)',
        right: 0,
        left: 0,
        backgroundColor: '#FFF',
        border: 'solid 2px #004571',
        borderRadius: 4,
        zIndex: 100,
        [theme.breakpoints.up('xs')]: {
            marginLeft: 8,
            marginRight: 8
        }
    },
    tableContainer: {
        border: 'solid 1px #E1E9EE',
        borderRadius: 4,
        marginTop: 20
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

    item: {
        position: 'relative',
        backgroundColor: '#F8F7F6',
        textAlign: 'center',
        padding: '12px 20px 26px',
        borderRadius: 4
      },
      row: {
        marginTop: 14
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