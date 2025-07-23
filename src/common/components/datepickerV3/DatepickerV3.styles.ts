import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
	s: {
		width: '100%',
		fontSize: 11,
	},
	m: {
		width: '100%',
		fontSize: 16
	},
	l: {
		width: '100%',
		fontSize: 18
	},
	container: {
		position: 'relative',
		margin: '6px 12px 0 0',
		backgroundColor: '#ffffff',
		'& .react-datepicker-popper[data-placement^="left"]': {
			marginTop: 30
		}
	},
	icon: {
		position: 'absolute',
		top: 12,
		right: 12,
		cursor: 'pointer',
		'& img': {
			width: 24
		}
	},
	iconS: {
		position: 'absolute',
		top: 10,
		right: 12,
		cursor: 'pointer',
		'& img': {
			width: 24
		}
	},

}))

export default useStyles;
