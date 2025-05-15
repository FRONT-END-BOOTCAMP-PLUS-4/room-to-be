export interface SaveRoomDto {
  name: string;
  width: number;
  height: number;
  userId: string;
  imageBlob: Blob; // 클라이언트에서 보내는 썸네일 이미지/ 파일처럼 다룰 수 있는 이진 데이터 묶음 타입
}
