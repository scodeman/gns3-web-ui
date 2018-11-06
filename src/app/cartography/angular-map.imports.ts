import { NodeComponent } from './components/node/node.component';
import { LayerComponent } from './components/layer/layer.component';
import { LinkComponent } from './components/link/link.component';
import { StatusComponent } from './components/status/status.component';
import { DrawingComponent } from './components/drawing/drawing.component';
import { EllipseComponent } from './components/drawing/drawings/ellipse/ellipse.component';
import { ImageComponent } from './components/drawing/drawings/image/image.component';
import { LineComponent } from './components/drawing/drawings/line/line.component';
import { RectComponent } from './components/drawing/drawings/rect/rect.component';
import { TextComponent } from './components/drawing/drawings/text/text.component';
import { DraggableComponent } from './components/draggable/draggable.component';
import { SelectionComponent } from './components/selection/selection.component';
import { InterfaceLabelComponent } from './components/interface-label/interface-label.component';


export const ANGULAR_MAP_DECLARATIONS = [
    NodeComponent,
    LayerComponent,
    LinkComponent,
    StatusComponent,
    DrawingComponent,
    EllipseComponent,
    ImageComponent,
    LineComponent,
    RectComponent,
    TextComponent,
    DraggableComponent,
    SelectionComponent,
    InterfaceLabelComponent
];
