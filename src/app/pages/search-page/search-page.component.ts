import { Component, inject, signal } from '@angular/core';
import { GifsListComponent } from "../../gifs/components/gifs-list/gifs-lits.component";
import { GifService } from 'src/app/gifs/services/gifs.service';
import { Gif } from 'src/app/gifs/interfaces/gif.interface';

@Component({
  selector: 'app-search-page',
  imports: [GifsListComponent],
  templateUrl: './search-page.component.html',
})
export default class SearchPageComponent {

  gifsService = inject(GifService);
  gifs = signal<Gif[]>([]);
  onSearch(query: string) {
    this.gifsService.searchGifs(query).subscribe((resp) => {
      this.gifs.set(resp);
    });
  }
}
