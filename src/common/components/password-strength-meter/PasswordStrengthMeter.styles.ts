import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  info: {
    display: 'inline-block',
    fontSize: 13,
    color: '#525659'
  },
  label: {
    fontSize: 13,
    fontWeight: 'bold'
  },
  boxes: {
    display: 'inline-block',
    marginRight: 8
  },
  box: {
    display: 'inline-block',
    width: 13,
    height: 13,
    backgroundColor: '#E0DBD4',
    marginRight: 6
  },
  soft: {
    backgroundColor: '#DEE28D'
  },
  medium: {
    backgroundColor: '#A3AD00'
  },
  hard: {
    backgroundColor: '#EA4D4C'
  }
}))

export default useStyles
