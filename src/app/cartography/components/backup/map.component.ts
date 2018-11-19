// import {
//   Component, ElementRef, HostListener, Input, OnChanges, OnDestroy, OnInit,
//   SimpleChange, ChangeDetectionStrategy, ChangeDetectorRef, EventEmitter, ViewChild
// } from '@angular/core';

// import { GraphLayout } from "../../widgets/graph-layout";
// import { Context } from "../../models/context";
// import { Size } from "../../models/size";
// import { NodesWidget } from '../../widgets/nodes';
// import { Subscription } from 'rxjs';
// import { InterfaceLabelWidget } from '../../widgets/interface-label';
// import { SelectionTool } from '../../tools/selection-tool';
// import { MovingTool } from '../../tools/moving-tool';
// import { MapChangeDetectorRef } from '../../services/map-change-detector-ref';
// import { CanvasSizeDetector } from '../../helpers/canvas-size-detector';
// import { MapListeners } from '../../listeners/map-listeners';
// import { DrawingsWidget } from '../../widgets/drawings';
// import { Node } from '../../models/node';
// import { Link } from '../../../models/link';
// import { Drawing } from '../../models/drawing';
// import { Symbol } from '../../../models/symbol';
// import { GraphDataManager } from '../../managers/graph-data-manager';


// @Component({
//   selector: 'app-map',
//   templateUrl: './map.component.html',
//   styleUrls: ['./map.component.scss'],
//   changeDetection: ChangeDetectionStrategy.OnPush
// })
// export class MapComponent implements OnInit, OnChanges, OnDestroy {
//   @Input() nodes: Node[] = [];
//   @Input() links: Link[] = [];
//   @Input() drawings: Drawing[] = [];
//   @Input() symbols: Symbol[] = [];
//   @Input() changed: EventEmitter<any>;
  
//   @Input('node-updated') nodeUpdated: EventEmitter<any>;

//   @Input() width = 1500;
//   @Input() height = 600;

//   @ViewChild('svg') svg: ElementRef;

//   private changedSubscription: Subscription;
  
//   protected settings = {
//     'show_interface_labels': true
//   };

//   constructor(
//     private graphDataManager: GraphDataManager,
//     private context: Context,
//     private mapChangeDetectorRef: MapChangeDetectorRef,
//     private canvasSizeDetector: CanvasSizeDetector,
//     private mapListeners: MapListeners,
//     protected element: ElementRef,
//     protected nodesWidget: NodesWidget,
//     protected drawingsWidget: DrawingsWidget,
//     protected interfaceLabelWidget: InterfaceLabelWidget,
//     protected selectionToolWidget: SelectionTool,
//     protected movingToolWidget: MovingTool,
//     public graphLayout: GraphLayout,
//     ) {
//     this.parentNativeElement = element.nativeElement;
//   }

//   @Input('show-interface-labels') 
//   set showInterfaceLabels(value) {
//     this.settings.show_interface_labels = value;
//     this.interfaceLabelWidget.setEnabled(value);
//     this.mapChangeDetectorRef.detectChanges();
//   }

//   @Input('moving-tool')
//   set movingTool(value) {
//     this.movingToolWidget.setEnabled(value);
//     this.mapChangeDetectorRef.detectChanges();
//   }

//   @Input('selection-tool')
//   set selectionTool(value) {
//     this.selectionToolWidget.setEnabled(value);
//     this.mapChangeDetectorRef.detectChanges();
//   }

//   @Input('draw-link-tool') drawLinkTool: boolean;

//   @Input('readonly') set readonly(value) {
//     this.nodesWidget.draggingEnabled = !value;
//     this.drawingsWidget.draggingEnabled = !value;
//   }
  
//   ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
//     if (
//       (changes['width'] && !changes['width'].isFirstChange()) ||
//       (changes['height'] && !changes['height'].isFirstChange()) ||
//       (changes['drawings'] && !changes['drawings'].isFirstChange()) ||
//       (changes['nodes'] && !changes['nodes'].isFirstChange()) ||
//       (changes['links'] && !changes['links'].isFirstChange()) ||
//       (changes['symbols'] && !changes['symbols'].isFirstChange())
//     ) {
//       if (changes['nodes']) {
//         this.onNodesChange(changes['nodes']);
//       }
//       this.ref.detectChanges();
//     }
//   }

//   ngOnInit() {
//     this.ref.detach();
//     this.changedSubscription = this.changed.subscribe(() => {
//       this.ref.detectChanges();
//     });

//     this.nodeUpdated.subscribe((node: Node) => {
//       this.nodeChanged.emit(node);
//     });
//   }

//   ngOnDestroy() {
//     this.changedSubscription.unsubscribe();
//   }

//   public getSize(): Size {
//     return this.canvasSizeDetector.getOptimalSize(this.width, this.height);
//   }



//   public get layers() {
//     const manager = new LayersManager();
//     manager.setNodes(this.nodes);
//     manager.setLinks(this.links);
//     manager.setDrawings(this.drawings);
//     return manager.getLayersList();
//   }

//   public get transform() {
//     const ctx = new Context();
//     ctx.size = this.getSize();

//     const xTrans = ctx.getZeroZeroTransformationPoint().x + ctx.transformation.x;
//     const yTrans = ctx.getZeroZeroTransformationPoint().y + ctx.transformation.y;
//     const kTrans = ctx.transformation.k;
//     return `translate(${xTrans}, ${yTrans}) scale(${kTrans})`;
//   }


//   @HostListener('window:resize', ['$event'])
//   onResize(event) {

//   }
// }
