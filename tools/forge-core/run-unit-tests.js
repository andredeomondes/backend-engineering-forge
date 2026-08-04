import { getSetting } from "./database.js";
import { runUnitTests } from "./test-runner.js";

const unitId = process.argv[2] || getSetting("current_unit", "js-01");
const result = await runUnitTests(unitId);
process.stdout.write(result.output);
process.exitCode = result.success ? 0 : 1;
