export class Message {
  AvisoID: number;
  UserID: number;
  msg: string;

  constructor(obj: any) {
    this.AvisoID = obj.avisoID || null;    
    this.UserID = obj.userID || null;
    this.msg = obj.msg || null;
  }
}
