import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: "search"
})
export class Step1SearchPipe  implements PipeTransform {
  transform(value, args:string){
    if (args.toLowerCase() != '') {
      return value.filter((item)=>
          item.DesTipoElemento.toLowerCase().indexOf(args.toLowerCase()) != -1
      );
    }
    return value;
  }
}