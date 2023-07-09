export type Options<T = Record<string, unknown>> = {
  [key in keyof T as key]: T[key];
} & {
  env: string;
};
