import { Notify } from 'quasar';

export const useNotifications = (message: string, avatar = '') => {
  Notify.create({
    message: message,
    color: 'primary',
    textColor: 'white',
    position: 'top',
    avatar: avatar,
  });
};
