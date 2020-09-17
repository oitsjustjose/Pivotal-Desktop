import electron, { BrowserWindow, ipcMain, Menu, Notification, shell } from 'electron'
import contextMenu from 'electron-context-menu'
import WinBadge from 'electron-windows-badge'
import path from 'path'
import * as CSS from './app/css'
import { getWindow, setWindow, getAutoHideSetting } from './app/window'
import { PreloadNotification } from './modules/types'
import { template } from './utils/menu'

const app = electron.app

let mainWindow: BrowserWindow | null
let badge: any | null = null

const init = () => {
    const winPref = getWindow()
    mainWindow = new BrowserWindow({
        title: 'Pivotal Desktop',
        x: winPref.x,
        y: winPref.y,
        width: winPref.width,
        height: winPref.height,
        icon: path.resolve(`${path.dirname(require.main!.filename)}/../assets/icons/png/pivotal.png`),
        show: process.platform != 'darwin',
        transparent: process.platform == 'darwin',
        frame: process.platform != 'darwin',
        titleBarStyle: process.platform == 'darwin' ? 'hidden' : 'default',
        webPreferences: {
            nodeIntegration: false,
            nativeWindowOpen: true,
            preload: `${__dirname}/app/preload`
        },
    })

    if (getAutoHideSetting()) {
        mainWindow.setAutoHideMenuBar(true)
        mainWindow.setMenuBarVisibility(false)
    }

    mainWindow.loadURL('https://pivotaltracker.com')

    mainWindow.webContents.on('new-window', (evt, url) => {
        evt.preventDefault()

        if (url.indexOf('pivotaltracker.com') >= 0) {
            mainWindow?.loadURL(url)
        } else {
            shell.openExternal(url)
        }
    })

    mainWindow.webContents.on('dom-ready', () => {
        if (mainWindow) {
            CSS.inject(mainWindow)
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

ipcMain.on('unread', (_: any, cnt: number, notifs: string[]) => {
    if (process.platform == 'darwin' && mainWindow) {
        app.dock.setBadge(cnt > 0 ? `${cnt}` : ``)
    } else if (process.platform == 'win32' && mainWindow) {
        if (!badge) {
            badge = new WinBadge(mainWindow)
        }
        badge.update(cnt)
    }
})

ipcMain.on('notification', (_: any, notifs: PreloadNotification[]) => {
    notifs.forEach((notif) => {
        const notification = new Notification({
            title: notif.title,
            body: notif.body,
            silent: false,
            icon: path.resolve(`${path.dirname(require.main!.filename)}/../assets/icons/png/pivotal.png`),
        })
        notification.show()
    })
})

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
