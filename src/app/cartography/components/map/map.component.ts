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
import { LayersManager } from '../../managers/layers-manager';


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

  private changedSubscription: Subscription;
  
  protected settings = {
    'show_interface_labels': true
  };

  nodeChanged = new EventEmitter<Node>();

  constructor(protected element: ElementRef,
              private multiLinkCalculatorHelper: MultiLinkCalculatorHelper,
              private ref: ChangeDetectorRef,
              ) {
  }

  @Input('show-interface-labels') 
  set showInterfaceLabels(value) {
    this.settings.show_interface_labels = value;
    this.ref.detectChanges();
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
      }
      if (changes['drawings']) {
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
      this.nodeChanged.emit(node);
    });
  }

  ngOnDestroy() {
    this.changedSubscription.unsubscribe();
  }

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

  public get layers() {
    const manager = new LayersManager();
    manager.setNodes(this.nodes);
    manager.setLinks(this.links);
    manager.setDrawings(this.drawings);
    return manager.getLayersList();
  }

  public get transform() {
    const ctx = new Context(true);
    ctx.size = this.getSize();

    const xTrans = ctx.getZeroZeroTransformationPoint().x + ctx.transformation.x;
    const yTrans = ctx.getZeroZeroTransformationPoint().y + ctx.transformation.y;
    const kTrans = ctx.transformation.k;
    return `translate(${xTrans}, ${yTrans}) scale(${kTrans})`;
  }
  
  public onNodeChanged(event) {
    this.nodeChanged.emit(event);
  }

  public onSelection(event) {
    this.selectionManager.onSelection(event);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {

  }
}
