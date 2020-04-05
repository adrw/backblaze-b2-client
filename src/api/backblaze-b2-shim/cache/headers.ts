import { BackblazeB2Conf } from "./conf"

export const addInfoHeaders = (options: any, info: any) => {
  const isValidHeader = (header: string) => {
    return /^[a-z0-9-_]+$/i.test(header)
  }

  const addInfoHeader = (infoKey: string) => {
    if (isValidHeader(infoKey)) {
      const key = "X-Bz-Info-" + infoKey
      options.headers[key] = encodeURIComponent(info[infoKey])
    } else {
      return invalidKeys.push(infoKey)
    }
  }

  const MAX_INFO_HEADERS = BackblazeB2Conf.MAX_INFO_HEADERS
  let invalidKeys: string[] = []
  if (info) {
    let keys = Object.keys(info)

    if (keys.length > MAX_INFO_HEADERS) {
      throw new Error(
        `Too many info headers: maximum of ${MAX_INFO_HEADERS} allowed`
      )
    }

    keys.forEach(addInfoHeader)

    if (invalidKeys.length) {
      throw new Error(
        "Info header keys contain invalid characters: " +
          invalidKeys.join("   ")
      )
    }
  }
}

export const addBzHeaders = (headers: any, targetObj: any) => {
  const isBzHeader = (header: string) => {
    return /^X-Bz-/i.test(header)
  }

  const getKeyObj = (header: string) => {
    const replacement = /^X-Bz-Info-/i.test(header) ? /X-Bz-Info-/i : /X-Bz-/i
    return {
      original: header,
      header: camelCase(header.replace(replacement, ""))
    }
  }

  const setKeyValue = (headerObj: { header: string; original: string }) => {
    targetObj[headerObj.header] = headers[headerObj.original]
  }

  const camelCase = (header: string) => {
    return header.split("-").map(firstLetterCapitalise).join("")
  }

  const firstLetterCapitalise = (word: string, index: number) => {
    if (index === 0) {
      // skip first letter
      return word
    }
    return word[0].toUpperCase() + word.substr(1)
  }

  const keys = Object.keys(headers)
  return keys.filter(isBzHeader).map(getKeyObj).map(setKeyValue)
}
