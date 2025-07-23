import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({

  headboard: {
    backgroundColor: '#f9f8f7',
    padding: '13px',
    borderRadius: '10px',
  },
  codSr: {
    display: 'inline-block',
    backgroundColor: '#009AA6',
    fontWeight: 'bold',
    padding: '12px 32px',
    borderRadius: '20em',
    color: 'white',
    position:'relative',
    zIndex:1,
    [theme.breakpoints.down('sm')]: {
      padding: '12px 45px'
    }
   },
  status:{
    display: 'inline-block',
    backgroundColor: 'white',
    fontWeight: 'bold',
    padding: '12px 32px',
    borderRadius: '0em 20em 20em 0em',
    marginLeft:'-15px',
    color: 'orange',
    [theme.breakpoints.down(1420)]: {
      padding: '12px 45px',
      borderRadius: '20em 20em 20em 20em',
      marginLeft:'0px',
      marginTop: '11px',
    }
  },
  title:{
    color:'rgba(0, 69, 113, 1)',
    fontSize:'1.03em',
    fontWeight:600,
  },
  marginDate:{
    margin: '10px 0px 10px 0px',
    [theme.breakpoints.down('sm')]: {
        margin: '10px 10px 10px 10px',
    },
  },
  marginTop: {
    margin:'10px',
  },
  genericMargin:{
    margin:'10px',
  },
  comments:{
    margin:'10px 0px 0px 0px',
  },
  arrow: {
    transform: 'rotate(90deg)',
    width: '9px',
    marginRight: '10px',
    marginLeft: '10px',
    transition: 'transform 0.2s ease-in-out',
    cursor: 'pointer',
  },
  documents: {
    margin: '12px',
  },
  documentBubble: {
    color: '#267cd3',
    display: 'inline-block',
    padding: '7px 20px',
    fontWeight: 'bold',
    borderRadius: '20em',
    backgroundColor:'#eff0f0',
    margin: '8px',
  },
  documentLink: {
    textDecoration: 'none',
    color: '#267cd3',
  },
  response: {
    border: 'grey solid 1px',
    padding: '12px',
    backgroundColor:' white',
    borderRadius: '0.2em',
    marginTop: '10px',
    borderColor: 'rgba(0, 69, 113, 1)',
  },
  fontWeight: {
    fontWeight: 600,
  },
  reopen: {
    color: '#267cd3',
    textDecoration:'underline',
    cursor:'pointer'
  }
}))

export default useStyles