import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '20px 0'
  },
  maxWidthForBigScreens: {
    [theme.breakpoints.up('sm')]: {
      maxWidth: 1200
    }
  },
  headerTitle: {
    fontFamily: 'Arial, Helvetica, Arial, serif',
    fontSize: '36px',
    fontWeight: 100,
    color: 'rgba(0, 69, 113, 1.0)',
    textAlign: 'center',
    margin: '26px 30px 34px 30px',
  },
  orangeSubtitle: {
    marginBottom: '15px',
    fontSize: '22px',
    color: '#e57200',
    textAlign: 'center'
  },
  lightSubtitle: {
    fontSize: '18px',
    color: '#64666a',
    textAlign: 'center'
  },
}));

export default useStyles;
