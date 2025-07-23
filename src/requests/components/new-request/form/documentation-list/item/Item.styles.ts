import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    alignItems: 'center',
    alignContent: 'center',
    justifyItems: 'center',
    [theme.breakpoints.down('sm')]: {
      marginTop: 8
    },

    // '&.redEnable': {min-height
    //   color: '#CF0E11',
    //   border: '2px solid #CF0E11'
    // }
  },
  red: {
    color: '#CF0E11',
    border: '2px solid #CF0E11'
  },
  newRequest: {
    color: '#6AA1D8',
    textDecoration: 'none',
    border: '1px solid #838383',
    background: '#F8F7F5',
    cursor: 'pointer',

    '&.redEnable': {
      color: '#CF0E11',
      border: '1px solid #CF0E11',
      background: 'none'
    }
  },
  newRequestRound:{
    color: '#6AA1D8',
    textDecoration: 'none',
    border: '1px solid #838383',
    borderRadius: '15px',
    background: '#F8F7F5',
    cursor: 'pointer',

  },
  icon: {
    width: 18,
    verticalAlign: 'text-top',

    '&.redEnable': {
      color: '#CF0E11'
    }
  },
  processingIcon: {
    width: 26,
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
  text: {
    marginLeft: '5px',
    marginRight: '5px',
    marginTop: '5px',
    marginBottom: '5px',
    '&.redEnable': {
      color: '#CF0E11'
    }
  },
  examineButton: {
    cursor: 'pointer',
    display: 'flex'
  },
  addIconCont: {
    marginRight: '10px'
  },
  uploadedFile: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '10px'
  },
  docContainer: {
    alignItems: 'center',
    marginTop: '10px',
    marginBottom: '10px',
    marginRight: '20px',
    marginLeft: '20px'
  },
  iconContainer: {
    marginLeft: '20px'
  },
  deleteIconCont: {
    margin: '0 10px 0 10px'
  },
  dashedLine: {
    borderTop: 'dashed 3px',
    color: '#bbb'
  }
  
}))

export default useStyles
