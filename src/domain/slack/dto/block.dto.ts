export class BlockCount {
  block: number;

  receipt: number;

  log: number;

  constructor(block: number, receipt: number, log: number) {
    this.block = block;
    this.receipt = receipt;
    this.log = log;
  }
}
