import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  dialog: {
    '& .MuiPaper-root.MuiDialog-paper': {
      width: '810px',
      heigth: '500px',
      border: '2px solid rgb(61, 114, 147)'
    }
  },
  container: {
    padding: 36,
    overflow: 'hidden'
  },
  closeButton: {
    position: 'absolute',
    top: 18,
    right: 18,
    cursor: 'pointer'
  },
  text: {
    fontSize: 17,
    color: '#838383'
  },
  alertBlock: {
    [theme.breakpoints.only('xs')]: {
      textAlign: 'center'
    }
  },
  alertIcon: {
    height: '100%'
  },
  button: {
    marginTop: 25,
    
    '& span[class^="MuiButton-label"]': {
      lineHeight: 1.4,
      padding: '19px'
    },
  },
  button2: {
    marginTop: 50,
    color: 'rgba(0, 69, 113, 1)',
  },
  title: {
    color: 'rgba(0, 69, 113, 1)',
    margin: '10px 0 30px',
    fontSize: '36px',
    textAlign: 'center'
  },
  subTitle: {
    color: 'rgba(0, 69, 113, 1)',
    marginBottom: '15px',
    fontSize: '20px',
    textAlign: 'center'
  },
}))

export default useStyles