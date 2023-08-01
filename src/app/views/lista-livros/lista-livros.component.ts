import { Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription, debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs';
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

  constructor(private service: LivroService) { }

  livrosEncontrados$ = this.campoBusca.valueChanges.pipe(
    debounceTime(PAUSA),
    filter((valorDigitado) => valorDigitado.length >= 3),
    distinctUntilChanged(),
    switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
    map((items) => this.livrosResultadoParaLivros(items))
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



