'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var nextId = 0;
var generateId = function generateId() {
  return nextId++;
};

var container = function container(lookup, scopeName, resolveFromParent) {
  var resources = [];
  var instances = [];
  var thisContainer = undefined;

  function create(entry) {
    var args = [];
    if (entry.args !== undefined) {
      var argsObj = {};
      for (var key in entry.args) {
        argsObj[key] = _resolve(entry.args[key]);
      }
      args.push(argsObj);
    }
    args.push(thisContainer);
    var instance = entry.factory.apply(entry, args);
    var disposer = entry.disposer;
    if (disposer !== undefined) {
      resources.push(function () {
        return disposer(instance);
      });
    }
    return instance;
  }

  function dispose() {
    resources.forEach(function (dispose) {
      return dispose();
    });
    lookup = null;
    resources = null;
  }

  function resolveScoped(entry) {
    if (entry.scope === scopeName) {
      var hasInstance = instances[entry.key] !== undefined;
      if (!hasInstance) {
        instances[entry.key] = { value: create(entry) };
      }
      return instances[entry.key].value;
    }
    if (resolveFromParent !== undefined) return resolveFromParent(entry.key);
    throw new Error('Cannot find scope ' + entry.scope);
  }

  function resolveEntry(entry) {
    if (entry.scope !== undefined) {
      return resolveScoped(entry, resources);
    }
    return create(entry, resources);
  }

  function _resolve(keyOrBuilder) {
    if (keyOrBuilder === undefined) throw new Error('Must provide a key');
    var key = keyOrBuilder.key !== undefined ? keyOrBuilder.key : keyOrBuilder;
    var entries = lookup[key];
    if (entries === undefined) {
      throw new Error('Cannot resolve ' + key);
    }
    if (entries.length > 1) throw new Error('Multiple entries exist for ' + key);

    var _entries = _slicedToArray(entries, 1);

    var entry = _entries[0];

    return resolveEntry(entry);
  }

  function resolveMany(keyOrBuilder) {
    if (keyOrBuilder === undefined) throw new Error('Must provide a key');
    var key = keyOrBuilder.key !== undefined ? keyOrBuilder.key : keyOrBuilder;
    var entries = lookup[key];
    if (entries === undefined) return [];
    return entries.map(function (entry) {
      return resolveEntry(entry, resources);
    });
  }

  function bind(factory) {
    if (factory === undefined) throw new Error('Must provide a factory');
    var key = generateId();
    var entry = { key: key, factory: factory };
    var entries = lookup[key] || (lookup[key] = []);
    entries.push(entry);
    var builder = {
      key: key,
      get asSingleton() {
        entry.scope = 'singleton';
        return builder;
      },
      with: function _with(args) {
        entry.args = args;
        return builder;
      },
      to: function to(key) {
        entry.key = key;
        var entries = lookup[key] || (lookup[key] = []);
        entries.push(entry);
        return builder;
      },
      perScope: function perScope(scopeName) {
        entry.scope = scopeName;
        return builder;
      },
      disposeBy: function disposeBy(disposer) {
        entry.disposer = disposer;
        return builder;
      }
    };
    return builder;
  }

  function createScope(scopeName) {
    if (scopeName === undefined) throw new Error('Must provide a scope name');
    var child = container(Object.assign({}, lookup), scopeName, _resolve);
    resources.push(child.dispose);
    return child;
  }

  function unbind(keyOrBuilder) {
    if (keyOrBuilder === undefined) throw new Error('Must provide a key');
    var key = keyOrBuilder.key !== undefined ? keyOrBuilder.key : keyOrBuilder;
    delete lookup[key];
  }

  return thisContainer = {
    resolve: function resolve(keyOrBuilder) {
      return _resolve(keyOrBuilder, resources);
    },
    bind: bind, unbind: unbind, resolveMany: resolveMany, createScope: createScope, dispose: dispose
  };
};

exports.default = function () {
  return container({}, 'singleton');
};