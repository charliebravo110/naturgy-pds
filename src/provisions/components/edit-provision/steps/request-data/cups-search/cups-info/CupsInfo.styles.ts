import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: '#F1F5F8',
    color: '#004571',
    padding: '28px 36px',
    borderRadius: 8,
    marginTop: '25px'
  },
  closeButton: {
    width: '15px',
    margin: '-15px -15px 15px 0',
    cursor: 'pointer'
  },
  cups: {
    color: '#FFF',
    width: 'fit-content',
    backgroundColor: '#009AA6',
    fontWeight: 'bold',
    padding: '10px 32px',
    borderRadius: '20em',
  }, 
  address: {
    fontWeight: 'bold'
  }
}))

export default useStyles