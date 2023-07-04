import { Component, NgModule, Inject, HostListener } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { MatGridListModule } from '@angular/material/grid-list';
import { v4 as uuid } from 'uuid';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';

import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { LocalStorageService } from './local-storage.service';
import { PickerInteractionMode } from 'igniteui-angular';
import { Observable } from 'rxjs';

export interface DialogData {
  image: string;
  name: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public mode: PickerInteractionMode = PickerInteractionMode.DropDown;

  isChildComponentOpen: boolean = false;
  childData: any;
  driverImageFileName: string = '';
  mapImageFileName: string = '';
  addresses!: Observable<string[]>;

  title = 'Bill';
  name: string = '';
  DISTANCE_FARE = 21.5;
  WAITING_FARE = 2;
  BASE_FARE = 69;
  CONVENIENCE_FARE = 4;
  OFFICE_LOCATION =
    '4X2R+Q7V, CHIL SEZ IT Park, Saravanampatti, Coimbatore, Tamil Nadu 641035, India';

  rideData: {
    rideDate: string;
    customerName: string;
    bookingId: string;
    driverName: string;
    travelTime: number;
    distance: number;
    pickUpAddress: string;
    dropAddress: string;
    invoiceNumber: string;
    startTime: string;
    endTime: string;
    waitingTime: number;
    customerNumber: string;
    address: string;
    startTime12: string;
    driverImage: File;
    mapImage: File;
    fareBreakUp: {
      gst: number;
      baseFare: number;
      distanceFare: number;
      waitingFare: number;
      netFare: number;
      convenience: {
        fare: number;
        gst: number;
        netFare: number;
      };
    };
    price: number;
  };

  errorHints = {
    rideDate: 'Date Format shoud be MM/DD/YYYY',
  };

  onPaste(e: any, context: string) {
    const items = e.clipboardData.items;
    let blob = null;

    console.log(e);
    console.log(e.clipboardData);

    for (const item of items) {
      if (item.type.indexOf('image') === 0) {
        blob = item.getAsFile();
      }
    }

    if (blob !== null) {
      console.log(blob);
      if (context === 'driver') {
        this.driverImageFileName = blob?.name;
        this.setImage('driverImage', blob);
      } else if (context === 'map') {
        this.setImage('mapImage', blob);
        this.mapImageFileName = blob?.name;
      } else {
        alert('Invalid input. Try again');
      }
    } else {
      alert('Invalid input');
    }
  }

  ngOnInit(): void {
    this.rideData = {
      ...JSON.parse(
        localStorage.getItem('rideData') ??
          JSON.stringify(this.getEmptyRideData())
      ),
    };

    let oldBaseFare = this.rideData.fareBreakUp.baseFare;
    let baseFare = this.BASE_FARE + Math.random() * 2;
    baseFare = oldBaseFare === 0 ? baseFare : oldBaseFare;

    let convenience = { ...this.rideData.fareBreakUp.convenience };
    const convenienceFare = this.CONVENIENCE_FARE + Math.random() * 1;
    const convenienceGst = convenienceFare * 0.09;
    const convenienceNetFare = convenienceFare + convenienceGst * 2;
    convenience = {
      ...convenience,
      fare: convenience.fare === 0 ? convenienceFare : convenience.fare,
      gst: convenience.gst === 0 ? convenienceGst : convenience.gst,
      netFare:
        convenience.netFare === 0 ? convenienceNetFare : convenience.netFare,
    };

    const price = this.rideData.fareBreakUp.netFare + convenience.netFare;
    this.setRideData({
      ...this.rideData,
      fareBreakUp: { ...this.rideData.fareBreakUp, baseFare, convenience },
      price,
    });
  }

