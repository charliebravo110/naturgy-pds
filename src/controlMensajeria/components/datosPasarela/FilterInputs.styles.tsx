import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
    searchBar: {
        backgroundColor:'#f7fbfe'
    },
    datepickerContainer: {
        marginTop: 10
    },
    codTitle: {
        fontSize: 16,
        color: 'rgba(0, 69, 113, 1.0)',
        marginBottom: 7
    },
    inputTitle: {
        color: 'rgba(0, 69, 113, 1.0)',
        fontSize: '14px',
        marginTop: '10px',
        paddingBottom: '10px',
        [theme.breakpoints.up('sm')]: {
            height: '28px',
            display: 'flex',
            alignItems: 'flex-end'
        }
    },
    inputContv1: {        
        [theme.breakpoints.only('xs')]: {
            marginTop: '15px'
        },
        '&.padding1':{
            [theme.breakpoints.up('sm')]: {
                paddingRight: '15px'
            }
        }
    },
    inputTitle2: {
        color: 'rgba(0, 69, 113, 1.0)',
        fontSize: '14px',
        marginTop: '-10px',
        [theme.breakpoints.up('sm')]: {
            height: '28px',
            display: 'flex',
            alignItems: 'flex-end'
        }
    },
    inputTitleError: {
        color: '#df5f65',
        fontSize: '14px',
        marginTop: '10px',
        [theme.breakpoints.up('sm')]: {
            height: '28px',
            display: 'flex',
            alignItems: 'flex-end'
        }
    },
    input: {
        width: '100%',
        backgroundColor: '#FFF',
        '& input, & .MuiSelect-selectMenu': {
            background: '#FFF',
            paddingTop: '15px',
            paddingBottom: '15px'
        }
    },
    inputError: {
        width: '100%',
        backgroundColor: '#FFF',
        border: '1px solid ' + '#df5f65',
        '& input, & .MuiSelect-selectMenu': {
            background: '#FFF',
            paddingTop: '15px',
            paddingBottom: '15px'
        }
    },
    inputV4Error: {
        width: '95%',
        height: '49%',
        fontSize: '14px',
        textAlign: 'left',
        textOverflow: 'ellipsis',
        paddingLeft: '14px',
        border: '1px solid ' + '#df5f65',
        borderRadius: '4px',
        outline: 'none',
    },
    datepickerInput: {
        width: 230,
    },
    link: {
        color: '#6ea8e2',
        textDecoration: 'underline',
        cursor: 'pointer'
    },
    filterContainer:{
        justifyContent:'space-between'
    },
    buttonContainer: {
        paddingTop:'20px',
        justifyContent: 'flex-start',
    },
    marginButton: {
        marginTop: '20px',
    },
    credentialError: {
        fontSize: '14px',
        color: '#df5f65',
    },
    buttonTopMargin: {
        marginTop: '10px'
    },
    resetCont: {
        display: 'flex',
        alignItems: 'center'
    }
}));

export default useStyles