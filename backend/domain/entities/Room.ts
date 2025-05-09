export class Room {
  constructor(
    public id: string = '',
    public name: string,
    public width: number,
    public height: number,
    public thumbnailUrl: string,
    public userId: string,
    public createdAt: Date,
  ) {}

  get area(): number {
    return this.width * this.height;
  }
}
