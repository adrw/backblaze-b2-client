import { IBackblazeB2Lib } from "../types"

export const getAuthHeaderObject = (b2: IBackblazeB2Lib) => {
  const id = b2.applicationKeyId || b2.accountId
  if (!id) {
    throw new Error("Invalid accountId or applicationKeyId")
  }
  if (!b2.applicationKey) {
    throw new Error("Invalid applicationKey")
  }
  let base64 = Buffer.from(id + ":" + b2.applicationKey).toString("base64")
  return {
    Authorization: "Basic " + base64
  }
}

export const getAuthHeaderObjectWithToken = (b2: IBackblazeB2Lib) => {
  if (!b2) {
    throw new Error("Invalid B2 instance")
  }
  if (!b2.authorizationToken) {
    throw new Error("Invalid authorizationToken")
  }
  return {
    Authorization: b2.authorizationToken
  }
}

export const parseJson = (jsonString: string) => {
  try {
    return JSON.parse(jsonString)
  } catch (e) {
    // got error
  }
}

export const saveAuthContext = (
  context: IBackblazeB2Lib,
  authResponse: any
) => {
  context.authorizationToken = authResponse.authorizationToken
  context.apiUrl = authResponse.apiUrl
  context.downloadUrl = authResponse.downloadUrl
  context.accountId = authResponse.accountId
}

export const getProcessFileSuccess = (deferred: any) => {
  return function (error: any, response: any, body: any, promise: any) {
    deferred = deferred || promise
    if (error) {
      deferred.reject(error)
    } else if (response.statusCode !== 200) {
      deferred.reject(response.statusMessage)
    } else {
      deferred.resolve(response)
    }
  }
}

export const processResponseGeneric = (deferred: any) => {
  return function (error: any, response: any, body: any, promise: any) {
    deferred = deferred || promise
    if (error) {
      return deferred.reject(error)
    } else {
      let genericResponse = parseJson(body)
      deferred.resolve(genericResponse)
    }
  }
}

export const getUrlEncodedFileName = (fileName: any) => {
  return fileName.split("/").map(encodeURIComponent).join("/")
}
