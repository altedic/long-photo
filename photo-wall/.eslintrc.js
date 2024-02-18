module.exports = {
  "env": {
      "browser": true,
      "es2021": true
  },
  "extends": [
      "eslint:recommended",
      "plugin:vue/essential"
  ],
  "parserOptions": {
      "ecmaVersion": 12,
      "sourceType": "module"
  },
  "plugins": [
      "vue"
  ],
  "rules": {
      'no-debugger'    :   'warn',
      'vue/multi-word-component-names': 'off',
      'vue/no-use-v-if-with-v-for' : 'off',
  }
};
