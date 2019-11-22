import { Component, OnInit } from '@angular/core';
import xml2js from 'xml2js'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {ToastrManager} from 'ng6-toastr-notifications';
import * as moment from 'moment';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  public xmlItems:any;
  public resultArray:any;
  public orderInput:any;
  public result:any;
  public fromDate: Date;
  public toDate: Date;
  constructor(public http: HttpClient, public toastr: ToastrManager){}
ngOnInit(){
this.loadXML();
}

public loadXML() {  
  this.http.get('./assets/dataset.xml',  
    {  
      headers: new HttpHeaders()  
        .set('Content-Type', 'text/xml')  
        .append('Access-Control-Allow-Methods', 'GET')  
        .append('Access-Control-Allow-Origin', '*')  
        .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method"),  
      responseType: 'text'  
    })  
    .subscribe((data) => {
     //console.log(data);  
      this.parseXML(data)  
        .then((data) => {  
          this.xmlItems = data; 
         // console.log(this.xmlItems); 
         let a:any;
          a= this.xmlItems[0].creationDate;
          console.log(moment(a).format("YYYY-MM-DD"));
   this.xmlItems.sort(function(a:any,b:any){
            return  a.creationDate - b.creationDate;
  })
  console.log(this.xmlItems);
        });  
    });  
}

parseXML(data) {  
  return new Promise(resolve => {  
    var k: string | number,  
      arr = [],  
      parser = new xml2js.Parser(  
        {  
          trim: true,  
          explicitArray: true  
        });  
    parser.parseString(data, function (err, result) { 
      //console.log(result); 
      var obj = result.dataset;  
      for (k in obj.record) {  
        var item = obj.record[k];  
        arr.push({  
          id: item.id,  
          orderNumber: item.order_number,  
          status: item.status, 
          creationDate: new Date(item.creation_date)
        });  
      }  
      resolve(arr);  
    });  
  });  
}  

public fetchDetails(){
      console.log(this.orderInput);

      if(this.orderInput == undefined || this.orderInput == "" || this.orderInput == null){
        this.toastr.warningToastr("Please enter Order Number");
      }
      else{
    this.result = this.xmlItems.filter((e)=>{
    return e.orderNumber == this.orderInput
  })
}
  console.log(this.result)
  if(this.result.length == 0){
    this.toastr.warningToastr("No Order Number Found!!")
  }
}

public fetchDetailsDate(){
      console.log(this.fromDate);
      console.log(this.toDate);

      for(let x of this.xmlItems){
             moment(x.creationDate).format("YYYY-MM-DD");
      }
      
}


}
