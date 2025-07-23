import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  searchBar: {
    marginBottom: 20,
    marginTop: 5,
    marginLeft: 20,
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  removeDelegate: {
    color: '#1674D1',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'flex-end',
    cursor: 'pointer',
    '&.disabled': {
      color: '#BBB',
      cursor: 'default'
    },
    '& img': {
      paddingRight: 5,
      paddingBottom: 5
    },
    [theme.breakpoints.down('md')]: {
      marginBottom: 20
    }
  },
  view: {
    marginRight: 10,
    [theme.breakpoints.down('sm')]: {
      marginBottom: 10
    }
  },
  mobileFullWidth: {
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  datepickerContainer: {
    marginTop: 10
  },
  datepickerContainerB: {
    marginTop: 10,
    gridGap: '0px 35px'
  },
  datepickerTitle: {
    fontSize: 16,
    color: 'rgba(0, 69, 113, 1.0)',
  },
  codTitle: {
    fontSize: 16,
    color: 'rgba(0, 69, 113, 1.0)',
    marginBottom: 7
  },
  SearchButton: {
    cursor: 'pointer',
  },
  button: {
    width: 70,
    height: 15,
    fontSize: 16,
    position: 'relative',
    backgroundColor: '#004571',
    color: '#FFF',
    padding: '19px 0px 16px 27px',
    marginTop: '25px',
    marginRight:'10px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  exportButton: {
    width: 135,
    height: 15,
    fontSize: 16,
    position: 'relative',
    backgroundColor: '#004571',
    color: '#FFF',
    padding: '19px 0px 16px 27px',
    marginTop: '25px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  searchImg: {
    width: 14,
    height: 14,
    padding: '5px 3px 0px 2px'
  },
  searchText: {
    position: 'relative',
    bottom: '1.5px'
  },
  input: {
    width: '94%',
    fontSize: '14px',
    backgroundColor: 'rgb(247, 247, 247)',
    '& input, & .MuiSelect-selectMenu': {
      background: '#FFF',
      paddingTop: '15px',
      paddingBottom: '15px'
    }
  },
  datepickerInput: {
    width: 200,
  },
  searcher: {
    justifyContent: 'flex-end',
    paddingRight: 8,
    paddingTop: 6,
    [theme.breakpoints.down('sm')]: {
      paddingRight: 0,
      paddingBottom: 14
    }
  },
}))

export default useStyles
