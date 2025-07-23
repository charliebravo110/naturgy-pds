import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    justifyContent: 'center',
    marginTop: 42
  },
  data: {
    position: 'relative',
    backgroundColor: '#F1F5F8',
    color: '#2E4B61',
    padding: 28,
    borderRadius: 4
  },
  closeIcon: {
    position: 'absolute',
    top: 18,
    right: 18,
    width: 16,
    cursor: 'pointer'
  },
  section: {
    alignItems: 'center',
    marginTop: 16,
    '&:first-child': {
      marginTop: 0
    },
    '&.gray': {
      color: '#8A8A8A'
    },
    '& div:last-child': {
      marginTop: 4
    }
  },
  requestType: {
    marginTop: '0 !important'
  },
  supplyIcon: {
    fontSize: 36
  },
  supplyName: {
    fontWeight: 'bold'
  }
}))

export default useStyles
