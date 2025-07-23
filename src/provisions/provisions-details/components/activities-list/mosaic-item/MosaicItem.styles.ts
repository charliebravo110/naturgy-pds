import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    padding: 15,
    textAlign: 'left',
    backgroundColor: '#F8F7F6',
    '&.border': {
      borderBottom: 'solid 2px #FFF'
    }
  },
  responseStatus: {
    margin: '0 auto',
    marginTop: 5,
    width: 12,
    height: 12,
    backgroundColor: '#019AA5',
    borderRadius: '50%',
    '&.read': {
      backgroundColor: '#E5E1DE'
    }
  },
  responseSubject: {
    color: '#004571',
    fontSize: 15,
    fontWeight: 'bold',
    '&.read': {
      fontWeight: 'normal'
    }
  },
  responseDate: {
    fontSize: 14,
    color: '#868686',
    fontWeight: 'bold',
    '&.read': {
      fontWeight: 'normal'
    }
  },
  responseLink: {
    fontSize: 14,
    color: '#5193bd',
    paddingLeft: 10,
    borderLeft: '1px solid #868686'
  },
  expandIcon: {
    color: '#5193bd',
    cursor: 'pointer'
  },
  viewContainer: {
    padding: 15,
    fontSize: 16,
    textAlign: 'left',
    backgroundColor: '#F8F7F6',
    borderBottom: 'solid 2px #FFF'
  },
  message: {
    color: '#868686'
  },
  documents: {
    marginTop: 20
  },
  documentContainer: {
    marginBottom: 15,
    '& a': {
      textDecoration: 'none',
      color: '#5193bd',
      cursor: 'pointer',
    }
  },
  documentIcon: {
    marginRight: 10
  },
  documentName: {
    color: '#5A85A1',
    fontSize: 14,
    textAlign: 'center',
    wordBreak: 'break-word'
  },
  documentType: {
    color: '#256085',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  downloadDocument: {
    textDecoration: 'none',
    cursor: 'pointer'
  }
}))

export default useStyles
