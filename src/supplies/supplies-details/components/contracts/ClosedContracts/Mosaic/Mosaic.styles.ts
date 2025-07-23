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
    color: 'rgba(0, 69, 113, 1)',
    fontSize: 'inherit',
    fontWeight: 'bold'
  },
  value: {
    fontSize: 'inherit',
    color:'#5b5a5a',
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
  },
  requestStatusText: {
    cursor:'pointer',
    textDecoration:'underline',
    filter:'invert(35%) sepia(82%) saturate(800%) hue-rotate(182deg) brightness(92%) contrast(97%)'
  },
  bellIcon: {
    width: '25px',
  },
  requestStatusTextDis: {
    cursor:'initial',
    textDecoration:'underline',
    alignItems: 'center',
    filter: 'invert(86%) sepia(44%) saturate(3%) hue-rotate(37deg) brightness(55%) contrast(93%)'
  },
  TypeIcon: {
    display: 'flex',
    alignItems: 'center',
    '& img': {
      width: 12,
      height: 12
    },
  },
  loadingBox: {
    backgroundColor:'#f2f6f8',
    height: 'auto',
    justifyContent: 'flex-start',
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    fontSize: 16,
    color: '#004571',
    marginTop: 12
  },
  loadingAnimation: {
    display: 'block',
    width: 45,
    height: 45,
    marginLeft: '10px',
    marginRight: '10px'
  },
  loadingText: {
    overflowWrap: 'break-word',
    wordBreak: 'break-word',
    maxWidth: 'calc(100% - 40px)',
    flex: '1'
  },
  TypeLabel: {
    marginLeft: 4,
  }
})

export default useStyles