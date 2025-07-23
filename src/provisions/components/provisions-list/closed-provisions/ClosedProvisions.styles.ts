import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
	searcher: {
		justifyContent: 'flex-end',
		paddingRight: 8,
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
	box: {
		position: 'relative',
		padding: 32,
		border: 'solid 1px #E1E9EE',
		borderRadius: 4,
		marginTop: 20
	},
	paginationContainer: {
		margin: '20px 0'
	},
	dossierDateAdviseBox: {
		margin: '0 auto',
		marginTop: 20
	},
	dossierDateAdviseContainer: {
		backgroundColor: '#F2F5F8',
		marginBottom: 46,
		padding: '15px',
		borderRadius: '5px',
		fontSize: '16px'
	},
	infoIcon: {
		width: 35,
		[theme.breakpoints.down('sm')]: {
			margin: '0 auto',
			marginBottom: '15px',
			display: 'block'
		}
	},
	dossierDateAdviseTitle: {
		fontWeight: 'bold',
		color: '#256094',
		[theme.breakpoints.only('xs')]: {
			textAlign: 'center'
		}
	}
}))

export default useStyles