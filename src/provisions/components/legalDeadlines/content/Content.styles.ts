import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  generalCont: {
    color: '#004571'
  },
  linksCont: {
    justifyContent: 'center',
    marginTop: '20px'
  },
  link1: {
    fontSize: 18,
    marginRight: 20,
    cursor: 'pointer',
    [theme.breakpoints.only('xs')]: {
      fontSize: 12
    }
  },
  link1Selected: {
    fontSize: 18,
    marginRight: 20,
    cursor: 'pointer',
    fontWeight: 'bold',
    borderBottom: '4px solid #E97000',
    paddingBottom: '5px',
    [theme.breakpoints.only('xs')]: {
      fontSize: 12
    }
  },
  link2: {
    fontSize: 18,
    cursor: 'pointer',
    [theme.breakpoints.only('xs')]: {
      fontSize: 12
    }
  },
  link2Selected: {
    fontSize: 18,
    cursor: 'pointer',
    fontWeight: 'bold',
    borderBottom: '4px solid #E97000',
    paddingBottom: '5px',
    [theme.breakpoints.only('xs')]: {
      fontSize: 12
    }
  },
  firstTable: {
    border: '1px solid #004571',
    margin: '30px 0 0 0'
  },
  secondTable: {
    border: '1px solid #004571',
    margin: '60px 0 0 0'
  },
  descriptionCont: {
    textAlign: 'left',
    marginTop: 40,
  },
  description: {
    fontSize: 16,
    [theme.breakpoints.only('xs')]: {
      fontSize: 10
    }
  },
  descriptionBold: {
    fontSize: 16,
    fontWeight: 'bold',
    [theme.breakpoints.only('xs')]: {
      fontSize: 10
    }
  },
  secondaryDescription: {
    marginTop: 20,
    color: 'rgba(0, 0, 0, 0.87)',
    fontSize: 16,
    [theme.breakpoints.only('xs')]: {
      fontSize: 10
    }
  },
  scriptDescription: {
    marginTop: 20,
    color: 'rgba(0, 0, 0, 0.87)',
    marginLeft: 10,
    fontSize: 16,
    [theme.breakpoints.only('xs')]: {
      fontSize: 10
    }
  },
  cell: {
    padding: '10px',
    border: '1px solid #004571',
    color: 'rgba(0, 0, 0, 0.87)',
    [theme.breakpoints.only('xs')]: {
      fontSize: 10,
      fontWeight: 'bold',
      padding: '5px',
    }
  },
  celln: {
    padding: '10px',
    border: '1px solid #004571',
    color: 'rgba(0, 0, 0, 0.87)',
    alignItems: 'center',
    fontWeight: 'bold',
    [theme.breakpoints.only('xs')]: {
      fontSize: 10,
      fontWeight: 'bold',
      padding: '5px',
    }
  },
  flexCell: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#EBE9E6',
    border: '1px solid #004571',
    fontWeight: 'bold',
    [theme.breakpoints.only('xs')]: {
      fontSize: 10,
      padding: '5px',
      fontWeight: 'bold',
      '&.extraSmall': {
        fontSize: 8,
        fontWeight: 'bold',
        padding: '2px',
      }      
    }
  },
  centeredTextCell: {
    textAlign: 'left',
    padding: '10px',
    border: '1px solid #004571',
    [theme.breakpoints.only('xs')]: {
      fontSize: 10,
      padding: '5px',
    }
  },
  bold: {
    fontWeight: 'bold'
  },
  marginTop: {
    marginTop: '15px'
  }
}))

export default useStyles
