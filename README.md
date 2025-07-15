# 水杉智境工作室网站

## 部署到GitHub Pages

### 前置条件
- GitHub账号及仓库
- Node.js 18+ 和 pnpm

### 部署步骤
1. 将代码推送到GitHub仓库的main分支
   ```bash
   git add .
   git commit -m "准备部署到GitHub Pages"
   git push origin main
   ```

2. 在GitHub仓库中启用Pages:
   - 导航到仓库的Settings > Pages
   - 在"Build and deployment"部分，选择"Deploy from a branch"
   - 分支选择`gh-pages`，目录选择`/ (root)`
   - 点击"Save"

3. (可选) 如果使用项目站点而非用户/组织站点:
   - 编辑`next.config.ts`，取消注释并修改basePath
   ```typescript
   basePath: '/你的仓库名称',
   ```

### 查看部署状态
- 部署工作流将在代码推送到main分支后自动运行
- 可以在仓库的Actions标签页查看部署进度
- 部署完成后，访问 https://m9ai.github.io 查看网站

## 本地开发
```bash
pnpm install
pnpm dev
```

打开 http://localhost:3000 查看开发服务器
