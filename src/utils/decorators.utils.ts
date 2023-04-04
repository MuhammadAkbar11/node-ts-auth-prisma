// export function Bind() {
//   return function (target: any, key: string, descriptor: PropertyDescriptor) {
//     const fn = descriptor.value;
//     return {
//       configurable: true,
//       get() {
//         const boundFn = fn.bind(this);
//         Object.defineProperty(this, key, {
//           value: boundFn,
//           configurable: true,
//           writable: true,
//         });
//         return boundFn;
//       },
//     };
//   };
// }

export function Bind(
  _target: any,
  _methodName: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };

  return adjDescriptor;
}

export function BindAllMethods(target: any) {
  const proto = target.prototype;
  const propertyNames = Object.getOwnPropertyNames(proto);

  for (const name of propertyNames) {
    const descriptor = Object.getOwnPropertyDescriptor(proto, name);

    if (descriptor?.value instanceof Function) {
      Object.defineProperty(proto, name, Bind(proto, name, descriptor));
    }
  }
}
