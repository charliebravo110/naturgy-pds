import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
    box: {
        position: 'relative',
        padding: 15,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        border: 'solid 1px #E1E9EE',
        marginTop: 15,
        borderRadius: '8px'
    },
    container: {
        margin: 'auto',
        marginTop: 120,
        maxWidth: 1200,
        marginBottom: 120
    },
    titleCont: {
			padding: '0 15px',
			[theme.breakpoints.only('xs')]: {
					textAlign: 'center'
			}
    },
    options: {
        '& .MuiGrid-item.MuiGrid-grid-md-2': {
          maxWidth: '40%',
          flexBasis: '40%',
          [theme.breakpoints.down('sm')]: {
            maxWidth: '100%',
            flexBasis: '100%',
          }
        },
        '& .MuiGrid-item.MuiGrid-grid-md-3': {
					maxWidth: '60%',
					flexBasis: '60%',
					[theme.breakpoints.down('sm')]: {
						maxWidth: '100%',
						flexBasis: '100%',
					}
				}
    },
		optionsCont: {
			paddingRight: '30px',
			[theme.breakpoints.only('xs')]: {				
				paddingRight: '15px'
			}
		},
    bottomLine: {
        borderBottom: 'solid 1px #E1E9EE',
        marginTop: 20,
        marginBottom: 20
    },
    descriptions: {
        display: 'flex'
    },
    p: {
        color: '#696969',
        fontSize: 16
    },
    Link: {
        fontSize: 14,
        color: '#0066CC',
        marginTop: 20,
        alignItems: 'center',
        textDecoration: 'none',
        justifyContent: 'center',
        textAlign: 'center'
    },
    Linkcups: {
        color: '#1674D1',
        textDecoration: 'underline',
        cursor: 'pointer'
      },

    titleWelcome: {
        color: 'rgba(233, 124, 35, 1)',
        fontSize: 24,
        marginTop: 50
    },
    boxtitle: {
        paddingLeft: 30,
        paddingRight: 30
    },
    titleOpt: {
        color: 'rgba(0, 69, 113, 1)',
        fontSize: 36
    },
    titleSub: {
        color: 'rgba(0, 69, 113, 1)',
        fontSize: 24,
        textAlign: 'center'
    },
    titleSubSub: {
        color: 'rgba(0, 69, 113, 1)',
        fontSize: 16,
    },
    text: {
        color: '#696969',
        fontSize: 16,
        textAlign: 'center'
    },
    button: {
        marginLeft: 40,
        marginTop: 25
    },
    image: {
        padding: 38
    }
}))

export default useStyles