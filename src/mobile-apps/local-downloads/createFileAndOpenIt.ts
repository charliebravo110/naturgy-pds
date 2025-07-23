//import { Filesystem, Directory } from '@capacitor/filesystem'
//import { FileOpener } from '@capawesome-team/capacitor-file-opener'
import { isWeb } from '../common/detectPlatform'

/** options for createFileAndOpenIt */
export interface createFileAndOpenItOptions {
  /** The name of the file to create. This should include the file extension (e.g. ".txt", ".xlsx"). */
  fileName: string
  /** The content of the file as a Base64-encoded string. Either this or `contentAsBlob` must be provided. */
  contentAsBase64?: string
  /** The content of the file as a `Blob`. Either this or `contentAsBase64` must be provided. */
  contentAsBlob?: Blob
}

/**
 * Creates a file in the device app directory with the specified name and content,
 * and opens it with the default app or a native dialog to choose the app.
 * Only supported on mobile apps, not web.
 *
 * @param options.fileName - The name of the file to create. This should include the file extension (e.g. ".txt", ".xlsx").
 * @param options.contentAsBase64 - The content of the file as a Base64-encoded string. Either this or 'contentAsBlob' must be provided.
 * @param options.contentAsBlob - The content of the file as a 'Blob'. Either this or 'contentAsBase64' must be provided.
 * @returns A Promise that resolves when the file has been created and opened successfully.
 */
export default async function createFileAndOpenIt(options: createFileAndOpenItOptions) {
  if (isWeb()) {
    // just in case someone in the future uses this function on web
    console.warn('createFileAndOpenIt not supported on web, only for mobile apps.')
    return
  }

  let { fileName, contentAsBase64, contentAsBlob } = options

  // validations
  if (!contentAsBase64 && !contentAsBlob) {
    console.warn('createFileAndOpenIt: either contentAsBase64 or contentAsBlob must be received')
    return
  }
  if (contentAsBase64 && contentAsBlob) {
    console.warn('createFileAndOpenIt: either contentAsBase64 or contentAsBlob must be received, not both')
    return
  }

  const data = contentAsBase64 || (await blobToBase64(contentAsBlob))

  // if filename received does NOT have extension and mimetype is known, then add the extension
  if (filenameHasExtension(fileName) === false && contentIncludesMimeType(options))
    fileName = `${fileName}.${getExtensionFromMimeType(options)}`

  // Write the file
  // const savedFile = await Filesystem.writeFile({
  //   path: fileName,
  //   data,
  //   directory: Directory.Data,
  //   recursive: true,
  // })

  // Open the file with the default app or, depending on the OS, a native dialog to choose the app
  //await FileOpener.openFile({ path: savedFile.uri })
}

/** local helper */
async function blobToBase64(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = () => {
      resolve(reader.result as string)
    }
    reader.readAsDataURL(blob)
  })
}

/** local helper */
function filenameHasExtension(fileName: string) {
  return fileName.includes('.')
}

/** local helper */
function contentIncludesMimeType(options: createFileAndOpenItOptions) {
  return options.contentAsBase64?.startsWith('data:') || options.contentAsBlob?.type
}

/** local helper */
function getExtensionFromMimeType(options: createFileAndOpenItOptions) {
  return options.contentAsBase64?.split(';')[0].split('/')[1] || options.contentAsBlob?.type.split('/')[1]
}