const Converter = require('./Converter');

class App {
  constructor() {
    this.con = new Converter();
  }

  convert = () => {
    try {
      this.con.convert();
    } catch (e) {
      console.log(new Error(e));
    }
  }

  init = () => {
    try {
      this.con.initYamlFile();
    } catch (e) {
      console.log(new Error(e));
    }
  }
}

module.exports = App;
