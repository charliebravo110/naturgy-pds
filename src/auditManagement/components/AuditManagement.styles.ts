import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    container: {
        padding: '20px 0',
    },
    maxWidthForBigScreens: {
        maxWidth: 1200,
    },
    orangeSubtitle: {
        marginBottom: '15px',
        fontSize: '22px',
        color: '#e57200',
        textAlign: 'center',
        '@media (max-width:700px)': {
            fontSize: '16px',
            marginBottom: '14px',
        }
    },
    lightSubtitle: {
        fontSize: '18px',
        color: '#64666a',
        textAlign: 'center',
        '@media (max-width:700px)': {
            fontSize: '14px',
        }
    },
    headerTitle: {
        fontFamily: 'Arial, Helvetica, Arial, serif',
        fontSize: '36px',
        fontWeight: 100,
        color: 'rgba(0, 69, 113, 1.0)',
        textAlign: 'center',
        margin: '26px 30px 34px 30px',
        '@media (max-width:700px)': {
            fontSize: '24px',
            margin: '14px',
        }
    }
}));

export default useStyles;
