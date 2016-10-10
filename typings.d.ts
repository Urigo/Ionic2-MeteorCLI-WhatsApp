declare module '*.html' {
  const template: string;
  export default template;
}

declare module '*.scss' {
  export const innerHTML: string;
}
