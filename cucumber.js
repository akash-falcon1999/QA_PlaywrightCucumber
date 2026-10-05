module.exports = {
  default: {
    paths: ['features/**/*.feature'],
    require: ['features/support/*.js', 'features/steps/*.js'],
    format: ['progress-bar', 'html:reports/cucumber-report.html', 'json:reports/cucumber-report.json'],
  },
};
