import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  orange: {
    background: '#E97000',
    width: 10,
    height: 10,
    borderRadius: '50%',
    marginRight: 5
  },
  blue: {
    background: '#004571',
    width: 10,
    height: 10,
    borderRadius: '50%',
    marginRight: 5
  },
  checkBox: {
    padding: '5px',
    '& .MuiSvgIcon-root path': {
      color: '#1674d1',
      stroke: '1px'
    },
    '&.MuiCheckbox-colorPrimary.Mui-checked': {
      color: '#1674d1'
    }
  },
  supplyCheckBox: {
    '&::before': {
      content: `'...'`,
      position: 'absolute',
      fontSize: '60%'
    }
  },
  delegateItem: {
    display: 'flex',
    alignItems: 'center'
  },
  several: {
    cursor: 'pointer',
    textDecoration: 'underline',
    color: '#1674D1'
  },
  singleDelegate: {
    color: '#1674D1',
    textDecoration: 'underline',
    cursor: 'pointer',
    '&.disabled': {
      color: '#BBB',
      cursor: 'default'
    }
  }
}))


export default useStyles
