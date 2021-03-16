import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchGIFResponse, Datum } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private servicioURL: string = 'http://api.giphy.com/v1/gifs'
  private apiKey: string = 'Jxes64HoGoGqPHLNpd2spsyYyvxFh6Wc';
  private _historial: string[]= [];

  public resultados: Datum[] = []

  get historial() {
    return [...this._historial];
  }

  constructor( private http: HttpClient ) {
    this._historial = JSON.parse(localStorage.getItem('Historial')!) || []
    this.resultados = JSON.parse(localStorage.getItem('lastSearch')!) || []
  }

  buscarGifs(query: string) {
    if( !this._historial.includes(query.trim().toLocaleLowerCase()) ){
      
      this._historial.unshift(query.trim().toLocaleLowerCase()); 
      this._historial = this._historial.splice(0,12);

      localStorage.setItem('Historial', JSON.stringify(this._historial));
    }
    
    const params = new HttpParams()
                  .set('api_key', this.apiKey)
                  .set('q', query)
                  .set('limit', '8');

    this.http.get<SearchGIFResponse>(`${this.servicioURL}/search`,{params})
        .subscribe( (resp) => {
          console.log(resp.data);
          this.resultados = resp.data;
          localStorage.setItem('lastSearch', JSON.stringify(this.resultados));
        });
    console.log(this._historial);
  }
}
