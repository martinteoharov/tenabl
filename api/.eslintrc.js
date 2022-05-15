// eslint-disable-next-line no-undef
module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
        'unused-imports'
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    rules: {
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['warn', {
            vars: 'all',
            varsIgnorePattern: '^_',
            args: "after-used",
            argsIgnorePattern: '^_'
        }],
        'unused-imports/no-unused-imports': 'warn',
        'eol-last': ['warn', 'always'],
        'no-trailing-spaces': 'warn',
    }
};
