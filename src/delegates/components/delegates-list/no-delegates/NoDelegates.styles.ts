import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '20px 0',
    marginTop: 140
  },
  box: {
    margin: '24px auto 0'
  },
  headerSubTitle: {
    fontFamily: 'Arial, Helvetica, Arial, serif',
    color: 'rgb(0, 69, 113)',
    textAlign: 'center',
    marginTop: '2%',
    marginBottom: '10px',
  },
  tickText: {
    color: '#838383',
    position: 'relative'
  },
  tickIcon: {
    position: 'absolute',
    left: '-50px',
    top: '-5px',
    [theme.breakpoints.only('xs')]: {
      left: '-35px'
    }
  },
  addNewDelegate: {
    '-webkit-box-shadow': '0px 0px 3px 1px rgba(207, 205, 207, 1)',
    '-moz-box-shadow': '0px 0px 3px 1px rgba(207, 205, 207, 1)',
    boxShadow: '0px 0px 3px 1px rgba(207, 205, 207, 1)',
    padding: '20px',
    marginTop: '4%',
    marginBottom: '4%',
    textAlign: 'center',
    '& span': {
      textAlign: 'center',
      cursor: 'pointer',
      '&.disabled': {
        opacity: .5,
        cursor: 'default'
      }
    }
  },
  newDelegateText: {
    color: '#1674D1'
  }
}))

export default useStyles
