import { lightBlue } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    errorContainer: {
        backgroundColor: 'lightBlue',
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '10px',
        '& div': {
            width: '80%'
        },
        '& img': {
            margin: '10px'
        }
    }
}))

export default useStyles