export function notNull<T, Exargs extends []>(
  arg: T|null|undefined|void,
  Error: { new(...args: Exargs): Error }, 
  ...args: [...Exargs, ...any[]]
): T | never {
  if (arg === undefined || arg === null) throw new Error(...args as unknown as Exargs) // Typescript y no tuple polymorphism??
  return arg as T
}