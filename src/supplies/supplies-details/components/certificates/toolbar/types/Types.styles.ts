import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  types: {

  },
  label: {
    color: '#004571'
  },
  items: {
    marginTop: 6
  },
  item: {
    color: '#004571',
    padding: '12px 20px',
    border: 'solid 1px #E1E9EE',
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
  }
}))

export default useStyles
