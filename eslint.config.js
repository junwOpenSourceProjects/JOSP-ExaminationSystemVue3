import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import pluginTypeScript from 'typescript-eslint'
import configPrettier from 'eslint-config-prettier'

export default [
  js.configs.recommended,
  ...pluginTypeScript.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  configPrettier,
  {
    files: ['**/*.{js,ts,vue}'],
    languageOptions: {
      parserOptions: {
        parser: pluginTypeScript.parser,
        sourceType: 'module'
      }
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  },
  {
    languageOptions: {
      globals: {
        useHead: 'readonly',
        defineNuxtConfig: 'readonly',
        definePageMeta: 'readonly',
        useRuntimeConfig: 'readonly',
        navigateTo: 'readonly'
      }
    }
  },
  {
    ignores: ['.nuxt', '.output', 'node_modules', 'dist', '.prettierrc.cjs']
  }
]
