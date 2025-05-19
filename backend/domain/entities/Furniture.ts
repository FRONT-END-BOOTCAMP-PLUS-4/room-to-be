export class Furniture {
  constructor(
    public id: string,
    public name: string,
    public type: string,              
    public category: string,          
    public modelUrl: string,          // Supabase의 glb URL
    public thumbnailUrl: string,      // Supabase의 썸네일 URL
    public placementType: 'floor' | 'wall',
    public createdAt: Date
  ) {}
}
