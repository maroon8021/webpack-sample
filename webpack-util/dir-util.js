const path = require('path');
const fs = require('fs');
const HTMLWebpackPlugin = require('html-webpack-plugin');

const FileType = {
  File: 'file',
  Directory: 'directory',
  Unknown: 'unknown'
}

const getFileType = path => {
  try {
    const stat = fs.statSync(path);

    switch (true) {
      case stat.isFile():
        return FileType.File;

      case stat.isDirectory():
        return FileType.Directory;

      default:
        return FileType.Unknown;
    }

  } catch(e) {
    return FileType.Unknown;
  }
}

const listFiles = (dirname, pageDir, opt_recursiveText = '') => {
  const ret = [];
  const recursiveDir = opt_recursiveText !== '' ? `/${opt_recursiveText}` : opt_recursiveText
  const dirPath = path.resolve(dirname, pageDir+recursiveDir)
  const paths = fs.readdirSync(dirPath);
  paths.forEach(pathText => {
    const currentPath = `${dirPath}/${pathText}`;

    switch (getFileType(currentPath)) {
      case FileType.File:
        const parts = pathText.split('.')
        const name = parts[0]
        let chunksName = name
        const extension = parts[1]
        if(opt_recursiveText !== '' && chunksName === 'index'){
          chunksName = opt_recursiveText
        }
        ret.push(
          new HTMLWebpackPlugin({
            filename: `.${recursiveDir}/${name}.html`,
            template: path.resolve(dirPath,`${name}.${extension}`),
            chunks : [chunksName]
          })
        );
        break;

      case FileType.Directory:
        if(opt_recursiveText !== ''){
          pathText = `${opt_recursiveText}/${pathText}`
        }
        ret.push(...listFiles(dirname, pageDir, pathText));
        break;

      default:
        break;
    }
  })

  return ret;
};

function generateHtmlPlugins (dirname, pageDir) {
  // Read files in template directory
  return listFiles(dirname,pageDir)
}

function generateJsEntries(dirname, pageDir){
  const files = fs.readdirSync(path.resolve(dirname, pageDir))
  return files.reduce((previousValue, currentValue) => {
    const parts = currentValue.split('.')
    const name = parts[0]
    previousValue[name] = path.resolve(dirname,`${pageDir}/${currentValue}`)
    return previousValue
  }, {})
}

module.exports = {
  generateHtmlPlugins,
  generateJsEntries
};