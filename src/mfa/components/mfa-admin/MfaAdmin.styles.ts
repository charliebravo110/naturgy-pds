import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
    container: {
        padding: '20px 0',
        marginTop: 126,
    },
    maxWidthForBigScreens: {
        maxWidth: 1200,
    },
    headerTitle: {
        fontFamily: 'Arial, Helvetica, Arial, serif',
        fontSize: '36px',
        fontWeight: 100,
        color: 'rgba(0, 69, 113, 1.0)',
        textAlign: 'center',
        margin: '26px 30px 34px 30px',
    },
    searchContainer: {
        marginTop: '30px',
        border: 'solid 1.5px #eef3f6',
        borderRadius: 4,
        backgroundColor: '#f7fbfe',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column'
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
}));

export default useStyles;