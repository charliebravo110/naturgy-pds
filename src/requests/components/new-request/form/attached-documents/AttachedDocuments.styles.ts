import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: 32
  },
  attachedDocuments: {
    backgroundColor: '#F8F7F5',
    padding: 24,
    borderRadius: 4
  },
  label: {
    color: '#2D5062',
    fontWeight: 'bold'
  },
  list: {
    justifyContent: 'center',
    marginTop: 24
  },
  document: {
    color: '#004571',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTop: 'solid 1px #CECECE',
    marginTop: 12,
    '&:first-child': {
      paddingTop: 0,
      borderTop: 0,
      marginTop: 0
    }
  },
  removeContainer: {
    backgroundColor: '#EDEAE3',
    padding: '4px 8px',
    borderRadius: '50%',
    cursor: 'pointer',
    '& img': {
      width: 10
    }
  }
}))

export default useStyles
