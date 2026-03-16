const base = require("@mendix/pluggable-widgets-tools/configs/eslint.ts.base.json");

module.exports = {
    ...base,
    rules: {
        ...base.rules,
        "@typescript-eslint/no-unused-vars": ["warn", { varsIgnorePattern: "^createElement$" }]
    }
};
