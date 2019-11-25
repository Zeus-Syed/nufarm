import { Component, OnInit } from '@angular/core';
import { ChartService } from '../chart.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as moment from 'moment';
import xml2js from 'xml2js';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
public xmlItems:any;
public status:any;
public result:any;
public chartLabel:any;
public chartData:any;
public chartType:string = "doughnut";
public chartOptions = {
  aspectRatio: 4
}
  constructor(public chartService: ChartService, public http: HttpClient) { }

  ngOnInit() {
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
 
        this.parseXML(data)
          .then((data) => {
            this.xmlItems = data;
             //console.log(this.xmlItems); 
         
            this.xmlItems.sort(function (a: any, b: any) {
              return a.creationDate - b.creationDate;
            })
            console.log(this.xmlItems);
           this.status = this.xmlItems.map((e)=>e.status.toString());
           console.log(this.status);
        this.result = {}
           for(var i = 0; i < this.status.length; ++i) {
            if(!this.result[this.status[i]])
                this.result[this.status[i]] = 0;
            ++this.result[this.status[i]];
        }
        console.log(this.result);
            this.chartLabel = Object.keys(this.result);
            this.chartData = Object.values(this.result);
            console.log(this.chartData);
            console.log(this.chartLabel);
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
      


}
