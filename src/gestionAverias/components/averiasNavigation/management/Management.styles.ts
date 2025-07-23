import { makeStyles, withStyles } from '@material-ui/core/styles'
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel'
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import colors from '../../../../assets/colors/colors';

const useStyles = makeStyles((theme) => ({

	expansionPanelSummaryContent: {
		[theme.breakpoints.down('sm')]: {
			display:'initial',
			flexGrow:'initial'
		}
	  },

	  expansionPanelHeight: {
		height:'auto'
	  },

	container: {
		[theme.breakpoints.down('sm')]: {
			display:'block'
		}
	},
	table: {
		margin: '2rem auto auto auto',
	},

    height: {
		[theme.breakpoints.down('sm')]: {
			height:'42%'
		}
	},

	dialog: {
		'& .MuiTableSortLabel-icon': {
			width: 700,
			border: '2px solid rgb(61, 114, 147)'
		}
	},

	inputsArea: {
		'-webkit-box-shadow': '0px 0px 3px 1px rgba(207,205,207,1)',
		'-moz-box-shadow': '0px 0px 3px 1px rgba(207,205,207,1)',
		boxShadow: '0px 0px 3px 1px rgba(207,205,207,1)',
		[theme.breakpoints.up('sm')]: {
			'-webkit-box-shadow': 'none',
			'-moz-box-shadow': 'none',
			boxShadow: 'none'
		}
	},

	inputTitle: {
		width: '100%',
		justify: 'flex-start',
		color: 'rgba(0, 69, 113, 1.0)',
		fontSize: '0.8rem',
		marginTop: '10px',
		marginBottom: '5px',
		[theme.breakpoints.up('sm')]: {
			height: '28px',
			display: 'flex',
			alignItems: 'flex-end'
		}
	},

	titleContainer: {
		paddingBottom: 20,
		borderBottom: '1px solid ' + colors.lighterBlue
	},

	searchTitle: {
		fontSize: 14,
		float: 'left',
		color: colors.primary,
		fontWeight: 'bold'
	},

	loadingContainer: {
		margin: 'auto auto auto 1rem',
	},

	loadingText: {
		color: '#004571',
		fontWeight: 600,
		margin: 'auto auto auto 0.3rem',
	},

	loadingImg: {
		width: '2.2rem',
		verticalAlign: 'middle'
	},
	button: {
		width: 80,
		height: 20,
		fontSize: 14,
		position: 'relative',
		backgroundColor: '#004571',
		color: '#FFF',
		padding: '7px 12px 9px 15px',
		marginTop: '14px',
		borderRadius: '4px',
		cursor: 'pointer',
	},
	buttons: {
		padding: 20
	},
	cancelButton: {
		width: 80,
		height: 20,
		fontSize: 14,
		position: 'relative',
		backgroundColor: '#004571',
		color: colors.primary,
		padding: '7px 12px 9px 15px',
		marginTop: '14px',
		borderRadius: '4px',
		cursor: 'pointer',
	},
	miniButton: {
		width: 50,
		height: 15,
		fontSize: 14,
		position: 'relative',
		backgroundColor: '#004571',
		color: '#FFF',
		padding: '3px 8px 5px 11px',
		marginTop: '5px',
		borderRadius: '4px',
		cursor: 'pointer',
	},
	searchImg: {
		width: 14,
		height: 14,
		padding: '5px 3px 0px 2px'
	},
	searchText: {
		position: 'relative',
		bottom: '1.5px'
	},
	input: {
		flex: '1 1 auto',

		'& input': {
			border: 'solid 1px ' + colors.lightBlue + '!important',
			borderRadius: '4px 4px 4px 4px',
			height: '12px',
		},

		'& fieldset': {
			display: 'none',
		},
	},
	inputV1: {
		width: '85%',
		fontSize: '14px',

		'& input, & .MuiSelect-selectMenu': {
			background: '#FFF',
			paddingTop: '15px',
			paddingBottom: '15px'
		}
	},
	inputV2: {
		width: '100%',
		fontSize: '14px',
		'& input, & .MuiSelect-selectMenu': {
			background: '#FFF',
			paddingTop: '15px',
			paddingBottom: '15px'
		}
	},
	input2: {
		width: '92.5%',
		fontSize: '14px',
		color: 'rgba(0, 69, 113, 1.0)',

		'& input, & .MuiSelect-selectMenu': {
			background: '#FFF',
			paddingTop: '15px',
			paddingBottom: '15px'
		}
	},
	input2a: {
		width: '85%',
		fontSize: '14px',
		color: 'rgba(0, 69, 113, 1.0)',

		'& input, & .MuiSelect-selectMenu': {
			background: '#FFF',
			paddingTop: '15px',
			paddingBottom: '15px'
		}
	},
	input3: {
		width: '90%',
		fontSize: '14px',
		color: 'rgba(0, 69, 113, 1.0)',

		'& input, & .MuiSelect-selectMenu': {
			background: '#FFF',
			paddingTop: '15px',
			paddingBottom: '15px'
		}
	},
	input4: {
		padding: '10px',
		'& input, & .MuiSelect-selectMenu': {
			background: '#FFF',
			paddingTop: '15px',
			paddingBottom: '15px'
		}
	},
	arrow: {
		float: 'right'
	},
	titleWrapper: {
		width: '100%',
		marginTop: 10
	},
	link: {
		paddingTop: 12,
		color: '#6ea8e2',
		textDecoration: 'underline',
		cursor: 'pointer'
	},
	expansionPanelSummaryIcon: {
		width: 24
	},
	expansionPanelSummaryText: {
		color: '#004571',
		fontSize: 17,
		fontWeight: 'bold',
		marginLeft: 10
	},
	expansionPanelDetailsTitle: {
		color: '#004571',
		fontWeight: 'bold',
	},
	expansionPanelDetailsValue: {
		marginTop: 6
	},
	navigation: {
		backgroundColor: '#f7fbfe'
	},
	tabs: {
		borderBottom: 0,
		'& button': {
			padding: '0 12px',
			marginRight: 12
		}
	},
	tab: {
		'&.MuiTab-root': {
			minWidth: '160px'
		},
		'&.Mui-selected': {
			fontWeight: 'bold'
		},
		'&:focus': {
			fontWeight: 'bold'
		},
	},
	views: {
		width: '100%',
		marginTop: 21,
		overflow: 'hidden !important',
		'& div[data-swipeable="true"]': {
			paddingTop: 1,
			overflow: 'hidden !important'
		},
		[theme.breakpoints.down('sm')]: {
			'& div[data-swipeable="true"]': {
				paddingTop: '0 !important',
			}
		}
	},
	badge: {
		paddingRight: '16px'
	},
	customBadge: {
		backgroundColor: '#CF0E11',
		color: '#FFF',
		fontSize: 11
	},
	filtrarPor: {
		textAlign: 'end',
		padding: 15,
		color: '#004571'
	},
	warnigsTitle: {
		paddingTop: 10
	},
    alertContainer: {
		textAlign: 'center',
		padding: 36
	},
    searchResultContainer: {
        backgroundColor: '#f7fbfe',
        margin: '20px 20px 20px 20px',
    },
	alertTitle: {
		color: '#004571',
		fontSize: 26,
		marginBottom: 24,
		marginTop: 10,
	},
	red: {
        background: '#ff0000',
        borderRadius: '0.8em',
        color: '#ffffff',
        display: 'inline-block',
        fontWeight: 'bold',
        //lineHeight: '0.8em',
        textAlign: 'center',
        width: '1.6em',
		height: '1.6em'
    },
}))

