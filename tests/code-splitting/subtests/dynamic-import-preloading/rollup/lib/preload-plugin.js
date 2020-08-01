const MARKER = 'preloading-import:';

const PLACEHOLDER = '____TOTALLY_A_PLACEHOLDER____';

export default function preload() {
  return {
    name: 'preload',
    resolveId(id) {
      if (id !== MARKER) {
        return;
      }
      return id;
    },
    load(id) {
      if (id !== MARKER) {
        return;
      }
      return `
        const bundleData = ${PLACEHOLDER};
        export async function preloadingImport(path, base) {
          path = path.replace(/(\\.\\/)*/, '');
          const deps = new Set([path]);
          for(const dep of deps) {
            for(const subdep of (bundleData[dep] || [])) {
              deps.add(subdep);
            }
          }
          for(const dep of deps) {
            const tag = document.createElement("link");
            tag.rel = "preload";
            tag.as = "script"
            tag.crossOrigin = true;
            tag.href = dep;
            document.head.append(tag);
          };
          return import("./"+path);
        }
      `;
    },
    transform(code, id) {
      if (!code.includes('import(')) {
        return;
      }
      if (id === MARKER) {
        return;
      }
      return `
        import {preloadingImport} from "${MARKER}"; 
        // Rollup prunes the import because renderDynamicImport() 
        // didn’t run yet. This is my workaround.
        // See https://github.com/rollup/rollup/issues/3700
        self[Symbol()] = preloadingImport;
        ${code}
      `;
    },
    renderDynamicImport({ moduleId }) {
      if (moduleId === MARKER) {
        return;
      }
      return {
        left: 'preloadingImport(',
        right: ', import.meta.url)',
      };
    },
    generateBundle(options, bundle) {
      const bundleData = {};
      for (const info of Object.values(bundle)) {
        if (info.type !== 'chunk') {
          continue;
        }
        bundleData[info.fileName] = info.imports;
      }
      for (const chunk of Object.values(bundle)) {
        chunk.code = chunk.code.replace(
          PLACEHOLDER,
          JSON.stringify(bundleData),
        );
      }
    },
  };
}
