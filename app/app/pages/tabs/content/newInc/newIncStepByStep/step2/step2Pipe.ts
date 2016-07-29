import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: "search"
})
export class Step2SearchPipe  implements PipeTransform {
  transform(value, args:string){
    if (args.toLowerCase() != '') {
      return value.filter((item)=>
          item.TipoInc.toLowerCase().indexOf(args.toLowerCase()) != -1
      );
    }
    return value;
  }
}