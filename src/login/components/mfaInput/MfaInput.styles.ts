import { grey } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles'

import BackgroundDard from './../../../assets/img/background-manos-teclado-oscuro.png';

const useStyles = makeStyles((theme) => ({
    mfaContainer: {
        padding: '20px 0',
        backgroundSize: '100% 100%',
        flexGrow: 1,
        backgroundImage: `url(${BackgroundDard})`
    },
    container: {
        padding: '28px 30px 44px',
        backgroundColor: 'white',
        maxWidth: 1200
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
        flexWrap: 'nowrap'
    },
    title: {
        fontSize: 34,
        color: 'rgba(0, 69, 113, 1)',
        textAlign: 'center',
        marginBottom: '25px',
        '@media (max-width:500px)': {
            fontSize: 28,
            marginBottom: '0px',
        }
    },
    titleConfigure: {
        fontSize: 24,
        color: 'rgba(0, 69, 113, 1)',
        textAlign: 'center',
        marginBottom: '25px',
        fontWeight: 600,
        '@media (max-width:500px)': {
            fontSize: 28,
            marginBottom: '0px',
        }
    },
    titleError: {
        color: 'red',
        marginBottom: '2    rem'
    },
    subTitle: {
        fontSize: 28,
        color: 'rgba(0, 69, 113, 1)',
        textAlign: 'center',
        '@media (max-width:800px)': {
            fontSize: 25,
        },
        '@media (max-width:500px)': {
            fontSize: 16,
            marginTop: '1rem'
        }
    },
    subTitleError: {
        marginBottom: '3rem'
    },
    subTitleAdvice: {
        fontSize: 24,
        marginBottom: '1rem',
        color: 'rgba(0, 69, 113, 1)',
        textAlign: 'center',
        '@media (max-width:500px)': {
            fontSize: 16,
            marginTop: '1rem'
        }
    },
    subTitleConfigure: {
        fontSize: 20,
        marginBottom: '1rem',
        color: 'rgba(0, 69, 113, 1)',
        textAlign: 'center',
        '@media (max-width:500px)': {
            fontSize: 16,
            marginTop: '1rem'
        }
    },
    profileTitleConfigure: {
        fontSize: 18,
        marginBottom: '1rem',
        color: 'grey',
        textAlign: 'center',
        '@media (max-width:500px)': {
            fontSize: 14,
            marginTop: '1rem'
        }
    },
    buttonAdvice: {
        '@media (max-width:1550px)': {
            fontSize: '1em',
        },
        '@media (max-width:500px)': {
            width: '100%',
        }
    },
    imageContainer: {
        alignItems: 'baseline',
        justifyContent: 'center',
        display: 'flex',
        '@media (max-width:760px)': {
            display: 'none'
        }
    },
    button: {
        '@media (max-width:500px)': {
            width: '100%',
        }
    },
    button2: {
        color: 'rgba(0, 69, 113, 1)',
      },
    buttons: {
        display: 'flex',
        justifyContent: 'space-around',
        marginTop: '2rem',
        '@media (max-width:500px)': {
            gap: '16px'
        }
    },
    textField: {
        width: '60%',
        textAlign: 'center',
        '@media (max-width:500px)': {
            width: '100%',
        }
    },
    errorInput: {

    },
    send: {
        marginTop: '1.5rem',
        '@media (max-width:500px)': {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }
    },
    textInfo: {
        marginTop: '1.5rem',
        marginBottom: '1.5rem',
        fontSize: 18,
        textAlign: 'center',
        width: '100%'
    },
    textInfoDisabled: {
        marginTop: '1.5rem',
        marginBottom: '1.5rem',
        fontSize: 18,
        textAlign: 'center',
        width: '100%',
        color: 'grey'
    },
    inputSms: {
        display: 'flex',
        width: '100%'
    },
    largeInput: {
        width: '100%'
    },
    textColor: {
        fontSize: 19,
        width: '100%',
        color: 'rgba(0, 69, 113, 1)',
        marginBottom: '1rem'
    },
    link: {
        cursor: 'pointer',
        color: '#004571',
        textDecoration: 'underline',
        '&:hover': {
            color: '#6ea8e2'
        }
    },
    circle: {
        color: 'rgb(0, 69, 113)',
        position: 'absolute',
        zIndex: 1
    },
    circleBottom: {
        color: '#d3d0d0'
    },
    time: {
        fontSize: 34,
        color: 'rgb(0, 69, 113)'
    },
    timer: {
        margin: '1.5rem 0 1.5rem 0'
    },
    iconError: {
        height: '5rem'
    },
    iconErrorBlock: {
        height: '5rem',
        width: '5rem',
        marginBottom: '1rem'
    },
    mfaCheck: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px'
    },
    textBold: {
        fontSize: 16,
        color: 'rgba(0, 69, 113, 1)',
        fontWeight: 600
    },
    dialog: {
        '& .MuiPaper-root.MuiDialog-paper': {
            width: 600,
            border: '2px solid rgb(61, 114, 147)'
        }
    },
    closeButton: {
        position: 'absolute',
        top: 18,
        right: 18,
        cursor: 'pointer'
    },
    contentDialog: {
        paddingTop: 24
    },
    mfaBox: {
        border: '1px solid rgb(61, 114, 147)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px'
    }
}))

export default useStyles
