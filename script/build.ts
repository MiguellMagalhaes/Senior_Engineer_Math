import { build as viteBuild } from "vite";
import { rm } from "fs/promises";

async function buildAll() {
  await rm("dist", { recursive: true, force: true });

  console.log("Building client for GitHub Pages...");
  await viteBuild();
  
  console.log("✅ Build complete! Files are in dist/public");
  console.log("📦 Ready for GitHub Pages deployment");
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
