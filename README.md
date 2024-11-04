# Dui

该工程基于 Angular CLI 18.1.0创建

# package

工程相关脚本配置

```json
`{`
  `"scripts": {`
    `"build-dui": "ng build dui --configuration production",`
    `"prebuild": "npm --no-git-tag-version version patch && cd dui  && npm --no-git-tag-version version patch",`
    `"npm_pack": "cd dist/dui && npm pack",`
    `"package": "npm run build-dui && npm run npm_pack",`
    `"publish": "cd dist/dui && npm publish  --ignore-scripts",`
    `"unpublish": "cd dist/dui && npm unpublish @dotos/dui@latest  --force"`
  `}`
`}`
```

# 操作

一般有变动后要进行以下操作：

1. 增加版本号
2. 编译工作
3. 发布类库
4. 提交代码

## Increase version number

增加小版本号

```shell
npm run  prebuild
```



## Build-dui

编译当前工程

```shell
npm run  build-dui
```



## publish

打包并发布类库

```
npm run  publish
```

