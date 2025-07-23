import { blue, lightBlue } from '@material-ui/core/colors';
import colors from '../../../assets/colors/colors';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    resumebox: {
        backgroundColor: '#F2F5F8',
        padding: '1.3rem 1.3rem 0.5rem 1.3rem',
    },
    container: {
        padding: '20px 0',
        marginTop: 126,
    },
    
    maxWidthForBigScreens: {
        minWidth: '100%',
        maxWidth: '100%',
    },
    icon: {
        marginRight:'5px',
        width: 20
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
        margin: '0.8em auto 1.3rem auto',
        '& span': {
            color: blue,
            fontWeight: 'bold',
        },
    },

    codeLabel: {
        color: '#555555',
        '& span': {
            fontSize: '0.9rem',
        },
    },

    code: {
        textAlign: 'center',
        margin: '1.1rem auto 1.5rem auto',

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
            marginLeft: '1.2rem',
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

    descriptionLabel:{
        // padding: '1rem 0.4rem 1rem 1.3rem',
        fontWeight: 'bold',
        justifyContent:'flex-end',
        alignItems:'center',
        display:'flex',
        color: colors.primary,
    },

    inputValue: {
        fontSize: '0.9rem',
        color: '#6a6a6a',
        justifyContent:'flex-start',
        alignItems:'center',
        display:'flex'
    },

    remark: {
        color: '#6a6a6a',
        padding: '1rem 0',

        '& h4': {
            fontSize: '0.9rem',
            color: colors.primary,
            fontWeight: 100,
            margin: '1rem 1rem 1rem 0rem',
        },

        '& span': {
            fontSize: '0.9rem',
            marginTop: '0.5rem',
        },
    },

    button: {
        marginTop: '4rem',
    },

    address: {
        padding: '1rem 1.3rem',
    },

    cont: {
        width: '100%'
    },
    
    item: {
        display: 'flex',
        alignContent: 'center',
        // justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flexBasis:'content',
        '& *' : {
            marginLeft: '2px'
        },
        '& h5' : {
            marginLeft: '0'
        }
    },
    h5:{
        color:'#004571',
        fontWeight:'bold',    
        fontSize:'0.83em'      
    },
    item_1: {
        justifyContent: 'center'
    },
    item_resume: {
        display: 'flex',
        alignContent: 'center',
        // justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        '& *' : {
            marginLeft: '2px'
        },
        '& h5': {
            color: '#004571',
            marginLeft: '0'
        },

    },
    centeredItem:{
        '& *':{
            marginLeft: 0,
            margin: 0,
            boxSizing: 'border-box'
        },
        width: '100%',
        display: 'flex',
        alignItems: 'flex-start',
        '& span':{
            width: '50%',
            '&:first-child': {
                textAlign: 'right',
            },
            '&:last-child': {
                paddingLeft: '4px',
                textAlign: 'left',
            }
        }
    },
    imgQuote: {
        '& span:last-child': {
            paddingTop: '8px'
        }
    },
    bkg: {
        border: '2px solid #f0eeec',
        backgroundColor: '#F7F7F7',
        padding: '20px',
        justifyContent: 'space-between',
        [theme.breakpoints.down('sm')]: {
            paddingLeft: '15px',
            paddingRight: '15px'
        }
    },
    bkg_: {
        border: '2px solid #f0eeec',
        backgroundColor: '##f7fbfe',
        padding: '20px',
        justifyContent: 'space-between',
        [theme.breakpoints.down('sm')]: {
            paddingLeft: '15px',
            paddingRight: '15px'
        }
    },
    getMargin: {
        margin: '1rem',
    },
    item_2: {
        justifyContent: 'center'
    },
    item_3: {
        justifyContent: 'end'
    },
    flex: {
        '& div': {
            flexBasis:'content'
        },
    }
}));

export default useStyles;