const ExpansionPanel = withStyles({
	root: {
		height:'auto',
		width: '100%',
		border: '1px solid #E1E9EE',
		borderRadius: 4,
		marginTop: 20,
		boxShadow: 'none',
		'&:before': {
			display: 'none',
		},
		'&:first-child': {
			marginTop: 0
		},
		'&$expanded': {
			marginTop: 20
		}
	},
	expanded: {},
})(MuiExpansionPanel)

const ExpansionPanelSummary = withStyles({
	root: {
		borderBottom: '1px solid #E1E9EE',
		minHeight: 56,
		backgroundColor: '#f7fbfe',
		'&$expanded': {
			minHeight: 56
		},
		'&:not($expanded)': {
			borderBottom: 0
		},
		'&.colored': {
			backgroundColor: '#F2F5F8',
			color: '#004571',
			padding: '0 72px'
		}
	},
	content: {
		'&$expanded': {

		},
	},
	expanded: {},
})(MuiExpansionPanelSummary)

const StyledExpandMoreIcon = withStyles({
	root: {
		fill: '#004571',
		fontSize: 32,
		pointerEvents: 'auto'
	}
})(ExpandMoreIcon)

const ExpansionPanelDetails = withStyles(theme => ({
	root: {
		//padding: '45px',
		paddingRight: 45,
		paddingLeft: 45,
		backgroundColor: '#f7fbfe',

		[theme.breakpoints.down('sm')]: {
			paddingRight: 20,
		paddingLeft: 20,
		}
	},
}))(MuiExpansionPanelDetails)

export default useStyles

export {
	ExpansionPanel,
	ExpansionPanelSummary,
	StyledExpandMoreIcon,
	ExpansionPanelDetails
}
