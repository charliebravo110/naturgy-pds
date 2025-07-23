import { makeStyles, withStyles } from '@material-ui/core/styles'
import Checkbox from '@material-ui/core/Checkbox'

const NaturgyCheckbox = withStyles({
  root: {
    padding: 3,
    '& .MuiSvgIcon-root path': {
      color: '#1674d1',
      stroke: '1px'
    },
    '&.MuiCheckbox-colorPrimary.Mui-checked': {
      color: '#1674d1'
    }
  }
})(Checkbox)


const useStyles = makeStyles((theme) => ({
  uncheckedCheckbox: {
    width: 16,
    height: 16,
    border: '1px solid #1674d1',
    borderRadius: 3,
    margin: 3,
    background: 'white'
  },
  uncheckedCheckboxDisabled: {
    width: 16,
    height: 16,
    border: '1px solid #868686',
    borderRadius: 3,
    margin: 3,
    background: 'white'
  }
}))

export default useStyles

export { NaturgyCheckbox }
