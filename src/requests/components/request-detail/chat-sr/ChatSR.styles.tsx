import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  generalCont: {
    margin: '20px 0 50px 0'
  },
  titleTxt: {
    color: 'rgb(0, 69, 113)',
    fontSize: '20px',
    fontWeight: 'bold'
  },
  requestStatusButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid rgb(0, 69, 113)',
    padding: '10px',
    borderRadius: '5px',
    color: 'rgb(0, 69, 113)',
    cursor: 'pointer',
    '&.disabled': {
      border: '1px solid rgba(125, 124, 124, 0.7)',
      filter: 'invert(51%) sepia(5%) saturate(5%) hue-rotate(314deg) brightness(95%) contrast(88%)',
      cursor: 'default',
    },
    [theme.breakpoints.only('xs')]: {
      marginTop: '15px'
    }
  },
  bellIcon: {
    width: '25px',
    paddingLeft: '10px'
  },
  commentBar: {
    backgroundColor: '#f8f8f8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 30px',
    borderRadius: '5px',
    margin: '35px 0 30px 0'
  },
  input: {
    border: 'none',
    padding: '15px',
    fontSize: '18px',
    backgroundColor: 'inherit',
    width: '100%',
    outline: 'none',
    color: 'rgba(0, 0, 0, 0.7)',
    [theme.breakpoints.only('xs')]: {
      padding: '0 0 20px 0'
    }
  },
  chatCont: {
    border: '2px solid #f0f4f6',
    padding: '20px 70px',
    borderRadius: '5px',
    [theme.breakpoints.only('xs')]: {
      padding: '20px'
    }
  },
  dateBubbleCont: {
    marginTop: '20px',
    position: 'relative'
  },
  dateBubble: {
    padding: '5px 15px',
    borderRadius: '20px',
    '&.v1': {
      border: '2px solid #ec9a48',
      color: 'rgb(0, 69, 113)'
    },
    '&.v2': {
      border: '2px solid #4cb8c0',
      color: '#4cb8c0'
    }
  },
  chatArrow: {    
    width: '10px',
    height: '10px',
    transform: 'rotate(-45deg)',
    position: 'absolute',
    bottom: '-5px',
    backgroundColor: 'white',
    '&.v1': {
      borderLeft: '2px solid #ec9a48',
      borderBottom: '2px solid #ec9a48',
    },
    '&.v2': {
      borderLeft: '2px solid #4cb8c0',
      borderBottom: '2px solid #4cb8c0',
    }
  },
  chatBubbleCont: {
    marginTop: '20px',
    display: 'flex',
    '&.v1': {
      justifyContent: 'flex-end'
    },
    '&.v2': {
      justifyContent: 'flex-start'
    }
  },
  chatBubble: {
    padding: '10px',
    borderRadius: '10px',
    border: '2px solid #e4e9ec',
    color: '#808286',
    '&.v1': {
      backgroundColor: '#f2f6f8'
    },
    '&.v2': {
      backgroundColor: 'inherit'
    }
  },
  infoText: {
    fontWeight: 'bold'
  },
  docName: {
    fontWeight: 'bold'
  },
  chatBubbleHour: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  chatIconItem: {
    marginLeft: '10px',
    '&.ufd': {
      marginLeft: '0px',
      marginRight: '10px'
    },
    '&.invisible': {
      opacity: '0%'
    }
  },
  chatIconCont: {
    border: '2px solid #e4e9ec',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '50%',
    overflow: 'hidden',    
    backgroundColor: 'inherit',
    padding: '2px',
    '&.v1': {
      backgroundColor: '#f2f6f8',
      padding: '6px',
    }    
  },
  userIcon: {
    width: '25px',
    height: '25px',
    filter: 'invert(16%) sepia(98%) saturate(1795%) hue-rotate(183deg) brightness(50%) contrast(106%)'
  },
  ufdIcon: {
    width: '35px',
    height: '35px',
  },
  ufdMessage: {
    fontWeight: 'bold'
  }
}))

export default useStyles