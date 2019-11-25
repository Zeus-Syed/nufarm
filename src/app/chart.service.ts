import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChartService {
public xmlItems:any;
  constructor() { }
  public setXmlItems(data){
    this.xmlItems = data;
    console.log(this.xmlItems);
  }

  public getXmlItems(){
    return this.xmlItems;
  }

}
