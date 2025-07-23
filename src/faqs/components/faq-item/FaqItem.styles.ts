import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '20px 0'
  },
  question: {
    fontFamily: 'Arial, Helvetica, Arial, serif',
    fontWeight: 'bold',
    color: 'rgba(0, 69, 113, 1.0)',
    padding: '20px',
    '-webkit-box-shadow': '0px 0px 3px 1px rgba(207,205,207,1)',
    '-moz-box-shadow': '0px 0px 3px 1px rgba(207,205,207,1)',
    boxShadow: '0px 0px 3px 1px rgba(207,205,207,1)',
    userSelect: 'none'
  },
  questionText: {
    height: '100%'
  },
  arrow: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  arrowIcon: {
    width: '20px'
  },
  arrowIconUp: {
    transform: 'rotate(180deg)'
  },
  answer: {
    color: 'rgb(131, 131, 131)',
    padding: '20px 0',
  },
  faqItem: {
    '-webkit-box-shadow': '0px 0px 3px 1px rgba(207,205,207,1)',
    '-moz-box-shadow': '0px 0px 3px 1px rgba(207,205,207,1)',
    boxShadow: '0px 0px 3px 1px rgba(207,205,207,1)',
    marginBottom: '3%',
    width: '100%',
    cursor: 'pointer'
  }
}))

export default useStyles