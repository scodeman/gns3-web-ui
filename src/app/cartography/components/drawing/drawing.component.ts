import { Component, OnInit, Input } from '@angular/core';
import { Drawing } from '../../models/drawing';
import { SvgToDrawingConverter } from '../../helpers/svg-to-drawing-converter';
import { EllipseElement } from '../../models/drawings/ellipse-element';
import { ImageElement } from '../../models/drawings/image-element';
import { LineElement } from '../../models/drawings/line-element';
import { RectElement } from '../../models/drawings/rect-element';
import { TextElement } from '../../models/drawings/text-element';

@Component({
  selector: '[app-drawing]',
  templateUrl: './drawing.component.html',
  styleUrls: ['./drawing.component.scss']
})
export class DrawingComponent implements OnInit {
  @Input('app-drawing') drawing: Drawing;
  
  constructor(
    private svgToDrawingConverter: SvgToDrawingConverter
  ) { }

  ngOnInit() {
    try {
      this.drawing.element = this.svgToDrawingConverter.convert(this.drawing.svg);
    } catch (error) {
      console.log(`Cannot convert due to Error: '${error}'`);
    }
  }

  is(element, type: string) {
    if (!element) {
      return false;
    }

    if (type === "ellipse") {
      return element instanceof EllipseElement;
    }
    if (type === "image") {
      return element instanceof ImageElement;
    }
    if (type === "line") {
      return element instanceof LineElement;
    }
    if (type === "rect") {
      return element instanceof RectElement;
    }
    if (type === "text") {
      return element instanceof TextElement;
    }
    return false;
  }

  get transformation() {
    return `translate(${this.drawing.x},${this.drawing.y}) rotate(${this.drawing.rotation})`;
  }
}
