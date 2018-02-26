import { Component, OnInit, Inject } from '@angular/core';
import { IPageChangeEvent, ITdDataTableColumn, TdDataTableService } from '@covalent/core';
import { FriendsInvite, ReservationView } from '../../../shared/viewModels/interfaces';
import { MAT_DIALOG_DATA } from '@angular/material';
import { config } from '../../../config';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'cockpit-reservation-dialog',
  templateUrl: './reservation-dialog.component.html',
  styleUrls: ['./reservation-dialog.component.scss'],
})
export class ReservationDialogComponent implements OnInit {

  datao: FriendsInvite[] = [];
  columnso: ITdDataTableColumn[];
  pageSizes: number[];
  fromRow: number = 1;
  currentPage: number = 1;
  pageSize: number = 4;

  data: any;

  datat: ReservationView[] = [];
  columnst: ITdDataTableColumn[];

  filteredData: any[] = this.datao;

  constructor(private _dataTableService: TdDataTableService,
              private translate: TranslateService,
              @Inject(MAT_DIALOG_DATA) dialogData: any) {
    this.data = dialogData.row;
    this.pageSizes = config.pageSizesDialog;
  }

  ngOnInit(): void {

    this.translate.get('cockpit.table').subscribe( (res: any) => {
      this.columnst = [
        { name: 'booking.bookingDate', label: res.reservationDateH },
        { name: 'booking.creationDate', label: res.creationDateH },
        { name: 'booking.name', label: res.ownerH },
        { name: 'booking.email', label: res.emailH },
        { name: 'booking.tableId', label: res.tableH },
      ];
    });

    this.translate.get('cockpit.reservations.dialogTable').subscribe((res: any) => {
      this.columnso = [
        { name: 'email', label: res.guestEmailH },
        { name: 'accepted', label: res.acceptanceH },
      ];
      if (this.data.booking.assistants) {
        this.columnst.push({ name: 'booking.assistants', label: res.assistantsH});
      }
    });

    this.datat.push(this.data);
    this.datao = this.data.invitedGuests;
    this.filter();
  }

  page(pagingEvent: IPageChangeEvent): void {
    this.fromRow = pagingEvent.fromRow;
    this.currentPage = pagingEvent.page;
    this.pageSize = pagingEvent.pageSize;
    this.filter();
  }

  filter(): void {
    let newData: any[] = this.datao;
    newData = this._dataTableService.pageData(newData, this.fromRow, this.currentPage * this.pageSize);
    setTimeout(() => this.filteredData = newData);
  }

}
