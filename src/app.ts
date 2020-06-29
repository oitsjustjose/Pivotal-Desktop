import electron, { BrowserWindow, shell, Menu } from 'electron'
import contextMenu from 'electron-context-menu'
import path from 'path'

import { get as getWindow, set as setWindow } from './window'
import { template } from './menu'

const app = electron.app

let mainWindow: BrowserWindow | null;

const init = () => {
    const winPref = getWindow()
    mainWindow = new BrowserWindow({
        title: 'Pivotal Desktop',
        x: winPref.x,
        y: winPref.y,
        width: winPref.width,
        height: winPref.height,
        icon: path.join(__dirname, 'assets', 'icons', 'png', 'pivotal.png'),
        show: process.platform != 'darwin',
        webPreferences: {
            nodeIntegration: false,
            nativeWindowOpen: true
        }
    })

    mainWindow.loadURL('https://pivotaltracker.com')

    mainWindow.webContents.on('new-window', (evt, url) => {
        evt.preventDefault()

        if (url.indexOf('pivotaltracker.com') >= 0) {
            mainWindow?.loadURL(url)
        } else {
            shell.openExternal(url)
        }
    })

    mainWindow.on('move', () => {
        const bds = mainWindow?.getBounds()
        if (bds) {
            setWindow(bds.x, bds.y, bds.width, bds.height)
        }
    })

    mainWindow.on('resize', () => {
        const bds = mainWindow?.getBounds()
        if (bds) {
            setWindow(bds.x, bds.y, bds.width, bds.height)
        }
    })

    mainWindow.once('ready-to-show', () => {
        mainWindow?.show()
        mainWindow?.focus()
    })
}

app.setName('Pivotal Desktop')
app.on('window-all-closed', () => {
    mainWindow?.webContents.session.flushStorageData()
    mainWindow = null
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('before-quit', (evt) => {
    mainWindow?.webContents.session.flushStorageData()
})


app.on('activate', () => {
    if (!mainWindow) {
        init()
    }
})

app.on('ready', () => {
    if (app.isPackaged) {
        contextMenu()
    } else {
        contextMenu({
            showInspectElement: true
        })
    }
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))
    init()
})
