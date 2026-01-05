import { build as viteBuild } from "vite";
import { rm, readFile, writeFile } from "fs/promises";
import { join } from "path";

async function buildAll() {
  await rm("dist", { recursive: true, force: true });

  console.log("Building client for GitHub Pages...");
  await viteBuild();
  
  // Create 404.html for GitHub Pages SPA routing
  // GitHub Pages uses 404.html to handle client-side routing
  // This ensures that all routes are handled by the SPA
  const distPath = join(import.meta.dirname, "..", "dist", "public");
  const indexPath = join(distPath, "index.html");
  
  try {
    const indexContent = await readFile(indexPath, "utf-8");
    // 404.html should be identical to index.html for SPAs
    await writeFile(join(distPath, "404.html"), indexContent);
    console.log("✅ 404.html criado para GitHub Pages SPA routing");
  } catch (error: any) {
    console.warn("⚠️  Aviso: Não foi possível criar 404.html:", error.message);
  }
  
  console.log("✅ Build complete! Files are in dist/public");
  console.log("📦 Ready for GitHub Pages deployment");
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
