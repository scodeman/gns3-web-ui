import { Component, OnInit, SimpleChanges, ElementRef, Input } from '@angular/core';
import { Link } from '../../../models/link';
import { LinkStatus } from '../../models/link-status';

@Component({
  selector: '[app-status]',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {
  static STOPPED_STATUS_RECT_WIDTH = 10;

  @Input('app-status') link: Link;

  constructor(
    protected element: ElementRef
  ) {
  }

  ngOnInit() {
  }

  get statuses() {
    return this.getStatuses(this.link);
  }

  private getStatuses(link: Link) {
    const start_point: SVGPoint = this.element.nativeElement.getPointAtLength(45);
    const end_point: SVGPoint = this.element.nativeElement.getPointAtLength(this.element.nativeElement.getTotalLength() - 45);

    const statuses = [
      new LinkStatus(start_point.x, start_point.y, link.source.status),
      new LinkStatus(end_point.x, end_point.y, link.target.status)
    ];
    return statuses;
  }

}
