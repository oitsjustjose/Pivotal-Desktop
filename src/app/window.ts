import Store from '../utils/store'

const store = new Store({
    configName: 'window-settings',
    defaults: {
        width: 800,
        height: 600,
        x: 0,
        y: 0,
        autohideMenu: false
    }
})

export const getWindow = () => {
    return {
        width: store.get('width'),
        height: store.get('height'),
        x: store.get('x'),
        y: store.get('y'),
    }
}

export const setWindow = (x: number, y: number, w: number, h: number) => {
    store.set('x', x)
    store.set('y', y)
    store.set('width', w)
    store.set('height', h)
}

export const getAutoHideSetting = () => {
    return store.get('autohideMenu')
}

export const setAutoHide = (autohideMenu: boolean) => {
    store.set('autohideMenu', autohideMenu)
}