  constructor(
    public dialog: MatDialog,
    private localStorageService: LocalStorageService
  ) {
    this.rideData = this.getEmptyRideData();
  }
  openDialog(context: string): void {
    const dialogRef = this.dialog.open(Dialog, {
      data: {
        name: this.name,
        image:
          context === 'driver'
            ? this.rideData.driverImage
            : this.rideData.mapImage,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  onFileSelected(key: string, event: any): void {
    if (event.target.files && event.target.files[0]) {
      this.setImage(key, event.target.files[0]);
      if (key.includes('driver')) {
        this.driverImageFileName = event.target.files[0]?.name;
      } else if (key.includes('map')) {
        this.mapImageFileName = event.target.files[0]?.name;
      }
    } else {
      alert('Retry');
    }
  }

  setImage(key: string, file: any): void {
    var reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = (out) => {
      const url = out?.target?.result;

      this.setRideData({ ...this.rideData, [key]: url });
    };
  }

  setRideData(rideData: any): void {
    this.rideData = { ...rideData };
    this.localStorageService.setItem('rideData', JSON.stringify(this.rideData));
  }
  resetRideData(): void {
    this.rideData = this.getEmptyRideData();
    this.localStorageService.clear();
    location.reload();
  }
  getEmptyRideData(): any {
    return {
      rideDate: '',
      customerName: '',
      bookingId: '',
      driverName: '',
      travelTime: 0,
      distance: 0,
      pickUpAddress: '',
      dropAddress: '',
      invoiceNumber: '',
      startTime: '',
      endTime: '',
      waitingTime: 0,
      customerNumber: '',
      address: '',
      startTime12: '',
      fareBreakUp: {
        gst: 0,
        baseFare: 0,
        distanceFare: 0,
        waitingFare: 0,
        netFare: 0,
        convenience: {
          fare: 0,
          gst: 0,
          netFare: 0,
        },
      },
      price: 0,
    };
  }

  setData(event: any, key: string): void {
    const { value } = event.target;
    if (key === 'distance') {
      const travelTime = Math.ceil(value * 2 + Math.floor(Math.random() * 10));
      const distanceFare = value * this.DISTANCE_FARE;
      let netFare =
        this.rideData.fareBreakUp.baseFare +
        distanceFare +
        this.rideData.fareBreakUp.waitingFare;

      const gst = netFare * 0.025;
      netFare += gst * 2;
      const price = netFare + this.rideData.fareBreakUp.convenience.netFare;
      const endTime = this.getEndTime(null, travelTime);
      const fareBreakUp = {
        ...this.rideData.fareBreakUp,
        distanceFare,
        netFare,
        gst,
      };
      this.setRideData({
        ...this.rideData,
        [key]: value,
        travelTime,
        fareBreakUp,
        price,
        endTime,
      });
    } else if (key === 'waitingTime') {
      const waitingFare = value * this.WAITING_FARE;
      let netFare =
        this.rideData.fareBreakUp.baseFare +
        this.rideData.fareBreakUp.distanceFare +
        waitingFare;
      const gst = netFare * 0.025;
      netFare += gst * 2;
      const price = netFare + +this.rideData.fareBreakUp.convenience.netFare;
      const fareBreakUp = {
        ...this.rideData.fareBreakUp,

        waitingFare,
        netFare,
        gst,
      };
      this.setRideData({ ...this.rideData, [key]: value, fareBreakUp, price });
    } else if (key === 'waitingTime') {
      const endTime = '';
      this.setRideData({ ...this.rideData, [key]: value, endTime });
    } else if (key === 'startTime') {
      const [time, _] = value.toString().split(' ');
      const [hours, __] = time.split(':');

      const startTime12 = this.getEndTime(value, 0);

      const pickUpAddress =
        hours <= 12 ? this.rideData.address : this.OFFICE_LOCATION;
      const dropAddress =
        hours > 12 ? this.rideData.address : this.OFFICE_LOCATION;
      const endTime = this.getEndTime(value, null);
      this.setRideData({
        ...this.rideData,
        [key]: value,
        pickUpAddress,
        dropAddress,
        endTime,
        startTime12,
      });
    }
    // else if (key === 'pickUpOrDrop') {
    //   const pickUpAddress =
    //     value === 'pick' ? this.rideData.address : this.OFFICE_LOCATION;
    //   const dropAddress =
    //     value === 'drop' ? this.rideData.address : this.OFFICE_LOCATION;
    //   this.setRideData({
    //     ...this.rideData,
    //     [key]: value,
    //     pickUpAddress,
    //     dropAddress,
    //   });
    // }
    else if (key === 'address') {
      const [_, suffix] = this.rideData.startTime.toString().split(' ');

      const pickUpAddress = suffix === 'AM' ? value : this.OFFICE_LOCATION;
      const dropAddress = suffix === 'PM' ? value : this.OFFICE_LOCATION;

      this.setRideData({
        ...this.rideData,
        [key]: value,
        pickUpAddress,
        dropAddress,
      });
    } else {
      this.setRideData({ ...this.rideData, [key]: value });
    }
  }

  getEndTime(startTime: any, travelTime: any): any {
    const [time, _] = (startTime ?? this.rideData.startTime)
      .toString()
      .split(' ');
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours));
    date.setMinutes(parseInt(minutes));

    date.setMinutes(
      date.getMinutes() + (travelTime ?? this.rideData.travelTime)
    );
    return new Intl.DateTimeFormat('default', {
      hour12: true,
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  }

  setBookingId(): void {
    let prefixList = ['CCG', 'CRB', 'CCR'];
    const randomIndex = Math.floor(Math.random() * prefixList.length);
    const randomPrefix = prefixList[randomIndex];
    const randomSuffix = uuid().replace('-', '').substring(0, 11).toUpperCase();
    const bookingId = randomPrefix + randomSuffix;

    this.setRideData({
      ...this.rideData,
      bookingId,
    });
  }
  setInvoiceNumber(): void {
    let prefixList = ['DCR', 'CCR', 'CCG'];
    const randomIndex = Math.floor(Math.random() * prefixList.length);
    const randomPrefix = prefixList[randomIndex];
    const randomSuffix = Math.floor(Date.now() * Math.random())
      .toString()
      .substring(0, 10);
    const invoiceNumber = randomPrefix + randomSuffix;

    this.setRideData({
      ...this.rideData,
      invoiceNumber,
    });
  }
  generateTemplate(): void {
    this.isChildComponentOpen = true;
    this.childData = { ...this.rideData };
  }
  closeTemplate(): void {
    this.isChildComponentOpen = false;
  }

  isEmpty(value: string): boolean {
    return value === '' || value === undefined || value === null;
  }
}

@Component({
  selector: 'app-dialog',
  templateUrl: 'dialog.html',
})
export class Dialog {
  constructor(
    public dialogRef: MatDialogRef<Dialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
