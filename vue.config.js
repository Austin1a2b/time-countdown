module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/time-countdown/'           //這邊是 repo 專案名稱
    : '/'
}