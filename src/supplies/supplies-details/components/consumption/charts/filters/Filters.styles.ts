import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      marginTop: 16
    }
  },
  label: {
    color: 'rgba(0, 69, 113, 1)'
  },
  label2: {
    color: 'rgba(0, 69, 113, 1)',
    textAlign: 'center',
    marginBlock: 40

  },
  label3: {
    color: 'rgba(0, 69, 113, 1)',
    margin: 'auto 0'
  },
  input: {
    width: '85%',
    fontSize: '14px',

    '& input, & .MuiSelect-selectMenu': {
      background: '#FFF',
      paddingTop: '15px',
      paddingBottom: '15px'
    },
  },


  menu: {
    alignItems: 'flex-end',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      gap: '15px'
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: 0
    }
  },
  menu2: {
    marginTop: 5,
    [theme.breakpoints.down('sm')]: {
      width: '50%',
      justifyContent: 'center'
    }
  },
  menu3: {
    marginBottom: 20,
    [theme.breakpoints.down('sm')]: {
      width: '50%',
      justifyContent: 'center'
    }
  },
  menuItem: {
    [theme.breakpoints.down('sm')]: {
      margin: 10 + 'px',
    }
  },

  menuItem2: {
    padding: '12px',
    fontSize: 16,
    border: 'solid 1px #E1E9EE',
    color: '#004571',
    borderRadius: 4,
    cursor: 'pointer',
    marginLeft: 4,
    '&:first-child': {
      marginLeft: 0
    },
    '&.active': {
      fontWeight: 'bold',
      borderColor: '#E57200'
    },
    [theme.breakpoints.down('sm')]: {
      width: '32.5%',
      textAlign: 'center'
    }
  },
  buttonContainer: {
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
      marginTop: 16
    },
    [theme.breakpoints.up('sm')]: {
      width: 'auto',
      flexBasis: 'auto'
    },
  },

  button: {
    padding: '3px 20px 4px',
    height: 44,
    marginRight: 0,
    '& span[class^="MuiButton-label"]': {
      fontSize: 16
    },

  },

  reload: {
    width: '35px',
  },
  containerInformativo: {
    backgroundColor: '#E5ECF0',
    borderRadius: 4,
    marginBottom: 20,
    color: 'rgba(0, 69, 113, 1)',
    display: 'flex',
    margin: 'auto'
  },
  text: {
    lineHeight: '20px',
    '& a': {
      color: '#1674D1'
    }
  },
  message: {
    alignItems: 'center',
    float: 'left',
    marginTop: 26,
  },
  icon: {
    float: 'left',
    margin: 21
  },
}))

export default useStyles
