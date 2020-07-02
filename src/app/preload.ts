import { ipcRenderer } from 'electron'

window.addEventListener('load', () => {
    setInterval(() => {
        const notifBadge = document.querySelector('[data-aid="NotificationsBell__unreadCounter"]')
        if (notifBadge) {
            ipcRenderer.send('unread', parseInt(notifBadge.innerHTML.toString()))
        }else {
            ipcRenderer.send('unread', 0)
        }
    }, 1000)
})