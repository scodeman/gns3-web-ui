import { Component, OnInit, ElementRef, AfterViewInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Point } from '../../models/point';



@Component({
  selector: '[app-draggable]',
  templateUrl: './draggable.component.html',
  styleUrls: ['./draggable.component.scss']
})
export class DraggableComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input('app-draggable') item: Point;
  @Output() dragging = new EventEmitter<Point>();
  @Output() dragged = new EventEmitter<Point>();

  draggable: Subscription;
  
  private startX: number;
  private startY: number;

  private posX: number;
  private posY: number;
  
  constructor(
    private elementRef: ElementRef
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const down = Observable.fromEvent(this.elementRef.nativeElement, 'mousedown').do((e: MouseEvent) => e.preventDefault())

    down.subscribe((e: MouseEvent) => {
      this.posX = this.item.x;
      this.posY = this.item.y;

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

            this.item.x = Math.round(this.posX - x);
            this.item.y = Math.round(this.posY - y);
            this.dragging.emit(this.item);
          })
          .skipUntil(up
              .take(1)
              .do((e: MouseEvent) => {
                const x = this.startX - e.clientX;
                const y = this.startY - e.clientY;
    
                this.item.x = Math.round(this.posX - x);
                this.item.y = Math.round(this.posY - y);

                this.dragged.emit(this.item);
              }))
          .take(1);
    });

    this.draggable = drag.subscribe((e: MouseEvent) => {
      // this.cd.detectChanges();
    });
  }

  ngOnDestroy() {
    this.draggable.unsubscribe();
  }
}
