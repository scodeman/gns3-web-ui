import { Component, OnInit, Input, ViewChild, ElementRef, SimpleChanges, OnChanges, DoCheck } from '@angular/core';
import { Link } from '../../../models/link';
import { MultiLinkCalculatorHelper } from '../../helpers/multi-link-calculator-helper';
import { path } from 'd3-path';
import { LinkStatus } from '../../models/link-status';


interface LinkStrategy {
  d(link: Link): string;
}

class EthernetLinkStrategy implements LinkStrategy {
  public d(link: Link): string {
    const points = [
      [link.source.x + link.source.width / 2., link.source.y + link.source.height / 2.],
      [link.target.x + link.target.width / 2., link.target.y + link.target.height / 2.]
    ];

    const line_generator = path();
    line_generator.moveTo(points[0][0], points[0][1]);
    line_generator.lineTo(points[1][0], points[1][1]);
    return line_generator.toString();
  }
}

class SerialLinkStrategy implements LinkStrategy {
  private linkToPoints(link: Link) {
    const source = {
      'x': link.source.x + link.source.width / 2,
      'y': link.source.y + link.source.height / 2
    };
    const target = {
      'x': link.target.x + link.target.width / 2,
      'y': link.target.y + link.target.height / 2
    };

    const dx = target.x - source.x;
    const dy = target.y - source.y;

    const vector_angle = Math.atan2(dy, dx);
    const rot_angle = -Math.PI / 4.0;
    const vect_rot = [
      Math.cos(vector_angle + rot_angle),
      Math.sin(vector_angle + rot_angle)
    ];

    const angle_source: [number, number] = [
      source.x + dx / 2.0 + 15 * vect_rot[0],
      source.y + dy / 2.0 + 15 * vect_rot[1]
    ];

    const angle_target: [number, number] = [
      target.x - dx / 2.0 - 15 * vect_rot[0],
      target.y - dy / 2.0 - 15 * vect_rot[1]
    ];

    return [
      [source.x, source.y], 
      angle_source,
      angle_target,
      [target.x, target.y]
    ];
  }

  d(link: Link): string {
    const points = this.linkToPoints(link);

    const line_generator = path();
    line_generator.moveTo(points[0][0], points[0][1]);
    line_generator.lineTo(points[1][0], points[1][1]);
    line_generator.lineTo(points[2][0], points[2][1]);
    line_generator.lineTo(points[3][0], points[3][1]);
    return line_generator.toString();
  }
}


@Component({
  selector: '[app-link]',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss']
})
export class LinkComponent implements OnInit, OnChanges, DoCheck {
  @Input('app-link') link: Link;

  @ViewChild('path') path: ElementRef;

  private ethernetLinkStrategy = new EthernetLinkStrategy();
  private serialLinkStrategy = new SerialLinkStrategy();

  sourceStatus: LinkStatus;
  targetStatus: LinkStatus;

  constructor(
    private multiLinkCalculatorHelper: MultiLinkCalculatorHelper
    ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  get strategy(): LinkStrategy {
    if (this.link.link_id === 'serial') {
      return this.serialLinkStrategy;
    }
    return this.ethernetLinkStrategy;
  }

  get transformation() {
    const translation = this.multiLinkCalculatorHelper.linkTranslation(this.link.distance, this.link.source, this.link.target);
    return `translate (${translation.dx}, ${translation.dy})`;
  }

  get d() {
    return this.strategy.d(this.link);
  }

  ngDoCheck(): void {
    if (!this.path) {
      return null;
    }
    const start_point: SVGPoint = this.path.nativeElement.getPointAtLength(45);
    const end_point: SVGPoint = this.path.nativeElement.getPointAtLength(this.path.nativeElement.getTotalLength() - 45);
    this.sourceStatus =  new LinkStatus(start_point.x, start_point.y, this.link.source.status);
    this.targetStatus = new LinkStatus(end_point.x, end_point.y, this.link.target.status);
  }

}
