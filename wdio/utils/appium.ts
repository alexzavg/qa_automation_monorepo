// @ts-ignore
import shell from 'shelljs'

const APPIUM_PORT = 4723

function startAppium() {
    console.log('Starting Appium server...')
    shell.exec(`appium --port ${APPIUM_PORT}`, { async: true })
}

function stopAppium() {
    console.log('Stopping Appium server...')
    const result = shell.exec(`lsof -ti:${APPIUM_PORT}`, { silent: true })
    if (result.stdout) {
        const pids = result.stdout.split('\n').filter((pid: any) => pid)
        pids.forEach((pid: any) => {
            shell.exec(`kill -9 ${pid}`)
            console.log(`Killed process: ${pid}`)
        })
    } else {
        console.log('No Appium server running on port', APPIUM_PORT)
    }
}

// Example usage:
if (process.argv.includes('--start')) {
    startAppium()
} else if (process.argv.includes('--stop')) {
    stopAppium()
}
