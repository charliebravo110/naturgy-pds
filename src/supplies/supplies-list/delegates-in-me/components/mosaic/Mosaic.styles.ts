import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  checkboxContainer: {
    margin: '18px 0 6px'
  },
  table: {
    width: '100%',
    fontSize: 13,
    borderRadius: 4,
    overflow: 'hidden'
  },
  item: {
    backgroundColor: '#F8F7F6',
    textAlign: 'center',
    padding: '12px 20px 26px',
    borderRadius: 4
  },
  row: {
    marginTop: 14
  },
  title: {
    color: '#1674D1',
    fontSize: 'inherit',
    fontWeight: 'bold'
  },
  value: {
    fontSize: 'inherit',
    marginTop: 6,
    '&.bold' : {
      fontWeight: 'bold'
    },
    '& a': {
      color: '#1674D1'
    }
  },
  button: {
    marginTop: 24
  },
  delegationsTextLink: {
    marginRight: '50',
    color: '#1674D1',
    [theme.breakpoints.down('xs')]: {
      fontSize: 16,
      fontWeight: 'bold'
    }
  },
  orange: {
    background: '#E97000',
    width: 10,
    height: 10,
    borderRadius: '50%',
    marginRight: 5
  },
  blue: {
    background: '#004571',
    width: 10,
    height: 10,
    borderRadius: '50%',
    marginRight: 5
  },
  pointContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 0'
  },
  itemsPerPage: {
    justifyContent: 'flex-end',
    marginTop: 10,
    fontSize: 14,
    color: '#004571'
  },
  select: {
    borderRadius: 4,
    borderColor: '#004571',
    color: '#004571'
  },
  totalItems: {
    justifyContent: 'flex-start',
    fontSize: 14,
    marginTop: '12px',
    marginBottom: '12px',
    color: '#3b3b3b'
  }
}))

export default useStyles
