const path = require('path');

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    context: path.resolve(__dirname, '../'),
    resolve: {
        // 自动补全扩展名
        extensions: ['.js', '.vue', '.json'],
        // 默认路径代理
        alias: {
            '@': resolve('src')
        }
    }
}
