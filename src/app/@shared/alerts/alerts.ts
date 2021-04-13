import { EMAIL_PATTERN } from '@core/constants/regex';
import Swal from 'sweetalert2';

const swalWithBasicOptions = (title: string, html: string) =>
    Swal.mixin({
        title,
        html,
        focusConfirm: false,
        cancelButtonText: 'Cancelar',
        showCancelButton: true
    });

export async function formBasicDialog(
    title: string,
    html: string,
    property: string
) {
    return await swalWithBasicOptions(title, html).fire({
        preConfirm: () => {
            const value = (document.getElementById('name') as HTMLInputElement).value;
            if (value) {
                return value;
            }
            Swal.showValidationMessage('Añade un género para continuar');
            return;
        },
    });
}

export async function userFormBasicDialog(
    title: string,
    html: string
) {
    return await swalWithBasicOptions(title, html).fire({
        preConfirm: () => {
            let error = '';
            const name = (document.getElementById('name') as HTMLInputElement).value;
            if (!name) {
                error += 'Usuario es obligatorio</br>';
            }

            const lastName = (document.getElementById('lastName') as HTMLInputElement).value;
            if (!lastName) {
                error += 'Apellidos es obligatorio</br>';
            }

            const email = (document.getElementById('email') as HTMLInputElement).value;
            if (!email) {
                error += 'Email es obligatorio</br>';
            }
            if (!EMAIL_PATTERN.test(email)) {
                error += 'El formato del correo es incorrecto';
            }

            const role =  (document.getElementById('role') as HTMLInputElement).value;

            if (error !== '') {
                Swal.showValidationMessage(error);
                return;
            }
            return {
                name,
                lastName,
                email,
                role,
                birthday: new Date().toISOString()
            };
        },
    });
}

export async function optionsWithDetails(
    title: string,
    html: string,
    width: number | string,
    confirmButtonText: string = '',
    cancelButtonText: string = ''

) {
    return await Swal.fire({
        title,
        html,
        width: `${width}`,
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonColor: '#6c757d',
        cancelButtonColor: '#dc3545',
        confirmButtonText,
        cancelButtonText
    }).then((result) => {
        console.log(result);
        if (result.isConfirmed) {
            console.log('Cancelar');
            return true;
        } else if (result.dismiss.toString() === 'cancel') {
            console.log('Bloquear');
            return false;
        }
    });
}
