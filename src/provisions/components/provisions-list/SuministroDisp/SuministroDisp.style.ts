import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
    buttonTextContainer: {
        display: 'flex',
        alignitems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        flexDirection: 'row',
        '@media (max-width: 600px)': {
            flexDirection: 'column',
          },
    },
    buttonCurso: {
        width: 'auto', 
        borderRadius: '44px',
         border: 'orange solid 2px', 
         backgroundColor: 'white', 
         display: 'flex', 
         justifyContent: 'center', 
         padding: '9px 52px' ,
         '@media (max-width: 600px)': {
           padding: '11px 43px 11px 10px'
          },
    },
    textFont:{
        fontSize: '1.5rem',
        '@media (max-width: 600px)': {
            fontSize: '1.3rem',
          },
    },
    textContainer:{ 
        display: 'flex',
        flexDirection: 'column',
        margin: '12px 0px', 
        '@media (min-width: 768px)': {
              flexDirection: 'row',
              alignIitems: 'center',
              gap: '0.5rem',   
              margin: '6px 0px',  
             
    }},
    textInfo:{
        color: '#808286', 
    }
}))

export default useStyles