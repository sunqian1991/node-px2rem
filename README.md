## px转rem的node工具
这是一个基于nodejs的将样式文件中的`px`单位转换为`rem`单位的工具，通过项目目录下的命令行中输入指定的指令实现批量转换指定文件的`px`单位。

需要注意的是，转换所需必要的参数需要从配置文件中读取，如不添加配置文件，会按照默认的配置进行转换，可能会对项目有影响，此插件提供了初始化配置文件的命令，建议先执行初始化后再开始转换。

#### 使用

- 安装
```shell
yarn add node-px2rem-converter
```

- 初始化
```shell
"./node_modules/.bin/px2rem" -I
```

- 开始转换
```shell
"./node_modules/.bin/px2rem" -R
```

#### 配置文件
执行了初始化后，自动在项目根目录生成一个px2rem.yml配置文件，建议在开始转换之前设置配置文件中的配置项

###### includeDirs
必填项，执行转换的目录的路径，默认为`src`目录

###### excludeDirs
选填项，不执行转换的目录的路径

###### excludeFiles
选填项，不执行转换的文件的路径，这个配置和excludeDirs都是在includeDirs中过滤对应的目录和文件

###### includeFiles
选填项，执行转换的文件的路径，这里的文件与目录的设置是单独的，文件可以不在已设置的转换目录中，同时目录和设置不转换的文件配置不会影响此设置

###### fileTypes
选填项，执行转换的文件的类型，默认为`css`和`less`，目前只支持`css`和`less`类型的文件，后续开发时考虑加入其他类型的文件

###### ratio
转换的比例设置，默认为`100`
