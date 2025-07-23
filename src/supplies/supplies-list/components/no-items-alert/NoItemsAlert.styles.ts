import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  noItems: {
    textAlign: 'center',
    justifyContent: 'center',
    paddingTop: 20
  },
  infoIconCont: {
    margin: '16px 15px 0 0'
  },
  infoIcon: {
    width: '35px'
  },
  errorContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F5F8',
    marginTop: '20px',
    padding: '15px',
    borderRadius: '5px'
  },
  text: {
    marginTop: 16
  },
  text2: {
    color: '#888',
    marginTop: 16
  },
  text3: {
    color: '#256094',
    fontWeight: 'bold',
    marginTop: 16
  }
}))

export default useStyles
