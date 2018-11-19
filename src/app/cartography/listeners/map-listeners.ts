import { Injectable } from "@angular/core";
import { MapListener } from "./map-listener";
import { DraggableListener } from "./draggable-listener";
import { SelectionUpdateListener } from "./selection-update-listener";


@Injectable()
export class MapListeners {
  private listeners: MapListener[] = [];
  constructor(
    private nodesDraggableListener: DraggableListener,
    private selectionUpdateListener: SelectionUpdateListener,
  ) {
    this.listeners.push(this.nodesDraggableListener);
    this.listeners.push(this.selectionUpdateListener);
  }

  public onInit(svg: any) {
    this.listeners.forEach((listener) => {
      listener.onInit(svg);
    });
  }

  public onDestroy() {
    this.listeners.forEach((listener) => {
      listener.onDestroy();
    });
  }
}