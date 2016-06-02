export class User {  
  Apellidos: string;
  Aplicacion: string;
  AyuntamientoID: number;
  CiudadanoID: number;
  Email: string;
  Movil: string;
  Nombre: string;
  Password: string;
  Telefono: string;
  UsuarioID: number;
  server: string;
  token: string;

  constructor(obj: any) {
    
    this.Apellidos = obj.Apellidos;
    this.Aplicacion = obj.Aplicacion;
    this.AyuntamientoID = obj.AyuntamientoID;
    this.CiudadanoID = obj.CiudadanoID;
    this.Email = obj.Email;
    this.Movil = obj.Movil;
    this.Nombre = obj.Nombre;
    this.Password = obj.Password;
    this.Telefono = obj.Telefono;
    this.UsuarioID = obj.UsuarioID;
    this.server = obj.server;
    this.token = obj.token;
  
  }
}