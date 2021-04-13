import { Component, OnInit } from '@angular/core';
import { IResultData } from '@core/interfaces/result-data.interface';
import { ITableColumns } from '@core/interfaces/table-columns.interface';
import { GENRE_LIST_QUERY } from '@graphql/operations/query/genre';
import { formBasicDialog, optionsWithDetails } from '@shared/alerts/alerts';
import { BREAK, DocumentNode } from 'graphql';
import { GenresService } from './genres.service';
import { basicAlert } from '@shared/alerts/toasts';
import { TYPE_ALERT } from '@shared/alerts/values.config';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-genres',
  templateUrl: './genres.component.html',
  styleUrls: ['./genres.component.scss']
})
export class GenresComponent implements OnInit {
  query: DocumentNode = GENRE_LIST_QUERY;
  context: object;
  itemsPage: number;
  resultData: IResultData;
  include: boolean;
  columns: Array<ITableColumns>;
  constructor(private service: GenresService) { }

  // ACTUALIZAR DATOS AL AGREGAR NEUVOS GENEROS
  /*private refreshData = new Subject<boolean>();
  public refreshData$ = this.refreshData.asObservable();

  private showMessageInfoAction(res: any): void {
    if (res?.status) {
      basicAlert(TYPE_ALERT.SUCCESS, res?.message);
      this.refreshData.next(true);
      return;
    }
    basicAlert(TYPE_ALERT.WARNING, res?.message);
  }*/

  ngOnInit(): void {
    this.context = {};
    this.itemsPage = 10;
    this.resultData = {
      listKey: 'genres',
      definitionKey: 'genres'
    };
    this.include = false;
    this.columns = [
      {
        property: 'id',
        label: '#'
      },
      {
        property: 'name',
        label: 'Nombre del género'
      },
      {
        property: 'slug',
        label: 'Slug'
      }
    ];
  }

  async takeAction($event) {
    // RECOGER LA INFORMACIÓN PARA LAS ACCIONES

    const action = $event[0];
    const genre = $event[1];

    // RECOGER EL VALOR POR DEFECTO
    const defaultValue = (genre.name !== undefined && genre.name !== '') ? genre.name : '';

    const html = `<input id="name" value="${defaultValue}" class="swal2-input" required>`;

    // TENIENDO EN CUENTA EL CASO, EJECUTAR UNA ACCIÓN
    switch (action) {
      case 'add':
        this.addForm(html);
        break;

      case 'edit':
        this.updateForm(html, genre);
        break;

      case 'info':
        const result = await optionsWithDetails('Detalles', `${genre.name} (${genre.slug})`, 400,
          '<i class="fas fa-edit"></i> Editar', // true
          '<i class="fas fa-lock"></i> Bloquear'); // false
        if (result) {
          this.updateForm(html, genre);
        }
        else if (result === false) {
          this.blockForm(genre);
        }
        break;

      case 'block':
        this.blockForm(genre);
        break;
      default:
        break;
    }
  }

  private async addForm(html: string) {
    const result = await formBasicDialog('Añadir género', html, 'name');
    console.log(result);
    this.addGenre(result);
    return;
  }

  private addGenre(result) {
    if (result.value) {
      this.service.add(result.value).subscribe(
        (res: any) => {
          // this.showMessageInfoAction(res);
          console.log(res);
          if (res.status) {
            basicAlert(TYPE_ALERT.SUCCESS, res.message);
            return;
          }
          basicAlert(TYPE_ALERT.WARNING, res.message);
        }
      );
    }
  }

  private async updateForm(html: string, genre: any) {
    const result = await formBasicDialog('Actualizar género', html, 'name');
    console.log(result);
    this.updateGenre(genre.id, result);
    return;
  }

  private async blockForm(genre: any) {
    const result = await optionsWithDetails('¿Bloquear item?', `Si bloqueas el item seleccionado no se mostrara en la lista`, 400,
      'No Bloquear',
      'Bloquear');
    if (result === false) { // falso bloquear
      this.blockGenre(genre.id);
    }
  }

  private updateGenre(id: string, result) {
    if (result.value) {
      this.service.update(id, result.value).subscribe(
        (res: any) => {
          // this.showMessageInfoAction(res);
          console.log(res);
          if (res.status) {
            basicAlert(TYPE_ALERT.SUCCESS, res.message);
            return;
          }
          basicAlert(TYPE_ALERT.WARNING, res.message);
        }
      );
    }
  }

  private blockGenre(id: string) {
    this.service.block(id).subscribe(
      (res: any) => {
        // this.showMessageInfoAction(res);
        console.log(res);
        if (res.status) {
          basicAlert(TYPE_ALERT.SUCCESS, res.message);
          return;
        }
        basicAlert(TYPE_ALERT.WARNING, res.message);
      }
    );
  }
}

