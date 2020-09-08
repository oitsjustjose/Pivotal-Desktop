import { ipcRenderer } from 'electron'
import { PreloadNotification } from '../modules/types'

const seen = new Set()

window.addEventListener('load', () => {
    setInterval(() => {
        const notifBadge = document.querySelector('[data-aid="NotificationsBell__unreadCounter"]')
        /* Fetch any notification bodies whose parent is unread */
        const unreadElements = document.querySelectorAll(`[class*="NotificationsList"] > *:not([class*="--read"])`)

        if (notifBadge) {
            ipcRenderer.send('unread', parseInt(notifBadge.innerHTML.toString()))
        } else {
            ipcRenderer.send('unread', 0,)
        }

        if (unreadElements) {
            const unread: PreloadNotification[] = []

            unreadElements.forEach((el) => {
                console.log(el)

                const title = (el.querySelector(`[data-aid="Notification__detailsLink"]`) as HTMLElement).innerText
                const body = (el.querySelector(`[data-aid="Notification__message"]`) as HTMLElement).innerText

                unread.push({
                    body,
                    title
                })
            })

            const unique = unread.filter(x => !seen.has(`${x.title} ${x.body}`))
            ipcRenderer.send('notification', unique)
            unique.forEach(x => seen.add(`${x.title} ${x.body}`))
        }
    }, 1000)
})