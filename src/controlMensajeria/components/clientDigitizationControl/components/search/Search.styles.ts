import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  generalCont: {
    margin: '10px 0'
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
        // maxHeight: '490px'
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
    color: 'rgba(0, 69, 113, 1.0)',
    '&.marginTop': {
      marginTop: '30px'
    }
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
  stadisticsCont: {
    [theme.breakpoints.only('xs')]: {
        marginTop: '40px'
    }
  },
  box: {
    border: 'solid 1px rgba(0, 69, 113, 1.0)'
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
  separator: {
    backgroundColor: '#E3E6E8',
    height: '1.5px',
    width: '100%',
    marginTop: '5px',
    '&.variant': {
        height: '3px',
    }
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
  smallTitle: {
    margin: '8px 0px',
    fontSize: '16px',
    color: 'rgba(0, 69, 113, 1.0)'
  },
  buttonsContainer: {
    marginTop: '13px',
    marginLeft: '2px'
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
  icon: {
    width: '23px',
    height: '18px',
    marginRight: '2px',
    float: 'left'
  },
  resetContainer: {
    marginTop: '15px'
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
}))

export default useStyles;
