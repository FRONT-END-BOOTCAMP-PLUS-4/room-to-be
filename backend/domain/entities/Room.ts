import { PlacedFurniture } from './PlacedFurniture';
export class Room {
  constructor(
    public id: string = '',
    public name: string,
    public width: number,
    public height: number,
    public thumbnailUrl: string,
    public userId: string,
    public createdAt: Date,
    public furnitures: PlacedFurniture[] = [],
    public background: string,
    public isNightMode: boolean,
    public cameraX: number,
    public cameraY: number,
    public cameraZ: number,
  ) {}
}
