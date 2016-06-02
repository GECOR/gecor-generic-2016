export class Message {
  Nombre: string;
  AvisoID: number;
  UsuarioID: number;
  msg: string;

  constructor(obj: any) {
    this.Nombre = obj.Nombre || null;   
    this.AvisoID = obj.AvisoID || null;    
    this.UsuarioID = obj.UsuarioID || null;
    this.msg = obj.msg || null;
  }  
}
