import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  
  generalArea: {
    backgroundColor: '#f9f8f7'
  },
  title:{
    color:'#004571',
    fontWeight:'bold'
  },
  subtitle:{
    color:'#004571',
  },
  subtext:{
    color:'#88898c',
    marginTop:'8px'
  },
  container: {
    marginTop: 32
  },
  description: {
    color: '#004571',
    fontWeight: 'bold',
    marginBottom: 24
  },
  attach: {
    alignItems: 'center',
    padding:'10px 10px 10px 10px'
  },
  button: {
    minWidth: '100% !important',
    fontSize: 14
  },
  help: {
    color: '#868686',
    fontSize: 14,
    marginTop: 4
  },
  addBox: {
    display: 'flex', 
    alignItems: 'center', 
    padding:'10px',
    color: '#2d80d3',
    textDecoration: 'none',
    border: '2px solid #dfd9d9',
    borderRadius:'6px',
    background: '#F8F7F5',
    cursor: 'pointer',
    justifyContent: 'center',

    '&.redEnable': {
      color: '#CF0E11',
      border: '1px solid #CF0E11',
      background: 'none'
    }
  },
  addIcon: {
     marginRight: '8px', 
     width: 'fit-content', 
     height: 'fit-content',
     verticalAlign: 'text-top',
  },
  icon: {
    width: 26,
    verticalAlign: 'text-top',

    '&.redEnable': {
      color: '#CF0E11'
    }
  },

  iconText: {
    marginLeft: '5px',
    marginRight: '5px',

    '&.redEnable': {
      color: '#CF0E11'
    }
  },
  input: {
    '& input[type=number]': {
      '-moz-appearance': 'textfield',
    },
    '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'rgba(0, 69, 113, 0.5)'
      },
      '&:hover fieldset': {
        borderColor: 'rgba(0, 69, 113, 0.5)'
      },
      '&.Mui-focused fieldset': {
        borderColor: 'rgba(0, 69, 113, 0.5)'
      }
    },
  },

  disabledInput: {
    cursor:'pointer',
    // backgroundColor: '#fff',  // Fondo blanco para el input deshabilitado
    // color: 'rgba(0, 0, 0, 0.6)',  // Color del texto deshabilitado
    
      backgroundColor: '#fff',  // Fondo blanco para el input deshabilitado
      color: '#000',  // Color más oscuro para el texto cuando está deshabilitado
      '-webkit-text-fill-color': '#000',  // Asegura que el color del texto también funcione en WebKit browsers
    
  },

  caption: {
    color:'#646466',
    marginLeft: '13px',
    position: 'relative',
    bottom: '7px',
  },
  standardText1: {
    color:'#004571',
    fontWeight:'bold'
  },
  standardText2: {
    color:'grey'
  },

  buttons: {
    justifyContent: 'center',
    marginTop: 32,
    '& button': {
      margin: '0 16px',
      [theme.breakpoints.only('xs')]: {
        '&:first-child': {
          marginBottom: 16
        }
      }
    }
  },
  back: {
    fontSize: 36,
    color: '#004571',
    textAlign: 'center',
    margin: '26px 10px 36px 10px'
  },

}))

export default useStyles
