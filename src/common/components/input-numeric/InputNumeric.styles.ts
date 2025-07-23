import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  input: {
    '& input[type="number"]': {
      '-webkit-appearance': 'textfield',
      '-moz-appearance': 'textfield',
      'appearance': 'textfield'
    },
    '& input[type=number]::-webkit-inner-spin-button' : {
      '-webkit-appearance': 'none'
    },
    'input[type=number]::-webkit-outer-spin-button' : {
      '-webkit-appearance': 'none'
    },
    '& .MuiOutlinedInput-adornedEnd': {
      paddingRight: '35px'
    },
    '& .MuiInputBase-root.Mui-disabled img': {
      opacity: .3
    }
  },
  adornmentContainer: {
    borderLeft: '1px solid #BDCDD7',
    position: 'absolute',
    top: 0,
    width: '35px',
    right: 0,
    height: '100%',
    cursor: 'pointer',
    userSelect: 'none'
  },
  adornmentItem: {
    borderBottom: '1px solid #BDCDD7',
    height: '50%',
    padding: '5px 0 0 8px',
    '& img': {
      width: '18px'
    }
  },
  adornmentItemActive: {
    backgroundColor: '#7FA2B8',
    borderBottom: '1px solid #BDCDD7',
    height: '50%',
    padding: '5px 0 0 8px',
    '& img': {
      width: '18px'
    }
  },
}))

export default useStyles
