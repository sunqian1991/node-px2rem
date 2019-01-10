const yaml = require('js-yaml');
const fs = require('fs');
const css = require('css');

const loadYamlFile = (dir) => {
  try {
    const doc = yaml.safeLoad(fs.readFileSync(dir, 'utf8'));
    return Object.assign({ load: true, body: {} }, { body: doc });
  } catch (e) {
    return { load: false, error: e.message };
  }
};

const defaultProps = loadYamlFile('src/config/px2rem.yml').body;

const getYamlProps = () => {
  let props = {};
  if (!fs.existsSync('px2rem.yml')) {
    fs.copyFileSync('src/config/px2rem.yml', './px2rem.yml');
  }
  const yamlProps = loadYamlFile('px2rem.yml');
  if (yamlProps.load) {
    props = Object.assign({}, yamlProps.body);
  }
  return props;
};

const props = Object.assign({}, defaultProps, getYamlProps());

const isNumber = (num) => {
  const regPos = /^\d+(\.\d+)?$/;
  const regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/;
  return (regPos.test(num) || regNeg.test(num));
};

const formatAccuracy = value => (value.substring(0, value.indexOf('.') < 0 ? value.length : value.indexOf('.')).length + 1);

const getFormatText = (ele) => {
  if (!ele || ele.toLowerCase().indexOf('px') === -1 || ele === '') {
    return ele;
  }
  const rem = parseFloat(ele.substring(0, ele.indexOf('px'))) / parseFloat(props.ratio);
  return `${rem.toFixed(formatAccuracy(String(props.ratio))).replace(/0*$/g, '').replace(/\.$/g, '')}rem`;
};

const calculate = (value) => {
  let index = value.toLowerCase().indexOf('px');
  let content = value;
  do {
    index = content.toLowerCase().indexOf('px');

    let startIndex = index;
    while (startIndex > 0 && isNumber(content.substring(startIndex - 1, index))) {
      startIndex -= 1;
    }
    if (startIndex !== index) {
      content = content.substring(0, startIndex) + getFormatText(`${content.substring(startIndex, index)}px`.toLowerCase()) + content.substring(index + 2);
    }
  } while (index > -1);
  return content;
};

const doConvertFile = (file) => {
  const stylesString = fs.readFileSync(file, 'utf-8');
  const styles = css.parse(stylesString);
  styles.stylesheet.rules = styles.stylesheet.rules.map((rule => (
    Object.assign({}, rule, {
      declarations: rule.declarations.map(style => (
        (style.value.indexOf('px') > -1) ? Object.assign({}, style, { value: calculate(style.value) }) : style
      )),
    })
  )));
  fs.writeFileSync(file, css.stringify(styles), {
    encoding: 'utf-8',
  });
};

const getConvertFiles = (dir) => {
  fs.readdir(dir, 'utf8', (err, files) => {
    if (!err) {
      files.filter(f => (f.indexOf('.') > 0 && props.fileTypes.indexOf(f.substring(f.lastIndexOf('.') + 1)) > -1) || (fs.statSync(`${dir}/${f}`).isDirectory())).forEach((f) => {
        if (fs.statSync(`${dir}/${f}`).isDirectory()) {
          getConvertFiles(`${dir}/${f}`);
        } else {
          doConvertFile(`${dir}/${f}`);
        }
      });
    }
  });
};

const convert = () => {
  if (props && props.includeDirs && props.fileTypes) {
    props.includeDirs.forEach((dir) => {
      getConvertFiles(dir);
    });
  }
};

convert();
