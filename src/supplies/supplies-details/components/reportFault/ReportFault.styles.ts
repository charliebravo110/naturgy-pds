import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
    container: {
        position: 'relative',
        margin: '0 auto',
        [theme.breakpoints.up('md')]: {
            marginTop: 20
        },
        [theme.breakpoints.down('sm')]: {
            padding: 2,
            marginTop: 0
        }
    },
    container1: {
        marginTop: 50
    },
    container2: {
        marginTop: 30
    },
    container2a: {
        marginTop: 30,
        justifyContent: 'flex-end'
    },
    title: {
        paddingBottom: 20,
        fontSize: 36,
        color: 'rgba(0, 69, 113, 1)',
        justifyContent: 'center'
    },
    subTitle: {
        paddingBottom: 20,
        fontSize: 24,
        color: 'rgba(0, 69, 113, 1)',
        justifyContent: 'center'
    },
    titleB: {
        [theme.breakpoints.up('md')]: {
            paddingBottom: 20
        },
        [theme.breakpoints.down('sm')]: {
            paddingBottom: 0
        },
        textAlign: 'center',
        //paddingRight: 191,
        fontSize: 36,
        color: 'rgba(0, 69, 113, 1)'
    },
    title1: {
        marginTop: 50,
        paddingBottom: 20,
        fontSize: 20,
        color: 'rgba(0, 69, 113, 1)',
        textAlign: 'left'
    },
    input2: {
        fontSize: '18px',
        color: 'rgba(0, 69, 113, 1.0)',
        marginTop: 25,
        textAlign: 'center'
    },
    input3: {
        fontSize: '18px',
        textAlign: 'left'
    },
    description: {
        fontSize: '18px',
        marginTop: 50,
        color: '#555555',
        lineHeight: '20px',
        textAlign: 'center'
    },
    cuadroTexto: {
        position: 'relative',
        textAlign: 'center',
        padding: 40,
        border: 'solid 1px #E1E9EE',
        borderRadius: 4,
        marginTop: 50
    },
    cuadroTexto1: {
        textAlign: 'center',
        padding: 40,
        border: 'solid 1px #E1E9EE',
        borderRadius: 4,
        marginTop: 50
    },
    icon: {
        position: 'relative',
        alignContent: 'center',
        width: 64
    },
    iconFirst: {
        width: 50,
        alignContent: 'center'
    },
    textEnd: {
        color: '#555555',
        textAlign: 'right',
        fontSize: '18px'
    },
    text: {
        marginTop: 20
    },
    text1: {
        marginTop: 30
    },
    text2: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'rgba(0, 69, 113, 1)',
        fontSize: '20px',
        marginTop: 30
    },
    closeButton: {
        //marginTop: 10,
        fontSize: '20px',
        marginLeft: 25,
        padding: '4px 0'
    },
    closeIcon: {
        top: 14,
        right: 14,
        width: 14
    },
    noItems: {
        textAlign: 'center',
        justifyContent: 'center',
        '& .row': {
            display: 'block',
            textAlign: 'center',
            marginTop: 24
        },
        '& .title': {
            color: '#004571',
            fontSize: 18
        },
        '& .description': {
            color: '#777'
        },
        '& .buttons': {
            justifyContent: 'center',
            marginTop: 36
        }
    },
    dialog: {
        '& .MuiPaper-root.MuiDialog-paper': {
            width: 700,
            border: '2px solid rgb(61, 114, 147)'
        },
        '& .MuiDialogContent-root': {
            padding: 48
        }
    },
    dialogContainer: {
        position: 'relative',
        padding: 36
    },
    alertBlock: {
        [theme.breakpoints.only('xs')]: {
            textAlign: 'center'
        }
    },
    alertIcon: {
        height: '175%'
    },
    maxWidthForBigScreens: {
        maxWidth: 1200,
        width: '100%'
    },
    link: {
        fontSize: 12,
        color: '#0066CC',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        cursor: 'pointer'
      }
}))

export default useStyles
