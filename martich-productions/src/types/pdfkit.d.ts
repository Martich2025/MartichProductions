declare module 'pdfkit' {
  import { Readable } from 'stream'
  class PDFDocument extends Readable {
    constructor(options?: Record<string, unknown>)
    text(text: string, options?: Record<string, unknown>): this
    fontSize(size: number): this
    moveDown(lines?: number): this
    end(): void
    on(event: 'data', listener: (chunk: Buffer) => void): this
    on(event: 'end', listener: () => void): this
  }
  export default PDFDocument
}


