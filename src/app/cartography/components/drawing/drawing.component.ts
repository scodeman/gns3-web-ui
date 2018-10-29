import { Component, OnInit, Input } from '@angular/core';
import { Drawing } from '../../models/drawing';

@Component({
  selector: '[app-drawing]',
  templateUrl: './drawing.component.html',
  styleUrls: ['./drawing.component.scss']
})
export class DrawingComponent implements OnInit {
  @Input('app-drawing') drawing: Drawing;
  
  constructor() { }

  ngOnInit() {
  }

}
