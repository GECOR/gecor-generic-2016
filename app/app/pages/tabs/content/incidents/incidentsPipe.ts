import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({
  name: "search"
})
export class IncidentsSearchPipe  implements PipeTransform {
  transform(value, args:string[]){
    if (args[0].toLowerCase() != '') {
      return value.filter((item)=>
          item.type.toLowerCase().indexOf(args[0].toLowerCase()) != -1
          || item.state.toLowerCase().indexOf(args[0].toLowerCase()) != -1
          || item.route.toLowerCase().indexOf(args[0].toLowerCase()) != -1
      );
    }
    return value;
  }
}
