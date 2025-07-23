import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        [theme.breakpoints.down('md')]: {
            minWidth: '100%'
        },
        [theme.breakpoints.down('sm')]: {
            marginTop: 10,
        }
    },
    dossierDateAdviseBox: {
        margin: '0 auto'
    },
    dossierDateAdviseTitle: {
        color: '#256094',
        textAlign: 'center',
        [theme.breakpoints.only('xs')]: {
            textAlign: 'center'
        }
    },
    infoIcon: {
        width: 35,
        [theme.breakpoints.down('sm')]: {
            margin: '0 auto',
            marginBottom: '15px',
            display: 'block'
        }
    },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: 10
    },
    title2: {
        fontSize: '18px',
        padding: 15
    },
    text: {
        paddingRight: 20,
        paddingLeft: 20
    },
    textInfo: {
        marginTop: 50,
        textAlign: 'center',
        [theme.breakpoints.down('sm')]: {
            marginTop: 10,
        }
    },
    imageContainer: {
        paddingBottom: 15
    },
    backcolor : {
        backgroundColor: '#F2F1EF'
    },
    alerticon: {
        textAlign: 'center',
        padding: 20
    }
}))

export default useStyles