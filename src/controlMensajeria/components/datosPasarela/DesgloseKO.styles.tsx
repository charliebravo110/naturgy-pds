import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
    typography:{
    marginRight: '10px',
    fontWeight:'bold',
    cursor:'pointer'
},
generalCont: {
    padding: '15px'
},
typographySelected: {
    marginRight: '10px',
    color:'orange',
    textDecoration:'underline',
    fontWeight:'bold',
    cursor:'pointer'
},
graphResponsive: {
    margin: '30px auto 100px auto',
    [theme.breakpoints.down('sm')]: {
        height: '60vh',
        width: '60vw'
    }    
},
noDataCont: {
    margin: '30px 0 80px 0',
    justifyContent: 'center'
},
alertCont: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 69, 113, 0.1)',
    borderRadius: '10px',
    padding: '15px'
},
noDataText: {
    color: 'rgb(0, 69, 113)',
    fontSize: '16px',
    marginTop: '20px',
    textAlign: 'center'
},
optionsCont:{
    marginBottom: '15px',
    justifyContent: 'center'
},
graphResponsiveLinear: {
    margin: '0 auto',
    [theme.breakpoints.down('sm')]: {
        height: '60vh',
        width: '85vw',
        position: 'relative',
    }      
}
}))

export default useStyles

