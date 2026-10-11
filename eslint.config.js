// Lint rules of every project (AI Company template v2, ADR 0012). Agents cannot change this file, and `npm run lint`
// runs with --no-inline-config, so `eslint-disable` comments have no effect.
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import security from 'eslint-plugin-security';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  // Only the build outputs: the root's and each workspace's dist (never a dist directory an agent adds elsewhere, S5-7).
  { ignores: ['**/node_modules/**', 'dist/**', 'api/dist/**', 'web/dist/**'] },
  {
    files: ['**/*.{js,jsx,ts,tsx,mjs,cjs}'],
    extends: [js.configs.recommended, tseslint.configs.recommended, security.configs.recommended],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
    rules: {
      // Typed index access is everywhere in TypeScript; this rule reports it as noise.
      'security/detect-object-injection': 'off',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-restricted-syntax': [
        'error',
        { selector: "CallExpression[callee.name='eval']", message: 'eval is not allowed.' },
        { selector: "NewExpression[callee.name='Function']", message: 'new Function is not allowed.' },
        { selector: "JSXAttribute[name.name='dangerouslySetInnerHTML']", message: 'dangerouslySetInnerHTML is not allowed: render text.' },
        { selector: "AssignmentExpression[left.property.name='innerHTML']", message: 'Assigning innerHTML is not allowed: use textContent.' },
        { selector: "AssignmentExpression[left.property.name='outerHTML']", message: 'Assigning outerHTML is not allowed.' },
      ],
    },
  },
);
