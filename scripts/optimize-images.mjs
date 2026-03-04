import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const workspace = "/Users/carlos/Developer/casa_rural";
const pagePath = path.join(workspace, "app/page.tsx");
const sourceRoot = path.join(workspace, "public");
const outputRoot = path.join(sourceRoot, "images/optimized");

const pageContent = fs.readFileSync(pagePath, "utf8");
const imagePaths = [
  ...new Set(
    [...pageContent.matchAll(/"(\/images\/[^"]+)"/g)]
      .map((match) => match[1])
      .filter((imgPath) => !imgPath.startsWith("/images/optimized/"))
  )
];

fs.mkdirSync(outputRoot, { recursive: true });

async function optimize() {
  for (const imagePath of imagePaths) {
    const sourcePath = path.join(sourceRoot, imagePath.replace(/^\/+/, ""));
    const parsed = path.parse(sourcePath);
    const outputPath = path.join(outputRoot, `${parsed.name}.webp`);

    await sharp(sourcePath)
      .rotate()
      .resize({
        width: 1800,
        height: 1800,
        fit: "inside",
        withoutEnlargement: true
      })
      .webp({ quality: 74, effort: 5 })
      .toFile(outputPath);

    const sourceSize = fs.statSync(sourcePath).size;
    const optimizedSize = fs.statSync(outputPath).size;
    const ratio = ((1 - optimizedSize / sourceSize) * 100).toFixed(1);
    console.log(
      `${imagePath} -> /images/optimized/${parsed.name}.webp (-${ratio}%)`
    );
  }
}

optimize().catch((error) => {
  console.error(error);
  process.exit(1);
});

