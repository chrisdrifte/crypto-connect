import * as fs from "fs";

/**
 * Reads a file and splits content into an array of lines
 */
export function readCredentialsFile(file: string): string[] {
  if (!fs.existsSync(file)) {
    throw new Error(
      `To run live tests, create a ${file} file with your credentials on each line`,
    );
  }

  return fs.readFileSync(file).toString().split("\n");
}
