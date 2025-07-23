import { makeStyles } from '@material-ui/core/styles';
import colors from '../../../assets/colors/colors';

const styleClasses = makeStyles((theme) => ({
    tab: {
        color: colors.primary,
        fontSize: '0.8rem',
        border: '1px solid',
        borderColor: colors.lightBlue,
        padding: '0.8rem 2.5rem',
        cursor: 'pointer',
        marginRight: 15,
        minWidth: '100px',
        textAlign: 'center'
    },

    selectedTab: {
        color: colors.primary,
        fontSize: '0.8rem',
        fontWeight: 600,
        border: '2px solid',
        borderColor: colors.accent,
        padding: '0.8rem 2.5rem',
        cursor: 'pointer',
        marginRight: 15,
        minWidth: '100px',
        textAlign: 'center'
    },

    column: {

        display:'initial !important',
        [theme.breakpoints.up('sm')]: { 
            display: 'grid !important'
        },
        [theme.breakpoints.up('xs')]: { 
            display: 'grid !important'
        },
        [theme.breakpoints.up('md')]: { 
           display: 'inherit !important'
        }
        
        
    }
}));

export default styleClasses;
