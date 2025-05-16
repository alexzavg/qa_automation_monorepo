// utils/helpers/OTPGenerator.ts
import speakeasy from 'speakeasy'

export class OTPGenerator {

  public getOTP(secret: string): string {
    const otp = speakeasy.totp({
      secret,
      encoding: 'base32'
    })

    console.log(`Generated OTP: ${otp}`)

    return otp
  }

  public verifyOTP(secret: string, token: string): boolean {
    const isValid = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 0
    })

    console.log(`OTP Verification Result: ${isValid ? '✅ VALID' : '❌ INVALID'}`)

    return isValid
  }

}
