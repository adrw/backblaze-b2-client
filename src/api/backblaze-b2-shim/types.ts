// For additional options, see https://github.com/softonic/axios-retry
export interface IAxiosRetryConfig {
  retry: {
    retries: number
    retryDelay: (retryCount: number, error: any) => number
  }
}

export interface IBackblazeB2Lib {
  accountId: string
  applicationKeyId: string
  applicationKey: string
  axios?: any
  retry?: IAxiosRetryConfig
  authorizationToken?: string
  apiUrl?: string
  downloadUrl?: string
}
