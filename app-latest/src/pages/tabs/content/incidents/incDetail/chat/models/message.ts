export class Message {
  Nombre: string;
  AvisoID: number;
  UsuarioID: number;
  Mensaje: string;
  FechaHoraRegistro: string;

  constructor(obj: any) {
    this.Nombre = obj.Nombre || null;   
    this.AvisoID = obj.AvisoID || null;    
    this.UsuarioID = obj.UsuarioID || null;
    this.Mensaje = obj.Mensaje || null;
    this.FechaHoraRegistro = obj.FechaHoraRegistro || null;
  }  
}
