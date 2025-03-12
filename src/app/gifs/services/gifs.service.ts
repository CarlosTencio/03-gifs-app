import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import type { GiphyResponse } from '../interfaces/giphy.interfaces';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';
import { map, Observable, tap } from 'rxjs';


const GIF_KEY = 'history';
const loadFromLocalStorage = () => {
  const gifsFromStorage = localStorage.getItem(GIF_KEY) ?? '{}';//record<string,Gif[]>
  const gifs = JSON.parse(gifsFromStorage);
  return gifs;

};



@Injectable({ providedIn: 'root' })
export class GifService {

  private http = inject(HttpClient);

  trendingGifs = signal<Gif[]>([]);//[gif,gif,gif]
  trendingGifsLoading = signal(false);
  private trendingPage = signal(0);
  //[[fig,fig,fig],[fig,fig,fig],[fig,fig,fig]]

  trendingGifGroup = computed<Gif[][]>(() => {//con esto creo grupos de 3 para mostrar en el grid
    const groups = [];
    for (let i = 0; i < this.trendingGifs().length; i += 3) {
      groups.push(this.trendingGifs().slice(i, i + 3));
    }

    return groups;
  })


  searchHistory = signal<Record<string, Gif[]>>(loadFromLocalStorage());
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));


  constructor() {
    this.loadTrendingGifs();
  }


  saveGifsToLocalStorage = effect(() => {
    const historyStorage = JSON.stringify(this.searchHistory());
    localStorage.setItem(GIF_KEY, historyStorage);
  })


  loadTrendingGifs() {
    if (this.trendingGifsLoading()) return;

    this.trendingGifsLoading.set(true);

    this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
      params: {
        api_key: environment.giphyapiKey,
        limit: '20',
        offset: this.trendingPage() * 20
      }
    }).subscribe((resp) => {
      const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);//con esto se puede ver el arreglo de una mejor manera
      this.trendingGifs.update((currentGifs)=>[...currentGifs,...gifs]);
      this.trendingPage.update((page) => page + 1);
      this.trendingGifsLoading.set(false);
      console.log(gifs);
    });
  }

  searchGifs(query: string): Observable<Gif[]> { //regresa un observable
    return this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`, {
      params: {
        api_key: environment.giphyapiKey,
        limit: '20',
        q: query
      },
    }).pipe(
      map(({ data }) => data),//desestructura la respuesta y regresa solo el arreglo de data
      map((items) => GifMapper.mapGiphyItemsToGifArray(items)),//arreglo procesado como lo necesito

      //historial de busqueda
      tap((items) => {//efecto secundario
        this.searchHistory.update((history) => ({
          ...history,
          [query.toLocaleLowerCase()]: items
        }))
      })
      //barre cada elemento de la respuesta y regresa una transformacion diferente
    );//permite encadenar operadores especiales de observables



    // .subscribe((resp) => {
    //   const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);

    //   console.log({ search: gifs });
    // });
  }
  getHistoryGifs(query: string): Gif[] {
    return this.searchHistory()[query] ?? [];
  }
}
