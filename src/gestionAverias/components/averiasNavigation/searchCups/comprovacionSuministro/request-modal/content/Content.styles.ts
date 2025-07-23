import { makeStyles } from '@material-ui/core/styles'
import colors from '../../../../../../../assets/colors/colors'

const useStyles = makeStyles((theme) => ({
    modalContainer: {
        border: '2px solid rgb(61, 114, 147)',
        outline: 'none',
        [theme.breakpoints.down('sm')]: {
            overflow: 'auto'
        }
    },
    block: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column'
    },
    container: {
        padding: '10px 0px 10px 0px',
        justifyContent: 'flex-start'
    },
    addressContainer: {
        backgroundColor: '#f8f7f7',
        padding: '14px 0px 20px 16px'
    },
    title: {
        fontSize: 30,
        color: '#004571',
        textAlign: 'center',
        marginBottom: 20
    },
    addressContainerTitle: {
        fontSize: 15,
        color: '#004571',
        fontWeight: 'bold'
    },
    addressDesc: {
        fontSize: 14,
        color: '#686864'
    },
    text: {
        color: '#838383',
        textAlign: 'center',
        boxSizing: 'border-box',
        marginBottom: 25
    },
    closeButton: {
        marginTop: -5,
        marginRight: -5,
        padding: '4px 0'
    },
    locationTable: {
        borderRadius: 4,
        overflow: 'hidden',
        '& thead': {
            display: 'block',
            backgroundColor: '#EBE9E6',
            paddingRight: 34
        },
        '& tbody': {
            display: 'block',
            maxHeight: 170,
            overflowY: 'scroll',
            overflowX: 'hidden'
        },
        '& .MuiTableCell-root': {
            width: '33%'
        }
    },
    button: {
        marginTop: 24,
        justifyContent: 'center',
        '& button': {
            margin: '0 16px'
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
    mosaicContainer: {
        maxHeight: 278,
        overflow: 'auto'
    },
    selectAnOption: {
        color: '#777777',
        textAlign: 'left',
        fontSize: '13px'
    },
    selectAnOptionContainer: {
        padding: '14px 0px 14px 0px'
    },
    tablePadding: {
        paddingTop: '12px',
        paddingBottom: '12px'
    },
    innerContainer: {
        margin: '5px 30px 30px 30px',
        justifyContent: 'center',
    },
    icon: {
        margin: '5px 0px 0px 5px',
        width: 15
    },
    innerDescriptionText: {
        margin: '5px 5px 0px 5px',
        textAlign: 'right',
        fontSize: 14,
        float: 'left',
        color: colors.primary,
        fontWeight: 'bold'
    },
    innerPointInformation: {
        margin: '5px 5px 0px 5px',
        textAlign: 'left',
        fontSize: 14,
        color: '#6a6a6a',
    },
    innerArea: {
        border: '2px solid #f0eeec',
        backgroundColor: '#F7F7F7',
        padding: '15px 0px',
        justifyContent: 'space-between'
    },
    innerArea2: {
        height: '350px',
        border: '2px solid #f0eeec',
        backgroundColor: '#F7F7F7',
        padding: '20px 0px 15px 25px',
        justifyContent: 'space-between'
    },
    wrapperTitle: {
        width: '100%',
        marginTop: '20px',
        color: 'rgba(0, 69, 113, 1.0)',
        fontWeight: 'bold'
    },
    inputTitle: {
        justify: 'flex-start',
        color: 'rgba(0, 69, 113, 1.0)',
        fontSize: '14px',
        marginTop: '20px',
        marginBottom: '5px'
    },
    input: {
        width: '100%',
        fontSize: '14px',
        '& input, & .MuiSelect-selectMenu': {
            background: '#FFF',
            paddingTop: '15px',
            paddingBottom: '15px',
            color: '#6a6a6a',
        },
    },
    inputsContainer: {
        width: '92%'
    },
    textArea: {
        padding: '35px 0px',
        '& .MuiOutlinedInput-multiline': {
            color: '#6a6a6a',
        }
    },
    cancelButton: {
        marginTop: 24,
        color: colors.primary,
        justifyContent: 'center',
        '& button': {
            margin: '0 16px'
        }
    },
    questionsTitle: {
        width: '100%',
        fontSize: '14px',
        color: 'rgba(0, 69, 113, 1.0)',
        fontWeight: 'bold'
    },
    questionText: {
        fontSize: '14px',
        paddingTop: '12px',
        color: '#6ea8e2',
        textDecoration: 'underline',
        cursor: 'pointer'
    },
    borderRight: {
        borderRight: '2px solid #f0eeec'
    },
    inputsWrapper2: {
        background: 'white',
        marginBottom: 18
    },
    question: {
        fontSize: '18px',
        color: 'rgba(0, 69, 113, 1.0)',
    },
    yesButton: {
        width: '90px',
        height: '10px',
        marginTop: 24,
        color: colors.primary,
        justifyContent: 'center',
        '& button': {
            margin: '0 16px'
        }
    },
    noButton: {
        width: '90px',
        height: '10px',
        marginTop: 24,
        justifyContent: 'center',
        '& button': {
            margin: '0 16px'
        }
    },
    questionContainer: {
        alignSelf: 'end',
        justifyContent: 'center' 
    },
    noQuestionsContainer: {
        alignSelf: 'center',
        justifyContent: 'center',
        padding: '0px 50px',
        textAlign: 'center'
    },
    radioButtonText: {
        color: 'rgba(0, 69, 113, 1.0)',
        fontSize: '15px',
        paddingLeft: '10px',
        float: 'left'
    },
    radioButtonsContainer: {
        paddingLeft: '62px'
    }
}))


export default useStyles
