# 值得买集成 - 快速启动脚本

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   值得买 OpenAPI 数据可视化平台    " -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# 检查 MongoDB 是否运行
Write-Host "🔍 检查 MongoDB 状态..." -ForegroundColor Yellow
$mongoProcess = Get-Process mongod -ErrorAction SilentlyContinue
if ($null -eq $mongoProcess) {
    Write-Host "❌ MongoDB 未运行！" -ForegroundColor Red
    Write-Host "请先启动 MongoDB 服务" -ForegroundColor Yellow
    exit 1
} else {
    Write-Host "✅ MongoDB 正在运行" -ForegroundColor Green
}

Write-Host ""
Write-Host "📦 项目路径: d:\code\data-viz-platform" -ForegroundColor Cyan
Write-Host ""

# 询问是否生成数据
Write-Host "是否需要生成种子数据？(Y/N): " -ForegroundColor Yellow -NoNewline
$generateData = Read-Host

if ($generateData -eq "Y" -or $generateData -eq "y") {
    Write-Host ""
    Write-Host "🌱 正在生成种子数据..." -ForegroundColor Yellow
    Set-Location "d:\code\data-viz-platform\backend"
    node seedZhidemai.js
    Write-Host ""
}

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "🚀 启动说明" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1️⃣  启动后端服务（端口 5000）:" -ForegroundColor Yellow
Write-Host "   cd d:\code\data-viz-platform\backend" -ForegroundColor White
Write-Host "   npm start" -ForegroundColor White
Write-Host ""
Write-Host "2️⃣  启动前端服务（端口 5173）:" -ForegroundColor Yellow
Write-Host "   cd d:\code\data-viz-platform\frontend" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "🌐 访问地址" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 仪表板:       http://localhost:5173/dashboard" -ForegroundColor Cyan
Write-Host "🎁 好价推荐:     http://localhost:5173/zhidemai-deals" -ForegroundColor Cyan
Write-Host "📰 社区文章:     http://localhost:5173/zhidemai-articles" -ForegroundColor Cyan
Write-Host "🛒 京东热榜:     http://localhost:5173/jd-hotlist" -ForegroundColor Cyan
Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "📡 API 接口测试" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "好价列表:       http://localhost:5000/api/zhidemai/haojia" -ForegroundColor White
Write-Host "文章列表:       http://localhost:5000/api/zhidemai/articles" -ForegroundColor White
Write-Host "统计数据:       http://localhost:5000/api/zhidemai/stats" -ForegroundColor White
Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "📖 文档位置" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "完整报告:       ZHIDEMAI_FINAL_REPORT.md" -ForegroundColor White
Write-Host "集成文档:       ZHIDEMAI_INTEGRATION.md" -ForegroundColor White
Write-Host "更新指南:       ZHIDEMAI_UPDATE.md" -ForegroundColor White
Write-Host "功能总结:       ZHIDEMAI_SUMMARY.md" -ForegroundColor White
Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "✨ 准备就绪！请按上述步骤启动服务" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
