import { h, Fragment, ComponentType } from 'preact';
import acorn from 'acorn';
import walk from 'acorn-walk';

const GLOBALS_MAPPINGS: { [key: string]: string } = {
  // only import hooks if used (note: badly relies on rollup/ts import name inference)
  hooks: `import * as hooks from 'https://unpkg.com/preact@latest/hooks/dist/hooks.module.js?module';`,
  // we don't actually need the style values, because hydration doesn't diff attributes.
  styles: 'var styles = {};',
};

export function renderOnClient<P>(Child: ComponentType<P>): ComponentType<P> {
  // skip all of this on the client (safeguard, not used)
  if (typeof window !== 'undefined') {
    return Child;
  }

  const componentImpl = Function.prototype.toString.call(Child);

  const globals = getFreeGlobals(componentImpl);

  const deps = globals.reduce((s, v) => `${s}${GLOBALS_MAPPINGS[v] || ''}`, '');

  let renderer = `
import * as preact from 'https://unpkg.com/preact@latest?module';
${deps}
const c = ${componentImpl};
const d = $CSR_DATA$;
const s = document.getElementById('$CSR_ID$');
// workaround: hydration assumes root is shared, we can't assume that.
preact.hydrate(preact.h(c, d.props), { childNodes: [s.previousSibling] });
  `.trim();

  return props => {
    // inject props into the hydration script:
    let script = renderer.replace('$CSR_DATA$', JSON.stringify({ props }));
    // calculate a unique instance ID and inject it into the script:
    const id = `csr-${hash(script)}`;
    script = script.replace('$CSR_ID$', id);

    return (
      <Fragment>
        <Child {...props} />
        <script
          type="module"
          id={id}
          dangerouslySetInnerHTML={{ __html: script }}
        />
      </Fragment>
    );
  };
}

function getFreeGlobals(code: string) {
  const ast = acorn.parse(code, { sourceType: 'module' });
  const globals = new Set<string>();
  const declared = new Set<string>();
  function isDeclared(ancestors: acorn.Node[]) {
    for (let i = ancestors.length - 1; i--; ) {
      const type = ancestors[i].type;
      if (/Function|Declarator/.test(type)) {
        return true;
      }
      if (!/(^Property|Pattern)$/.test(type)) {
        break;
      }
    }
    return false;
  }
  walk.ancestor(ast, {
    Identifier(node, _, ancestors) {
      const name = (node as any).name;
      if (isDeclared(ancestors)) {
        declared.add(name);
      } else if (!declared.has(name)) {
        globals.add(name);
      }
    },
  });
  return Array.from(globals);
}

function hash(str: string): number {
  let hash = 0,
    i = 0;
  for (; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return hash;
}
