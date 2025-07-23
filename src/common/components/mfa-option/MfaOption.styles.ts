import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: 24,
    color: 'rgba(0, 69, 113, 1)'
  },
  text: {
    fontSize: 16
  },
  textBold: {
    fontSize: 16,
    color: 'rgba(0, 69, 113, 1)',
    fontWeight: 600,
    minWidth: '280px'
  },
  titleMore: {
    fontSize: 24,
    color: 'rgba(0, 69, 113, 1)',
    display: 'flex'
  },
  textColor: {
    fontSize: 16,
    color: 'rgba(0, 69, 113, 1)',
    marginBottom: '1rem'
  },
  link: {
    fontSize: 14,
    margin: '0 0 0 0.5rem',
    cursor: 'pointer',
    color: '#0066CC',
    '&:hover': {
      color: '#6ea8e2'
    }
  },
  mfaContainer: {
    marginTop: 16,
    [theme.breakpoints.up('sm')]: {
      padding: '0px 0 10px 56px',
      marginLeft: 8
    },
    [theme.breakpoints.down('sm')]: {
      padding: '0 16px'
    }
  },
  mfaBackgroundColor: {
    backgroundColor: 'rgba(191, 184, 174, 0.1)',
    marginRight: '2rem',
    display: 'flex',
    padding: '1rem',
    '@media (max-width:760px)': {
      marginRight: '0rem',
    }
  },
  imageContainer: {
    alignItems: 'baseline',
    justifyContent: 'center',
    display: 'flex',
    '@media (max-width:760px)': {
      display: 'none'
    }
  },
  message: {
    fontSize: 16,
    color: 'rgba(0, 69, 113, 1)',
    backgroundColor: 'rgba(0, 69, 113, 0.05)',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem',
    '& img': {
      height: '20px',
      margin: '0 10px'
    }
  },
  buttons: {
    gap: '1rem'
  },
  modalContainer: {
    outline: 'none'
  },
  closeButton: {
    position: 'absolute',
    top: 18,
    right: 18,
    cursor: 'pointer'
  },
  modalText: {
    textAlign: 'center',
    marginBottom: 48,
    '& img': {
      height: '50px'
    }
  },
  info: {
    paddingLeft: 4,
    color: '#838383'
  },
  mfaCheck: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
   '@media (max-width:760px)': {
      flexDirection: 'column',
      alignItems: 'flex-start'
    }
  },
  mfaCheckText: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  },
  mfaDetailContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflow: 'scroll'
  },
  dialog: {
		'& .MuiPaper-root.MuiDialog-paper': {
			width: 780,
			border: '2px solid rgb(61, 114, 147)'
		},
		'& .MuiDialogContent-root': {
			minHeight: 160,
			padding: 36,
			overflow: 'hidden'
		},
    '@media (max-width:760px)': {
      '& .MuiDialogContent-root': {
        minHeight: 160,
        padding: 36,
        overflow: 'scroll'
      },
    }
	},
  body : {
		color: '#696969',
    textAlign: 'center',
    marginBottom: '1rem'
	},
  dialogTitle: {
    fontSize: 24,
    color: 'rgba(0, 69, 113, 1)',
    marginBottom: '1rem'
  },
  buttonDetail: {
		marginTop: 24
	},
}))

export default useStyles
