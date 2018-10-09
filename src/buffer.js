const bufferList = {}

export default {

    addBuffer(key, datas, others) {
        if (!key) return false
        !bufferList[key] && (bufferList[key] = {
            data: [],
            props: {}
        })
        bufferList[key]['data'] = bufferList[key]['data'].concat(datas)
        if (others) for (const i in others) {
            bufferList[key]['props'][i] = others[i]
        }

        //console.log(bufferList)
        return bufferList[key]
    },

    setBuffer(key, datas, others) {
        if (!key) {
            return false
        }
        !bufferList[key] && (bufferList[key] = {
            data: [],
            props: {}
        })
        bufferList[key]['data'] = datas
        if (others)for (const i in others) {
            bufferList[key]['props'][i] = others[i]
        }
        //console.log(bufferList)
        return bufferList[key]
    },

    setProps(key, others) {
        if (!key) {
            return false
        }
        !bufferList[key] && (bufferList[key] = {
            data: [],
            props: {}
        })
        if (others)for (const i in others) {
            bufferList[key]['props'][i] = others[i]
        }
        //console.log(bufferList)
        return bufferList[key]
    },

    clearBuffer(key) {
        if (!key) return false
        if (!bufferList[key]) return false
        bufferList[key][data].length = 0
        bufferList[key] = {
            data: [],
            props: {}
        }
        // console.log(bufferList)
        return bufferList[key]
    },

    getBuffer(key) {
        if (!key) return null
        //console.log(bufferList[key])
        return bufferList[key] || null
    }
}
