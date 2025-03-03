import { Component, input } from '@angular/core';
import { GifsListItemComponent } from "./gifs-list-item/gifs-list-item.component";

@Component({
  selector: 'gifs-lits',
  imports: [GifsListItemComponent],
  templateUrl: './gifs-lits.component.html',
})
export class GifsListComponent {
gifs=input.required<string[]>()
}
