import { app, MenuItemConstructorOptions } from 'electron'
import { preProcessFile } from 'typescript'
import { getAutoHideSetting, setAutoHide } from "../app/window"

export const template: MenuItemConstructorOptions[] = [
    ...(process.platform == 'darwin' ? [{
        label: 'Pivotal Tracker',
        submenu: [
            {
                label: 'About Pivotal Desktop',
                role: 'about',
            },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideOthers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' }
        ],
    }] as MenuItemConstructorOptions[] : []), {
        label: 'Edit',
        submenu: [
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
            { role: 'pasteAndMatchStyle' },
            { role: 'delete' },
            { role: 'selectAll' }
        ]
    }, ...(app.isPackaged ? [] : [{
        label: 'Debug',
        submenu: [
            {
                role: 'toggleDevTools',
            },
            {
                type: 'separator',
            },
            {
                role: 'reload',
            },
            {
                role: 'forceReload',
            }
        ],
    }] as MenuItemConstructorOptions[]),
    ...(process.platform == 'darwin' ? [] : [{
        label: 'Settings',
        submenu: [
            {
                label: 'Auto-Hide Menu Bar (reveal with ALT-key)',
                type: 'checkbox',
                checked: getAutoHideSetting(),
                click: (menuItem, bw) => {
                    setAutoHide(menuItem.checked)
                    if (bw) {
                        bw.setMenuBarVisibility(!menuItem.checked)
                        bw.setAutoHideMenuBar(menuItem.checked)
                    }
                },
            }
        ],
    }] as MenuItemConstructorOptions[])
]
