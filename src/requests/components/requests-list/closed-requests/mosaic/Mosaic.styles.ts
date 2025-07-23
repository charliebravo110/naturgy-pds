import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  item: {
    position: 'relative',
    backgroundColor: '#F8F7F6',
    textAlign: 'center',
    padding: '12px 20px 26px',
    borderRadius: 4
  },
  row: {
    marginTop: 14
  },
  paginationContainer: {
		margin: '20px 0'
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
    }
  },
  actionBox: {
    display: 'inline-flex',
    position: 'absolute',
    top: 12,
    left: 12,
    width: 'calc(100% - 24px)',
    backgroundColor: '#E1EDF0',
    color: '#164258',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 20px',
    borderRadius: 4
  },
  viewButton: {
    color: '#1674D1',
    fontSize: 14,
    textDecoration: 'underline',
    cursor: 'pointer',
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
    color: '#004571'
  }
})

export default useStyles