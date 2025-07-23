import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
    container: {
        backgroundColor: '#F8F7F5',
        padding: 30,
        borderRadius: 10,
        marginTop: 40
    },
    section: {
        marginLeft: '38px',
        marginTop: '5px'
    },
    title: {
        fontSize: 20,
        color: 'rgba(0, 69, 113, 1)'
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(0, 69, 113, 1)'
    },
    grayText: {
        fontSize: 14,
        margin: '12px 0px',
        color: '#777'
    },
    lightIcon: {
        top: 25,
        right: 25,
        width: 25
    }
}))

export default useStyles
