import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'notReaded'
})
export class NotReadedPipe implements PipeTransform {

  transform(items: any, filter: Object): any {
    if(!items || items && !items.feed) return [];

    return items.feed.channel.filter( it => {
      return filter ? !it.readed : true;
    });
  }
}
