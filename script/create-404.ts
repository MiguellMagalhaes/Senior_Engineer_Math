import { readFile, writeFile } from "fs/promises";
import { join } from "path";

async function create404() {
  const distPath = join(import.meta.dirname, "..", "dist", "public");
  const indexPath = join(distPath, "index.html");
  
  try {
    const indexContent = await readFile(indexPath, "utf-8");
    // Create 404.html that redirects to index.html for SPA routing
    await writeFile(join(distPath, "404.html"), indexContent);
    console.log("✅ 404.html criado com sucesso!");
  } catch (error: any) {
    console.error("❌ Erro ao criar 404.html:", error.message);
    process.exit(1);
  }
}

create404();

