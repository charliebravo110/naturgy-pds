import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  inputContainer: {
    marginBottom: 30,
    minHeight: 87
  },
  label: {
    marginBottom: 7,
    color: '#004571'
  },
  label2: {
    color: '#004571'
  },
  input: {
    color: '#868686',
    '& .MuiInputBase-input': {
      color: '#868686'
    },
    '& .MuiSelect-root': {
      color: '#868686'
    },
    '& textarea': {
      color: '#868686'
    }
  },
  selfConsumptionInput: {
    color: '#868686',
    '& .MuiInputBase-input': {
      color: '#868686'
    },
    '& .MuiSelect-root': {
      color: '#868686'
    },
    '& textarea': {
      color: '#868686'
    },
    minHeight:90
  },
  stateLabel: {
    color: '#868686',
    width: '100%',
    marginBottom: 15
  },
  marginLeft: {
    marginLeft: 10
  },
  switchsMargin: {
    marginTop: 20
  },
  inputBlock: {
    width: '100%',
    textAlign: 'left'
  },
  characterCount: {
    backgroundColor: '#F3F7FB',
    width: '220px',
    color: 'rgba(0, 69, 113, 1)',
    fontSize: '13px',
    padding: '5px 8px',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  checkboxContainer2: {
    alignItems: 'center',
    margin: '12px 0 30px 0',
    '& .checkbox': {
      // marginTop: 12,
      marginRight: 6,
    },
    '& .label': {
      // marginLeft: 6,
      // marginTop: 12,
      '& span': {
        color: '#1674D1',
        fontSize: 14,
        cursor: 'pointer',
      }
    }
  },
  budgetExtensionContainer: {
    marginBottom: 20
  },
  selfConsumptionInfoContainer: {
    fontSize: '14px',
    marginTop: '10px',
    color: '#004571'
  },
  smallInputContainer: {
    width: '81%'
  },
  infoIcon: {
    width: 17
  },
  electricBox: {
    border: '2px solid #f1f5f8',
    borderRadius: '4px',
    padding: '20px',
    marginBottom: '20px'
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
      backgroundColor: '#009aa6',
      content: '""',
      borderRadius: '50%',
      cursor: 'default'
    }
  },
  disabledRadioButton: {
    width: 17,
    height: 17,
    boxSizing: 'border-box',
    backgroundColor: '#FFF',
    padding: 3,
    border: 'solid 1px #C4D2DA',
    borderRadius: '50%',
    float: 'left',
    '&.active::before': {
      display: 'block',
      width: '100%',
      height: '100%',
      backgroundColor: '#BDBDBD !important',
      content: '""',
      borderRadius: '50%'
    }
  },
  radioButtonText: {
    color: '#64666a',
    fontSize: '15px',
    paddingLeft: '10px',
    float: 'left'
  },
}))

export default useStyles