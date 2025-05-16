import { test, step } from '../../utils/envName'
import { expect } from '@playwright/test'
import Web3 from 'web3'
import { spawn } from 'child_process'

const ganacheUrl = process.env.GANACHE_URL || 'http://127.0.0.1:8545'
let ganacheProcess: ReturnType<typeof spawn> | undefined

console.log('Using Ganache URL:', ganacheUrl)

test.describe('Local private ETH blockchain tests', () => {
  test.beforeAll(async () => {
    console.log('🚀 Starting Ganache...')
    ganacheProcess = spawn('ganache', [], { stdio: 'inherit' })

    console.log('⏳ Waiting for Ganache to start...')
    await new Promise((resolve) => setTimeout(resolve, 3000))
    console.log('✅ Ganache started')
  })

  test.afterAll(async () => {
    if (ganacheProcess) {
      console.log('🛑 Stopping Ganache...')
      ganacheProcess.kill()
    }
  })

  test('sends transaction and validates balances', async () => {
    const web3 = new Web3(ganacheUrl)

    await step('gets accounts from ganache', async () => {
      const accounts = await web3.eth.getAccounts()
      console.log('Accounts from Ganache:', accounts)
      expect(accounts.length).toBeGreaterThan(1)
    })

    let sender: string
    let receiver: string
    let balanceSenderBefore: string
    let balanceReceiverBefore: string

    await step('initializes sender and receiver addresses', async () => {
      const accounts = await web3.eth.getAccounts()
      sender = accounts[0]
      receiver = accounts[1]
      console.log('Sender address:', sender)
      console.log('Receiver address:', receiver)

      balanceSenderBefore = (await web3.eth.getBalance(sender)).toString()
      balanceReceiverBefore = (await web3.eth.getBalance(receiver)).toString()
      console.log('Sender balance before (Wei):', balanceSenderBefore)
      console.log('Sender balance before (ETH):', web3.utils.fromWei(balanceSenderBefore, 'ether'))
      console.log('Receiver balance before (Wei):', balanceReceiverBefore)
      console.log('Receiver balance before (ETH):', web3.utils.fromWei(balanceReceiverBefore, 'ether'))

      expect(sender).toBeTruthy()
      expect(receiver).toBeTruthy()
    })

    await step('sends transaction', async () => {
      console.log('Sending transaction...')
      const value = web3.utils.toWei('1', 'ether')
      console.log('Transferring value (Wei):', value)
      console.log('Transferring value (ETH):', web3.utils.fromWei(value, 'ether'))

      const tx = await web3.eth.sendTransaction({
        from: sender,
        to: receiver,
        value
      })
      console.log('Transaction result:', tx)
      expect(tx.status).toBeTruthy()
    })

    await step('validates updated balances', async () => {
      console.log('Validating updated balances...')
      const balanceReceiverAfter = await web3.eth.getBalance(receiver)
      console.log('Receiver balance before (Wei):', balanceReceiverBefore)
      console.log('Receiver balance after (Wei):', balanceReceiverAfter)

      const receiverBalanceBeforeInEth = Number(web3.utils.fromWei(balanceReceiverBefore, 'ether'))
      const receiverBalanceAfterInEth = Number(web3.utils.fromWei(balanceReceiverAfter, 'ether'))
      console.log('Receiver balance before (ETH):', receiverBalanceBeforeInEth)
      console.log('Receiver balance after (ETH):', receiverBalanceAfterInEth)

      expect(receiverBalanceAfterInEth).toBeGreaterThan(receiverBalanceBeforeInEth)
    })
  })
})
