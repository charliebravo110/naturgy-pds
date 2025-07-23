import { makeStyles, withStyles } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell';

const useStyles = makeStyles((theme) => ({
	container: {
		padding: '20px 0',
		marginTop: 126,
	},
	styleEstado:{
		display:'flex',
		justifyContent: 'left'
	},
	styleEstado2:{
		display:'block',
		justifyContent: 'center'
	},
	maxWidthForBigScreens: {
		[theme.breakpoints.up('sm')]: {
			maxWidth: 1200
		}
	},
	headerTitle: {
		fontFamily: 'Arial, Helvetica, Arial, serif',
		fontSize: '34px',
		textAlign: 'center',
		fontWeight: 100,
		color: 'rgba(0, 69, 113, 1.0)',
		//textAlign: 'center',
		margin: '26px 30px 34px 30px',
	},
	
	icon: {
		paddingRight: '5px',
		width: 18
	},

	iconV2: {
		height: 20
	},
	subContainer: {
		marginTop: 20,
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
	},
	inputsAreaWrapper: {
		marginBottom: '4%',
		[theme.breakpoints.up('sm')]: {
			padding: '20px',
			'-webkit-box-shadow': '0px 0px 3px 1px rgba(207,205,207,1)',
			'-moz-box-shadow': '0px 0px 3px 1px rgba(207,205,207,1)',
			boxShadow: '0px 0px 3px 1px rgba(207,205,207,1)'
		}
	},
	inputsArea: {
		background: 'white',
		'-webkit-box-shadow': '0px 0px 3px 1px rgba(207,205,207,1)',
		'-moz-box-shadow': '0px 0px 3px 1px rgba(207,205,207,1)',
		boxShadow: '0px 0px 3px 1px rgba(207,205,207,1)',
		padding: '20px',
		[theme.breakpoints.up('sm')]: {
			backgroundColor: 'white',
			'-webkit-box-shadow': 'none',
			'-moz-box-shadow': 'none',
			boxShadow: 'none'
		}
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
	badge: {
		paddingRight: '16px'
	},
	customBadge: {
		backgroundColor: '#CF0E11',
		color: '#FFF',
		fontSize: 11
	},
	inputTitle: {
		justify: 'flex-start',
		color: 'rgba(0, 69, 113, 1.0)',
		fontSize: '14px',
		marginTop: '20px',
		marginBottom: '5px'
	},
	button: {
		fontSize: 14,
		marginTop: '41px',
	},
	buttonContainerSearch: {
		justifyContent: 'center'	
	},
	buttonContainer: {
		textAlign: 'right',
		[theme.breakpoints.only('xs')]: {
			marginTop: '20px',
			textAlign: 'left',
		}
	},
	titleCont: {
		margin: '35px 0',
		[theme.breakpoints.up('sm')]: {
			justifyContent: 'space-between'
		}		
	},
	itemText: {
		color: '#64666A',
		display: 'flex',
		alignItems: 'center',
		fontSize: '18px',
		marginBottom: '1rem'
	},
	messagesTable: {
		width: '100%',
		borderRadius: 4,
		overflow: 'hidden',
		'& .MuiTableSortLabel-icon': {
			marginRight: 0,
			marginLeft: 0
		},
		'&.makeStyles-table': {
			margin: 'auto auto auto auto'
		}
	},
	headTableCell: {
		paddingRight: 30,
		'&.name': {
			paddingLeft: 0
		},
		'&.extra': {
			width: '11%'
		}
	},
	headTableCellFirst: {		
		paddingRight: 10,
		'&.name': {
			paddingLeft: 0
		},
		'&.extra': {
			width: '11%'
		},
		[theme.breakpoints.up('sm')]: {
			width: '22%',
		}
	},
	headTableCellSecond: {
		verticalAlign: 'middle',		
		paddingRight: 10,
		'&.name': {
			paddingLeft: 0
		},
		'&.extra': {
			width: '11%'
		},
		[theme.breakpoints.up('sm')]: {
			width: '17%',
		}
	},
	headTableCellDate: {
		width: '8%',
		paddingRight: 10,
		'&.name': {
			paddingLeft: 0
		},
		'&.extra': {
			width: '11%'
		}
	},
	headTableCellSendFirst: {		
		paddingRight: 30,
		'&.name': {
			paddingLeft: 0
		},
		'&.extra': {
			width: '11%'
		},
		[theme.breakpoints.up('sm')]: {
			width: '15%',
			//textAlign: 'center',
		}
	},
	headTableCellSendChannel: {		
		paddingRight: 30,
		'&.name': {
			paddingLeft: 0,
			width: '20px'
		},
		'&.extra': {
			width: '20px'
		},
		[theme.breakpoints.up('sm')]: {
			width: '20px',
			textAlign: 'center',
		}
	},
	headTableCellSendFirstCenter: {		
		paddingRight: 30,
		'&.name': {
			paddingLeft: 0
		},
		'&.extra': {
			width: '11%'
		},
		[theme.breakpoints.up('sm')]: {
			width: '15%',
			textAlign: 'center',
		}
	},
	headTableCellSend: {
		paddingRight: 30,
		'&.name': {
			paddingLeft: 0
		},
		'&.extra': {
			width: '11%'
		},
		[theme.breakpoints.up('sm')]: {
			width: '15%',
			textAlign: 'center',
		}
	},
	headTableCellSendV2: {
		paddingRight: '0px'
	},
	bodyTableCellSend: {		
		paddingRight: '0px',
		[theme.breakpoints.up('sm')]: {
			//textAlign: 'center',
		}
	},
	bodyTableCellSendColorGreen: {		
		padding: '5px',
		backgroundColor: 'green', 
		borderRadius: '5px',
		[theme.breakpoints.up('sm')]: {
			textAlign: 'center',
		}
	},
	bodyTableCellSendCenter: {		
		paddingRight: '0px',
		[theme.breakpoints.up('sm')]: {
			textAlign: 'center',
		}
	},
	bodyTableCellSendV2: {
		paddingRight: '0px',
		paddingLeft: '0px',
		[theme.breakpoints.up('sm')]: {
			textAlign: 'center',
		}
	},
	tableRow: {
		[theme.breakpoints.down('sm')]: {
			display: 'flex',
			flexDirection: 'column'
		}
	},
	tableBodyRow: {
		'&.disabled': {
			opacity: .7,
			filter: 'grayscale(1)'
		},
		[theme.breakpoints.down('sm')]: {
			display: 'flex',
			flexDirection: 'column'
		},
		backgroundColor: '#FFF00'
	},
	noResults: {
		height: 60,
		textAlign: 'center'
	},
	itemsPerPage: {
		justifyContent: 'flex-end',
		marginTop: 10,
		fontSize: 14,
		color: '#004571'
	},
	select: {
		borderRadius: 4,
		borderColor: '#004571',
		color: '#004571'
	},
	paginationContainer: {
		margin: '20px 0'
	},
	schedule: {
		color: '#004571'
	},
	floatLeft: {
		float: 'left'
	},
	floatLeftAndMargin: {
		float: 'left',
		marginTop: '1px',
		marginLeft: '6px'
	}
}));

const StyledTableCell = withStyles(theme => ({
	head: {
		backgroundColor: '#EBE9E6',
		color: '#004571',
		fontSize: 14,
		fontWeight: 'bold',
		paddingRight: 1,
		height: 42,
		boxSizing: 'border-box',
		paddingTop: 10,
		paddingBottom: 10
	},
	body: {
		backgroundColor: '#F8F7F6',
		fontSize: 12,
		paddingTop: 10,
		paddingBottom: 10
	}
}))(TableCell);

export default useStyles;

export { StyledTableCell }