export class PlacedFurniture {
  constructor(
    public id: string = '',
    public roomId: string,
    public furnitureId: string,
    public positionX: number,
    public positionY: number,
    public positionZ: number,
    public rotationY: number,
    public scaleX: number,
    public scaleY: number,
    public scaleZ: number,
    public createdAt: Date,
  ) {}
}
