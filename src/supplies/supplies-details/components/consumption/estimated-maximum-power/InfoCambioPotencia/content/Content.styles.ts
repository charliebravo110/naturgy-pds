import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({

  infoTextOrange: {
    color: '#E97000',
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
    fontSize: 18,
    padding: '0px 20px'
  },
  infoText: {
    color: '#004571',
    padding: '0px 20px',
    textAlign: 'justify',
    textJustify: 'inter-word'
  },
  infoTextT: {
    color: '#004571',
    padding: '0px 40px',
    textAlign: 'justify',
    textJustify: 'inter-word'
  },
  infoTextB: {
    color: '#004571',
    fontWeight: 'bold',
    padding: '0px 20px',
    textAlign: 'justify',
    textJustify: 'inter-word'
  },
  closeButton: {
    marginTop: -5,
    marginRight: -5,
    padding: '4px 0'
  },
  buttons: {
    [theme.breakpoints.up('sm')] : {
      marginTop: 24
    }
  },
  button: {
    margin: 8
  },
  title: {
    fontSize: 36,
    color: 'rgba(0, 69, 113, 1)',
    textAlign: 'center',
    padding: '30px 0px'
  }
}))

export default useStyles
