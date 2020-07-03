import { MenuItemConstructorOptions } from "electron"

export const template: Array<MenuItemConstructorOptions> = [{
    label: 'Pivotal Tracker',
    submenu: [{
        label: 'About Pivotal Desktop',
        role: 'about'
    },
    {
        type: 'separator'
    },
    {
        role: 'hide'
    },
    {
        role: 'hideOthers'
    },
    {
        role: 'unhide'
    },
    {
        type: 'separator'
    },
    {
        role: 'quit'
    }]
}, {
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
}, {
    label: 'Go',
    submenu: [{
        role: 'reload'
    }, {
        role: 'forceReload'
    }]
}]
