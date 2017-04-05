export const assert = (name: string, value: any) => ({
  is: {
    a: {
      function: () => {
        if (typeof value !== 'function') {
          const error = new Error(`Expected ${name} to be a function`);
          console.error(error.message, ' but was:', value, error);
          if (value.default) {
            console.warn(`The error in ${name} may result from importing the default export rather than a specific export.`);
          }
          throw error;
        }
      }
    },
    not: {
      empty: () => {
        if (!(value instanceof Array)) {
          const error = new Error(`Expected ${name} to be an array`);
          console.error(error.message, ' but was:', value, error);
          throw error;
        }
        if (value.length === 0) {
          const error = new Error(`Expected ${name} to be non-empty`);
          console.error(error.message, ' but was:', value, error);
          throw error;
        }
      }
    }
  }
});
