// backend/domain/entities/Room.ts
export class Room {
  constructor(
    public id: string,
    public name: string,
    public width: number,
    public height: number,
    public thumbnailUrl: string,
    public userId: string,
    public createdAt: Date
  ) {}
  //필요하면 쓰장
  get area(): number {
    return this.width * this.height;
  }
}
