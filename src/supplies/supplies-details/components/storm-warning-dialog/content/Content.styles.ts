import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '32px',
    textAlign: 'center',
    [theme.breakpoints.down('xs')]: {
      padding: '32px 12px',
      overflow: 'hidden'
    }
  },
  closeButton: {
    position: 'absolute',
    top: 7,
    right: 7
  },
  inputContainerBordered: {
    position: 'relative',
    border: 'solid 1px rgba(0, 69, 113, .5)',
    borderRadius: 4,
    margin: '12px 0',
    '&::before': {
      position: 'absolute',
      top: 0,
      left: -14,
      color: '#004571',
      content: '"*"'
    }
  },
  inputContainer: {
    flexBasis: 'auto'
  },
  label: {
    textAlign: 'left',
    marginBottom: 7,
    color: '#004571'
  },
  input: {
    color: '#868686',
    textAlign: 'left',
    '& .MuiSelect-root': {
      color: '#868686'
    }
  },
  checks: {
    paddingLeft: 36
  },
  marginedCheck: {
    marginTop: 2
  },
  questionText: {
    fontSize: 14,
    marginLeft: 6
  },
  marginLeft: {
    marginLeft: 10
  },
  checkBoxWrapper: {
    background: '#F1F5F8',
    color: '#004571',
    margin: '0 -72px',
    marginBottom: 25,
    padding: '20px 77px',
    width: 'calc(100% + 144px)'
  },
  checkBox: {
    marginRight: 60
  },
  buttonContainer: {
    justifyContent: 'center',
    marginTop: 24
  }
}))

export default useStyles
