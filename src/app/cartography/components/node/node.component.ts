import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { Node } from '../../models/node';
import { Symbol } from '../../../models/symbol';
import { CssFixer } from '../../helpers/css-fixer';
import { FontFixer } from '../../helpers/font-fixer';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: '[app-node]',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss'],
})
export class NodeComponent implements OnInit {
  static NODE_LABEL_MARGIN = 3;

  @ViewChild('label') label: ElementRef;

  @Input('app-node') node: Node;
  @Input('symbols') symbols: Symbol[];
   
  constructor(
    private cssFixer: CssFixer,
    private fontFixer: FontFixer,
    private sanitizer: DomSanitizer) { }

  ngOnInit() {

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
    return this.node.label.x + NodeComponent.NODE_LABEL_MARGIN;  }
}
