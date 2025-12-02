import { promises as fs } from "fs";
import path from "path";

export async function loadTemplate(templateName: string) {
  const filePath = path.join(process.cwd(), "templates", `${templateName}.html`);

  try {
    return await fs.readFile(filePath, "utf-8");
  } catch (err) {
    console.error("Template file not found:", filePath);
    throw err;
  }
}
