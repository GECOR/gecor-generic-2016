import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: "search"
})
export class IncidentsSearchPipe  implements PipeTransform {
  transform(value, args:string){
    if (args.toLowerCase() != '') {
      return value.filter((item)=>
          item.DesTipoElemento.toLowerCase().indexOf(args.toLowerCase()) != -1
          || item.TipoInc.toLowerCase().indexOf(args.toLowerCase()) != -1
          || item.DesUbicacion.toLowerCase().indexOf(args.toLowerCase()) != -1
          || item.CodAviso.toLowerCase().indexOf(args.toLowerCase()) != -1
          || item.DesEstadoAviso.toLowerCase().indexOf(args.toLowerCase()) != -1
          || item.Responsable.toLowerCase().indexOf(args.toLowerCase()) != -1
      );
    }
    return value;
  }
}
