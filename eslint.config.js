import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        // Variables de entorno de Vite
        'import.meta.env': 'readonly',
        'import.meta.env.VITE_API_URL': 'readonly',
        'import.meta.env.VITE_APP_TITLE': 'readonly',
        'import.meta.env.VITE_APP_VERSION': 'readonly',
        'import.meta.env.VITE_DEBUG_MODE': 'readonly',
        'import.meta.env.DEV': 'readonly',
        'import.meta.env.PROD': 'readonly',
        'import.meta.env.MODE': 'readonly',
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
]
