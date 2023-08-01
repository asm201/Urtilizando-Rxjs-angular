import { LivrosResultado } from './../../models/interfaces';
import { Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EMPTY, Subscription, catchError, debounceTime, distinctUntilChanged, filter, map, of, switchMap, throwError } from 'rxjs';
import { Item, Livro } from 'src/app/models/interfaces';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';
import { LivroService } from 'src/app/service/livro.service';

const PAUSA = 300

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css']
})
export class ListaLivrosComponent{

  //listaLivros: Livro[];
  campoBusca = new FormControl()
  //subscription: Subscription
  //livro: Livro
  mensgemErro = ''
  livrosResultado: LivrosResultado

  constructor(private service: LivroService) { }


  totalDeLivros$ = this.campoBusca.valueChanges.pipe(
    debounceTime(PAUSA),
    filter((valorDigitado) => valorDigitado.length >= 3),
    distinctUntilChanged(),
    switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
    map(resultado => this.livrosResultado = resultado),
    catchError(erro => {
      console.log(erro);
      return of()
    })
  )

  livrosEncontrados$ = this.campoBusca.valueChanges.pipe(
    debounceTime(PAUSA),
    filter((valorDigitado) => valorDigitado.length >= 3),
    distinctUntilChanged(),
    switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
    map(resultado => this.livrosResultado = resultado),
    map(resultado => resultado.items ?? []),
    map((items) => this.livrosResultadoParaLivros(items)),
    //catchError(() => {
    //    this.mensgemErro = 'Ops, ocorreu um erro, Recarregando a aplicação!'
    //    return EMPTY
     // }
    //)
    catchError(erro => {
     console.log(erro)
      return throwError(() => new Error(this.mensgemErro = 'Ops, ocorreu um erro, Recarregando a aplicação!'))
      }
    )
  )

/*
  buscarLivros(){
    this.subscription = this.service.buscar(this.campoBusca).subscribe(
      {
        next: (items) => {
          this.listaLivros = this.livrosResultadoParaLivros(items)
        },
        error: erro => console.error(erro),
      }
    )
  }*/

  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[]{
    return items.map(item => {
      return new LivroVolumeInfo(item)
    })
  }

  /*
  ngOnDestroy() {
    this.subscription.unsubscribe()
  }*/

}



