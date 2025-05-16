import shell from 'shelljs'

const EMULATOR_NAME = 'Samsung_S24_API_34'

/**
 * Function to start the emulator
 */
function startEmulator() {
    console.log(`Starting emulator: ${EMULATOR_NAME}`)
    const startCommand = `emulator -avd ${EMULATOR_NAME} -no-window -gpu swiftshader_indirect`

    if (shell.exec(startCommand, { async: true }).code === 0) {
        console.log(`Emulator ${EMULATOR_NAME} started successfully.`)
    } else {
        console.error(`Failed to start emulator. Ensure your AVD name is correct.`)
    }
}

/**
 * Function to stop all running emulator processes
 */
function stopEmulator() {
    console.log('Stopping all running emulators...')
    const processes = shell.exec('ps aux | grep emulator', { silent: true }).stdout
        .split('\n')
        .filter((line: any) => line.includes('/emulator/'))

    if (processes.length === 0) {
        console.log('No emulator processes found.')
        return
    }

    processes.forEach((line: any) => {
        const match = line.match(/^\S+\s+(\d+)/) // Extract PID
        if (match && match[1]) {
            const pid = match[1]
            console.log(`Killing emulator process with PID: ${pid}`)
            if (shell.exec(`kill -9 ${pid}`).code === 0) {
                console.log(`Successfully killed process ${pid}`)
            } else {
                console.error(`Failed to kill process ${pid}`)
            }
        }
    })
}

/**
 * Main script logic
 */
const action = process.argv[2] // Expecting 'start' or 'stop' as argument

if (action === 'start') {
    startEmulator()
} else if (action === 'stop') {
    stopEmulator()
} else {
    console.log('Usage: node emulatorManager.js <start|stop>')
    console.log('Example: node emulatorManager.js start')
    console.log('         node emulatorManager.js stop')
}
