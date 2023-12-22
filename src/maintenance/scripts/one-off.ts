import type { Mark } from "../../schemas";
import { jsonStringifyRecords } from "../../utils";
import { getDataPath, readFileAsJson, writeFile } from "../utils/fs";

// Use this file to run one-off scripts like this example.
// The run it with `bun src/maintenance/scripts/one-off.ts`
// NOTE: Do not commit the changes to this file.

function run() {
  // Get the data file contents
  const dataFile = getDataPath("marks.json");
  const marks = readFileAsJson<Mark[]>(dataFile);

  for (const mark of marks) {
    // Do something with each record here.
    console.log(mark.id);
  }

  // Save the changes
  writeFile(dataFile, jsonStringifyRecords(marks));
}

run();
