import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  documentContainer: {
    [theme.breakpoints.only('xs')]: {
      margin: '0 auto'
    }
  },
  item: {
    backgroundColor: '#F8F7F6',
    border: '1px solid #E3E6E8',
    borderRadius: '5px',
    position: 'relative',
    minHeight: '230px',
    width: '180px'
  },
  itemError: {
    backgroundColor: '#F8F7F6',
    border: '2px solid #F15B70',
    borderRadius: '5px',
    position: 'relative',
    minHeight: '200px',
    width: '180px'
  },
  upPart: {
    padding: '15px',
    position: 'relative',
    width: '100%'
  },
  separator: {
    backgroundColor: '#E3E6E8',
    height: '1px',
    width: '100%'
  },
  downPart: {
    padding: '5px',
    marginTop: '1px',
    width: '100%'
  },
  icon: {
    width: '40px',
    height: '33px'
  },
  documentType: {
    color: '#256085',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    display: 'table'
  },
  documentType2: {
    color: '#256085',
    fontSize: 10,
    fontStyle: 'italic',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  documentName: {
    color: '#5A85A1',
    fontSize: 14,
    textAlign: 'center',
    wordBreak: 'break-word'
  },
  customDocumentType: {
    position: 'absolute',
    left: '-5px'
  },
  uploadInfo: {
    marginBottom: 8,
    position: 'relative'
  },
  date: {
    color: '#7D7C7C',
    fontSize: '13px'
  },
  deleteDocument: {
    position: 'absolute',
    right: '-10px'
  },
  downloadDocument: {
    textDecoration: 'none',
    cursor: 'pointer'
  },
  attachCommentIco: {
    cursor: 'pointer'
  },
  uploadLink: {
    fontSize: '13px',
    alignSelf: 'center',
    top: '76%',
    '&.plan': {
      width: '100%',
      maxWidth: '180px',
      margin: '0 auto',
      boxSizing: 'border-box'
    }
  },
  statusInfo: {
    position: 'absolute',
    top: '-10px',
    right: '-10px',
    zIndex: 1001
  },
  statusIcon: {
    width: 20,
    height: 20
  },
  fullWidth: {
    width: '100%',
    //marginBottom: '30%'
  },
  input: {
    maxWidth: '190px',
    fontSize: '12px',
    color: '#336A8E',
    fontWeight: 'bold',
    wordBreak: 'break-all'
  },
  tooltip: {
    position: 'absolute',
    width: '150px',
    padding: '5px',
    border: '1px solid #8FAEC1',
    borderRadius: '2px',
    backgroundColor: '#FFFFFF',
    color: '#5A86A3',
    left: '40px',
    boxShadow: '0 2px 5px #8FAEC1',
    zIndex: 1,
    '&::before': {
      width: '5px',
      height: '5px',
      content: `' '`,
      position: 'absolute',
      top: 12,
      left: '-3.5px',
      backgroundColor: '#FFF',
      transform: 'rotate(45deg)',
      borderLeft: '1px solid #8FAEC1',
      borderBottom: '1px solid #8FAEC1'
    }
  },
  plan: {
    marginTop: '-10%',
    width: '100%'
  },
  paddingLeftTextButton: {
    paddingLeft: 25,
    paddingRight: 10
  },
  orLabel: {
    textAlign: 'center',
    margin: '4px 0'
  },
  uploadTextButton: {
    justifyContent: 'center'
  },
  blockingDocText: {
    textAlign: 'center',
    color: '#d3222a'
  },
  message: {
    textAlign: 'center',
    color: '#7D7C7C',
    fontSize: '11px'
  },
  messageLink: {
    color: 'rgba(0, 102, 204, 1)',
    textDecoration: 'underline'
  },
  messagePart: {
    padding: '5px',
    marginTop: '1px',
    width: '100%',
    minHeight: '60px'
  },
  button: {
    display: 'flex !important',
    color: '#1674D1',
    alignItems: 'center',
    cursor: 'pointer',
    textDecoration:'none'
  },
  link: {
    fontSize:'13px',
    textDecoration:'none',
    fontFamily: 'FSEmeric", "Arial", sans-serif !important',
    color: '#1674D1',
    justifyContent: 'center'
  },
  justifyCenter: {
    justifyContent: 'center'
  },
}))

export default useStyles
