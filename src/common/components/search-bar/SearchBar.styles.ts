import { makeStyles } from '@material-ui/core/styles';
import colors from '../../../assets/colors/colors';

const useStyles = makeStyles(() => ({
    container: {
        display: 'flex',
    },

    input: {
        flex: '1 1 auto',

        '& input': {
            border: 'solid 1px ' + colors.lightBlue + '!important',
            borderRadius: '4px 0 0 4px',
        },

        '& fieldset': {
            display: 'none',
        },
    },

    icon: {
        flex: '0 1 auto',

        color: '#FFFFFF',
        backgroundColor: '#004571',
        border: 'solid 1px #004571 !important',
        borderRadius: '0 4px 4px 0',

        cursor: 'pointer',
    },
    
    s: {
        '& $input': {
            '& input': {
                fontSize: '0.7rem',
                padding: '0.3rem 0.4rem',
            },
        },

        '& $icon': {
            '& img': {
                display: 'block',
                marginTop: '0.2rem',
                width: '0.9rem',
                padding: '0 0.5rem 0 0.5rem',
            },
        },
    },

    m: {
        '& $input': {
            '& input': {
                fontSize: '1rem',
                padding: '0.4rem 0.5rem',
            },
        },

        '& $icon': {
            '& img': {
                display: 'block',
                marginTop: '0.4rem',
                width: '1.1rem',
                padding: '0 0.8rem 0 0.8rem',
            },
        },
    },

    l: {
        '& $input': {
            '& input': {
                fontSize: '1rem',
                padding: '0.85rem 0.8rem',
            },
        },

        '& $icon': {
            '& img': {
                display: 'block',
                marginTop: '0.9rem',
                width: '1.1rem',
                padding: '0 0.9rem 0 0.9rem',
            },
        },
    },
}));

export default useStyles;
