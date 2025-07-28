const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// 修改为你的 .ply 文件所在的文件夹路径
const inputDir = path.resolve(__dirname, 'C:\\Users\\28397\\Desktop\\3DGS\\ControlGS论文相关\\模型整理\\LP-3DGS-R_models_arranged\\ply_models');
const outputDir = path.resolve(__dirname, 'C:\\Users\\28397\\Desktop\\3DGS\\ControlGS论文相关\\模型整理\\LP-3DGS-R_models_arranged\\ksplat_models');

// 创建输出目录（如果不存在）
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// 遍历文件夹中所有 .ply 文件
const plyFiles = fs.readdirSync(inputDir).filter(file => file.endsWith('.ply'));

const compressionLevel = 0;
const alphaThreshold = 0;
const sceneCenter = '"0,0,0"';
const blockSize = 5.0;
const bucketSize = 256;
const shLevel = 2;

let index = 0;

function convertNext() {
    if (index >= plyFiles.length) {
        console.log('✅ 所有文件转换完成！');
        return;
    }

    const plyFile = plyFiles[index];
    const inputPath = path.join(inputDir, plyFile);
    const outputPath = path.join(outputDir, plyFile.replace('.ply', '.ksplat'));

    const command = `node --max-old-space-size=8192 util/create-ksplat.js "${inputPath}" "${outputPath}" ${compressionLevel} ${alphaThreshold} ${sceneCenter} ${blockSize} ${bucketSize} ${shLevel}`;

    console.log(`▶️ 正在转换 ${plyFile}...`);

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ 转换失败: ${plyFile}`, error);
        } else {
            console.log(`✅ 转换成功: ${outputPath}`);
        }
        index++;
        convertNext();  // 继续下一个文件
    });
}

convertNext();