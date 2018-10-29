import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './components/map/map.component';
import { NodeComponent } from './components/node/node.component';
import { LayerComponent } from './components/layer/layer.component';
import { LinkComponent } from './components/link/link.component';
import { CssFixer } from './helpers/css-fixer';
import { FontFixer } from './helpers/font-fixer';
import { MultiLinkCalculatorHelper } from './helpers/multi-link-calculator-helper';
import { StatusComponent } from './components/status/status.component';
import { DrawingComponent } from './components/drawing/drawing.component';
import { EllipseComponent } from './components/drawing/drawings/ellipse/ellipse.component';
import { ImageComponent } from './components/drawing/drawings/image/image.component';
import { LineComponent } from './components/drawing/drawings/line/line.component';
import { RectComponent } from './components/drawing/drawings/rect/rect.component';
import { TextComponent } from './components/drawing/drawings/text/text.component';
import { SvgToDrawingConverter } from './helpers/svg-to-drawing-converter';
import { QtDasharrayFixer } from './helpers/qt-dasharray-fixer';
import { DraggableComponent } from './components/draggable/draggable.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    MapComponent,
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
    DraggableComponent
  ],
  providers: [
    CssFixer,
    FontFixer,
    MultiLinkCalculatorHelper,
    SvgToDrawingConverter,
    QtDasharrayFixer
  ],
  exports: [MapComponent]
})
export class CartographyModule { }
