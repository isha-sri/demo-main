import { Component,ViewChild, ElementRef, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AgGridModule, AgGridAngular } from 'ag-grid-angular'; // Angular Grid Logic
import { ColDef, ColGroupDef,
  GridApi,
  GridReadyEvent, } from 'ag-grid-community'; // Column Definitions Interface
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import {MatSelect, MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { AppModule } from './app.module';
import {MatButtonModule} from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-root',
  //standalone:true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  //@ViewChild('agGrid', { static: true })
    @ViewChild('select')
  select!: MatSelect;
  //dropdownSettings = {};



  agGrid: any;

  private gridApi!: GridApi;
  title = 'myApp';
  selected = 'None';
  url='';
  
  colDefs:any[]=[];
  rowData: any[] = [];
  rowData1: any[] = [];
  dropdownSettings:IDropdownSettings = {
    enableCheckAll:true,
    idField: 'item_id',
    textField: 'item_text',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    allowSearchFilter: true,
    itemsShowLimit: 0,

  };

  allSelected:boolean[]=[false];


  filterColumns: string[] = [];
  filterOptions: { [key: string]: string[] } = {};
  //selectedFilters: { [key: string]: string } = {};
  selectedFilters: { [key: string]: string[] | any[] } = {};

  filteredData: any[] = [];
  filteredDataFull: any[] = [];
  filterOptionsObjects: { [key: string]: { item_id: any; item_text: any; }[] } = {};



  constructor(private http: HttpClient) {}

  // onDatasetChange() {
  //   console.log("Dataset changed");
  //   // Reset filterColumns, filterOptions, and selectedFilters
  //   this.filterColumns = [];
  //   this.filterOptions = {};
  //   this.selectedFilters = {};
  //   this.filterOptionsObjects = {}; // New object to store options as objects
  
  //   // Call importExcelFromUrl to fetch and load the data for the selected dataset
  //   this.importExcelFromUrl();
  
  //   if (this.selected !== 'None') {
  //     this.http.get(this.url, { responseType: 'arraybuffer' }).subscribe(
  //       (data) => {
  //         const workbook: XLSX.WorkBook = XLSX.read(data, { type: 'array' });
  
  //         const sheetName: string = workbook.SheetNames[0];
  //         const sheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
  
  //         this.rowData1 = XLSX.utils.sheet_to_json(sheet);
  
  //         if (this.rowData1.length > 0) {
  //           const firstRow = this.rowData1[0];
  //           this.filterColumns = Object.keys(firstRow);
  
  //           this.filterColumns.forEach(column => {
  //             this.filterOptions[column] = Array.from(new Set(this.rowData1.map(row => row[column])));
  //             this.selectedFilters[column] = [this.filterOptions[column][0]] as any as string; // Set the default selected option as a string
  //             this.filterOptionsObjects[column] = this.filterOptions[column].map(option => ({ item_id: option, item_text: option }));
  //           });
  
  //           console.log('filterColumns:', this.filterColumns);
  //           console.log('filterOptions:', this.filterOptions);
  //           console.log('selectedFilters:', this.selectedFilters);
  //           console.log('filterOptionsObjects:', this.filterOptionsObjects);
  //         }
  //       },
  //       (error) => {
  //         console.error('Error fetching Excel file from the URL:', error);
  //       }
  //     );
  //   }
  // }

  onDatasetChange() {
    console.log("Dataset changed");
    // Reset filterColumns, filterOptions, and selectedFilters
    this.filterColumns = [];
    this.filterOptions = {};
    this.selectedFilters = {};
    this.filterOptionsObjects = {}; // New object to store options as objects
  
    // Call importExcelFromUrl to fetch and load the data for the selected dataset
    this.importExcelFromUrl();
    if (this.selected !== 'None') {
      this.http.get(this.url, { responseType: 'arraybuffer' }).subscribe(
        (data) => {
          const workbook: XLSX.WorkBook = XLSX.read(data, { type: 'array' });
  
          const sheetName: string = workbook.SheetNames[0];
          const sheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
  
          this.rowData1 = XLSX.utils.sheet_to_json(sheet);
  
          if (this.rowData1.length > 0) {
            const firstRow = this.rowData1[0];
            this.filterColumns = Object.keys(firstRow);
            this.filterColumns.forEach(column => {
              const options = Array.from(new Set(this.rowData1.map(row => row[column])));
              this.filterOptions[column] = options.map(String); // Convert options to strings
              //this.selectedFilters[column] = this.filterOptions[column][0];
              this.selectedFilters[column] = options.map(String); // Set all options as selected by default

              
              // Convert options to an array of objects with 'item_id' and 'item_text'
              this.filterOptionsObjects[column] = options.map(option => ({ item_id: option, item_text: option }));
              console.log('filterColumns:', this.filterColumns);
            console.log('filterOptions:', this.filterOptions);
            console.log('selectedFilters:', this.selectedFilters);
            console.log('filterOptionsObjects:', this.filterOptionsObjects);
            });
          }
        },
        (error) => {
          console.error('Error fetching Excel file from the URL:', error);
        }
      );
    }
  }
  
  


  
  //Original
  // onDatasetChange() {
  //   console.log("Dataset changed");
  //   // Reset filterColumns, filterOptions, and selectedFilters
  //   this.filterColumns = [];
  //   this.filterOptions = {};
  //   this.selectedFilters = {};

  //   this.importExcelFromUrl();
  //   if (this.selected !== 'None') {
  //     //const url = this.getDatasetUrl(this.selectedDataset);
  //     this.http.get(this.url, { responseType: 'arraybuffer' }).subscribe(
  //       (data) => {
  //         const workbook: XLSX.WorkBook = XLSX.read(data, { type: 'array' });

  //         const sheetName: string = workbook.SheetNames[0];
  //         const sheet: XLSX.WorkSheet = workbook.Sheets[sheetName];

  //         this.rowData1 = XLSX.utils.sheet_to_json(sheet);

  //         if (this.rowData1.length > 0) {
  //           const firstRow = this.rowData1[0];
  //           //console.log(firstRow);
  //           this.filterColumns = Object.keys(firstRow);
  //           this.filterColumns.forEach(column => {
  //             this.filterOptions[column] = Array.from(new Set(this.rowData1.map(row => row[column])));
  //             this.selectedFilters[column] = this.filterOptions[column][0];
  //           });
  //         }
  //       },
  //       (error) => {
  //         console.error('Error fetching Excel file from the URL:', error);
  //       }
  //     );
  //     console.log(this.filterOptions)
  //   }
  // }



  //Original
  // previewData() {
  //   console.log("Preview clicked");
  //   console.log(this.rowData1);

  //   this.filteredData = this.rowData1.filter(row => {
  //     return Object.keys(this.selectedFilters).every(column => {
  //       const selectedOptions = this.selectedFilters[column];
  //       return selectedOptions.length === 0 || selectedOptions.includes(row[column]);
  //     });
  //   });
  //   this.filteredDataFull=this.filteredData;
  //   console.log(this.filteredData);

  
  //   const randomIndices = this.getRandomIndices(5, this.filteredData.length);
  //   this.filteredData = randomIndices.map(index => this.filteredData[index]);
  //   // Update the grid data
  //   this.gridApi.setRowData(this.filteredData);
  

  // }
  previewData() {
    console.log("Preview clicked");
    console.log(this.rowData1);
  
    this.filteredData = this.rowData1.filter(row => {
      return Object.keys(this.selectedFilters).every(column => {
        const selectedOptions = this.selectedFilters[column];
        return selectedOptions.length === 0 || selectedOptions.includes(String(row[column]));
      });
    });
  
    this.filteredDataFull = this.filteredData;
  
    console.log(this.filteredData);
    const randomIndices = this.getRandomIndices(10, this.filteredData.length);
    this.filteredData = randomIndices.map(index => this.filteredData[index]);
    // Update the grid data
    this.gridApi.setRowData(this.filteredData);
  
  }
  


  private getRandomIndices(numSamples: number, totalLength: number): number[] {
    const indices = Array.from({ length: totalLength }, (_, i) => i);
    indices.sort(() => Math.random() - 0.5);
    return indices.slice(0, numSamples);
  }

  downloadFilteredData() {
    // Download the entire filtered dataset
    const blob = new Blob([this.arrayBufferToCsv(this.filteredDataFull)], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'filtered_dataset.csv';
    link.click();
  }

  private arrayBufferToCsv(data: any[]): string {
    const header = Object.keys(data[0]).join(',') + '\n';
    const rows = data.map(row => Object.values(row).join(',')).join('\n');
    return header + rows;
  }

  importExcelFromUrl(): void {  
    if(this.selected=='OS')
    {console.log("OS");
    this.url='./assets/os_worldwide.xlsx'
    this.colDefs= [{headerName: 'Date', field: 'Date', filter:true },
  { headerName: 'Windows', field: 'Windows', filter:true },
   { headerName: 'Android', field: 'Android', filter:true },
           { headerName: 'iOS', field: 'iOS', filter:true },
           { headerName: 'OS X', field: 'OS X', filter:true },
           { headerName: 'Unknown', field: 'Unknown', filter:true },
           { headerName: 'Linux', field: 'Linux', filter:true },
           { headerName: 'Series 40', field: 'Series 40', filter:true },
           { headerName: 'SymbianOS', field: 'SymbianOS', filter:true },
           { headerName: 'Samsung', field: 'Samsung', filter:true },
           {headerName: 'BlackBerryOS', field: 'BlackBerryOS', filter:true },
           { headerName: 'Chrome OS', field: 'Chrome OS', filter:true },
           { headerName: 'Nokia Unknown', field: 'Nokia Unknown', filter:true },
           { headerName: 'Playstation', field: 'Playstation', filter:true },
           { headerName: 'Sony Ericsson', field: 'Sony Ericsson', filter:true },
           { headerName: 'KaiOS', field: 'KaiOS', filter:true },
           { headerName: 'Xbox', field: 'Xbox', filter:true },
           { headerName: 'bada', field: 'bada', filter:true },
           { headerName: 'Tizen', field: 'Tizen', filter:true },
           { headerName: 'LG', field: 'LG', filter:true },
           { headerName: 'Nintendo', field: 'Nintendo', filter:true },
           { headerName: 'Other', field: 'Other', filter:true },];
  }
  else if(this.selected=='GDP'){
    console.log("GDP");
    this.url='./assets/gdp.xlsx';
    this.colDefs= [{headerName: 'Country', field: 'Country', filter:true },
  { headerName: '1980', field: '1980', filter:true },
   { headerName: '1985', field: '1985', filter:true },
           { headerName: '1990', field: '1990', filter:true },
           { headerName: '1995', field: '1995', filter:true },
           { headerName: '2000', field: '2000', filter:true },
           { headerName: '2005', field: '2005', filter:true },
           { headerName: '2010', field: '2010', filter:true },
           { headerName: '2015', field: '2015', filter:true },
           { headerName: '2020', field: '2020', filter:true },
           {headerName: '2025', field: '2025', filter:true },];
  }
  else if(this.selected=='Movies'){
    console.log("Movies");
    this.url='./assets/moviesdataset_2023.xlsx';
    this.colDefs=[{ headerName:'Name',field: 'name', filter:true },
    { headerName:'Rating', field: 'rating', filter:true },
    { headerName:'Votes',field: 'votes', filter:true },
    { headerName:'Runtime',field: 'runtime', filter:true },
    { headerName:'Genre',field: 'genre', filter:true },
    { headerName:'Description',field: 'description', filter:true },
    ]
  }
  else{
    console.log("None");
    this.url='https://www.ag-grid.com/example-assets/olympic-data.xlsx';
    this.colDefs=[{ headerName:'Athlete',field: 'athlete', filter:true },
    { headerName:'Age', field: 'age', filter:true },
    { headerName:'Country',field: 'country', filter:true },
    { headerName:'Year',field: 'year', filter:true },
    { headerName:'Date',field: 'date', filter:true },
    { headerName:'Sport',field: 'sport', filter:true },
    { headerName:'Gold',field: 'gold', filter:true },
    { headerName:'Silver',field: 'silver', filter:true },
    { headerName:'Bronze',field: 'bronze', filter:true },
    { headerName:'Total',field: 'total', filter:true },
    ]
  }
    // this.http.get(this.url, { responseType: 'arraybuffer' }).subscribe(
    //   (data) => {
    //     const workbook: XLSX.WorkBook = XLSX.read(data, { type: 'array' });

    //     const sheetName: string = workbook.SheetNames[0];
    //     const sheet: XLSX.WorkSheet = workbook.Sheets[sheetName];

    //     this.rowData = XLSX.utils.sheet_to_json(sheet);
    //   },
    //   (error) => {
    //     console.error('Error fetching Excel file from the URL:', error);
    //   }
    // );

  }


  // onBtExport() {
  //   this.gridApi.exportDataAsCsv();
  // }
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
 

}
