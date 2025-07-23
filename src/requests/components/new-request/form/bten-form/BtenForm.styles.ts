import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: 32
  },
  description: {
    color: '#004571',
    fontWeight: 'bold'
  },
  descriptionMargin: {
    color: '#004571',
    fontWeight: 'bold',
    marginTop: '30px'
  },
  inputs: {
    width: 740,
    justifyContent: 'space-between',
    margin: '24px auto 0',
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  label: {
    color: '#004571',
    fontSize: 14,
    marginBottom: 8
  },
  characterCount: {
    backgroundColor: '#F3F7FB',
    width: 220,
    color: '#004571',
    fontSize: '13px',
    padding: '5px 8px',
    borderRadius: '0 0 4px 4px',
    textAlign: 'center'
  }
}))

export default useStyles
