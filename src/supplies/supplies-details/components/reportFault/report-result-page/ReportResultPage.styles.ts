
import { makeStyles } from '@material-ui/core/styles';
import colors from '../../../../../assets/colors/colors';

const useStyles = makeStyles(() => ({
    container: {
        padding: '20px 0',
        marginTop: 126,
    },
    
    maxWidthForBigScreens: {
        minWidth: 1200,
        maxWidth: 1200,
    },

    headerTitle: {
        fontFamily: 'Arial, Helvetica, Arial, serif',
        fontSize: '36px',
        fontWeight: 100,
        color: 'rgba(0, 69, 113, 1.0)',
        textAlign: 'center',
        margin: '26px 30px',
    },

    title: {
        margin: 'auto auto 2.5rem auto',

        '& span': {
            fontSize: '1.2rem',
            color: colors.primary,
        },
    },

    subtitle: {
        margin: 'auto auto 1.2rem auto',

        '& span': {
            color: colors.primary,
        },
    },

    codeLabel: {
        '& span': {
            fontSize: '0.9rem',
        },
    },

    code: {
        textAlign: 'center',
        margin: '1.1rem auto 4.5rem auto',

        '& span': {
            fontSize: '0.9rem',
            color: colors.white,
            borderRadius: '2rem',
            backgroundColor: '#009AA6',
            padding: '0.5rem 1.7rem 0.5rem 1.7rem',
        },
    },

    question: {
        padding: '1rem 1.3rem',

        '& img': {
            width: '0.6rem',
        },

        '& span': {
            color: colors.primary,
            marginLeft: '0.5rem',
        }
    },

    separator: {
        backgroundColor: '#E3E6E8',
        height: '1px',
        width: '100%',
    },

    label: {
        fontSize: '0.9rem',
        color: colors.primary,
        fontWeight: 100,
    },

    inputValue: {
        fontSize: '0.9rem',
        marginTop: '0.5rem',
    },

    remark: {
        padding: '1rem 1.3rem',

        '& h4': {
            fontSize: '0.9rem',
            color: colors.primary,
            fontWeight: 100,
            margin: '0 0',
        },

        '& span': {
            fontSize: '0.9rem',
            marginTop: '0.5rem',
        },
    },

    button: {
        marginTop: '4rem',
    },
}));

export default useStyles;
