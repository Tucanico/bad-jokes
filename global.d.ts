// use-sound ships its own types, but its package.json "exports" map hides them from TypeScript,
// so without this shim every use-sound import fails the type check.
declare module "use-sound" {
  export default function useSound(sound: any, options?: any): any;
}
