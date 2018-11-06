import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule, MatIconModule } from '@angular/material';

import { MapComponent } from './components/map/map.component';
import { CssFixer } from './helpers/css-fixer';
import { FontFixer } from './helpers/font-fixer';
import { MultiLinkCalculatorHelper } from './helpers/multi-link-calculator-helper';
import { SvgToDrawingConverter } from './helpers/svg-to-drawing-converter';
import { QtDasharrayFixer } from './helpers/qt-dasharray-fixer';
import { LayersManager } from './managers/layers-manager';
import { Context } from './models/context';
import { ANGULAR_MAP_DECLARATIONS } from './angular-map.imports';
import { D3_MAP_IMPORTS } from './d3-map.imports';



@NgModule({
  imports: [
    CommonModule,
    MatMenuModule,
    MatIconModule,
  ],
  declarations: [
    MapComponent,
    ...ANGULAR_MAP_DECLARATIONS
  ],
  providers: [
    CssFixer,
    FontFixer,
    MultiLinkCalculatorHelper,
    SvgToDrawingConverter,
    QtDasharrayFixer,
    LayersManager,
    Context,
    ...D3_MAP_IMPORTS
  ],
  exports: [ MapComponent ]
})
export class CartographyModule { }
