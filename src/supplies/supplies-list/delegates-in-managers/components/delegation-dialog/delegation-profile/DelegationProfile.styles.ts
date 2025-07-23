import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
    modalContainer: {
        border: '2px solid rgb(61, 114, 147)',
        outline: 'none',
        minHeight: '60vh',
        maxHeight: '80vh'
    },
    info: {
        paddingLeft: 4,
        marginBottom: 30,
        color: '#555555'
    },
    label: {
        color: 'rgba(0, 69, 113, 1)',
        fontWeight: 'bold',
        marginBottom: 5
    },
    closeIcon: {
        cursor: 'pointer',
        position: 'absolute',
        top: 10,
        right: 10
    },
    button: {
        margin: 8,
        marginBottom: 40
    },
    returnButton: {
        color: '#004571',
        border: '1px solid #004571'
    },
    closeButton: {
        marginTop: -5,
        marginRight: -5,
        padding: '4px 0'
    },
    title: {
        fontSize: 36,
        color: 'rgba(0, 69, 113, 1)',
        textAlign: 'center',
        marginBottom: 20
    },
    subTitle: {
        fontFamily: 'Arial, Helvetica, Arial, serif',
        color: 'rgb(131, 131, 131)',
        textAlign: 'center',
        marginLeft: '10%',
        marginRight: '10%',
        marginBottom: '4%'
    },
    dateText: {
        color: 'rgba(0, 69, 113, 1)',
        fontSize: 14,
        marginTop: 10,
        marginBottom: 5
    }
}))


export default useStyles
