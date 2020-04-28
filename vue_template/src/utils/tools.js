import { Message } from 'element-ui'

const WINDOWGROUP = { // 窗口管理，同样信息的提示框，同一时间只有一个
    'msgUid': {}
}

/**
 * elementui的message组件的封装
 * @param {*} option
 */
export function eleMessage (option) {
    let {
        message = '', type = 'info', onClose = null
    } = option || {}
    let _mark = `_toast${type}${message}`// 生成的massage id
    if (WINDOWGROUP['msgUid'][_mark]) { return false }// 不重复弹出相同mark的toast

    let _mes = Message({
        message, type,
        onClose: (data) => {
            WINDOWGROUP['msgUid'][_mark] = null
            delete WINDOWGROUP['msgUid'][_mark]
            if (onClose && typeof onClose === 'function') {
                onClose(data)
            }
        }
        // message: text || main.$t('member.submit_suc')
    })
    WINDOWGROUP['messageUniq'][_mark] = _mes
    return _mes
}