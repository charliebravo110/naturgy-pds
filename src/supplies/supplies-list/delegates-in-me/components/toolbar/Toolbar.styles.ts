import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  action: {
    color: '#1674D1',
    fontSize: 14,
    marginLeft: 18,
    marginTop: '12px',
    marginBottom: '12px',
    cursor: 'pointer',
    '&.disabled': {
      color: '#BBB',
      cursor: 'default'
    }
  },
  toolbar: {
    marginTop: 10,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  toolbarRight: {
    paddingRight: 8,
    [theme.breakpoints.down('xs')]: {
      width: '100%'
    }
  },
  items: {
    alignItems: 'center'
  },
  selectedItemsCounter: {
    display: 'block',
    backgroundColor: '#E5ECF0',
    color: '#004571',
    whiteSpace: 'pre-wrap',
    textAlign: 'center',
    padding: 12,
    borderRadius: 4,
    marginBottom: 5
  },

  mobileFullWidth2: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginBottom:'10px'
    }
  },
  exportButton:{
    height: 40,
    marginRight:10
  }


}))

export default useStyles
