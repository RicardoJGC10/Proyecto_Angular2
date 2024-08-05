import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-model',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './model.component.html',
  styleUrl: './model.component.css'
})
export class ModelComponent {
  @Input() isOpen = false;
  @Output() closeModel = new EventEmitter();

  onCloseModel() {
    this.closeModel.emit(false);
  }


}