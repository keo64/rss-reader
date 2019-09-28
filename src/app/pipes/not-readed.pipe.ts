import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'notReaded'
})
export class NotReadedPipe implements PipeTransform {

  transform(items: any[], filter: Object): any {
    if(!items) return [];

    return items.filter( it => {
      return filter ? !it.readed : true;
    });
  }
}
