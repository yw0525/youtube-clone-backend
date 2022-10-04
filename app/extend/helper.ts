import crypto from 'crypto'

exports.md5 = (str: string) =>
  crypto.createHash('md5').update(str).digest('hex')
