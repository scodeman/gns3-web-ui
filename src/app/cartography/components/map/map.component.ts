import {
  Component, ElementRef, HostListener, Input, OnChanges, OnDestroy, OnInit,
  SimpleChange, ChangeDetectionStrategy, ChangeDetectorRef, EventEmitter, ViewChild
} from '@angular/core';

import { Subscription } from 'rxjs';

import { Node } from "../../models/node";
import { Link } from "../../../models/link";
import { GraphLayout } from "../../widgets/graph-layout";
import { Context } from "../../models/context";
import { Size } from "../../models/size";
import { Drawing } from "../../models/drawing";
import { Symbol } from '../../../models/symbol';
import { MultiLinkCalculatorHelper } from '../../helpers/multi-link-calculator-helper';
import { SelectionManager } from '../../managers/selection-manager';



@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent implements OnInit, OnChanges, OnDestroy {
  @Input() nodes: Node[] = [];
  @Input() links: Link[] = [];
  @Input() drawings: Drawing[] = [];
  @Input() symbols: Symbol[] = [];
  @Input() changed: EventEmitter<any>;
  @Input('node-updated') nodeUpdated: EventEmitter<any>;
  @Input('selection-manager') selectionManager: SelectionManager;

  @Input() width = 1500;
  @Input() height = 600;

  @ViewChild('svg') svg: ElementRef;

  // // private d3: D3;
  // private parentNativeElement: any;
  // // private svg: Selection<SVGSVGElement, any, null, undefined>;
  // private graphContext: Context;

  public graphLayout: GraphLayout;
  private changedSubscription: Subscription;

  nodeChanged = new EventEmitter<Node>();

  constructor(protected element: ElementRef,
              private multiLinkCalculatorHelper: MultiLinkCalculatorHelper,
              private ref: ChangeDetectorRef
              ) {
    // this.d3 = d3Service.getD3();
    // this.parentNativeElement = element.nativeElement;
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (
      (changes['width'] && !changes['width'].isFirstChange()) ||
      (changes['height'] && !changes['height'].isFirstChange()) ||
      (changes['drawings'] && !changes['drawings'].isFirstChange()) ||
      (changes['nodes'] && !changes['nodes'].isFirstChange()) ||
      (changes['links'] && !changes['links'].isFirstChange()) ||
      (changes['symbols'] && !changes['symbols'].isFirstChange())
    ) {
      if (changes['nodes']) {
        this.onNodesChange(changes['nodes']);
      }
      if (changes['links']) {
        this.onLinksChange(changes['links']);
      }
      if (changes['symbols']) {
        this.onSymbolsChange(changes['symbols']);
      }
      this.ref.detectChanges();
    }
  }

  ngOnInit() {
    this.ref.detach();
    this.changedSubscription = this.changed.subscribe(() => {
      this.ref.detectChanges();
    });

    this.nodeUpdated.subscribe((node: Node) => {
      console.log(node);
      this.nodeChanged.emit(node);
    });

    // if (this.parentNativeElement !== null) {
    //   this.createGraph(this.parentNativeElement);
    // }
  }

  ngOnDestroy() {
    // this.graphLayout.disconnect(this.svg);
    this.changedSubscription.unsubscribe();
  }

  // public createGraph(domElement: HTMLElement) {
  //   const rootElement = this.d3.select(domElement);
  //   this.svg = rootElement.select<SVGSVGElement>('svg');

  //   this.graphContext = new Context(true);

  //   this.graphContext.size = this.getSize();

  //   this.graphLayout = new GraphLayout();
  //   this.graphLayout.connect(this.svg, this.graphContext);

  //   this.graphLayout.getNodesWidget().addOnNodeDraggingCallback((event: any, n: Node) => {
  //     const linksWidget = this.graphLayout.getLinksWidget();

  //     const links = this.links.filter((link) => link.target.node_id === n.node_id || link.source.node_id === n.node_id);

  //     links.forEach((link) => {
  //       linksWidget.redrawLink(this.svg, link);
  //     });
  //   });

  //   this.graphLayout.draw(this.svg, this.graphContext);
  // }

  public getSize(): Size {
    let width = document.documentElement.clientWidth;
    let height = document.documentElement.clientHeight;
    if (this.width > width) {
      width = this.width;
    }
    if (this.height > height) {
      height = this.height;
    }
    return new Size(width, height);
  }

  private changeLayout() {
    // if (this.parentNativeElement != null) {
    //   this.graphContext.size = this.getSize();
    // }

    // this.graphLayout.setNodes(this.nodes);
    // this.graphLayout.setLinks(this.links);
    // this.graphLayout.setDrawings(this.drawings);

    // this.redraw();
  }

  private onLinksChange(change: SimpleChange) {
    const nodes_by_id = {};
    this.nodes.forEach((n: Node) => {
      nodes_by_id[n.node_id] = n;
    });

    this.links.forEach((link: Link) => {
      const source_id = link.nodes[0].node_id;
      const target_id = link.nodes[1].node_id;
      if (source_id in nodes_by_id) {
        link.source = nodes_by_id[source_id];
      }
      if (target_id in nodes_by_id) {
        link.target = nodes_by_id[target_id];
      }

      if (link.source && link.target) {
        link.x = link.source.x + (link.target.x - link.source.x) * 0.5;
        link.y = link.source.y + (link.target.y - link.source.y) * 0.5;
      }
    });

    this.multiLinkCalculatorHelper.assignDataToLinks(this.links);
  }

  private onNodesChange(change: SimpleChange) {
    this.onLinksChange(null);
  }

  private onSymbolsChange(change: SimpleChange) {
    // this.graphLayout.getNodesWidget().setSymbols(this.symbols);
  }

  public redraw() {
    // this.graphLayout.draw(this.svg, this.graphContext);
  }

  public reload() {
    // this.onLinksChange(null);
    // this.redraw();
  }

  public getTransformation() {
    const ctx = new Context(true);
    ctx.size = this.getSize();

    const xTrans = ctx.getZeroZeroTransformationPoint().x + ctx.transformation.x;
    const yTrans = ctx.getZeroZeroTransformationPoint().y + ctx.transformation.y;
    const kTrans = ctx.transformation.k;
    return `translate(${xTrans}, ${yTrans}) scale(${kTrans})`;
  }
  
  public onNodeChanged(event) {
    this.nodeChanged.emit(event);
    // console.log(event);
  }

  public onSelection(event) {
    this.selectionManager.onSelection(event);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.changeLayout();
  }
}
