import { makeStyles, withStyles } from '@material-ui/core/styles'
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel'
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import colors from '../../../../../assets/colors/colors'

const useStyles = makeStyles((theme) => ({
    headerTitle: {
        fontFamily: 'Arial, Helvetica, Arial, serif',
        fontSize: '20px',
        fontWeight: 100,
        color: 'rgba(0, 69, 113, 1.0)',
        textAlign: 'center',
        // top right bottom left
        margin: '20px 20px 0px 20px',
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
    img:{
        marginRight:'10px',
    },

    innerArea: {
        border: '1px solid #E1E9EE',
        backgroundColor: '#F7F7F7',
        margin: '20px 20px 20px 20px',
        justifyContent: 'space-between'
        // gridAutoColumns: '50%'

    },
    borderArea: {
        border: '1px solid #E1E9EE',
    },
    innerContainer: {
        boxSizing: 'border-box',
        padding: '5px 30px 30px 30px',
        justifyContent: 'center',
    },
    readingItem: {
        textAlign: 'right',
        width: '100%',
        margin: '0',
        '& span:last-child': {
            marginLeft: '1em'
        }
    },
    rightJustifyContainer: {
        justifyContent: 'right',
        height: 'fit-content',
    },
    rightJustifyContainer2: {
        justifyContent: 'right',
        marginBottom: 10
    },
    buttonCont: {
        marginTop: '20px'
    },
    redBox: {
        backgroundColor: '#D3222A',
        textAlign: 'center',
        borderBottomLeftRadius: '15px',
        borderBottomRightRadius: '15px',
        paddingRight: '15px',
        paddingLeft: '15px',
        paddingBottom: '10px',
        paddingTop: '10px',
        fontFamily: 'Arial, Helvetica, Arial, serif',
        fontSize: '12px',
        color: 'white',
        marginRight: 10
    },
    greenBox: {
        backgroundColor: '#8E9300',
        textAlign: 'center',
        borderBottomLeftRadius: '15px',
        borderBottomRightRadius: '15px',
        paddingRight: '15px',
        paddingLeft: '15px',
        paddingBottom: '10px',
        paddingTop: '10px',
        fontFamily: 'Arial, Helvetica, Arial, serif',
        fontSize: '12px',
        color: 'white',
        marginRight: 10
    },
    greenBoxRight: {
        backgroundColor: '#8E9300',
        textAlign: 'center',
        borderBottomLeftRadius: '15px',
        borderBottomRightRadius: '15px',
        paddingRight: '15px',
        paddingLeft: '15px',
        paddingBottom: '10px',
        paddingTop: '10px',
        fontFamily: 'Arial, Helvetica, Arial, serif',
        fontSize: '12px',
        color: 'white',
        marginRight: '15px'
    },
    whiteRight: {
        backgroundColor: '#ffffff',
        textAlign: 'center',
        borderBottomLeftRadius: '15px',
        borderBottomRightRadius: '15px',
        paddingRight: '12px',
        paddingLeft: '12px',
        paddingBottom: '12px',
        paddingTop: '12px',
        fontFamily: 'FSEmeric',
        fontSize: '12px',
        color: '#D3222A',
        marginRight: '15px'
    },
    electroIcon: {
        display: 'flex',

        alignContent: 'center',
        alignItems: 'center',
    },
    leftjustifyContainer: {
        justifyContent: 'left'
    },
    innerDescriptionText: {
        margin: '5px 5px 0px 5px',
        fontSize: 14,
        float: 'left',
        color: colors.primary,
        fontWeight: 'bold'
    },
    innerPointInformation: {
        margin: '5px 5px 0px 5px',
        textAlign: 'left',
        fontSize: 14,
        color: colors.lightBlue,
        fontWeight: 'bold'
    },
    expansionPanelSummaryIcon: {
        width: 24,
    },
    expansionPanelSummaryText: {
        color: colors.primary,
        fontSize: 17,
        fontWeight: 'bold',
        marginLeft: 10
    },
    icon: {
        margin: '5px 0px 0px 5px',
        width: 15
    },
    iconContador: {
        // margin: '30px 0px -3px 20px',
        marginLeft: '30px',
        width: 30
    },
    arrowRight: {
        '& img': {
         width:'4%',
         marginRight:'6px'
        }
        
    },
    suministroConTelegestion: {
        marginTop: '20px',
        fontSize: 18,
        color: colors.primary,
        fontWeight: 'bold',
        textAlign: 'right',
        '&.mobile': {
            textAlign: 'left'
        }        
    },
    suministroErrorConexion: {
        marginTop: '8px',
        fontSize: 18,
        color: '#D3222A',
        fontWeight: 'bold',
        textAlign: 'right',
        
    },
    errorImg: {
        display: 'flex',
        '& img': {
            marginLeft: '10px',
            height: '100%',
        }
    },
    suministroSinTelegestion: {
        marginTop: '20px',
        fontSize: 18,
        color: '#D3222A',
        fontWeight: 'bold',
        textAlign: 'right',
    },
    numberContador:{
        marginTop: '20px',
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'right',
        
    },
    centerJustify: {
        justifyContent: 'center',
    },
    greenText: {
        fontSize: 18,
        color: '#8E9300',
        fontWeight: 'bold',
        textAlign: 'right',
        paddingTop: 10,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    redText: {
        justifyContent: 'right',
        fontSize: 18,
        color: '#D3222A',
        fontWeight: 'bold',
        textAlign: 'right',
    },
    button: {
        height: 20,
        fontSize: 13,
        position: 'relative',
        backgroundColor: '#004571',
        color: '#FFF',
        padding: '7px 12px 9px 15px',
        marginTop: '14px',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    LinearPorgressBar:{
        marginTop: '5px',
        marginBottom:'15px'
    },
    buttonsContainer: {
        paddingTop: '16px',
        marginBottom: '20px'
    },
    table: {
        margin: 'auto auto auto auto',
    },
    red: {          
        background: '#D3222A',
        borderRadius: '0.8em',
        color: '#ffffff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        fontWeight: 'bold',
        //lineHeight: '0.8em',
        width: '1.6em',
    },
    alignEnd: {
        textAlign: 'end',
        color: colors.lightBlue,
        padding: 10
    },
    width: {
        width: '100%',
        display: 'flex',
        marginLeft: '15px'
    }
}));

const ExpansionPanel = withStyles({
    root: {
        width: '100%',
        border: '1px solid #E1E9EE',
        borderRadius: 4,
        margin: 20,
        boxShadow: 'none',
        '&:before': {
            display: 'none',
        },
        '&:first-child': {
            marginTop: 0
        },
        '&$expanded': {
            margin: 20
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

const ExpansionPanelDetails = withStyles(theme => ({
    root: {
        //padding: '45px',
        paddingRight: 45,
        paddingLeft: 45,
        backgroundColor: '#f7fbfe',
        display: 'block'
    },
}))(MuiExpansionPanelDetails)

const StyledExpandMoreIcon = withStyles({
    root: {
        fill: '#004571',
        fontSize: 32,
        pointerEvents: 'auto'
    }
})(ExpandMoreIcon)

export default useStyles

export {
    ExpansionPanel,
    ExpansionPanelSummary,
    StyledExpandMoreIcon,
    ExpansionPanelDetails
}
