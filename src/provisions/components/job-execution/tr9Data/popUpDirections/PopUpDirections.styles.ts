import { makeStyles, withStyles } from '@material-ui/core'
import TableCell from '@material-ui/core/TableCell'

const useStyles = makeStyles((theme) => ({
    dialog: {
        //maxWidth: '100%',
        '& .MuiPaper-root.MuiDialog-paper': {
            width: '60%',
            border: '2px solid rgb(61, 114, 147)',
            [theme.breakpoints.down('md')]: {
                width: '100%',
                margin: 20,
            }
        },
        '& .MuiDialogContent-root': {
            padding: 48,
            [theme.breakpoints.down('sm')]: {
                padding: 22
            }
        },
        '& .MuiDialog-paperWidthSm': {
            maxWidth: '100%'
        }
    },
    dialogContainer: {
        position: 'relative',
        padding: 36
    },
    closeIcon: {
        position: 'absolute',
        top: 13,
        right: 13,
        cursor: 'pointer',
        width: 14
    },
    titleContainer: {
        width: '100%',
        textAlign: 'center'
    },
    title: {
        fontSize: 20,
        color: '#004165',
        paddingBottom: 24
    },
    localityContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#F9F8F7',
        paddingBlock: 24,
        marginBottom: 24,
        [theme.breakpoints.down('md')]: {
            flexDirection: 'column',
            paddingLeft: 20
        }
    },
    localityLineContainer: {
        display: 'flex',
        flexDirection: 'row'
    },
    localityTitle: {
        display: 'flex',
        flexDirection: 'row',
        fontWeight: 700,
        fontSize: 16,
        color: '#004571'
    },
    localityText: {
        textTransform: 'uppercase',
        color: '#64666A',
        paddingLeft: 5
    },
    getTitle: {
        fontSize: 24,
        color: '#004571',
        paddingBlock: 20
    },
    text: {
        color: '#555550'
    },
    paddingText: {
        color: '#555550',
        paddingBottom: 20
    },
    notFoundContainer: {
        backgroundColor: '#F9F8F7',
        border: '1px solid #BFB8AE80',
        paddingInline: 24
    },
    gridSpaceContainer: {
        width: 0,
        [theme.breakpoints.up('md')]: {
            width: 20
        }
    },
    alertContainer: {
        textAlign: 'center'
    },
    errorContainer: {
        textAlign: 'center',
        marginBottom: 24
    },
    failDirectionContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'center'
    },
    failDirectionTitle: {
        fontSize: 14,
        color: '#64666A',
        textAlign: 'center'
    },
    failDirectionLink: {
        paddingLeft: 4,
        textAlign: 'center',
        fontSize: 14,
        textDecoration: 'underline',
        cursor: 'pointer',
        color: '#0066CC'
    },
    failDirectionColumnContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    failDirectionButtonsContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        [theme.breakpoints.down('md')]: {
            flexDirection: 'column-reverse'
        }
    },
    failDirectionText: {
        color: '#555550',
        textAlign: 'center',
        paddingBlock: 20
    },
    acceptBtn: {
        [theme.breakpoints.down('md')]: {
            marginBottom: 10
        }
    },
    footerContainer: {
        display: 'flex', flexDirection: 'row', justifyContent: 'space-around', paddingTop: 24
    },

    //table
    tableHeaderContainer: {
        border: '1px solid #00457133',
        paddingInline: 20,
        paddingBlock: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        [theme.breakpoints.down('md')]: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start'
        }
    },
    headerResults: {
        color: '#64666A'
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
        float: 'left',
        '&.active::before': {
            display: 'block',
            width: '100%',
            height: '100%',
            backgroundColor: '#0066cc',
            content: '""',
            borderRadius: '50%',
            cursor: 'default'
        },
        marginRight: 10
    },
    titleCell: {
        fontSize: 14
    },
    textCell: {
        fontSize: 12
    },
    pagintaionContainer: {
        marginBottom: 24,
        marginTop: 5
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