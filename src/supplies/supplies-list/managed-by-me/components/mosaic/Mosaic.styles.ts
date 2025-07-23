import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  table: {
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
  row: {
    marginTop: 14
  },
  title: {
    color: '#1674D1',
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
  },
  checkboxContainer: {
    background:'white',
    paddingTop:10,
    paddingBottom:10,
    margin: '18px 0 6px'
  },
  actionsContainer: {
    
    '& div': {
      margin: '4px 6px 0',
    },
    '& span': {
      visibility: 'hidden',
      color: '#1674D1',
      textDecoration: 'underline',
      cursor: 'pointer'
    },
    '& span.visible': {
      visibility: 'visible'
    },
    '& span.disabled': {
      pointerEvents: 'none',
      color: '#BBB',
      cursor: 'default'
    }
  },
  buttonContainer: {
    marginTop: 18
  },
  button: {
    color: '#1674D1',
    [theme.breakpoints.down('xs')]: {
      fontSize: 16,
      fontWeight: 'bold'
    }
  },
  supplyTypeIcon: {
    '& img': {
      width: 16,
      height: 16
    }
  },
  supplyTypeLabel: {
    marginLeft: 2
  },
  itemsPerPage: {
    justifyContent: 'flex-end',
    marginTop: 10,
    fontSize: 14,
    color: '#004571'
  },
  select: {
    borderRadius: 4,
    borderColor: '#004571',
    color: '#004571'
  },
  totalItems: {
    justifyContent: 'flex-start',
    fontSize: 14,
    marginTop: '12px',
    marginBottom: '12px',
    color: '#004571'
  },
  loadingBox: {
    backgroundColor:'#f2f6f8',
    height: 'auto',
    justifyContent: 'flex-start',
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    fontSize: 16,
    color: '#004571',
    marginTop: 12
  },
  loadingAnimation: {
    display: 'block',
    width: 45,
    height: 45,
    marginLeft: '10px',
    marginRight: '10px'
  },
  loadingText: {
    overflowWrap: 'break-word',
    wordBreak: 'break-word',
    maxWidth: 'calc(100% - 40px)',
    flex: '1'
  }
}))

export default useStyles
