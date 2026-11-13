declare module 'fs-native-extensions' {
  const nativeFs: { tryLock(fd: number): boolean; unlock(fd: number): void };
  export default nativeFs;
}
