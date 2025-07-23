import { TableCell, withStyles } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    s: {
        width: '2.5rem'
    },
    m: {
        width: '6rem'
    },
    l: {
        width: '11rem'
    },
    sm: {
        backgroundColor: '#EBE9E6',
        color: '#004571',
        fontSize: 11,
        fontWeight: 'bold',
        paddingRight: 1,
        paddingLeft: 12,
        height: 42,
        boxSizing: 'border-box',
        paddingTop: 10,
        paddingBottom: 10
    },
    md: {
        backgroundColor: '#EBE9E6',
        color: '#004571',
        fontSize: 14,
        fontWeight: 'bold',
        paddingRight: 1,
        height: 42,
        boxSizing: 'border-box',
        paddingTop: 10,
        paddingBottom: 10
    },
    lg: {
        backgroundColor: '#EBE9E6',
        color: '#004571',
        fontSize: 18,
        fontWeight: 'bold',
        paddingRight: 1,
        height: 42,
        boxSizing: 'border-box',
        paddingTop: 10,
        paddingBottom: 10
    },
    cell: {
        backgroundColor: '#F8F7F6',
        fontSize: 12,
        paddingRight: 12,
        paddingTop: 10,
        paddingBottom: 10
    },
    cell2: {
        backgroundColor: '#F8F7F6',
        fontSize: 9,
        paddingRight: 12,
        paddingTop: 10,
        paddingBottom: 10
    },
    table: {
        borderRadius: 4,
        overflow: 'hidden',
        marginTop: 16
    },
    row: {
        '&.unread td': {
          fontWeight: 'bold'
        },
        [theme.breakpoints.down('sm')]: {
          display: 'flex',
          flexDirection: 'column'
        }
    },
}));

const StyledTableCell = withStyles(theme => ({
    head: {
        backgroundColor: '#EBE9E6',
        color: '#004571',
        fontSize: 11,
        fontWeight: 'bold',
        paddingRight: 1,
        paddingLeft: 12,
        height: 42,
        boxSizing: 'border-box',
        paddingTop: 10,
        paddingBottom: 10
    }
  }))(TableCell);

export default useStyles;

export {StyledTableCell};
