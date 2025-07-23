import { makeStyles, withStyles } from '@material-ui/core/styles'
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel'
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import colors from '../../../assets/colors/colors';

const useStyles = makeStyles((theme) => ({
    container: {
        padding: '20px 0',
        marginTop: 126,
    },
    inputsArea: {

    },
    itemText: {
        color: '#64666A',
        display: 'flex',
        alignItems: 'center',
        fontSize: '18px',
        marginBottom: '1rem'
    },
    maxWidthForBigScreens: {
        maxWidth: 1200,
    },
    searchContainer: {
        padding: '32px 72px',
        '@media (max-width:700px)': {
            padding: '0px',
        }
    },
    titleWrapper: {
        width: '100%',
        marginTop: 10
    },
    searchTitle: {
        fontSize: 14,
        float: 'left',
        color: colors.primary,
        fontWeight: 'bold'
    },
    headerTitle: {
        fontFamily: 'Arial, Helvetica, Arial, serif',
        fontSize: '36px',
        fontWeight: 100,
        color: 'rgba(0, 69, 113, 1.0)',
        textAlign: 'center',
        margin: '26px 30px 34px 30px',
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
    buttonsContainer: {
        paddingTop: '16px'
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
    link: {
        paddingTop: 12,
        color: '#6ea8e2',
        textDecoration: 'underline',
        cursor: 'pointer'
    },

    icon: {
        width: 18
    },
    subContainer: {
        marginTop: 20,
    },
    expansionPanelSummaryText: {
        color: '#004571',
        fontSize: 17,
        fontWeight: 'bold',
        marginLeft: 10
    },
    expansionPanelSummaryIcon: {
        width: 24
    },
    searchResultContainer: {
        backgroundColor: '#f7fbfe',
        margin: '20px 20px 20px 20px',
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
    },
    table: {
        margin: 'auto auto auto auto',
    },
    totalItems: {
        justifyContent: 'flex-start',
        fontSize: 17,
        alignItems: 'center',
        color: '#004571',
    },
    exportLink: {
        margin: '0 0 0 1rem',
        cursor: 'pointer',
        color: '#004571',
        '&:hover': {
            color: '#6ea8e2'
        }
    },
    input: {
        width: '100%',
        fontSize: '14px',

        '& input, & .MuiSelect-selectMenu': {
            background: '#FFF',
            paddingTop: '15px',
            paddingBottom: '15px'
        },
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
        //paddingRight: 45,
        //paddingLeft: 45,
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