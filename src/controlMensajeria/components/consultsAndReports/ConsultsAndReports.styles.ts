import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    container: {
        padding: '20px 0',
        marginTop: 126,
    },
    maxWidthForBigScreens: {
		[theme.breakpoints.up('sm')]: {
			maxWidth: 1200
		}
    },
    headerTitle: {
        fontFamily: 'Arial, Helvetica, Arial, serif',
        fontSize: '36px',
        fontWeight: 100,
        color: 'rgba(0, 69, 113, 1.0)',
        textAlign: 'center',
        margin: '26px 30px 34px 30px',
    },
    icon: {
        width: 18
    },
    subContainer: {
        //padding: '2.2rem',
        marginTop: 20,
        //boxShadow: '0px 0px 1px 1px ' + colors.lighterBlue,
        //'-moz-box-shadow': '0px 0px 1px 1px ' + colors.lighterBlue,
        //'-webkit-box-shadow': '0px 0px 1px 1px ' + colors.lighterBlue,
        //backgroundColor: '#f7fbfe'
    }
}));

export default useStyles;
