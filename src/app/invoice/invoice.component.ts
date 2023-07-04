import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css'],
})
export class InvoiceComponent {
  @Input() data: any;
  @Output() close = new EventEmitter<void>();
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const monthIndex = date.getMonth();
    const month = monthNames[monthIndex];
    const day = date.getDate();
    const year = date.getFullYear();

    return `${day < 10 ? '0' + day : day} ${month}, ${year}`;
  }
  slashFormatDate(dateString: string, length: number): string {
    const date = new Date(dateString);
    const day = String(date.getDate());
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());
    if (length === 1) {
      return `${day.padStart(2, '0')}/${month}/${year}`;
    }
    return `${day}/${month}/${year}`;
  }

  totalTax(): number {
    const gst =
      this.data.fareBreakUp.gst * 2 + this.data.fareBreakUp.convenience.gst * 2;
    return gst;
  }

  priceWithoutTax(): string {
    const gst =
      this.data.fareBreakUp.gst * 2 + this.data.fareBreakUp.convenience.gst * 2;
    const price = this.data.price - gst;
    return price.toFixed(2);
  }

  closeChild() {
    this.close.emit();
  }

  ngOnInit(): void {
    console.log(this.data);
  }
}
