import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
    container1: {
        marginTop: 50
    },
    container2: {
        marginTop: 30,
        marginBottom: 10
    },
    container2a: {
        justifyContent: 'flex-end'
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
    title: {
        paddingBottom: 20,
        fontSize: 36,
        color: 'rgba(0, 69, 113, 1)',
        textAlign: 'center'
    },
    subTitle: {
        paddingBottom: 20,
        fontSize: 30,
        color: 'rgba(0, 69, 113, 1)',
        textAlign: 'center'
    },
    title1: {
        marginTop: 50,
        paddingBottom: 20,
        fontSize: 20,
        color: 'rgba(0, 69, 113, 1)',
        textAlign: 'left'
    },
    input3: {
        fontSize: '18px',
        textAlign: 'left',
    },
    input4: {
        fontSize: '18px',
        textAlign: 'left',
        color: 'rgba(0, 69, 113, 1)',
    },
    separator: {
        backgroundColor: '#E3E6E8',
        height: '1px',
        width: '100%',
        margin: '1rem auto 1rem auto'
    },
    textoAveria: {
        justifyContent: 'flex-start',
        color: 'rgba(0, 69, 113, 1.0)',
        fontSize: '18px',
        marginTop: '10px',
        [theme.breakpoints.up('sm')]: {
            height: '28px',
            display: 'flex',
            alignItems: 'flex-end'
        }
    },
    questionContainer: {
        marginBottom: '1rem',
      },
}));

export default useStyles;
