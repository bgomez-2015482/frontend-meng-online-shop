import { Component, OnInit } from '@angular/core';
import { IResultData } from '@core/interfaces/result-data.interface';
import { ITableColumns } from '@core/interfaces/table-columns.interface';
import { USER_LIST_QUERY } from '@graphql/operations/query/user';
import { optionsWithDetails, userFormBasicDialog } from '@shared/alerts/alerts';
import { DocumentNode } from 'graphql';
import { UsersAdminService } from './users-admin.service';
import { IRegisterForm } from '@core/interfaces/register.interface';
import { basicAlert } from '@shared/alerts/toasts';
import { TYPE_ALERT } from '@shared/alerts/values.config';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  query: DocumentNode = USER_LIST_QUERY;
  context: object;
  itemsPage: number;
  resultData: IResultData;
  include: boolean;
  columns: Array<ITableColumns>;
  constructor(private service: UsersAdminService) { }

  ngOnInit(): void {
    this.context = {};
    this.itemsPage = 10;
    this.resultData = {
      listKey: 'users',
      definitionKey: 'users'
    };
    this.include = true;
    this.columns = [
      {
        property: 'id',
        label: '#'
      },
      {
        property: 'name',
        label: 'Nombre'
      },
      {
        property: 'lastName',
        label: 'Apellidos'
      },
      {
        property: 'email',
        label: 'Correo electrónico'
      },
      {
        property: 'role',
        label: 'Permisos'
      }
    ];
  }

  private initializeForm(user: any) {
    const defaultName = user.name !== undefined && user.name !== '' ? user.name : '';
    const dafaultLastName = user.lastName !== undefined && user.lastName !== '' ? user.lastName : '';
    const defaultEmail = user.email !== undefined && user.email !== '' ? user.email : '';
    const roles = new Array(2);
    roles[0] = user.role !== undefined && user.role === 'ADMIN' ? 'selected' : '';
    roles[1] = user.role !== undefined && user.role === 'CLIENT' ? 'selected' : '';
    return `
    <input id="name" value="${defaultName}" class="swal2-input" placeholder="Nombre" required>
    <input id="lastName" value="${dafaultLastName}" class="swal2-input" placeholder="Apellidos" required>
    <input id="email" value="${defaultEmail}" class="swal2-input" placeholder="Correo Electrónico" required>
    <select id="role" class="swal2-input">
      <option value="ADMIN" ${roles[0]}>Administrador</option>
      <option value="CLIENT" ${roles[1]}>Cliente</option>
    </select>
    `;
  }

  async takeAction($event) {
    // RECOGER LA INFORMACIÓN PARA LAS ACCIONES

    const action = $event[0];
    const user = $event[1];

    // RECOGER EL VALOR POR DEFECTO

    const html = this.initializeForm(user);
    switch (action) {
      case 'add':
        this.addForm(html);
        break;

      case 'edit':
        this.updateForm(html, user);
        break;

      case 'info':
        const result = await optionsWithDetails('Detalles', `${user.name} ${user.lastName}</br>
        <i class="fas fa-envelope-open-text"></i>&nbsp;&nbsp;${user.email}`, 400,
          '<i class="fas fa-edit"></i> Editar', // true
          '<i class="fas fa-lock"></i> Bloquear'); // false
        if (result) {
          this.updateForm(html, user);
        }
        else if (result === false) {
          this.blockForm(user);
        }
        break;

      case 'block':
        this.blockForm(user);
        break;
      default:
        break;
    }
  }

  private async addForm(html: string) {
    const result = await userFormBasicDialog('Añadir usuario', html);
    console.log(result);
    this.addUser(result);
  }

  private addUser(result) {
    if (result.value) {
      const user: IRegisterForm = result.value;
      user.password = '1234';
      user.active = false;
      this.service.register(user).subscribe(
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

  private async updateForm(html: string, user: any) {
    const result = await userFormBasicDialog('Editar usuario', html);
    console.log(result);
    this.updateUser(result, user.id);
  }

  private async blockForm(user: any) {
    const result = await optionsWithDetails('¿Bloquear usuario?', `Si bloqueas el usuario seleccionado no se mostrara en la lista`, 400,
      'No Bloquear',
      'Bloquear');
    if (result === false) { // falso bloquear
      this.blockUser(user.id);
    }
  }

  private updateUser(result, id: string) {
    if (result.value) {
      const user = result.value;
      user.id = id;
      this.service.update(result.value).subscribe(
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

  private blockUser(id: string) {
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
