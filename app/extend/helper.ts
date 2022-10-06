import crypto from 'crypto'

exports.md5 = (str: string) =>
  crypto.createHash('md5').update(str).digest('hex')

exports.pick = (object: any, fields: string[]) => {
  const ans = {}

  fields.forEach(field => {
    if (field in object) {
      ans[field] = object[field]
    }
  })

  return ans
}
