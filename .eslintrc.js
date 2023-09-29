module.exports = {
  root: true,
  extends: ['universe/native', "universe/node", "universe/web"],
  "prettier/prettier": [
    "error",
    {
      "singleQuote": false,
      "parser": "flow"
    }
  ]
};
