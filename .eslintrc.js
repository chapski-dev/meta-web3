module.exports = {
  'extends': ['react-app', 'eslint:recommended'],
  'rules': {
    'indent': ['warn', 2, { 'SwitchCase': 1 }],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always', { omitLastInOneLineBlock: true }],
    '@typescript-eslint/semi': ['warn'],
    '@typescript-eslint/member-delimiter-style': ['warn'],
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/no-shadow': ['error'],
    'no-unused-vars': ['error'],
    'no-useless-rename': 'error',
    'no-duplicate-imports': 'error',
    'prefer-arrow-callback': 'warn',
    'arrow-parens': ['error', 'always'],
    'curly': 'error',
    'padded-blocks': ['warn', 'never'],
    'no-multiple-empty-lines': ['warn', { 'max': 1 }],
    'dot-notation': 'error',
    'eqeqeq': 'error',
    'no-empty-function': 'error',
    'no-empty-pattern': 'error',
    'no-multi-spaces': 'warn',
    'no-shadow': 'off',
    'array-bracket-newline': ['warn', 'consistent'],
    'block-spacing': 'warn',
    'comma-dangle': ['warn', 'always-multiline'],
    'comma-spacing': ['error', { before: false, after: true }],
    'comma-style': ['error', 'last'],
    'object-curly-spacing': ['warn', 'always'],
    'eol-last': ['warn', 'always'],
    'func-call-spacing': ['error', 'never'],
    'jsx-quotes': ['error', 'prefer-double'],
    'space-infix-ops': ['warn'],
    'key-spacing': ['warn', { beforeColon: false, afterColon: true, mode: 'strict' }],
    'object-property-newline': ['warn', { allowMultiplePropertiesPerLine: true }],
    'no-unneeded-ternary': 'error',
    'max-len': ['warn', { code: 160, ignoreComments: true, ignoreStrings: true }],
    'react/jsx-wrap-multilines': ['warn', {
      'declaration': 'parens-new-line',
      'assignment': 'parens-new-line',
      'return': 'parens-new-line',
      'arrow': 'parens-new-line',
      'condition': 'parens-new-line',
      'logical': 'parens-new-line',
      'prop': 'parens-new-line',
    }],
    'react/jsx-tag-spacing': ['warn', {
      closingSlash: 'never',
      beforeSelfClosing: 'always',
      afterOpening: 'never',
      beforeClosing: 'never',
    }],
    'arrow-body-style': ['error', 'as-needed'],
    'react/jsx-indent': ['warn', 2],
    'react/jsx-indent-props': ['warn', 2],
    'react/jsx-curly-newline': ['warn', {
      multiline: 'forbid',
      singleline: 'forbid',
    }],
    'react/jsx-closing-bracket-location': ['warn'],
    'react/jsx-max-props-per-line': ['warn', { when: 'multiline' }],
    'react/jsx-first-prop-new-line': ['warn', 'multiline'],
    'react-hooks/exhaustive-deps': ['warn', {
      'additionalHooks': '(useGeneratorCallback|useGeneratorCallbackState|useGeneratorEffect|useBack)',
    }],
    'space-before-blocks': 'warn',
    'brace-style': ['warn', '1tbs'],
    'no-redeclare': 'off',
    '@typescript-eslint/no-redeclare': ['error'],
    'keyword-spacing': 'warn',
    'no-restricted-imports': ['error', {
      paths: [{
        name: 'react-redux',
        importNames: ['useSelector'],
        message: 'Please import \'useSelector\' from \'src/store\' instead.',
      }, {
        name: 'react-redux',
        importNames: ['useDispatch'],
        message: 'Please import \'useDispatch\' from \'src/store\' instead.',
      }, {
        name: 'react-redux',
        importNames: ['useStore'],
        message: 'Please import \'useStore\' from \'src/store\' instead.',
      }],
    }],
  },
  'settings': {
    'import/resolver': {
      'node': {
        'moduleDirectory': ['node_modules', 'src/'],
      },
    },
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'no-undef': 'off',
      },
    },
  ],
};