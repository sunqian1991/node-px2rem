import yaml from 'js-yaml';
import fs from 'fs';
import css from 'css';
import readline from 'readline';
import os from 'os';

class Convertor {
  constructor() {
    const defaultProps = this.loadYamlFile('src/config/px2rem.yml').body;
    this.props = Object.assign({}, defaultProps, this.getYamlProps());
  }

  loadYamlFile = (dir) => {
    try {
      const doc = yaml.safeLoad(fs.readFileSync(dir, 'utf8'));
      return Object.assign({ load: true, body: {} }, { body: doc });
    } catch (e) {
      return { load: false, error: e.message };
    }
  };

  getYamlProps = () => {
    let props = {};
    if (!fs.existsSync('px2rem.yml')) {
      fs.copyFileSync('src/config/px2rem.yml', './px2rem.yml');
    }
    const yamlProps = this.loadYamlFile('px2rem.yml');
    if (yamlProps.load) {
      props = Object.assign({}, yamlProps.body);
    }
    return props;
  };

  isNumber = num => ((/^\d+(\.\d+)?$/.test(num) || /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/.test(num)));

  formatAccuracy = value => (value.substring(0, value.indexOf('.') < 0 ? value.length : value.indexOf('.')).length + 1);

  getFormatText = (ele) => {
    if (!ele || ele.toLowerCase().indexOf('px') === -1 || ele === '') {
      return ele;
    }
    const rem = parseFloat(ele.substring(0, ele.indexOf('px'))) / parseFloat(this.props.ratio);
    return `${rem.toFixed(this.formatAccuracy(String(this.props.ratio))).replace(/0*$/g, '').replace(/\.$/g, '')}rem`;
  };

  calculateProp = (value) => {
    let index = value.toLowerCase().indexOf('px');
    let content = value;
    do {
      index = content.toLowerCase().indexOf('px');

      let startIndex = index;
      while (startIndex > 0 && this.isNumber(content.substring(startIndex - 1, index))) {
        startIndex -= 1;
      }
      if (startIndex !== index) {
        content = content.substring(0, startIndex) + this.getFormatText(`${content.substring(startIndex, index)}px`.toLowerCase()) + content.substring(index + 2);
      }
    } while (index > -1);
    return content;
  };

  calculateLine = (value) => {
    let content = value;
    let colonIndex = 0;

    while (content.indexOf(':', colonIndex) > -1) {
      const fromIndex = content.indexOf(':', colonIndex);
      const toIndex = (content.indexOf(';', fromIndex) === -1 || content.indexOf(';', colonIndex) < fromIndex) ? content.length : (content.indexOf('}', fromIndex) > -1 && content.indexOf(';', fromIndex) > content.indexOf('}', fromIndex) ? content.indexOf('}', fromIndex) : content.indexOf(';', fromIndex));
      let cont = content.substring(fromIndex + 1, toIndex);
      let index = cont.toLowerCase().indexOf('px');
      do {
        index = cont.toLowerCase().indexOf('px');

        let startIndex = index;
        while (startIndex > 0 && this.isNumber(cont.substring(startIndex - 1, index))) {
          startIndex -= 1;
        }
        if (startIndex !== index) {
          cont = cont.substring(0, startIndex) + this.getFormatText(`${cont.substring(startIndex, index)}px`.toLowerCase()) + cont.substring(index + 2);
        }
      } while (index > -1);
      content = `${content.substring(0, fromIndex + 1)}${cont}${content.substring(toIndex)}`;
      colonIndex = content.indexOf(':', colonIndex) + 1;
    }
    return content;
  };

  doConvertCSSFile = (file) => {
    const stylesString = fs.readFileSync(file, 'utf-8');
    const styles = css.parse(stylesString);
    styles.stylesheet.rules = styles.stylesheet.rules.map((rule => (
      Object.assign({}, rule, {
        declarations: rule.declarations.map(style => (
          (style.value.indexOf('px') > -1) ? Object.assign({}, style, { value: this.calculateProp(style.value) }) : style
        )),
      })
    )));
    fs.writeFileSync(file, css.stringify(styles), {
      encoding: 'utf-8',
    });
  };

  doConvertFile = (file) => {
    const input = fs.createReadStream(file);
    let content = '';
    const rl = readline.createInterface({
      input,
    });
    rl.on('line', (line) => {
      content = `${content}${content === '' ? '' : os.EOL}${line.toLowerCase().indexOf('px') > -1 ? this.calculateLine(line) : line}`;
    });
    rl.on('close', () => {
      fs.writeFileSync(file, content, {
        encoding: 'utf-8',
      });
    });
  };

  getConvertFiles = (dir) => {
    fs.readdir(dir, 'utf8', (err, files) => {
      if (!err) {
        files.filter(f => (f.indexOf('.') > 0 && this.props.fileTypes.indexOf(f.substring(f.lastIndexOf('.') + 1)) > -1) || (fs.statSync(`${dir}/${f}`).isDirectory())).forEach((f) => {
          if (fs.statSync(`${dir}/${f}`).isDirectory()) {
            this.getConvertFiles(`${dir}/${f}`);
          } else if (/\.css$/.test(f)) {
            this.doConvertCSSFile(`${dir}/${f}`);
          } else if (/\.less$/.test(f)) {
            this.doConvertFile(`${dir}/${f}`);
          } else {
            this.doConvertFile(`${dir}/${f}`);
          }
        });
      }
    });
  };

  convert = () => {
    if (this.props && this.props.includeDirs && this.props.fileTypes) {
      this.props.includeDirs.forEach((dir) => {
        this.getConvertFiles(dir);
      });
    }
  };
}

module.exports = Convertor;
