export function AutoBind(
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
      Object.defineProperty(proto, name, AutoBind(proto, name, descriptor));
    }
  }
}
