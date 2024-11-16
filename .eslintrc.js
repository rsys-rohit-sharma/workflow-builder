module.exports = {
    root: true,
    env: { node: true, jest: true },
    parser: '@typescript-eslint/parser',
    parserOptions: {},
    plugins: ['@typescript-eslint', 'prettier', 'import', 'simple-import-sort'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
    ],
    ignorePatterns: ['node_modules/', '**/node_modules/', '/**/node_modules/*', 'out/', 'dist/', 'build/'],
    rules: {
        'eslint-comments/require-description': 'off',
        'eslint-comments/no-unused-disable': 'off',
        'import/no-extraneous-dependencies': 'off',
        'lines-between-class-members': 'off',
        'max-classes-per-file': ['error', 2],
        'no-useless-catch': 'off',
        'no-useless-constructor': 'off',
        'no-use-before-define': 'off',
        'prefer-type-alias/prefer-type-alias': 'off',
        'require-await': 'off',
        'no-await-in-loop': 'off',
        'no-promise-executor-return': 'warn',
        'consistent-return': 'warn',
        'no-constant-condition': 'warn',
        'no-empty-function': 'off',
        'prefer-regex-literals': 'warn',
        '@typescript-eslint/no-shadow': 'warn',
        'default-case': 'warn',
        'no-return-assign': 'warn',
        'no-param-reassign': 'off',
        'no-new': 'warn',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': 'off',

        // Enforce sorting imports
        'simple-import-sort/imports': 'error',
        'simple-import-sort/exports': 'error',

        // Other helpful import rules
        'import/first': 'error', // Ensure all imports appear before other statements
        'import/newline-after-import': 'error', // Ensure a newline after import section
        'import/no-duplicates': 'error', // Disallow duplicate imports
        'import/order': [
            'error',
            {
                groups: [
                    ['builtin', 'external'],
                    ['internal', 'parent', 'sibling', 'index'],
                ],
                'newlines-between': 'always',
            },
        ],
    },
    overrides: [
        {
            files: ['**/*spec.ts'],
            rules: {
                '@typescript-eslint/no-explicit-any': 'warn',
            },
        },
    ],
};
