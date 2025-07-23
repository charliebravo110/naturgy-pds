import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    container: {
        width: '100%',
        textAlign: 'left'
    },
    label: {
        color: '#004571',
        fontSize: 14,
        marginBottom: 8
    },
    characterCount: {
        backgroundColor: '#F3F7FB',
        width: 220,
        color: '#004571',
        fontSize: '13px',
        padding: '5px 8px',
        borderRadius: '0 0 4px 4px',
        textAlign: 'center'
    }
}));

export default useStyles;
