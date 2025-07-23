import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Autorenew } from '@material-ui/icons'
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import { TableCell } from '@material-ui/core';

const useStyles_ = makeStyles((theme) => ({
  noBold: {
    fontWeight: 'normal',
  },
  customText:{
    fontWeight: 'normal',
    color: '#808286'
  },
  closeButton: {
    position: 'absolute',
    top: 18,
    right: 18,
    cursor: 'pointer'
  },
  bellIcon: {
    width: '80px',
    [theme.breakpoints.down('sm')]: {
      width: '62px',
    }
  },
  margin: {
    margin: 'auto',
  },
  gridIcon: {
    display: 'flex'
  },
  gridTitle: {
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      fontSize: '10px',
    }
  },
  gridText: {
    display: 'flex',
  },
  spanTitle: {
    fontSize: '1.8em',
    width: '75%',
    textAlign: 'center',
    color: '#004571',
  },
  spanSubtitle: {
    width: '76%',
    marginTop: '30px',
    textAlign: 'center',
    fontSize: '1.03em',
    marginBottom: '7px',
    color: '#808286'
  },
  color: {
    '& .MuiInputBase-root': {
      color: '#808286',
    }
  },
  container: {
    width: '100%',
    textAlign: 'left'
  },
  label: {
    color: '#004571',
    fontSize: 14,
    marginBottom: 8,
    display: 'flex'
  },
  characterCount: {
    backgroundColor: '#F3F7FB',
    width: 220,
    color: '#004571',
    fontSize: '13px',
    padding: '5px 8px',
    borderRadius: '0 0 4px 4px',
    textAlign: 'center',
    marginTop: '10px',
  },
  gridComment: {
    display: 'flex',
    marginTop: '13px',
    marginBottom: '11px',
  },
  buttons: {
    marginTop: '20px',
  },
  cancelButtonGrid: {
    margin: '10px',
  },
  acceptButtonGrid: {
    margin: '10px'
  },
  cancelButton: {
    color: '#FFFFFF',
    backgroundColor: '##004571 !important'
  },
  acceptButton: {
    color: 'white',
    backgroundColor: '#004571 !important',
  },
  dialogContainer: {
    position: 'relative',
    padding: 20
  },
  cancelarImage: {
    position: 'relative',
    marginLeft: 600,
    marginBottom: 5,
  },
  titleCommentDialog: {
    fontSize: '2em',
    color: '#004571'
  },
  dialogBody: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  items: {
    minHeight: 110,
    justifyContent: 'center',
    marginTop: 12
  },
  item: {
    alignItems: 'center',
    marginTop: 10
  },
  divider: {
    backgroundColor: 'transparent'
  },
  // cups: {
  //   color: '#004571',
  //   width: '100%',
  //   fontSize: '1.14em',
  //   textAlign: 'left',
  //   position: 'relative',
  //   left: '15px',
  //   '@media (max-width: 600px)': {
  //     textAlign: 'center', 
  //     display: 'table-caption',
  //     fontSize: '14px',
  //     marginLeft: '10px'    
  //   },
  // },
  cupsContainer: {
    display: 'flex',
    flexDirection: 'row', // Por defecto en una línea
    justifyContent: 'flex-start',
    alignItems: 'center',
    textAlign: 'left',
    marginLeft: '10px',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column', // Cambiar a columna en dispositivos móviles
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      marginLeft: '0px',
    },
  },
  cupsLabel: {
    color: '#004571',
    marginRight: '4px', // Espaciado entre "CUPS:" y el número en escritorio
    [theme.breakpoints.down('sm')]: {
      marginRight: '0', // Sin espaciado en móviles
      marginBottom: '4px', // Espaciado entre "CUPS:" y el número en móviles
    },
  },
  cupsNumber: {
    fontSize: '1em',
    color: '#004571',
  },
  generalInfo: {
    padding: '25px 15px 25px 15px',
    backgroundColor: '#f2f5f8',
    marginTop: '20px',
    borderBottom: 'solid 1px #658fa9'
  },
  dashedDivider: {
    borderTop: ' 2.7px dashed #c3e0f3',
    backgroundColor: 'transparent',
    marginTop: '17px',
    marginBottom: '17px'
  },
  icon: {
    textAlign: 'center',
    position: 'relative',
    left: '8px',
    '@media (max-width: 600px)': {
      textAlign: 'center',  
      marginRight: '12px'    
    },
  },
  iconFix:{
    textAlign: 'center',
    position: 'relative',
    left: '8px',
    '@media (max-width: 600px)': {
      textAlign: 'center',  
      marginRight: '12px'    
    },
  },
  extraInfo: {
    '@media (max-width: 600px)': {
      textAlign: 'center',
    },
  },
  textLine: {
    marginBottom: '3px',
    '@media (max-width: 600px)': {
      textAlign: 'center',       
    },
  },
  generalInfoTexts: {
    color: '#004571',
    flex: 1, /* Ocupa el resto del espacio */
    display: 'flex',
    flexDirection: 'column',
  },
  contentRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '17px',
    '@media (max-width: 600px)': {
      flexDirection: 'column',
      alignItems: 'center',
      gap: '13px',      
    },
  },
  bold: {
    fontWeight: 'bold'
  },
  expansionPanelSummaryIcon: {
    width: 24
  },
  expansionPanelSummaryText: {
    color: '#004571',
    fontSize: 17,
    fontWeight: 'bold',

  },
  root: {
    width: '100%',
    border: '1px solid #E0E0E0', // Borde claro
    borderRadius: '4px',
    margin: '10px 0', // Espaciado entre paneles
  },
  summary: {
    borderBottom: '1px solid #E0E0E0',
    '& .MuiExpansionPanelSummary-content': {
      justifyContent: 'space-between',
    },
    '& .MuiExpansionPanelSummary-expandIcon': {
      color: '#0072CE', // Color azul para el icono expandible
    },
  },
  details: {
    padding: '5px 20px',
    backgroundColor: '#fff', // Color de fondo blanco para el contenido
    color: '#555', // Color de texto gris para el contenido
    display: 'flex',
    flexDirection: 'column',
    gap: '10px', // Espaciado entre los elementos de texto
  },
  detailsTable:{
    color: '#555', // Color de texto gris para el contenido
    display: 'flex',
    flexDirection: 'column',
    padding: '0px',  
    gap: '10px', // Espaciado entre los elementos de texto
  },
  textLineInfo: {
    fontWeight: 'bold',
    color: '#004571',
    display: 'flex',
    flexDirection: 'column',
    padding: '10px 0'
  },
  textLineInfoPT:{
    fontWeight: 'bold',
    color: '#004571',
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '10px'
  },
  textLineInfoPC:{
      color: '#004571',
      display: 'flex',
      gridAutoFlow: 'column', // Alinea en una fila
      gap: '13px', // Espacio entre los elementos
      alignItems: 'center', // Alineación vertical
      paddingTop: '10px',
      fontWeight: 'bold',
  },
  textLineInfoNoBold:{
    color: '#004571',
    display: 'flex',
    gridAutoFlow: 'column', // Alinea en una fila
    gap: '13px', // Espacio entre los elementos
    alignItems: 'center', // Alineación vertical
    paddingTop: '10px',
},
  //table
  tableContainer: {
    display: 'block',
    [theme.breakpoints.down('sm')]: {
      display: 'none', // Ocultar tabla en móviles
    },
  },
  listContainer: {
    display: 'none', // Ocultar lista en escritorio
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column',     
    },
  },
  listItem: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    borderBottom: '1px solid #ccc'
  },
  messageDate: {
    fontSize: '14px',
    marginBottom: '5px',
  },
  messageDetail: {
    fontSize: '14px',
  },
  //
  enCurso: {
    padding: '25px 10px 25px 10px',
    backgroundColor: '#fbe9d9',
    marginTop: '20px',
    borderBottom: 'solid 1px #E57200',
    '@media (max-width: 600px)': {
      padding: '25px 5px 25px 5px',     
    },
  },
  rechazada: {
    padding: '25px 10px 25px 10px',
    backgroundColor: '#FAE9EA',
    marginTop: '20px',
    borderBottom: 'solid 1px #D3222A'
  },
  anulada: {
    padding: '25px 10px 25px 10px',
    backgroundColor: '#f5f5f5',
    marginTop: '20px',
    borderBottom: 'solid 1px #BDBDBD'
  },
  finalizada: {
    padding: '25px 10px 25px 10px',
    backgroundColor: '#f3f4e6',
    marginTop: '20px',
    borderBottom: 'solid 1px #8e9300',
    '@media (max-width: 600px)': {
      padding: '25px 5px 25px 5px',     
    },
  },
  containerData: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'nowrap',
      alignContent: 'center',
      justifyContent: 'center',
      alignItems: 'center'
    }
  },
}))

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: '#ECEAE7',
    color: '#004571',
    fontSize: 14,
    fontWeight: 'bold',
    paddingRight: 1,
    height: 42,
    boxSizing: 'border-box',
    paddingTop: 10,
    paddingBottom: 10
  },
  body: {
    backgroundColor: '#F8F7F6',
    fontSize: '0.75rem',
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10
  }
}))(TableCell);

