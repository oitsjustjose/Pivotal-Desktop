import Store from './store'

const store = new Store({
    configName: 'window-settings',
    defaults: {
        width: 800,
        height: 600,
        x: 0,
        y: 0
    }
})

export const get = () => {
    return {
        width: store.get('width'),
        height: store.get('height'),
        x: store.get('x'),
        y: store.get('y')
    }
}

export const set = (x: number, y: number, w: number, h: number) => {
    store.set('x', x)
    store.set('y', y)
    store.set('width', w)
    store.set('height', h)
}