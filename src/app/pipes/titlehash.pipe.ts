import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'titlehash'
})
export class TitlehashPipe implements PipeTransform {

  transform(input: string): string {
    let hash: number = 0, i: any, chr: any;

    if (input.length === 0) {
      return hash.toString();
    }

    for (i = 0; i < input.length; i++) {
      chr   = input.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }

    return hash.toString();
  }

}
