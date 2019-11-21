import { Component, OnInit } from '@angular/core';
import xml2js from 'xml2js'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  public xmlItems:any;
  constructor(public http: HttpClient){}
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
    //  console.log(data);  
      this.parseXML(data)  
        .then((data) => {  
          this.xmlItems = data; 
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
      console.log(result); 
      var obj = result.dataset;  
      for (k in obj.record) {  
        var item = obj.record[k];  
        arr.push({  
          id: item.id,  
          firstName: item.first_name,  
          lastName: item.last_name, 
        });  
      }  
      resolve(arr);  
    });  
  });  
}  




}
