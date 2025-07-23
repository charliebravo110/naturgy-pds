import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  table: {
    width: '100%',
    fontSize: 14,
    borderRadius: 4,
    overflow: 'hidden'
  },
  item: {
    position: 'relative',
    backgroundColor: '#F8F7F6',
    textAlign: 'center',
    padding: '12px 20px 26px',
    borderRadius: 4,
    '&.disabled': {
      opacity: .7,
      filter: 'grayscale(1)'
    }
  },
  nameRow: {
    marginTop: 49
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
    }
  },
  button: {
    marginTop: 26
  },
  editButton: {
    display: 'flex',
    color: '#1674D1',
    textDecoration: 'underline',
    justifyContent: 'center',
    '& p': {
      cursor: 'pointer'
    },
    '&.disabled': {
      color: 'rgba(0, 0, 0, .87)',
      textDecoration: 'none',
      '& p': {
        cursor: 'default'
      }
    }
  },
  delegates: {
    background: 'white',
    borderRadius: 10,
    padding: 10,
    marginTop: 20
  },
  alertIcon: {
    height: 16
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
  alertLabel: {
    marginLeft: 8
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
    color: '#3b3b3b',
    alignItems: 'center'
  },
  loadingAnimation: {
    display: 'block',
    width: 52,
  },
  paginationContainer: {
		margin: '20px 0'
	},
  pointer: {
    cursor: 'pointer'
  }
})

export default useStyles
