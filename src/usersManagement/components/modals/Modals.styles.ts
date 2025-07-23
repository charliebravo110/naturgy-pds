import { makeStyles } from '@material-ui/core/styles'
import colors from '../../../assets/colors/colors';

const useStyles = makeStyles((theme) => ({
  modalContainer: {
    outline: 'none'
  },
  modalText: {
    textAlign: 'center',
    marginBottom: 48
  },
  closeButton: {
    marginTop: -5,
    marginRight: -5
  },
  title: {
    fontSize: 22,
    color: 'rgba(0, 69, 113, 1)',
    marginBottom: 24
  },
  subTitle: {
    fontSize: 17,
    color: '#838383'
  },
  button: {
    margin: 8
  },
  cancelButton: {
    margin: 8,
    backgroundColor: '#004571',
    color: colors.primary,
  },
  inputV2: {
    width: '100%',
    fontSize: '14px',
    '& input, & .MuiSelect-selectMenu': {
        background: '#FFF',
        paddingTop: '15px',
        paddingBottom: '15px'
    }
  },
  select: {
    width: '80%'
  }
}))

export default useStyles