import { makeStyles, withStyles } from '@material-ui/core/styles'
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel'
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

const useStyles = makeStyles((theme) => ({
	dialog: {
		'& .MuiPaper-root.MuiDialog-paper': {
			//width: '550px',
			heigth: '250px',
			border: '2px solid rgb(61, 114, 147)'
		}
	},
	dialogContainer: {
		position: 'relative',
		padding: 36
	},
	container: {
		padding: 36,
		overflow: 'hidden'
	},
	closeButton: {
		position: 'absolute',
		top: 18,
		right: 18,
		cursor: 'pointer'
	},
	text: {
		fontSize: 17,
		color: '#838383'
	},
	alertBlock: {
		[theme.breakpoints.only('xs')]: {
			textAlign: 'center'
		}
	},
	alertIcon: {
		height: '100%'
	},
	button: {
		marginTop: 25
	},
	title: {
		color: '#004571',
		fontSize: 24,
		fontWeight: 'bold',
		justifyContent: 'center',
		marginTop: 10
		//marginLeft: 24
	},
	subTitle: {
		color: '#004571',
		fontSize: 17,
		fontWeight: 'bold',
		marginTop: 10
		//marginLeft: 24
	},
	subTitleCups: {
		color: '#004571',
		fontSize: 17,
		fontWeight: 'bold',
		textAlign: 'end'
	},
	subTitle2: {
		color: '#004571',
		fontSize: 14,
		marginTop: 10
		//marginLeft: 24
	},
	topContainer: {
		border: 'solid 2px #E1E9EE',
		marginTop: 10
	},
	observationsContainer: {
		border: 'solid 1px #d2dee6',
		borderRadius: 4,
		marginTop: 10,
		fontSize: 12,
		padding: 10
	},
	inTopContainer: {
		padding: 10,
		fontSize: 14
	},
	inObsContainer: {
		//margin: 10
	},
	line: {
		borderTop: 'solid 1px #E1E9EE',
		width: '98%',
		margin: '0 auto 0 auto'
	},
	expansionPanelSummaryIcon: {
		width: 24
	},
	expansionPanelSummaryText: {
		color: '#004571',
		fontSize: 17,
		fontWeight: 'bold',
		marginLeft: 10,
		marginTop: 7,
		'& a': {
			textDecoration: 'none',
			fontWeight: 'normal',
			color: '#000000'
		  }
	},
	expansionPanelSummaryText2: {
	  fontSize: 17,
	  marginTop: 7,
	  '& a': {
		textDecoration: 'none',
		fontWeight: 'normal',
		color: '#000000'
	  }
	},
	expansionContainer: {
		marginTop: 20
	},
	buttonContainer: {
		justifyContent: 'center'
	},
	table: {
		margin: '2rem auto auto auto',
	},
	lockBox: {
		display: 'inline-flex',
		width: 'auto',
		alignItems: 'center',
		//padding: '8px 20px',
		borderRadius: 4,
		textAlign: 'center'
	},
	lockIcon: {
		height: 18,
		paddingRight: 18
	},
	tooltip: {
		fontSize: 14,
		color: '#004571',
		textDecoration: 'underline'
	}
}))

const ExpansionPanel = withStyles({
	root: {
		width: '100%',
		border: '1px solid #E1E9EE',
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
		'&$expanded': {
			minHeight: 56
		},
		'&:not($expanded)': {
			borderBottom: 0
		},
		'&.colored': {
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
		display: 'block'
		//padding: '45px',
		//paddingRight: 45,
		//paddingLeft: 45
	},
}))(MuiExpansionPanelDetails)

export default useStyles

export {
	ExpansionPanel,
	ExpansionPanelSummary,
	StyledExpandMoreIcon,
	ExpansionPanelDetails
}