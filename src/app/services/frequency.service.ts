import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FrequencyService {

  constructor() { }

  getFrequency(str: string):any {
    if(!str) {return null;}

    const strLength: number = str.length;

    str = str
      .replace(/[^\wа-я]+/ig, '')
      .replace(/[0-9\.]+/g, '')
      .toLowerCase();

    let freq:any = {}, result: Array<any>;

    for (var i = 0; i < str.length;i++) {
        var character = str.charAt(i);
        if (freq[character]) {
           freq[character].count++;
        } else {
           freq[character] = {};
           freq[character].count = 1;
        }

        freq[character].percent =
        Number((freq[character].count / strLength * 100).toFixed(2));
    }

    result = Object.keys(freq).map(function(key) {
      return [key, freq[key].percent];
    });
    result.unshift(['Char', 'Frequency'])

    return result;
  }
}
