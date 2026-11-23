# Dui 发布与维护指南

本指南用于指导开发人员进行类库的版本更新、构建与发布。

## 脚本配置

工程构建与发布脚本位于 `package.json`：

```json
{
  "scripts": {
    "build-dui": "ng build dui --configuration production",
    "prebuild": "npm --no-git-tag-version version patch && cd dui  && npm --no-git-tag-version version patch",
    "npm_pack": "cd dist/dui && npm pack",
    "package": "npm run build-dui && npm run npm_pack",
    "publish": "cd dist/dui && npm publish  --ignore-scripts",
    "unpublish": "cd dist/dui && npm unpublish @dotos/dui@latest  --force"
  }
}
```

## 操作流程

1. 增加版本号
2. 编译工程
3. 发布类库
4. 提交代码

### 1. 增加版本号

增加小版本号：

```shell
npm run prebuild
```

### 2. 构建工程

编译当前工程：

```shell
npm run build-dui
```

### 3. 发布类库

打包并发布类库至 GitHub Packages：

```shell
npm run publish
```
