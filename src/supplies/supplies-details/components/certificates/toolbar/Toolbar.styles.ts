import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  rightContainer: {
    alignItems: 'flex-end',
    [theme.breakpoints.down('sm')]: {
      marginTop: 16
    }
  },
  downloadLink: {
    '& a': {
      textDecoration: 'none',
      color: '#FFF'
    }
  },
  Link: {
  },
  downloadButton: {
    height: 44,
    padding: '3px 20px 4px',
    '& span[class^="MuiButton-label"]': {
      fontSize: 16
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: 16
    }
  },
  descriptionSelfConsumption: {
    color: '#555555',
    lineHeight: '20px',
    paddingBottom: 20,
    marginBottom: '20px'
  },
}))

export default useStyles
