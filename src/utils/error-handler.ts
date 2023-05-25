import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function handleCatchError(err: any) {
  console.error('Ошибка!', err);
  notifyError(`${err?.message || ''}`);
}

const defaultMessageError = 'Что то пошло не так...';

export const notifyError = (message: any = defaultMessageError) => {
  if (typeof message !== 'string') {
    message = defaultMessageError; 
  }

  toast.error(message, {
    position: 'top-left',
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

const defaultMessageSuccess = 'Данные успешно добавлены';

export const notifySuccess = (message: any = defaultMessageSuccess) => {
  if (typeof message !== 'string') {
    message = defaultMessageSuccess; 
  }

  toast.success(message, {
    position: 'top-left',
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

const defaultMessageWarning = 'Ошибка';

export const notifyWarning = (message: any = defaultMessageWarning) => {
  if (typeof message !== 'string') {
    message = defaultMessageWarning; 
  }

  toast.warning(message, {
    position: 'top-left',
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};
