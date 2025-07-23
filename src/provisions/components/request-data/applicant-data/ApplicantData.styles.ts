import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({

  inputContainer: {
    marginBottom: 30,

  },
  label2: {
    color: '#004571',    
    [theme.breakpoints.down('sm')]: {
      marginBottom: 7,
    }
  },
  noInput: {
    '&.MuiGrid-item': {
      [theme.breakpoints.down('md')]: {
        padding: 0
      }
    }
  },
  documentContainer: {
    [theme.breakpoints.only('xs')]: {
      margin: '0 auto'
    }
  },
  item: {
    backgroundColor: '#F8F7F6',
    border: '1px solid #E3E6E8',
    borderRadius: '5px',
    position: 'relative',
    width: '180px',
    height:'80px'
  },
  item2: {
    backgroundColor: '#F8F7F6',
    cursor: 'pointer',
    borderRadius: '5px',
    position: 'relative',
    width: '200px',
    height:'50px',
    border: '1px solid #E3E6E8',
    marginRight: '10px',
    display: 'flex',
    alignItems: 'center',
  },
  container: {
    margin: '70px auto',
    width: '20px',
    height: 'auto',
    textAlign: 'center',
    fontSize: 14
  },
  label: {
    marginBottom: 7,
    color: '#004571'
  },
  label3: {
    marginBottom: 7,
    marginTop: 7,
    color: '#004571'
  },
  input: {
    color: '#868686',
    '& .MuiSelect-root': {
      color: '#868686'
    }
  },
  cuadroCheck:{
    marginLeft:10
  },
  marginLeft: {
    marginLeft: 10
  },
  question: {
    color: '#004571',
    fontWeight: 'bold'
  },
  question2: {
    color: '#004571',
    fontWeight: 'bold',
    marginTop:20
  },
  formatText: {
    marginBlock: '8px', 
    color: '#838383'
  },
  downloadBox: {
    marginBlock: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    cursor: 'pointer',
    textDecoration: 'none'
  },
  downloadLink: {
    textDecoration: 'none'
  },
  downloadText: {
    color: '#237bd3', 
    paddingRight: 5,
    [theme.breakpoints.down('md')]: {
      width: '80%'
    }
  },
  downloadLinkText: {
    color: '#0167cc', 
    fontWeight: 'bold'
  },
  newTabIcon: {
    width: '16px',
    verticalAlign: 'middle',
    paddingLeft: '2px'
  },
  signedAuthorizationGrid: {
    //width: '50%',
    [theme.breakpoints.down('md')]: {
      width: '50%'
    }
  },
  signedAuthorization: {
    color: '#838383', 
    alignItems: 'center', 
    display: 'flex'
  },
  checkIcon: {
    paddingRight: '5px',
    width: 15,
    '&.desactive': {
      filter: 'invert(86%) sepia(0%) saturate(5377%) hue-rotate(70deg) brightness(106%) contrast(87%)',
      marginLeft: '-10px',
      width: 30
    }
  },
  docContainer: {
    alignItems: 'center',
    marginBottom: '10px',
    marginRight: '20px',
    marginLeft: '20px'
  },
  uploadedFile: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '10px'
  },
  newRequestRound:{
    display: 'flex',
    alignItems: 'center',
    color: '#6AA1D8',
    textDecoration: 'none',
    //border: '1px solid #838383',
    borderRadius: '50px',
    background: '#EFF0F0',
    cursor: 'pointer',
    paddingInline: 6
  },
  text: {
    marginLeft: '5px',
    marginRight: '5px',
    marginTop: '5px',
    marginBottom: '5px',
    color: '#237bd3',
    '&.redEnable': {
      color: '#CF0E11'
    }
  },
  deleteIcon: {
    height: 10,
    backgroundColor: 'white',
    padding: '5px',
    borderRadius: '100%'
  },

  newRequest: {
    color: '#6AA1D8',
    textDecoration: 'none',
    border: '1px solid #838383',
    background: '#F8F7F5',
    cursor: 'pointer',
    borderRadius: '5px',
    padding: '12px',
    borderColor: '#d0dbe1',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    gap: '5px',

    [theme.breakpoints.up('md')]: {
      display: 'flex',
      justifyContent: 'flex-start'
    },

    '&.disabled': {
      cursor: 'none'
    },

    '&.redEnable': {
      color: '#CF0E11',
      border: '1px solid #CF0E11',
      background: 'none'
    },
  },

  newRequestIcon: {
    width: 18,
    verticalAlign: 'middle',
    color: '#237bd3',
  
    '&.disabled': {
      filter: 'invert(99%) sepia(0%) saturate(0%) hue-rotate(130deg) brightness(85%) contrast(94%)',
    },

    '&.redEnable': {
      color: '#CF0E11'
    }
  },
  
  newRequestIconText: {
    marginLeft: '5px',
    marginRight: '5px',
    color: '#237bd3',
    width: '140px',

    '&.disabled': {
      color: '#d3d3d2'
    },

    '&.redEnable': {
      color: '#CF0E11'
    }
  },
  privacity: {
    margin: '6px 0px 6px 6px'
  },
  separator: {
    height: 2,
    backgroundColor: '#E9EFF4',
    margin: '5px 0'
  },
  subtitleBlock: {
    //margin: '20px 0'
    marginBlock: '16px',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'space-between'
    }
  },
  icon: {
    width: '40px',
    height: '33px',
    cursor: 'pointer'
  },
  subtitleIcon: {
    width: '5%',
    [theme.breakpoints.down('md')]: {
      width: '10%'
    }
  },
  subtitleGrid: {
    width: '95%',
    paddingLeft: '2px',
    [theme.breakpoints.down('md')]: {
      width: '90%',      
      paddingLeft: '15px'
    }
  },
  subtitle: {
    color: '#838383'
  },
  subtitle2: {
    color: '#868686',
    marginTop: 20
  },
  subtitle3: {
    color: '#868686',
    marginBottom: 20,
    textAlign: 'left', 
    padding: '15px 0px'
  },
  subtitle4: {
    color: '#004571',
    fontSize: '12px'
  },
  declaProp:{
    display: 'block',
    lineHeight: '1.2',
    gap: '0',
    color: '#004571'
  },
  dataRelating: {
    fontSize:'14px', 
    color: '#004571', 
    marginBottom: '16px'
  },


  subtitle_datos: {
    color: '#004571'
  },
  subtitle2_datos: {
    color: '#004571',
    marginTop: 20
  },

  checkbox: {
    color: '#004571',

    '& .MuiFormControlLabel.label' : {
      lineHeight: '1'
    }
  },
  checkboxLink: {
    color: '#0E80D4',
    textDecoration: 'underline'
  }
}))

export default useStyles