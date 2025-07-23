import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  generalCont: {
    position: 'relative',
  },
  input: {
    width: '100%',
    backgroundColor: '#FFF',
    '& input, & .MuiSelect-selectMenu': {
      color: '#777',
      backgroundColor: 'transparent',
      padding: '12px 47px 12px 12px',
      border: '1px solid #E1E9EE',
      borderRadius: '4px',
      cursor: 'pointer',
    }
  },
  pickerCont: {
    width: '150px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexWrap: 'nowrap',
    marginTop: '4px',
    overflow: 'hidden',
    borderColor: '#E1E9EE',
    borderStyle: 'solid',
    borderWidth: 1,  
    borderRadius: '4px',
    position: 'absolute',
    zIndex: 1,
    top: '50px',
  },
  pickerHeader: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: '#F1F5F8',
    padding: 6,
  },
  arrowLeft: {
    width: 0,
    height: 0,
    borderTop: '7px solid transparent',
    borderBottom: '7px solid transparent',
    borderRight: '7px solid #155279',
    cursor: 'pointer',
  },
  boldText: {
    color: '#004571',
    fontWeight: 700,
  },
  arrowRight: {
    width: 0,
    height: 0,
    borderTop: '7px solid transparent',
    borderBottom: '7px solid transparent',
    borderLeft: '7px solid #155279',
    cursor: 'pointer',
  },
  pickerList: {
    textAlign: 'center',
    maxHeight: '140px',
    overflowY: 'scroll',
    backgroundColor: '#ffffff',
  },
  itemList: {
    width: '100%',
    cursor: 'pointer',
    padding: 4,
    '&:hover': {
      backgroundColor: 'rgba(0, 69, 113, 0.1)'
    },
  },
  messageList: {
    width: '100%',
    padding: 4,
  }
}))

export default useStyles
