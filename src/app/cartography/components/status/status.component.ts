import { Component, OnInit, SimpleChanges, ElementRef, Input, EventEmitter, OnDestroy, OnChanges, AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Link } from '../../../models/link';
import { LinkStatus } from '../../models/link-status';
import { Subscription } from 'rxjs';

@Component({
  selector: '[app-status]',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusComponent implements OnInit, OnDestroy {
  static STOPPED_STATUS_RECT_WIDTH = 10;

  @Input('app-status') status: EventEmitter<LinkStatus>;

  statusChangedSubscription: Subscription;
  linkStatus: LinkStatus;

  constructor(
    protected element: ElementRef,
    private ref: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.statusChangedSubscription = this.status.subscribe((linkStatus: LinkStatus) => {
      this.linkStatus = linkStatus;
      this.ref.detectChanges();
    });
  }

  ngOnDestroy() {
    this.statusChangedSubscription.unsubscribe();
  }
}
