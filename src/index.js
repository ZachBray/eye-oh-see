let nextId = 0;
const generateId = () => nextId++;

const container = (lookup, scopeName, resolveFromParent) => {
  let resources = [];
  let instances = [];

  function create(entry) {
    let args;
    if (entry.args !== undefined) {
      args = {};
      for(var key in entry.args) {
        args[key] = resolve(entry.args[key]);
      }
    }
    const instance = entry.factory(args);
    const disposer = entry.disposer;
    if (disposer !== undefined) {
      resources.push(() => disposer(instance));
    }
    return instance;
  }

  function dispose() {
    resources.forEach(dispose => dispose());
    lookup = null;
    resources = null;
  }

  function resolveScoped(entry) {
    if (entry.scope === scopeName) {
      const hasInstance = instances[entry.key] !== undefined;
      if (!hasInstance) {
        instances[entry.key] = { value: create(entry) };
      }
      return instances[entry.key].value;
    }
    if (resolveFromParent !== undefined) return resolveFromParent(entry.key);
    throw new Error(`Cannot find scope ${entry.scope}`);
  }

  function resolveEntry(entry) {
    if (entry.scope !== undefined) {
      return resolveScoped(entry, resources);
    }
    return create(entry, resources);
  }

  function resolve(keyOrBuilder) {
    if (keyOrBuilder === undefined) throw new Error('Must provide a key');
    const key = keyOrBuilder.key !== undefined ? keyOrBuilder.key : keyOrBuilder;
    const entries = lookup[key];
    if (entries === undefined) {
      throw new Error(`Cannot resolve ${key}`);
    }
    if (entries.length > 1) throw new Error(`Multiple entries exist for ${key}`);
    const [entry] = entries;
    return resolveEntry(entry);
  }

  function resolveMany(keyOrBuilder) {
    if (keyOrBuilder === undefined) throw new Error('Must provide a key');
    const key = keyOrBuilder.key !== undefined ? keyOrBuilder.key : keyOrBuilder;
    const entries = lookup[key];
    if (entries === undefined) return [];
    return entries.map(entry => resolveEntry(entry, resources));
  }

  function bind(factory) {
    if (factory === undefined) throw new Error('Must provide a factory');
    const key = generateId();
    const entry = { key, factory };
    const entries = lookup[key] || (lookup[key] = []);
    entries.push(entry);
    const builder = {
      key,
      get asSingleton() {
        entry.scope = 'singleton';
        return builder;
      },
      with: args => {
        entry.args = args;
        return builder;
      },
      to: key => {
        entry.key = key;
        const entries = lookup[key] || (lookup[key] = []);
        entries.push(entry);
      },
      perScope: scopeName => {
        entry.scope = scopeName;
        return builder;
      },
      disposeBy: disposer => {
        entry.disposer = disposer;
        return builder;
      }
    };
    return builder;
  }

  function createScope(scopeName) {
    if (scopeName === undefined) throw new Error('Must provide a scope name');
    const child = container(Object.assign({}, lookup), scopeName, resolve);
    resources.push(child.dispose);
    return child;
  }

  function unbind(keyOrBuilder) {
    if (keyOrBuilder === undefined) throw new Error('Must provide a key');
    const key = keyOrBuilder.key !== undefined ? keyOrBuilder.key : keyOrBuilder;
    delete lookup[key];
  }

  return {
    resolve: keyOrBuilder => resolve(keyOrBuilder, resources),
    bind, unbind, resolveMany, createScope, dispose
  };
};

export default () => container({}, 'singleton');
