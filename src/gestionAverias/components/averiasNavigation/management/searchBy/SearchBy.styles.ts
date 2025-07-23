import { makeStyles, withStyles } from '@material-ui/core/styles'
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel'
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import colors from '../../../../../assets/colors/colors';
const useStyles = makeStyles((theme) => ({
	table: {
		margin: 'auto auto auto auto'
	},
	inputsArea: {
		'-webkit-box-shadow': '0px 0px 3px 1px rgba(207,205,207,1)',
		'-moz-box-shadow': '0px 0px 3px 1px rgba(207,205,207,1)',
		boxShadow: '0px 0px 3px 1px rgba(207,205,207,1)',
		[theme.breakpoints.up('sm')]: {
			'-webkit-box-shadow': 'none',
			'-moz-box-shadow': 'none',
			boxShadow: 'none'
		},
		[theme.breakpoints.down('sm')]: {
			justifyContent:'center'
		},
		[theme.breakpoints.down('sm')]: {
            justifyContent:'center'
        },
        [theme.breakpoints.down('sm')]: {
            '-webkit-box-shadow': 'none',
            '-moz-box-shadow': 'none',
            boxShadow: 'none'
        }
	},
	MuiExpansionPanel: {
        [theme.breakpoints.down('sm')]: {
            bottom:'35%'
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
	buttons: {
		padding: 20
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
		// Cambia la x para borrar el contenido del input
		// '& input[type="search"]::-webkit-search-cancel-button': {
		//     '-webkit-appearance': 'none',
		//     'appearance': 'none',
		//     'height': '10px',
		//     'width': '10px',
		//     'background-image': 'url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE2LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgd2lkdGg9IjEyMy4wNXB4IiBoZWlnaHQ9IjEyMy4wNXB4IiB2aWV3Qm94PSIwIDAgMTIzLjA1IDEyMy4wNSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTIzLjA1IDEyMy4wNTsiDQoJIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPHBhdGggZD0iTTEyMS4zMjUsMTAuOTI1bC04LjUtOC4zOTljLTIuMy0yLjMtNi4xLTIuMy04LjUsMGwtNDIuNCw0Mi4zOTlMMTguNzI2LDEuNzI2Yy0yLjMwMS0yLjMwMS02LjEwMS0yLjMwMS04LjUsMGwtOC41LDguNQ0KCQljLTIuMzAxLDIuMy0yLjMwMSw2LjEsMCw4LjVsNDMuMSw0My4xbC00Mi4zLDQyLjVjLTIuMywyLjMtMi4zLDYuMSwwLDguNWw4LjUsOC41YzIuMywyLjMsNi4xLDIuMyw4LjUsMGw0Mi4zOTktNDIuNGw0Mi40LDQyLjQNCgkJYzIuMywyLjMsNi4xLDIuMyw4LjUsMGw4LjUtOC41YzIuMy0yLjMsMi4zLTYuMSwwLTguNWwtNDIuNS00Mi40bDQyLjQtNDIuMzk5QzEyMy42MjUsMTcuMTI1LDEyMy42MjUsMTMuMzI1LDEyMS4zMjUsMTAuOTI1eiIvPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPC9zdmc+DQo=)',
		//     'background-size': '10px 10px'
		// },
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
		marginTop: 10,
	
		[theme.breakpoints.down('sm')]: {
			marginTop: 30,
		}
	},
	link: {
		paddingTop: 12,
		color: '#6ea8e2',
		cursor: 'pointer'
	},
	expansionPanelSummaryIcon: {
		width: 24
	},
	expansionPanelSummaryText: {
		color: '#004571',
		fontSize: 17,
		fontWeight: 'bold',
		marginLeft: 24
	},
	expansionPanelDetailsTitle: {
		color: '#004571',
		fontWeight: 'bold',
	},
	expansionPanelDetailsValue: {
		marginTop: 6
	},
	searchContainer: {
		//padding: '32px 72px',
	},
	inputTitleError: {
		width: '100%',
		justify: 'flex-start',
		color: '#df5f65',
		fontSize: '0.8rem',
		marginTop: '10px',
		marginBottom: '5px',
		[theme.breakpoints.up('sm')]: {
			height: '28px',
			display: 'flex',
			alignItems: 'flex-end'
		}
	},
	inputV2Error: {
		width: '100%',
		fontSize: '14px',
		'& .MuiOutlinedInput-root': {
			'& fieldset': {
				borderColor: '#df5f65'
			},
			'&:hover fieldset': {
				borderColor: '#df5f65'
			},
			'&.Mui-focused fieldset': {
				borderColor: '#df5f65'
			}
		},
		'& input, & .MuiSelect-selectMenu': {
			background: '#FFF',
			paddingTop: '15px',
			paddingBottom: '15px'
		}
	},
	credentialError: {
		fontSize: '14px',
		color: '#df5f65',
	},
	inputV3: {
		width: '88%',
		//height: '92%',
		fontSize: '14px',
		textAlign: 'left',
		textOverflow: 'ellipsis',
		//paddingLeft: '14px',
		padding: '15px 14px',
		border: '1px solid ' + colors.lightBlue,
		borderRadius: '4px',
		outline: 'none',
		[theme.breakpoints.down('sm')]: {
			//height: '85% !important',
		}
	},
	inputV4: {
		width: '88%',
		//height: '49%',
		fontSize: '14px',
		textAlign: 'left',
		textOverflow: 'ellipsis',
		//paddingLeft: '14px',
		padding: '15px 14px',
		border: '1px solid ' + colors.lightBlue,
		borderRadius: '4px',
		outline: 'none',
		[theme.breakpoints.down('sm')]: {
			//height: '92% !important',
		}

		
	},
	inputV4Error: {
		width: '88%',
		//height: '49%',
		fontSize: '14px',
		textAlign: 'left',
		textOverflow: 'ellipsis',
		//paddingLeft: '14px',
		padding: '15px 14px',
		border: '1px solid ' + '#df5f65',
		borderRadius: '4px',
		outline: 'none',
	},
	inputV2Number: {
		width: '100%',
		fontSize: '14px',
		'& input, & .MuiSelect-selectMenu': {
			background: '#FFF',
			padding: '15px 10px 15px 11px'
		},
	},

	inputMargin: {
		[theme.breakpoints.down('sm')]: {
			marginTop: '38px'
		}
	},

	calendarWidth: {
		width:'100%'
	},

	sfdContainer: {
		width: '8.5%'
	},
	inputV2_SFD: {
		width: '95%',
		fontSize: '14px',
		'& input, & .MuiSelect-selectMenu': {
			background: '#FFF',
			padding: '15px 10px 15px 11px'
		},
	},
	buttonsContainer: {
		paddingTop: 16,
		marginBottom: 1
	},
	searchResult: {
		width: '100%',
		margin: '10px 0px',
		borderRadius: '2px',
		backgroundColor: '#f2f6f8',
		padding: '10px'
	},
	icon: {
		width: '20px',
		padding: '5px'
	},
	bluetext: {
		width: '95%',
		color: 'rgba(0, 69, 113, 1.0)',
		fontSize: '14px',
		paddingTop: '7px',
		paddingLeft: '5px'
	},
	closeButton: {
		width: '8.5px',
		cursor: 'pointer',
		paddingBottom: '8px'
	},
	searchResultContainer: {
		margin: '20px 0px 0px 20px'
	},
	alertContainer: {
		textAlign: 'center',
		padding: 36
	},
	alertTitle: {
		color: '#004571',
		fontSize: 26,
		marginBottom: 24,
		marginTop: 10,
	}
}));
const ExpansionPanel = withStyles({
	root: {
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
		display: 'block'
	},
}))(MuiExpansionPanelDetails)
export default useStyles;
export {
	ExpansionPanel,
	ExpansionPanelSummary,
	StyledExpandMoreIcon,
	ExpansionPanelDetails
}
