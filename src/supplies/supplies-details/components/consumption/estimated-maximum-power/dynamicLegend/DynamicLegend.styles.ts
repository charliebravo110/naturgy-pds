import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    justifyContent: 'flex-start'
  },
  itemContainer: {
    marginRight: 5,
    color: 'rgba(0, 69, 113, 1)'
  },
  itemContainer2: {
    color: 'rgba(0, 69, 113, 1)'
  },
  linkContainer: {
    width: '3%',
    height: '3%',
    marginTop: 12
  },
  span: {
    marginLeft: -5
  },
  supText: {
    marginTop: 10,
    marginBottom: 5,
    marginLeft: 10,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#777'
},
}))

export default useStyles