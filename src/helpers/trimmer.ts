
/**
 * A simple utility to trim string properties of an object.
 * This can be extended for more complex sanitization.
 */
export const trimSanitizer = {
  sanitize: (obj: any) => {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (typeof obj[key] === 'string') {
          obj[key] = obj[key].trim();
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          trimSanitizer.sanitize(obj[key]);
        }
      }
    }
  },
};
