import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  saveLabel: {
    paddingLeft: 4,
    color: 'rgba(0, 69, 113, 1)',
    fontWeight: 'bold'
  },
  saveIcon: {
    marginRight: 6
  },
  editText: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  textButton: {
    bottom: 4
  }
}))

export default useStyles
