import { Component, OnInit, Input, ElementRef, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy, Output, EventEmitter, OnDestroy, OnChanges, AfterViewInit } from '@angular/core';
import { Node } from '../../models/node';
import { Symbol } from '../../../models/symbol';
import { CssFixer } from '../../helpers/css-fixer';
import { FontFixer } from '../../helpers/font-fixer';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Component({
  selector: '[app-node]',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NodeComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  static NODE_LABEL_MARGIN = 3;

  @ViewChild('label') label: ElementRef;
  @ViewChild('image') imageRef: ElementRef;

  @Input('app-node') node: Node;
  @Input('symbols') symbols: Symbol[];
  @Input('node-changed') nodeChanged: EventEmitter<Node>;
   
  @Output() valueChange = new EventEmitter<Node>();
  
  nodeChangedSubscription: Subscription;

  private labelHeight = 0;

  constructor(
    private cssFixer: CssFixer,
    private fontFixer: FontFixer,
    private sanitizer: DomSanitizer,
    protected element: ElementRef,
    private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.nodeChangedSubscription = this.nodeChanged.subscribe((node: Node) => {
      if(node.node_id == this.node.node_id) {
        this.cd.detectChanges();
      }
    });
  }

  ngOnDestroy() {
    this.nodeChangedSubscription.unsubscribe();
  }

  ngOnChanges(changes) {
    this.cd.detectChanges();
  }

  ngAfterViewInit() {
    this.labelHeight = this.getLabelHeight();
    // reload BBox
    this.cd.detectChanges();
  }

  OnDragging(item) {
    this.cd.detectChanges();
    this.valueChange.emit(this.node);
  }

  OnDragged(item) {
    this.cd.detectChanges();
    this.valueChange.emit(this.node);
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
    if (this.node.label.x === null) {
      // center
      const bbox = this.label.nativeElement.getBBox();
     
      return -bbox.width / 2.;
    }
    return this.node.label.x + NodeComponent.NODE_LABEL_MARGIN;
  }

  get label_y(): number {
    this.labelHeight = this.getLabelHeight();
    
    if (this.node.label.x === null) {
      // center
      return - this.node.height / 2. - this.labelHeight ;
    }
    return this.node.label.y + this.labelHeight - NodeComponent.NODE_LABEL_MARGIN;
  }

  private getLabelHeight() {
    const bbox = this.label.nativeElement.getBBox();
    return bbox.height;
  }
}
