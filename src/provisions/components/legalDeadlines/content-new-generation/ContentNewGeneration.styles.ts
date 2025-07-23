import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  generalCont: {
    textAlign: 'center',
    color: '#004571'
  },
  table: {
    border: '1px solid #004571',
    margin: '30px 0 0 0'
  },
  titleRow: {
    backgroundColor: '#F2F5F8',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    padding: '20px',
    border: '1px solid #004571',
    width: '100%',
    [theme.breakpoints.only('xs')]: {
      fontSize: 10,
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
  secondaryDescription: {
    marginTop: 3,
    color: 'rgba(0, 0, 0, 0.87)',
    fontSize: 16,
    [theme.breakpoints.only('xs')]: {
      fontSize: 10
    }
  },
  scriptDescription: {
    marginTop: 3,
    color: 'rgba(0, 0, 0, 0.87)',
    fontSize: 16,
    marginLeft: 10,
    [theme.breakpoints.only('xs')]: {
      fontSize: 10
    }
  },
  thirdDescription: {
    marginTop: 20,
    color: 'rgba(0, 0, 0, 0.87)',
    fontSize: 16,
    [theme.breakpoints.only('xs')]: {
      fontSize: 10
    }
  },
  descriptionCont: {
    textAlign: 'left',
    marginTop: '20px',
  },
  description: {
    fontSize: 16,
    [theme.breakpoints.only('xs')]: {
      fontSize: 10
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
  header: {
    justifyContent: 'center',
    fontWeight: 'bold'
  },
  marginTop: {
    marginTop: '15px'
  }
}))

export default useStyles
