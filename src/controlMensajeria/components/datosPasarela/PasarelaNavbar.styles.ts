import { makeStyles } from '@material-ui/core/styles';
import colors from '../../../assets/colors/colors';

const styleClasses = makeStyles(() => ({
    tab: {
        color: colors.primary,
        fontSize: '0.875rem',
        padding: '0.8rem 2.5rem',
        borderColor: '#E97000',
        cursor: 'pointer',
        marginRight: 15,
        minWidth: '100px',
        textAlign: 'center'
    },

    selectedTab: {
        color: colors.primary,
        fontSize: '0.875rem',
        fontWeight: 600,
        borderBottom: '2px #E97000 solid',
        borderColor: '#E97000',
        padding: '0.8rem 2.5rem',
        cursor: 'pointer',
        marginRight: 15,
        minWidth: '100px',
        textAlign: 'center'
    },
    mainContainer: {
        marginLeft:'15%'
    }
}));

export default styleClasses;
