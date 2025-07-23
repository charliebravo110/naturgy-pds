import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    justifyContent: 'flex-start',
    backgroundColor: '#F8F7F5',
    padding: 30,
    borderRadius: 10,
    marginTop: 40
  },
  container2: {
    justifyContent: 'flex-start',
    padding: 30,
    borderRadius: 10,
    fontSize: 14
  },
  itemContainer: {
    marginRight: 5,
    color: '#777'
  },
  itemContainer2: {
    marginRight: 5,
    marginTop: 10,
    color: '#777'
  },
  itemContainer3: {
    color: '#777'
  },
  titleContainer: {
    justifyContent: 'center',
    color: '#004571',
    fontWeight: 'bold'
  },
  linkContainer: {
    width: '3%',
    height: '3%',
    marginTop: 12
  },
  span: {
    marginLeft: -5,
    color: '#777'
  },
  span2: {
    color: '#004571',
    fontWeight: 'bold'
  },
  legendContainer: {
    marginLeft: 30,
    fontSize: 14
  },
  space: {
    justifyContent: 'space-between'
  }
}))

export default useStyles