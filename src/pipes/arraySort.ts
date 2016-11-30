import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: "arraySort"
})
export class ArraySortPipe {
    transform(array: Array<string>, args: string, order:string): Array<string> {
        if (typeof args === "undefined") {
            return array;
        }
        if (order == 'asc'){
           array.sort((a: any, b: any) => {
                return a[args].toString().localeCompare(b[args].toString());
           }); 
        }else if(order == 'desc'){
           array.sort((a: any, b: any) => {
                return b[args].toString().localeCompare(a[args].toString());
           }); 
        }
        return array;
    }
}
