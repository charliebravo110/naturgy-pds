import { makeStyles } from '@material-ui/core/styles'

import BackgroundDard from './../../../assets/img/background-manos-teclado-oscuro.png';

const useStyles = makeStyles((theme) => ({
    updateContainer: {
        padding: '20px 0',
        backgroundSize: '100% 100%',
        flexGrow: 1,
        backgroundImage: `url(${BackgroundDard})`
    },
    container: {
        padding: '28px 30px 44px',
        backgroundColor: 'white',
        maxWidth: 800
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
            marginBottom: '10px',
        }
    },
    button: {
        '@media (max-width:500px)': {
            width: '100%',
        }
    },
    buttons: {
        display: 'flex',
        justifyContent: 'space-around',
        marginTop: '2rem',
        '@media (max-width:500px)': {
            gap: '16px'
        }        
    },
    send: {
        marginBottom: '1.5rem',
        '@media (max-width:500px)': {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
        }
    },
    link: {
        cursor: 'pointer',
        color: '#004571',
        textDecoration: 'underline',
        '&:hover': {
            color: '#6ea8e2'
        }
    },
    icon: {
        height: '3.5rem'
    },
    formContainer : {
        padding: '28px 30px 44px',
        backgroundColor: 'white',
        maxWidth: 1200
    },
    registerContainer: {
        alignItems: 'start',
        margin: '10px 0'
    },
    tooltipContainer: {
        position: 'relative'
    },
    infoContainer: {
        display: 'flex',
        alignItems: 'center',
        '@media (max-width:600px)': {
            flexDirection: 'column-reverse'
        }
    },
    textField: {
        margin: 16,
        width: '85%'
    },
    privacyPolicy: {
        marginTop: 30,
        '& .MuiFormControlLabel-root': {
          marginLeft: 0
        }
    },
    privacyPolicyLabel: {
        marginLeft: 8
    },
    privacyPolicyLink: {
        color: '#0066CC',
        textDecoration: 'underline',
        cursor: 'pointer'
    },
    rightContent: {
        marginTop: 15
    },
    passwordStrengthMeter: {
        width: '85%'
    },
}))

export default useStyles
