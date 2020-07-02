import electron from 'electron'
import path from 'path'
import fs from 'fs'
import { isToken } from 'typescript'

interface StorageOptionsDefaults {
    width: number,
    height: number,
    x: number,
    y: number
}

interface StorageOptions {
    configName: string,
    defaults: StorageOptionsDefaults
}

export default class Store {
    path: string
    data: any

    constructor(opts: StorageOptions) {
        const dataPath = (electron.app || electron.remote.app).getPath('userData')
        this.path = path.join(dataPath, opts.configName + '.json')
        this.data = parseDataFile(this.path, opts.defaults)
    }

    get(key: string) {
        return this.data[key];
    }

    set(key: string, val: any) {
        this.data[key] = val

        fs.writeFileSync(this.path, JSON.stringify(this.data))
    }
}

const parseDataFile = (fp: string, defaults: StorageOptionsDefaults) => {
    try {
        return JSON.parse(fs.readFileSync(fp).toString())
    } catch (ex) {
        return defaults
    }
}