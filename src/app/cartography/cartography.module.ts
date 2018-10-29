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
    DrawingComponent
  ],
  providers: [
    CssFixer,
    FontFixer,
    MultiLinkCalculatorHelper
  ],
  exports: [MapComponent]
})
export class CartographyModule { }
