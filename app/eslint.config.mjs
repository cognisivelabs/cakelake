import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // Tests exercise hooks/context via a tiny "probe" component that
    // assigns the hook's return value to an outer variable so the test
    // body can read it after act() — a deliberate, controlled violation
    // of "no side effects during render" that only ever matters for
    // real render-timing correctness, not for a probe only read
    // synchronously right after a manually-flushed act().
    files: ["**/*.test.ts", "**/*.test.tsx"],
    rules: {
      "react-hooks/globals": "off",
    },
  },
]);

export default eslintConfig;