const ExpansionPanel = withStyles({
  root: {
    width: '100%',
    //border: '1px solid #E1E9EE',
    borderRadius: 4,
    marginTop: 20,
    boxShadow: 'none',
    '&:before': {
      display: 'none',
    },
    '&:first-child': {
      marginTop: 0
    },
    '&$expanded': {
      marginTop: 20
    }
  },
  expanded: {},
})(MuiExpansionPanel)

const ExpansionPanelSummary = withStyles({
  root: {
    //borderBottom: '1px solid #E1E9EE',
    minHeight: 56,
    backgroundColor: '#f7fbfe',
    '&$expanded': {
      minHeight: 56
    },
    '&:not($expanded)': {
      //borderBottom: 0
    },
    '&.colored': {
      backgroundColor: '#F2F5F8',
      color: '#004571',
      padding: '0 72px'
    }
  },
  content: {
    '&$expanded': {
    },
  },
  expanded: {},
})(MuiExpansionPanelSummary)


const ExpansionPanelDetails = withStyles(theme => ({
  root: {
    //padding: '45px',
    //paddingRight: 45,
    //paddingLeft: 45,
    backgroundColor: '#f7fbfe',
    display: 'block'
  },
}))(MuiExpansionPanelDetails)

export default useStyles_

export {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  StyledTableCell
}