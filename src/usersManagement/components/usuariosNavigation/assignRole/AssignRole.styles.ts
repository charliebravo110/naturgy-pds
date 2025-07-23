import { makeStyles, withStyles } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell'
import colors from '../../../../assets/colors/colors'

const useStyles = makeStyles((theme) => ({
  inputsAreaWrapper: {
    marginBottom: '4%',
    [theme.breakpoints.up('sm')]: {
      padding: '20px',
      '-webkit-box-shadow': '0px 0px 3px 1px rgba(207,205,207,1)',
      '-moz-box-shadow': '0px 0px 3px 1px rgba(207,205,207,1)',
      boxShadow: '0px 0px 3px 1px rgba(207,205,207,1)'
    }
  },
  inputsArea: {
    background: 'white',
    '-webkit-box-shadow': '0px 0px 3px 1px rgba(207,205,207,1)',
    '-moz-box-shadow': '0px 0px 3px 1px rgba(207,205,207,1)',
    boxShadow: '0px 0px 3px 1px rgba(207,205,207,1)',
    [theme.breakpoints.up('sm')]: {
      backgroundColor: 'rgb(247, 247, 247)',
      '-webkit-box-shadow': 'none',
      '-moz-box-shadow': 'none',
      boxShadow: 'none'
    }
  },
  select: {
    backgroundColor: '#FFF',
    borderColor:'primary'
  },
  // input: {
  //   width: '100%',
  //   '& input, & .MuiSelect-selectMenu': {
  //     background: 'white',
  //     paddingTop: '15px',
  //     paddingBottom: '15px'
  //   }
  // },
  input: {
    width: '100%',
    backgroundColor: '#FFF',
    '& input, & .MuiSelect-selectMenu': {
      background: '#FFF',
      paddingTop: '15px',
      paddingBottom: '15px'
    }
  },

  input2: {
    width: '100%',
    backgroundColor: '#FFF',
    '& input, & .MuiSelect-selectMenu': {
      background: '#FFF',
      paddingTop: '15px',
      paddingBottom: '15px'
    }
  },
  tabWidth: {
    width: '100%',
  },
  rolContainer:{
    marginTop:'20px',
   
    [theme.breakpoints.up('sm')]: {
       marginBottom:'20px'
    }
  },
  lowMargin:{
   
    [theme.breakpoints.down('sm')]: {
       marginBottom:'20px'
    }
  },
  inputTitle: {
    color: 'rgba(0, 69, 113, 1.0)',
    fontSize: '14px',
    marginTop: '20px',
    [theme.breakpoints.up('sm')]: {
      height: '28px',
      display: 'flex',
      alignItems: 'flex-end'
    }
  },
  tableTitle: {
    color: 'rgba(0, 69, 113, 1.0)',
    fontSize: '14px',
    marginTop: '20px',
    [theme.breakpoints.up('sm')]: {
      height: '28px',
      display: 'flex',
      alignItems: 'flex-end'
    }
  },
  flex: {
    display: 'flex',
    flexWrap: 'nowrap'
  },
  buttonWrapper: {
    width: '50% !important',
    [theme.breakpoints.up('sm')]: {
      width:'100%'
    },
    [theme.breakpoints.up('xs')]: {
      width:'100% !important'
    }
  },
  inactive: {
    pointerEvents: 'none',
    userSelect: 'none',
    '& p': {
      color: 'rgb(220, 220, 220)'
    },
    '& .MuiButton-containedPrimary': {
      background: 'rgb(220, 220, 220)'
    }
  },
  table: {
    overflow: 'hidden',
    borderRadius: '4px'
  },
  headTableCell: {
    paddingRight: 10,
    width: '25%',
    textAlign: 'center',
    '&.name': {
      paddingLeft: 0
    }
  },
  boldCell: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  row: {
    backgroundColor: '#F8F7F6',
    border: 'solid 2px transparent',
    borderTop: 0,
    borderBottom: 0
  },
  tableMosaic: {
    width: '100%',
    fontSize: 14,
    borderRadius: 4,
    overflow: 'hidden'
  },
  item: {
    backgroundColor: '#F8F7F6',
    textAlign: 'center',
    padding: '12px 20px 26px',
    border: 'solid 2px transparent',
    borderRadius: 4,
    '&.selected': {
      backgroundColor: '#E6F2FB',
      borderColor: '#1674D1'
    }
  },
  rowMosaic: {
    marginTop: 14
  },
  title: {
    color: '#004571',
    fontSize: 'inherit',
    fontWeight: 'bold'
  },
  value: {
    fontSize: 'inherit',
    marginTop: 6,
    '&.bold' : {
      fontWeight: 'bold'
    },
    '& a': {
      color: '#1674D1'
    }
  }
}));

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: '#EBE9E6',
    color: '#004571',
    fontSize: 14,
    fontWeight: 'bold',
    height: 42,
    boxSizing: 'border-box',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 5,
    textAlign: 'center'
  },
  body: {
    fontSize: 12,
    padding: '10px 10px 10px 5px',
    border: 0
  }
}))(TableCell)

export default useStyles

export { StyledTableCell }