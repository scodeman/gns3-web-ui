import { Component, OnInit, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { Port } from '../../../models/port';
import { DrawingLineWidget } from '../../widgets/drawing-line';
import { Node } from '../../models/node';
import { NodesWidget, NodeEvent } from '../../widgets/nodes';
import { Subscription } from 'rxjs';
import { NodeSelectInterfaceComponent } from '../node-select-interface/node-select-interface.component';


export class LinkCreated {
  constructor(
    public sourceNode: Node,
    public sourcePort: Port,
    public targetNode: Node,
    public targetPort: Port
  ){}
}

@Component({
  selector: 'app-draw-link-tool',
  templateUrl: './draw-link-tool.component.html',
  styleUrls: ['./draw-link-tool.component.scss']
})
export class DrawLinkToolComponent implements OnInit, OnDestroy {
  @ViewChild(NodeSelectInterfaceComponent) nodeSelectInterfaceMenu: NodeSelectInterfaceComponent;
  
  @Output('linkCreated') linkCreated = new EventEmitter<LinkCreated>();

  private onNodeClicked: Subscription;

  constructor(
    private drawingLineTool: DrawingLineWidget,
    private nodesWidget: NodesWidget
  ) { }

  ngOnInit() {
    this.onNodeClicked = this.nodesWidget.onNodeClicked.subscribe((eventNode: NodeEvent) => {
        this.nodeSelectInterfaceMenu.open(eventNode.node, eventNode.event.clientY, eventNode.event.clientX);
    });
  }

  ngOnDestroy() {
    if(this.drawingLineTool.isDrawing()) {
      this.drawingLineTool.stop();
    }
    this.onNodeClicked.unsubscribe();
  }

  // public toggleDrawLineMode() {
  //   this.drawLineMode = !this.drawLineMode;
  //   if (!this.drawLineMode) {
  //     this.mapChild.graphLayout.getDrawingLineTool().stop();
  //   }
  // }

  public onChooseInterface(event) {
    const node: Node = event.node;
    const port: Port = event.port;
    // const drawingLineTool = this.mapChild.graphLayout.getDrawingLineTool();
    if (this.drawingLineTool.isDrawing()) {
      const data = this.drawingLineTool.stop();
      this.linkCreated.emit(new LinkCreated(data['node'], data['port'], node, port));
    } else {
      this.drawingLineTool.start(node.x + node.width / 2., node.y + node.height / 2., {
        'node': node,
        'port': port
      });
    }
  }
}
