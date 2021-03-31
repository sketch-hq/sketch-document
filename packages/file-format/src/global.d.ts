declare module 'deepdash'

declare module 'json-transforms'

declare module 'node-stream-zip' {
  export default class StreamZip {
    public constructor(options: { file: string; storeEntries: boolean })

    public on(event: 'ready', handler: () => void): void

    public on(event: 'error', handler: (error: string) => void): void

    public entryDataSync(name: string): string

    public stream(
      ref: string,
      handler: (error: string, stream: NodeJS.ReadStream) => void,
    ): void

    public close(): void
  }
}
