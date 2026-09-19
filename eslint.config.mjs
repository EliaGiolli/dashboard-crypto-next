import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import nextPlugin from '@next/eslint-plugin-next'
import jsxA11y from 'eslint-plugin-jsx-a11y'

export default tseslint.config(
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'src/core/generated/**',
      'src/generated/**',
      'playwright-report/**',
      'test-results/**',
      'next-env.d.ts',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ['**/*.{ts,tsx,js,jsx,mjs}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: {
      '@next/next': nextPlugin,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      ...jsxA11y.flatConfigs.recommended.rules,

      // Accessibility: these are the classes of bug found during the audit
      // (dangling aria-labelledby, nav implemented as a button).
      'jsx-a11y/anchor-is-valid': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/heading-has-content': 'error',

      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  // Architecture boundary: app -> features -> shared + core.
  // Enforced here so the dependency rule is mechanical, not aspirational.
  {
    files: ['src/shared/**/*.{ts,tsx}', 'src/core/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/*', '@/features/**', '**/features/*'],
              message:
                'shared/ and core/ must not import from features/. Move the shared piece down into shared/ or core/, or invert the dependency.',
            },
          ],
        },
      ],
    },
  },

  // Features may only reach each other through a public barrel (index.ts),
  // never through a deep path.
  {
    files: ['src/features/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/*/components/*', '@/features/*/lib/*', '@/features/*/hooks/*'],
              message:
                'Import another feature through its index.ts barrel (e.g. @/features/watchlist), not a deep path.',
            },
          ],
        },
      ],
    },
  },

  // Test files get looser rules.
  {
    files: ['**/*.test.{ts,tsx}', 'e2e/**/*.ts', 'tests/**/*.ts'],
    rules: { '@typescript-eslint/no-explicit-any': 'off' },
  }
)
