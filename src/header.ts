
export class Header {
  constructor (
    public readonly uri: string,
    public readonly query: string,
    public readonly offset: number,
    public readonly totalResults: number,
    public readonly format: string,
    public readonly dataset: string,
    public readonly lr: number,
    public readonly maxResults: number,
    public readonly epoch: string,
    public readonly outputSrs: string
  ) {

  }

  public hasNextPage(): boolean {
    return (this.offset + this.maxResults) / this.maxResults < this.totalResults / this.maxResults;
  }

  public getNextOffset(): number {
    return this.offset + this.maxResults;
  }

}
