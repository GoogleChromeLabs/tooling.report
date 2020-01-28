/**
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import del from 'del';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

import simpleTS from './lib/simple-ts';
import clientBundlePlugin from './lib/client-bundle-plugin';
import nodeExternalPlugin from './lib/node-external-plugin';
import cssPlugin from './lib/css-plugin';
import assetPlugin from './lib/asset-plugin';
import constsPlugin from './lib/consts-plugin';
import resolveDirsPlugin from './lib/resolve-dirs-plugin';
import runScript from './lib/run-script';
import markdownPlugin from './lib/markdown-plugin';
import testDataPlugin from './lib/test-data-plugin';
import * as config from './config.js';

function resolveFileUrl({ fileName }) {
  return JSON.stringify(fileName.replace(/^static\//, '/'));
}

const validResults = new Set(['pass', 'fail', 'partial']);

function validateMarkdownData(id, data) {
  if (!id.startsWith('tests/')) return;
  if ('result' in data && !validResults.has(data.result)) {
    throw Error(
      `Result must be one of ${[...validResults].join(', ')}. Found "${
        data.result
      }" in ${id}`,
    );
  }
}

export default async function({ watch }) {
  await del('.tmp/build');

  const tsPluginInstance = simpleTS('static-build', { watch });
  const commonPlugins = () => [
    tsPluginInstance,
    resolveDirsPlugin(['static-build', 'client', 'tests']),
    cssPlugin(),
    assetPlugin(),
    constsPlugin({ config }),
    markdownPlugin({ metadataValidator: validateMarkdownData }),
  ];
  const dir = '.tmp/build';
  const staticPath = 'static/[name]-[hash][extname]';

  return {
    input: 'static-build/index.tsx',
    output: {
      dir,
      format: 'cjs',
      assetFileNames: staticPath,
      exports: 'named',
    },
    watch: { clearScreen: false },
    preserveModules: true,
    plugins: [
      { resolveFileUrl },
      clientBundlePlugin(
        {
          plugins: [
            { resolveFileUrl },
            ...commonPlugins(),
            resolve(),
            terser({ module: true }),
          ],
        },
        {
          dir,
          format: 'esm',
          chunkFileNames: staticPath,
          entryFileNames: staticPath.replace('[extname]', '.js'),
        },
        resolveFileUrl,
      ),
      ...commonPlugins(),
      nodeExternalPlugin(),
      testDataPlugin(),
      runScript(dir + '/index.js'),
    ],
  };
}
