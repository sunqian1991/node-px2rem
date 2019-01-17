const Convertor = require('./Convertor');

const con = new Convertor();
try {
  con.convert();
} catch (e) {
  console.log(new Error(e));
}
