export class DataGenerator {

  // The string returned is in the format of "YYYYMMDDHHMMSS", e.g. "20190212152415"
  async currentDateString(){
    var date = new Date()    
    var testDate = date.getFullYear() + (date.getMonth() + 1) + date.getDate() + (date.getHours() + 3) + date.getMinutes() + date.getSeconds()
    return testDate
  }

  // The string returned is the email address in the format of "autotest_YYYYMMDDHHMMSS@test.com", e.g. "autotest_20190212152415@test.com
  async randomEmail() {
    var date = new Date()    
    var testDate = 
        date.getFullYear() + 
        (date.getMonth() + 1).toString().padStart(2, '0') + 
        date.getDate().toString().padStart(2, '0') + 
        (date.getHours() + 3).toString().padStart(2, '0') + 
        date.getMinutes().toString().padStart(2, '0') + 
        date.getSeconds().toString().padStart(2, '0')
    return ('pod.b.autotest+' + testDate + '@test.com')
  }

  // Returns random string with specific length, e.g. if length = 6, then output will be "abcdef"
  async randomString(length: number) {
    var str = ''
    var i
    var characters = 'abcdefghijklmnopqrstuvwxyz'
    for (i = 0; i < length; i++) {
        str += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return str
  }

  // Returns random string with specific length, e.g. if length = 6, then output will be "abc123"
  async randomEnumString(length: number) {
    var str = ''
    var i
    var characters = 'abcdefghijklmnopqrstuvwxyz1234567890'
    for (i = 0; i < length; i++) {
        str += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return str
  }

  // Returns random number with specific length, e.g. if length = 6, then output will be "123456"
  async randomNumber(length: number) {
    var str = ''
    var i
    var numbers = '123456789'
    for (i = 0; i < length; i++) {
        str += numbers.charAt(Math.floor(Math.random() * numbers.length))
    }
    let num = Number(str)
    return num
  }

  // Returns random special character with specific length, e.g. if length = 6, then output will be "!@#$%^"
  async specialChar(length: number) {
    var char = ''
    var i
    var specialCharacters = '!@#$^&*{}|_'
    for (i = 0; i < length; i++) {
        char += specialCharacters.charAt(Math.floor(Math.random() * specialCharacters.length))
    }
    return char
  }

  // Returns current time in ISO format, e.g: 2019-02-12T15:24:15.731Z
  async getCurrentTimeISO() {
    var date = new Date()
    date.setTime(Date.now())
    var time = date.toISOString()
    console.log(time)
    return time
  }

  // Returns current time in ISO custom format, e.g: 2024-10-0422T16:18:58Z
  async getCurrentCustomTimestamp() {
    const date = new Date()
    const year = date.getUTCFullYear()
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const day = String(date.getUTCDate()).padStart(2, '0')
    const hours = String(date.getUTCHours()).padStart(2, '0')
    const minutes = String(date.getUTCMinutes()).padStart(2, '0')
    const seconds = String(date.getUTCSeconds()).padStart(2, '0')
  
    const customFormat = `${year}-${month}-${day}${hours}T${minutes}:${seconds}Z`
    console.log(customFormat)
    return customFormat
  }  

  async generate20DigitUAN(): Promise<string> {
    let base = Date.now().toString()
    while (base.length < 20) {
      await new Promise(resolve => setTimeout(resolve, 1)) // slight delay to get a different timestamp
      base += Date.now().toString()
    }
    return base.slice(0, 20)
  }
  
  // Returns a string with random number within the given range of Min & Max values
  async getRandomNumberRange(min: number, max: number): Promise<number> {
    const randomNum = await Math.floor(Math.random() * (max - min + 1) + min)
    return randomNum
  }

  async getRandomUAN(): Promise<{ UAN: string; UANformatted: string }> {
    let dateBasedNumber = new Date().toISOString().replace(/[-T:Z.]/g, '').slice(4, 14)
    let hyphenatedDateBasedNumber = dateBasedNumber.slice(0, 5) + '-' + dateBasedNumber.slice(5)
    
    return { UAN: dateBasedNumber, UANformatted: hyphenatedDateBasedNumber }
  }

  async getRandomEsgUAN(): Promise<{
    compact: string
    spaced: string
    tenDigitCompact: string
    tenDigitFormatted: string
  }> {
    // Generate a unique date-based number
    const dateBasedNumber = new Date()
      .toISOString()
      .replace(/[-T:Z.]/g, '')
      .slice(0, 18) + '0' // Ensure 18 digits
  
    // Extract exactly 10 digits for the new values
    const tenDigitNumber = dateBasedNumber.slice(0, 10)
  
    return {
      compact: dateBasedNumber,
      spaced: dateBasedNumber.slice(0, 8) + ' ' + dateBasedNumber.slice(8),
      tenDigitCompact: tenDigitNumber,
      tenDigitFormatted: tenDigitNumber.slice(0, 5) + '-' + tenDigitNumber.slice(5),
    }
  }  

  async getRandomApplicationMessageId(): Promise<string> {
    const getRandomDigits = (length: number) =>
      Array.from({ length }, () => Math.floor(Math.random() * 10)).join('')
  
    return `${getRandomDigits(4)}-${getRandomDigits(8)}-${getRandomDigits(8)}`
  }

  async getRandomApplicationMessageIdAlt(): Promise<string> {
    const getRandomDigits = (length: number) =>
      Array.from({ length }, () => Math.floor(Math.random() * 10)).join('')
  
    return `${getRandomDigits(4)}-null-${getRandomDigits(8)}`
  }

  async getCurrentDate() {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  async calculateContractEndDate(contractStartDate, term) {
    const startDate = new Date(contractStartDate)
    const endDate = new Date(startDate)
  
    // Add term months
    endDate.setMonth(endDate.getMonth() + term)
  
    // Subtract 1 day
    endDate.setDate(endDate.getDate() - 1)
  
    const year = endDate.getFullYear()
    const month = String(endDate.getMonth() + 1).padStart(2, '0')
    const day = String(endDate.getDate()).padStart(2, '0')
  
    return `${year}-${month}-${day}`
  }  
  
}