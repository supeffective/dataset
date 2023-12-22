import { z } from "zod";
import { localDataLoader } from "../maintenance/loader";
import { validate } from "../maintenance/validation";
import { markSchema } from "../schemas";

describe("Validate marks.json data", () => {
  const recordList = localDataLoader.marks();

  it("should be valid", () => {
    const listSchema = z.array(markSchema);
    const validation = validate(listSchema, recordList);

    if (!validation.success) {
      console.error(validation.errorsSummary.join("\n"));
    }

    expect(validation.success).toBe(true);
    expect(validation.errors).toHaveLength(0);
  });
});
