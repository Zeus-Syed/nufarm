import { Component, OnInit } from '@angular/core';
import xml2js from 'xml2js';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrManager } from 'ng6-toastr-notifications';
import * as moment from 'moment';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  public xmlItems: any;
  public resultArray: any;
  public orderInput: any;
  public result: any;
  public fromDate: Date;
  public toDate: Date;
  public dateLength: number;
  public distinctArr: any;
  public dropDownList = [];
  public selectedItems = [];
  public dropdownSettings: IDropdownSettings  = {};
  public filterArray = [];
  constructor(public http: HttpClient, public toastr: ToastrManager) { }
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
        //console.log(data);  
        this.parseXML(data)
          .then((data) => {
            this.xmlItems = data;
            // console.log(this.xmlItems); 
            let a: any;
            a = this.xmlItems[0].creationDate;
            console.log(moment(a).format("YYYY-MM-DD"));
            this.xmlItems.sort(function (a: any, b: any) {
              return a.creationDate - b.creationDate;
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

  public fetchDetails() {
    console.log(this.orderInput);

    if (this.orderInput == undefined || this.orderInput == "" || this.orderInput == null) {
      this.toastr.errorToastr("Please enter Order Number");
    }
    else {
      this.result = this.xmlItems.filter((e) => {
        return e.orderNumber == this.orderInput
      })
    }
    console.log(this.result)
    if (this.result.length == 0) {
      this.toastr.errorToastr("No Order Number Found!!")
    }
  }

  public fetchDetailsDate() {
    console.log(this.fromDate);
    console.log(this.toDate);
    this.filterArray = [];
    for (let x of this.xmlItems) {
      let a = moment(x.creationDate).format("YYYY-MM-DD");
      if (moment(a).isSameOrBefore(this.toDate) &&
        moment(a).isSameOrAfter(this.fromDate)) {
        this.filterArray.push(x);
      }
    }
    console.log(this.filterArray);
    this.resultArray = this.filterArray;
    console.log(this.resultArray);
    this.dateLength = this.filterArray.length;
    let status = this.filterArray.map(a => a.status.toString());
    console.log(status);

    //this.distinctArr = status.filter((x:any, i:any, a:any)=>a.indexOf(x) === i);
    this.dropDownList = Array.from(new Set(status));
    console.log(this.dropDownList);

    this.dropdownSettings = {
      singleSelection: false,
      //idField: 'item_id',
      //textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      //itemsShowLimit: 3,
      allowSearchFilter: true
    };
   // console.log(this.selectedItems);

    if (this.filterArray.length == 0) {
      this.toastr.errorToastr("No Records Found!!");
    }
  }

  public onItemSelect(){
    console.log(this.selectedItems);
   // this.filterArray = [];
    this.resultArray = this.filterArray.filter((e)=>
        this.selectedItems.includes(e.status.toString())
    
    );
    this.dateLength = this.resultArray.length;
    console.log(this.resultArray);
  }

  public onSelectAll(){
    this.resultArray = this.filterArray;
    this.dateLength = this.resultArray.length;
  }
  public onItemDeselect(){
    console.log(this.selectedItems);
    this.resultArray = this.filterArray.filter((e)=>
         this.selectedItems.includes(e.status.toString())
    )
    this.dateLength = this.resultArray.length;
    if(this.dateLength == 0){
      this.resultArray = this.filterArray;
      this.dateLength = this.resultArray.length;
    }
  }

  public refresh(){
    this.resultArray = [];
    this.result = [];
  }

}
