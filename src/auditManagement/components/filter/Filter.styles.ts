import { makeStyles } from '@material-ui/core/styles'
import colors from '../../../assets/colors/colors';

const useStyles = makeStyles((theme) => ({
    searchContainer: {
        marginTop: '30px',
        border: 'solid 1.5px #eef3f6',
        borderRadius: 4,
        backgroundColor: '#f7fbfe',
        padding: '20px'
    },
    blueTitle: {
        marginBottom: '15px',
        fontSize: '15px',
        fontWeight: 'bold',
        color: 'rgba(0, 69, 113, 1.0)'
    },
    bigTitle: {
        marginBottom: '15px',
        fontSize: '20px',
        color: 'rgba(0, 69, 113, 1.0)'
    },
    formTitle: {
        fontSize: '17px',
        color: 'rgba(0, 69, 113, 1.0)'
    },
    group: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '1.5rem',
        '@media (max-width:700px)': {
            display: 'block',
        }
    },
    buttonBlue: {
        backgroundColor: '#076acd',
        color: 'white',
        '&:hover': {
            backgroundColor: '#076acd',
            color: 'white',
        }
    },
    icon: {
        width: '23px',
        height: '18px',
        marginRight: '2px',
        float: 'left'
    },
    inputTitle: {
        justify: 'flex-start',
        color: 'rgba(0, 69, 113, 1.0)',
        fontSize: '14px',
        marginTop: '10px',
        marginBottom: '5px'
    },
    fields: {
        marginBottom: '15px'
    },
    inputHour: {
        backgroundColor: 'white'
    },
    consultCont: {
        marginTop: '25px',
        '& button' : {
            '@media (max-width:700px)': {
                width: '100%'
            }            
        }
    },
    inputV2: {
        width: '100%',
        fontSize: '14px',
        '& input, & .MuiSelect-selectMenu': {
            background: '#FFF',
            paddingTop: '15px',
            paddingBottom: '15px'
        }
    },
    userContainer: {
        marginTop: '15px'
    },
    searchButton: {
        fontSize: '14px',
        color: '#076acd',
        cursor: 'pointer'
    },
    updateIcon: {
        marginRight: '5px'
    },
    updateText: {
        '&:hover': {
            textDecoration: 'underline'
        }
    },
}));

export default useStyles;
