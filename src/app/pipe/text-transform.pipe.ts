import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textTransform'
})
export class TextTransformPipe implements PipeTransform {

  //custom pipe to transform string - make it uppercase and remove any empty spaces and replace with hyphens
  transform(value: string, ...args: string[]): any {
    return value.toUpperCase()
      .replace(/\s+/g, '-')
    }

}
