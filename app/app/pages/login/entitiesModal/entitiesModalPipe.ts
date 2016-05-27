import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: "search"
})
export class EntitiesModalSearchPipe  implements PipeTransform {
  transform(value, args:string){
    if (args.toLowerCase() != '') {
      return value.filter((item)=>
          item.Nombre.toLowerCase().indexOf(args.toLowerCase()) != -1
      );
    }
    return value;
  }
}