import { StyleSheet, Font } from '@react-pdf/renderer'

import FSEmeric from '../../../../../../assets/fonts/fsemeric/FSEmeric.ttf'
import FSEmericBold from '../../../../../../assets/fonts/fsemeric/FSEmeric-SemiBold.ttf'

Font.register({ family: 'FSEmeric', fonts: [
  { src: FSEmeric },
	{ src: FSEmericBold, fontWeight: 700 }
]})

const useStyles = StyleSheet.create({
  page: {
    position: 'relative',
    color: '#004571',
    fontFamily: 'FSEmeric',
    fontSize: 12,
    paddingTop: 64,
    paddingRight: 54,
    paddingBottom: 64,
    paddingLeft: 54
  },
  sidebar: {
    position: 'absolute',
    top: '94%',
    left: 16,
    width: '1.2em',
    fontSize: 8,
    transform: 'rotate(-90deg)'
  },
  header: {
    display: 'flex',
    fontSize: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: 18,
    borderStyle: 'solid',
    borderColor: '#BFB8AE',
    borderBottomWidth: 1,
    marginBottom: 18
  },
  bold: {
    fontWeight: 700
  },
  boldSmall: {
    fontWeight: 700,
    fontSize: 9
  },
  logo: {
    width: 65
  },
  pageNumberContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  pageNumber: {
    fontSize: 10,
    textAlign: 'right',
    marginBottom: 18,
    color: 'rgba(0, 0, 0, 0.87)'
  },
  requestData: {
    marginTop: -18
  },
  upSpace: {
    marginTop: 18
  },
  tableSubtitle: {
    margin: '15px 0'
  },
  // table: {
  //   // marginTop: 7,
  //   width: '100%',
  //   // borderWidth: 1,
  //   // borderColor: '#E3EBEF',
  // },
  tableRow: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
  },
  spacing: {
    height: '180px',
    // backgroundColor: 'yellow'
  },
  smallCellTitle: {
    width: '30%',
    padding: '7px',
    fontWeight: 700    
  },
  bigCellTitle: {
    width: '70%',
    padding: '7px',
    fontWeight: 700
  },
  smallCellData: {
    width: '30%',
    padding: '7px',    
  },
  bigCellData: {
    width: '70%',
    padding: '7px',
  },
  separator: {
    width: '100%',
    alignSelf: 'center',
    height: '1px',
    backgroundColor: '#E3EBEF',
  },
  contractDataTitle: {
    color: '#E57200',
    fontWeight: 700,
    marginTop: 8
  },
  contractDataItem: {
    marginTop: 8
  },
  dates: {
    marginTop: 18
  },
  datesItem: {
    marginTop: 8
  },
  contractInvoices: {
    marginTop: 32
  },
  contractInvoicesTitle: {
    color: '#E57200',
    fontWeight: 700
  },
  contractInvoicesTable: {
    display: 'flex',
    width: 'auto',
    minHeight: 220,
    fontSize: 10,
    textAlign: 'center',
    marginTop: 8
  },
  contractInvoicesTableHeader: {
    backgroundColor: '#ECEAE7',
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 16
  },
  contractInvoicesTableHeaderRow: {
    flexDirection: 'row'
  },
  contractInvoicesTableHeaderRowCell50: {
    width: '50%',
    padding: 4
  },
  contractInvoicesTableHeaderRowCell25: {
    width: '25%',
    padding: 4
  },
  contractInvoicesTableHeaderRowCell50Colored: {
    width: '50%',
    backgroundColor: '#F6F5F3',
    padding: 4
  },
  contractInvoicesTableHeaderRowCell25Colored: {
    width: '25%',
    backgroundColor: '#F6F5F3',
    padding: 4
  },
  contractInvoicesTableContainer: {
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 16
  },
  contractInvoicesTableContainerRow: {
    flexDirection: 'row'
  },
  contractInvoicesTableContainerRowCell25: {
    width: '25%',
    padding: 4
  },
  contractInvoicesTableContainerRowCell50Colored: {
    width: '50%',
    backgroundColor: '#FCF1E5',
    padding: 4,
    paddingRight: 8
  },
  contractInvoicesTableContainerRowCell25Colored: {
    width: '25%',
    backgroundColor: '#FCF1E5',
    padding: 4
  },
  contractInvoicesTableFooter: {
    fontSize: 12,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 16,
    borderStyle: 'solid',
    borderColor: '#BFB8AE',
    borderBottomWidth: 3,
  },
  contractInvoicesTableFooterRow: {
    flexDirection: 'row'
  },
  contractInvoicesTableFooterRowCell50: {
    width: '50%',
    padding: 4
  },
  contractInvoicesTableFooterRowCell25: {
    width: '25%',
    padding: 4
  },
  sign: {
    // width: '32%',
    width: 150,
    textAlign: 'center',
    position: 'absolute',
    bottom: 70,
    left: 45
  },
  signImage: {
    // width: 75,
    width: 140,
    marginBottom: 6,
    // marginLeft: 40
    marginLeft: 8
  },
  signTexts: {
    width: '100%'
  },
  signText: {
    fontSize: 10,
    marginTop: 6
  },
  sateliteVertical: {
    position: 'absolute',
    width: 70,
    bottom: 0,
    right: 0
  },
  sateliteHorizontal: {
    position: 'absolute',
    width: 230,
    bottom: 0,
    left: 15
  },
  link: {
    fontSize: 10,
    marginTop: 6
  }
}) as any

export default useStyles
