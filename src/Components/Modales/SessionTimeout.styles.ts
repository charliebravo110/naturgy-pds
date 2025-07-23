import { makeStyles } from '@material-ui/core/styles';

const useStyles_ = makeStyles((theme) => ({
	titleBorder: {
		borderColor: '#004571',
		borderBottomWidth: '2px',
		borderBottomStyle: 'solid',

		[theme.breakpoints.down('sm')]: {
			borderBottomWidth: '0px',
    }

	},
	spanTitle: {
		fontSize: '1.8em',
		width: '100%%',
		textAlign: 'center',
		color: '#004571',
		display: 'block',
		marginTop: '25px',
		'@media (max-width: 600px)': {
			fontSize: '1.4em',
        },
	},
	dialog: {
		'& .MuiPaper-root.MuiDialog-paper': {
			width: 780,
			border: '2px solid rgb(61, 114, 147)',
			borderRadius: '10px'
		},
		'& .MuiDialogContent-root': {
			minHeight: 160,
			padding: 20,
			overflow: 'auto'
		}
	},
	dialog_2: {
		'& .MuiPaper-root.MuiDialog-paper': {
			width: '80vw',
			border: '2px solid rgb(61, 114, 147)',
			borderRadius: '10px'
		},
		'& .MuiDialogContent-root': {
			minHeight: 160,
			padding: 36,
			overflow: 'hidden'
		}
	},
	container: {
		position: 'relative',
		textAlign: 'center',
		padding: 36,
		'& p': {
			fontSize: 14,
			'& a': {
				color: '#0066CC'
			}
		},
		overflow: 'auto'
	},
	closeButton: {
		position: 'absolute',
		top: 18,
		right: 18,
		cursor: 'pointer'
	},
	title: {
		color: '#004571',
		fontSize: 26,
		marginBottom: 24,
		marginTop: 10,
	},
	body: {
		color: '#696969'
	},
	textParagraph: {
		overflowY: 'auto',
		overflowX: 'hidden',
		maxHeight: 270
	},
	button: {
		margin: '10px'
	},
	_scroll: {
		overflow: 'scroll'
	}
}));

export default useStyles_;
