export const credentials = {
  admin: {
    email: process.env.OTP_EMAIL!,
    password: process.env.OTP_PASSWORD!,
    otpSecret: process.env.OTP_SECRET!
  }
}
