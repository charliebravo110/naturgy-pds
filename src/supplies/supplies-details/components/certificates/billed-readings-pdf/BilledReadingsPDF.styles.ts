import { StyleSheet, Font } from '@react-pdf/renderer'

import FSEmeric from '../../../../../assets/fonts/fsemeric/FSEmeric.ttf'
import FSEmericBold from '../../../../../assets/fonts/fsemeric/FSEmeric-SemiBold.ttf'

Font.register({
  family: 'FSEmeric', fonts: [
    { src: FSEmeric },
    { src: FSEmericBold, fontWeight: 700 }
  ]
})

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
    fontSize: 5
  },
  boldMedium: {
    fontWeight: 700,
    fontSize: 7
  },
  small: {
    fontSize: 5
  },
  medium: {
    fontSize: 7
  },
  logo: {
    width: 65
  },
  pageNumber: {
    fontSize: 10,
    textAlign: 'right',
    marginBottom: 18,
    color: 'rgba(0, 0, 0, 0.87)'
  },
  contractData: {
    marginTop: -18,
    fontSize: 10
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
    fontSize: 10
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
    fontSize: 6,
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
  contractInvoicesTableHeaderRowCell13: {
    width: '11.50%',
    padding: 1
  },
  contractInvoicesTableHeaderRowCell15First: {
    width: '12.50%',
    padding: 1
  },
  contractInvoicesTableHeaderRowCell15: {
    width: '12.50%',
    padding: 1
  },
  contractInvoicesTableHeaderRowCell15Colored: {
    width: '12.50%',
    backgroundColor: '#F6F5F3',
    padding: 2
  },
  contractInvoicesTableHeaderRowCell42Colored: {
    width: '37.45%',
    backgroundColor: '#F6F5F3',
    padding: 2
  },
  contractInvoicesTableHeaderRowCell50Colored: {
    width: '50%',
    backgroundColor: '#F6F5F3',
    padding: 2
  },
  contractInvoicesTableContainer: {
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 16
  },
  contractInvoicesTableContainerRow: {
    flexDirection: 'row'
  },
  contractInvoicesTableContainerRowCell76: {
    width: '7.69%',
    padding: 2
  },
  contractInvoicesTableContainerRowCell15First: {
    width: '12.50%',
    padding: 1
  },
  contractInvoicesTableContainerRowCell15: {
    width: '12.50%',
    padding: 1
  },
  contractInvoicesTableContainerRowCell13: {
    width: '11.50%',
    padding: 1
  },
  contractInvoicesTableContainerRowCell13Colored: {
    width: '11.50%',
    backgroundColor: '#FCF1E5',
    padding: 1
  },
  contractInvoicesTableContainerRowCell15Colored: {
    width: '12.50%',
    backgroundColor: '#FCF1E5',
    padding: 2
  },
  contractInvoicesTableContainerRowCell15Colored2: {
    width: '25%',
    backgroundColor: '#FCF1E5',
    padding: 2
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
  sign: {
    width: '32%',
    textAlign: 'center',
    marginTop: 32
  },
  signImage: {
    width: 75,
    marginBottom: 6,
    marginLeft: 40
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
}) as any

export default useStyles
