import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  generalCont: {
    marginTop: '20px',
    color: '#266186'
  },
  link: {
    color: '#267cd3',
    textDecoration: 'underline',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  addDocsCont: {
    margin: '0 auto'
  },
  formatTxt: {
    marginTop: '20px',
    color: '#7D7C7C'
  },
  separator: {
    width: '100%',
    border: '1px solid rgba(125, 124, 124, 0.3)',
    borderStyle: 'dashed',
    '&.v1': {
      margin: '25px 0 10px 0'
    },
    '&.v2': {
      margin: '10px 0 25px 0'
    },
    '&.v3': {
      margin: '25px 0 25px 0'
    }
  },
  uploadDocsCont: {
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  text: {
    marginLeft: '5px',
    marginRight: '5px',
    marginTop: '5px',
    marginBottom: '5px',
    '&.redEnable': {
      color: '#CF0E11'
    }
  },
  uploadDocsInput: {
    [theme.breakpoints.only('xs')]: {
      margin: '15px 0 15px 0'
    }
  },
  newRequest: {
    color: '#6AA1D8',
    textDecoration: 'none',
    border: '1px solid #838383',
    background: '#F8F7F5',
    cursor: 'pointer',
    padding: '15px',
    borderRadius: '5px',
    '&.redEnable': {
      color: '#CF0E11',
      border: '1px solid #CF0E11',
      background: 'none'
    }
  },
  icon: {
    width: 18,
    verticalAlign: 'text-top',

    '&.redEnable': {
      color: '#CF0E11'
    }
  },
  iconText: {
    textDecoration: 'underline',
    marginLeft: '5px',
    marginRight: '5px',

    '&.redEnable': {
      color: '#CF0E11'
    }
  },
  docContainer: {
    alignItems: 'center',
    marginTop: '10px',
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
    color: '#6AA1D8',
    textDecoration: 'none',
    border: '1px solid #838383',
    borderRadius: '15px',
    background: '#F8F7F5',
    cursor: 'pointer',
  },
  iconContainer: {
    marginLeft: '20px'
  },
  processingIcon: {
    width: 26,
    verticalAlign: 'text-top',
    '&.redEnable': {
      color: '#CF0E11'
    }
  },
}))

export default useStyles