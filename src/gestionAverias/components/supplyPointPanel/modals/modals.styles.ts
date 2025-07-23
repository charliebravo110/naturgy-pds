import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({

  dialog: {
    '& .MuiPaper-root.MuiDialog-paper': {
			width: 780
		},
  },
  modalContainer: {
    border: '2px solid rgb(61, 114, 147)',
    outline: 'none',
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: {
      overflow: 'auto'
    }
  },
  block: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  closeButton: {
    marginTop: -5,
    marginRight: -5,
    padding: '4px 0'
  },
  container: {
    padding: '10px 0 10px',
    justifyContent: 'center'
  },
  title: {
    fontSize: 30,
    color: '#004571',
    textAlign: 'center',
    marginBottom: 15
  },
  icon: {
    width: 50,
    marginBottom: 15
  },
  description: {
    color: '#555555',
    marginBottom: 40
  },
  buttonsArea: {
    marginBottom: 25
  },
  link: {
    textDecoration: 'none',
  }


}))

export default useStyles;
