declare module 'ngl' {
  export class Stage {
    constructor(element: HTMLElement, options?: { backgroundColor?: string })
    removeAllComponents(): void
    loadFile(
      file: Blob | string,
      options?: { ext?: string }
    ): Promise<{
      addRepresentation(type: string, options?: { color?: string }): void
      autoView(): void
    }>
    dispose(): void
  }
} 