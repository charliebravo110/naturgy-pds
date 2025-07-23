import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
    container2: {
        backgroundColor: '#F8F7F5',
        padding: 30,
        borderRadius: 10,
        marginTop: 40
    },
    legendItemContainer: {
        justifyContent: 'flex-start'
    },
    label2: {
        color: '#777',
        padding: 5,
        [theme.breakpoints.only('xs')]: {
            marginTop: 2
        }
    },
    labelTitle: {
        marginRight: 10,
        marginLeft: 10,
        color: 'rgba(0, 69, 113, 1)',
        fontWeight: 'bold'
    },
    supText: {
        marginRight: 10,
        marginLeft: 10,
        marginBottom: 10,
        fontSize: 13,
        color: '#777',
        fontWeight: 'bold'
    },
    whiteTextRed: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#d3222a',
        color: '#ffffff',
        borderRadius: 10,
        fontSize: 11,
        textAlign: 'center'
    },
    whiteTextRed2: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#d3222a',
        color: '#ffffff',
        borderBottomLeftRadius: 10,
        borderTopLeftRadius: 10,
        fontSize: 11,
        textAlign: 'center'
    },
    whiteTextOrange: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e57200',
        color: '#ffffff',
        borderRadius: 10,
        fontSize: 11,
        textAlign: 'center'
    },
    whiteTextYellow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#edab46',
        color: '#ffffff',
        borderRadius: 10,
        fontSize: 11,
        textAlign: 'center'
    },
    whiteTextYellow2: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#edab46',
        color: '#ffffff',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        fontSize: 11,
        textAlign: 'center'
    },
    whiteTextGreen: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#bfbf60',
        color: '#ffffff',
        borderRadius: 10,
        fontSize: 11,
        textAlign: 'center'
    },
    whiteTextDarkGreen: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#5fad83',
        color: '#ffffff',
        borderRadius: 10,
        fontSize: 11,
        textAlign: 'center'
    },
    whiteTextBlue: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#009aa6',
        color: '#ffffff',
        borderRadius: 10,
        fontSize: 11,
        textAlign: 'center'
    },
    whiteTextGrey: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(191, 184, 174, 1)',
        color: '#ffffff',
        borderRadius: 10,
        fontSize: 11,
        textAlign: 'center',
        paddingRight: 8.5,
        paddingLeft: 8.5
    },
    whiteTextGrey2: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(191, 184, 174, 1)',
        color: '#ffffff',
        borderRadius: 10,
        fontSize: 11,
        textAlign: 'center'
    }
}))

export default useStyles
