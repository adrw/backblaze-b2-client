import axios, { AxiosInstance } from "axios"
import axiosRetry from "axios-retry"
const B2 = require("backblaze-b2")
import { IBackblazeB2Lib } from "./backblaze-b2-shim/types"
import { getUrlEncodedFileName } from "./backblaze-b2-shim/cache/utils"
import { addInfoHeaders } from "./backblaze-b2-shim/cache/headers"

// TODO add any missing B2 API here and types wrapping the backblaze-b2 library calls

export enum B2CopyFileMetadataDirective {
  COPY, // will return 400 if contentType is set to a non-null value
  REPLACE // will return 400 if contentType is not set, or is null
}

export interface IB2ApiCopyFile200Response {
  accountId: string
  action: string
  bucketId: string
  contentLength: number
  contentSha1: string
  contentMd5?: string
  contentType: string
  fileId: string
  fileInfo: string
  fileName: string
  uploadTimestamp: string
}

export interface IB2ApiConfig extends IBackblazeB2Lib {
  bucketName: string
  bucketId: string
}

export interface IB2ApiRequest {
  axios?: AxiosInstance
  axiosOverrides?: object
}

export interface IB2ApiCopyFileRequest extends IB2ApiRequest {
  sourceFileId: string
  fileName: string
  metadataDirective: B2CopyFileMetadataDirective
  destinationBucketId?: string
  // use to build range: string. example: "bytes=1000-2000"
  rangeByteStart?: number
  rangeByteEnd?: number
  contentType?: string // use "b2/x-auto" by default
  fileInfo?: object // optional additional key/value file metadata
}

export interface IB2Api {
  copyFile: (request: IB2ApiCopyFileRequest) => IB2ApiCopyFile200Response
}

export class B2Api {
  public rawB2: any
  public accountId: string
  public applicationKeyId: string
  public applicationKey: string
  public bucketName: string
  public bucketId: string

  // Assigned from Authorize call
  public authorizationToken: string
  public apiUrl: string
  public downloadUrl: string

  // Axios client to use for calls not in backblaze-b2
  public axiosClient: AxiosInstance

  constructor(config: IB2ApiConfig) {
    this.accountId = config.accountId
    this.applicationKeyId = config.applicationKeyId
    this.applicationKey = config.applicationKey
    this.bucketName = config.bucketName
    this.bucketId = config.bucketId
    this.rawB2 = new B2(config)
    this.rawB2.authorize()
    this.authorizationToken = this.rawB2.authorizationToken
    this.apiUrl = this.rawB2.apiUrl
    this.downloadUrl = this.rawB2.downloadUrl
    this.accountId = this.rawB2.accountId

    // Setup Axios client including axios-retry library
    this.axiosClient = axios.create(config.axios)
    axiosRetry(this.axiosClient, { retries: 3, ...config.retry })
  }

  public uploadFile = (args: any) => {
    const uploadUrl = args.uploadUrl
    const uploadAuthToken = args.uploadAuthToken
    // Previous versions used filename (lowercase), so support that here
    const fileName = getUrlEncodedFileName(args.fileName || args.filename)
    const data = args.data
    const hash = args.hash
    const info = args.info
    const mime = args.mime
    const len = args.contentLength || data.byteLength || data.length

    const options = {
      url: uploadUrl,
      method: "POST",
      headers: {
        Authorization: uploadAuthToken,
        "Content-Type": mime || "b2/x-auto",
        "Content-Length": len,
        "X-Bz-File-Name": fileName,
        "X-Bz-Content-Sha1": hash || (data ? sha1(data) : null)
      },
      data: data,
      maxRedirects: 0,
      onUploadProgress: args.onUploadProgress || null
    }

    addInfoHeaders(options, info)
    // merge order matters here: later objects override earlier objects
    return (args.axios || this.axiosClient)({
      ...options,
      ...args.axiosOverride
    })
  }

  /**
   * B2 copyFile
   */
  public copyFile = (
    sourceFileId: string,
    fileName: string,
    metadataDirective: B2CopyFileMetadataDirective,
    destinationBucketId?: string,
    // use to build range: string. example: "bytes=1000-2000"
    rangeByteStart?: number,
    rangeByteEnd?: number,
    contentType?: string, // use "b2/x-auto" by default
    fileInfo?: object // optional additional key/value file metadata
  ): IB2ApiCopyFile200Response => {
    const options = {}
    const response = this.axiosClient()
  }

  // ...
}

// = (): IB2Api => {
//   const b2 = new B2()
//   return {
//     copyFile: (
//       sourceFileId: string,
//       fileName: string,
//       metadataDirective: B2CopyFileMetadataDirective,
//       destinationBucketId?: string,
//       rangeByteStart?: number,
//       rangeByteEnd?: number,
//       contentType?: string,
//       fileInfo?: object
//     ) => {

//       const response: IB2ApiCopyFile200Response = {}
//       return response
//     }
//   }
// }
