import { makeStyles } from '@material-ui/core/styles'

import colors2 from '../../../../../assets/colors/colors'

const useStyles = makeStyles((theme) => ({
    orangeSubtitle: {
        marginBottom: '15px',
        fontSize: '22px',
        color: '#e57200',
        textAlign: 'center'
    },
    lightSubtitle: {
        fontSize: '18px',
        color: '#64666a',
        textAlign: 'center'
    },
    searchContainer: {
        marginTop: '30px',
        border: 'solid 1.5px #eef3f6',
        borderRadius: 4,
        backgroundColor: '#f7fbfe',
        padding: '20px'
    },
    flexContainerOne: {
        display: 'flex'
    },
    searchCont: {
        [theme.breakpoints.up('xs')]: {
            maxHeight: '490px'
        }
    },
    flexContainerTwo: {
        display: 'flex',
        marginTop: '60px'
    },
    blueTitle: {
        marginBottom: '15px',
        fontSize: '19px',
        fontWeight: 'bold',
        color: 'rgba(0, 69, 113, 1.0)'
    },
    smallTitle: {
        margin: '8px 0px',
        fontSize: '16px',
        color: 'rgba(0, 69, 113, 1.0)'
    },
    inputTitle: {
        justify: 'flex-start',
        color: 'rgba(0, 69, 113, 1.0)',
        fontSize: '14px',
        marginTop: '20px',
        marginBottom: '5px'
    },
    consultCont: {
        marginTop: '25px'
    },
    inputV2: {
        width: '80%',
        fontSize: '14px',
        '& input, & .MuiSelect-selectMenu': {
            background: '#FFF',
            paddingTop: '15px',
            paddingBottom: '15px'
        }
    },
    radioButton: {
        width: 17,
        height: 17,
        boxSizing: 'border-box',
        backgroundColor: '#FFF',
        padding: 3,
        border: 'solid 1px #C4D2DA',
        borderRadius: '50%',
        cursor: 'pointer',
        float: 'left',
        '&.active::before': {
            display: 'block',
            width: '100%',
            height: '100%',
            backgroundColor: '#0066cc',
            content: '""',
            borderRadius: '50%',
            cursor: 'default'
        }
    },
    radioButtonText: {
        color: 'rgba(0, 69, 113, 1.0)',
        fontSize: '15px',
        marginLeft: '6px',
        marginRight: '8px',
        float: 'left'
    },
    shipmentResultFiltersCont: {
        [theme.breakpoints.only('xs')]: {
            marginTop: '15px'
        }
    },
    buttonsContainer: {
        marginTop: '13px',
        marginLeft: '2px'
    },
    checkboxContainer: {
        marginTop: '10px'
    },
    userContainer: {
        marginTop: '15px'
    },
    stadisticsCont: {
        [theme.breakpoints.only('xs')]: {
            marginTop: '40px'
        }
    },
    countersCont: {
        [theme.breakpoints.only('xs')]: {
            marginTop: '40px'
        }
    },
    box: {
        border: 'solid 1px rgba(0, 69, 113, 1.0)'
    },
    box2: {
        border: 'solid 1px rgba(0, 69, 113, 1.0)',
        marginBottom: '10px',
        padding: '10px 15px'
    },
    checkboxText: {
        marginTop: '6px',
        marginLeft: '2px',
        fontSize: '15px',
        color: 'rgba(0, 69, 113, 1.0)',
    },
    icon: {
        width: '23px',
        height: '18px',
        marginRight: '2px',
        float: 'left'
    },
    iconV2: {
        width: '83px',
        height: '78px',
        marginRight: '14px',
    },
    iconV3: {
        width: '23px',
        height: '18px',
        marginRight: '2px',
        float: 'left'
    },
    iconContainer: {
        marginTop: '9px'
    },
    resultHeader: {
        backgroundColor: 'rgba(0, 69, 113, 1.0)',
        color: 'white',
        textAlign: 'center',
        padding: '10px',
        borderBottomLeftRadius: '12px',
        borderBottomRightRadius: '12px'
    },
    dateRange: {
        textAlign: 'center',
        padding: '10px',
        color: 'rgba(0, 69, 113, 1.0)'
    },
    percentage: {
        textAlign: 'center',
        marginTop: '6px'
    },
    resultTitle: {
        marginTop: '20px',
        marginBottom: '11px',
        fontSize: '17px',
        fontWeight: 'bold',
        color: 'rgba(0, 69, 113, 1.0)'
    },
    resultSubtitle: {
        textAlign: 'left',
        fontSize: '14px',
        color: 'rgba(0, 69, 113, 1.0)'
    },
    filterTitle: {
        textAlign: 'left',
        fontSize: '14px',
        color: 'rgba(0, 69, 113, 1.0)',
        fontWeight: 'bold',
        [theme.breakpoints.only('xs')]: {
            marginBottom: '15px'
        }
    },
    messagesTypeCont: {
        [theme.breakpoints.only('xs')]: {
            margin: '7px 0 7px 0'
        }
    },
    filterTitle2: {
        margin: '8px 0px 5px 0px',
        textAlign: 'left',
        fontSize: '14px',
        color: 'rgba(0, 69, 113, 1.0)',
        fontWeight: 'bold'
    },
    channelSubtitle: {
        color: 'rgba(0, 69, 113, 1.0)',
        fontSize: '14px',
        textAlign: 'right'
    },
    channelSubtitle2: {
        color: 'rgba(0, 69, 113, 1.0)',
        fontSize: '14px',        
        [theme.breakpoints.up('sm')]: {
            textAlign: 'right',
            paddingLeft: '51px'
        },        
        [theme.breakpoints.only('xs')]: {
            display: 'flex',
            justifyContent: 'flex-end'
        }
    },
    channelSubtitle3: {
        color: 'rgba(0, 69, 113, 1.0)',
        fontSize: '14px',
        textAlign: 'right',
        fontWeight: 'bold'
    },
    channelSubtitle4: {
        color: 'rgba(0, 69, 113, 1.0)',
        fontSize: '14px',                
        [theme.breakpoints.up('sm')]: {
            textAlign: 'right',
            paddingLeft: '21px'
        },
        [theme.breakpoints.only('xs')]: {
            display: 'flex',
            justifyContent: 'flex-end'
        }
    },
    separator: {
        backgroundColor: '#E3E6E8',
        height: '1.5px',
        width: '100%',
        marginTop: '5px',
        '&.variant': {
            height: '3px',
        }
    },
    boldText: {
        fontWeight: 'bold'
    },
    percentageCounters: {
        [theme.breakpoints.only('xs')]: {
            margin: '10px 0 10px 0'
        }
    },
    checkboxTitle: {
        fontSize: '14px',
        color: 'rgba(0, 69, 113, 1.0)',
        [theme.breakpoints.only('xs')]: {
            marginTop: '8px'
        }
    },
    searchButton: {
        fontSize: '14px',
        color: '#076acd',
        cursor: 'pointer'
    },
    updateIcon: {
        marginRight: '5px'
    },
    updateText: {
        '&:hover': {
            textDecoration: 'underline'
        }
    },
    rowContainer: {
        padding: '2.5px 0px' 
    },
    numberPercentage: {
        float: 'right',
        fontWeight: 'bold'
    },
    shipmentPercentageCont: {
        marginLeft: '20px'
    },
    ratioContainer: {
        padding: '15px',
        alignItems: 'center',
        fontSize: '14px',
        color: 'rgba(0, 69, 113, 1.0)',
    },
    textAndValueCont: {
        justifyContent: 'space-between',        
        '&.margin': {
            marginTop: '8px'
        }
    },
    percentageCont: {
        justifyContent: 'right',
        alignItems: 'center',
        fontWeight: 'bold'
    },
    roundedIcon: {
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        display: 'inline-block',
        marginRight: '5px',
        '&.green': {
            backgroundColor: 'green'
        },
        '&.red': {
            backgroundColor: 'red'
        }
    }

}));

export default useStyles;
