import fs from "node:fs/promises";
import path from "node:path";

export async function writeFile(filename, data) {
  const dirname = path.dirname(filename);

  await fs.mkdir(dirname, { recursive: true });
  await fs.writeFile(filename, data);

  console.log(filename);
}
