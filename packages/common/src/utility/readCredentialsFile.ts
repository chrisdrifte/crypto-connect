import fs from "fs";

export function readCredentialsFile(file: string): string[] {
  if (!fs.existsSync(file)) {
    throw new Error(
      `To run live tests, create a ${file} file with your apiKey on the first line, and your apiSecret on the second`,
    );
  }

  return fs.readFileSync(file).toString().split("\n");
}
