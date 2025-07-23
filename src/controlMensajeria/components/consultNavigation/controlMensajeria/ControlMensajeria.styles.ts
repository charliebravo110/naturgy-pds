import { makeStyles } from '@material-ui/core/styles'
import colors from '../../../../assets/colors/colors'

const useStyles = makeStyles((theme) => ({
	container: {
		padding: '20px 0',
    	//marginTop: 126,
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
		marginTop: 20
	},
	searcher: {
		justifyContent: 'flex-end',
		paddingRight: 8,
		paddingTop: 6,
		[theme.breakpoints.down('sm')]: {
			paddingRight: 0,
			paddingBottom: 14
		}
	},
	mobileFullWidth: {
		height: 47,
		[theme.breakpoints.down('sm')]: {
			width: '100%'
		}
	}
}));

export default useStyles;