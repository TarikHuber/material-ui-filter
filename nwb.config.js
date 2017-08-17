module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'material-ui-filter',
      externals: {
        react: 'React'
      }
    }
  }
}
