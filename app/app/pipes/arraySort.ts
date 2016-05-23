import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: "arraySort"
})
export class ArraySortPipe {
    transform(array: Array<string>, args: string): Array<string> {
        if (typeof args[0] === "undefined") {
            return array;
        }
        array.sort((a: any, b: any) => {
            return a[args].toString().localeCompare(b[args].toString());
        });

        return array;
    }
}
