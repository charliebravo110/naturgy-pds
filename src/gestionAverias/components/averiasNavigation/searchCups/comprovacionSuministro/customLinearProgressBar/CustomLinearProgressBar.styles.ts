import { makeStyles, withStyles } from '@material-ui/core/styles'
import colors from '../../../../../../assets/colors/colors'

const useStyles = makeStyles((theme) => ({
    
    LinearPorgressBar:{
        marginTop: '5px',
        marginBottom:'15px'
    },
    suministroConTelegestion: {
        //marginTop: '20px',
        fontSize: 18,
        color: colors.primary,
        fontWeight: 'bold',
        textAlign: 'right',
        
    },
    iconContador: {
        margin: '30px 0px -7px 20px',
        width: 30
    },
    numberContador:{
        marginTop: '20px',
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'right',
        
    },
}));

export default useStyles
