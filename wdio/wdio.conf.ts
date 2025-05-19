import allureReporter from '@wdio/allure-reporter'
import allureCommandline from 'allure-commandline'
import Video from 'wdio-video-reporter'
import fs from 'fs-extra'
import dotenv from 'dotenv'
import { pageManager } from './utils/pageManager'

// .env config selection (e.g. dev, stage, prod)
dotenv.config({ path: `./.env.${process.env.ENV_NAME}` })

declare global {
  // Make pageManager available as global.pages in all specs
  // (Type is PageManager, which matches the exported instance)
  var pages: typeof pageManager
}

export const config = {
    reporters: [
        'spec',
        [
            'allure',
            {
                outputDir: './html-report/allure-results', // Allure results go here
                disableWebdriverStepsReporting: true,
                disableWebdriverScreenshotsReporting: false,
                addConsoleLogs: true
            },
        ],
        [
            Video,
            {
                saveAllVideos: false,
                videoSlowdownMultiplier: 5,
                outputDir: './html-report/video', // Videos go here
            },
        ],
    ],
    // Hooks
    before: function () {
        global.pages = pageManager
    },
    onPrepare: function () {
        const foldersToClear = [
            './html-report', // Clear the entire html-report directory
        ]

        foldersToClear.forEach(folder => {
            try {
                console.log(`Clearing folder: ${folder}`)
                fs.emptyDirSync(folder)
            } catch (err) {
                console.error(`Error clearing folder ${folder}:`, err)
            }
        })
    },
    afterTest: async function (test: any, context: any, { error, result, duration, passed, retries }: any) {
        if (!passed) {
            await browser.takeScreenshot()

            try {
                const logs = await browser.getLogs('browser') // Get browser logs
                const logMessages = logs.map((log: any) => `${log.timestamp} [${log.level}] ${log.message}`).join('\n')
                allureReporter.addAttachment('Console Logs', logMessages, 'text/plain')
            } catch (err) {
                console.warn('Error capturing browser logs:', err)
            }
        }
    },
    onComplete: async function () {
        console.log('Generating Allure report...')
        try {
            const generation = allureCommandline(['generate', './html-report/allure-results', '--clean', '-o', './html-report/allure-report'])
    
            if (!generation) {
                throw new Error('Failed to start Allure generation process. Is Allure CLI installed correctly?')
            }
    
            generation.stdout?.on('data', (data: any) => console.log(`stdout: ${data}`))
            generation.stderr?.on('data', (data: any) => console.error(`stderr: ${data}`))
    
            await new Promise<void>((resolve, reject) => {
                generation.on('exit', (exitCode: string | number) => {
                    if (exitCode === 0) {
                        console.log('Allure report successfully generated in ./html-report/allure-report')
                        resolve()
                    } else {
                        reject(new Error('Failed to generate Allure report. Exit code: ' + exitCode))
                    }
                })
            })
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error in onComplete hook:', error.message)
            } else {
                console.error('Error in onComplete hook:', error)
            }
        }
    },      
}
