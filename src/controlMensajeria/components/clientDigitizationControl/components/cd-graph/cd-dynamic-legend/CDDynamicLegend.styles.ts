import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    margin: '20px 0 20px 0'
  },
  itemContainer: {
    color: 'rgba(0, 69, 113, 1)',
    display: 'flex',
    alignItems: 'center',    
    [theme.breakpoints.up('sm')]: {
			justifyContent: 'center'
		}
  },
  span: {
    marginLeft: -5
  },
  icon: {
    width: '25px',
    marginRight: '10px'
  },
}))

export default useStyles