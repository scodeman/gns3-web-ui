import { Component, OnInit, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Node } from '../../models/node';
import { Symbol } from '../../../models/symbol';
import { CssFixer } from '../../helpers/css-fixer';
import { FontFixer } from '../../helpers/font-fixer';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: '[app-node]',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss'],
})
export class NodeComponent implements OnInit, AfterViewInit {
  static NODE_LABEL_MARGIN = 3;

  @ViewChild('label') label: ElementRef;
  @ViewChild('image') imageRef: ElementRef;

  @Input('app-node') node: Node;
  @Input('symbols') symbols: Symbol[];
   
  draggable: Subscription;
  
  private native: any;
  private startX: number;
  private startY: number;

  private posX: number;
  private posY: number;

  constructor(
    private cssFixer: CssFixer,
    private fontFixer: FontFixer,
    private sanitizer: DomSanitizer,
    protected element: ElementRef) { }

  ngOnInit() {

  }
  ngAfterViewInit() {
    const down = Observable.fromEvent(this.imageRef.nativeElement, 'mousedown').do((e: MouseEvent) => e.preventDefault())

    down.subscribe((e: MouseEvent) => {
      this.posX = this.node.x;
      this.posY = this.node.y;

      this.startX = e.clientX;
      this.startY = e.clientY;
    });

    const up = Observable.fromEvent(document, 'mouseup')
    .do((e: MouseEvent) => {
      e.preventDefault();
    });

    const mouseMove = Observable.fromEvent(document, 'mousemove')
    .do((e: MouseEvent) => e.stopPropagation());

    const scrollWindow = Observable.fromEvent(document, 'scroll')
    .startWith({});

    const move = Observable.combineLatest(mouseMove, scrollWindow);

    const drag = down.mergeMap((md: MouseEvent) => {
      return move
          .map(([mm, s]) => mm)
          .do((mm: MouseEvent) => {
            const x = this.startX - mm.clientX;
            const y = this.startY - mm.clientY;

            this.node.x = Math.round(this.posX - x);
            this.node.y = Math.round(this.posY - y);
          })
          .skipUntil(up
              .take(1)
              .do(() => {
                console.log("end");
              }))
          .take(1);
    });

    this.draggable = drag.subscribe((e: MouseEvent) => {

    });
  }


  get symbol(): string {
    const symbol = this.symbols.find((s: Symbol) => s.symbol_id === this.node.symbol);
    if (symbol) {
      return 'data:image/svg+xml;base64,' + btoa(symbol.raw);
    }
    // @todo; we need to have default image
    return 'data:image/svg+xml;base64,none';
  }

  get label_style() {

    let styles = this.cssFixer.fix(this.node.label.style);
    styles = this.fontFixer.fixStyles(styles);
    return this.sanitizer.bypassSecurityTrustStyle(styles);
  }

  get label_x(): number {
    // if (this.node.label.x === null) {
    //   // center
    //   const bbox = this.label.nativeElement.getBBox();
    //   return -bbox.width / 2.;
    // }
    return this.node.label.x + NodeComponent.NODE_LABEL_MARGIN;
  }

  get label_y(): number {
    // if (this.node.label.x === null) {
    //   // center
    //   const bbox = this.label.nativeElement.getBBox();
    //   return -bbox.width / 2.;
    // }
    return this.node.label.x + NodeComponent.NODE_LABEL_MARGIN;
  }
}
