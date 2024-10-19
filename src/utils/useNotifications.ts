import { Notify } from 'quasar';

Notify.registerType('mention', {
  icon: 'alternate_email',
  color: 'primary',
  textColor: 'white',
});
Notify.registerType('message', {
  icon: 'chat',
  color: 'primary',
  textColor: 'white',
});
Notify.registerType('error', {
  icon: 'warning',
  color: 'negative',
  textColor: 'white',
});
Notify.registerType('add', {
  icon: 'add',
  color: 'primary',
  textColor: 'white',
});
Notify.registerType('info', {
  icon: 'info',
  color: 'primary',
  textColor: 'white',
});

export const useNotifications = (
  type: string,
  message: string,
  caption: string = '',
  avatar: string = ''
) => {
  Notify.create({
    type: type,
    message: message,
    caption: caption,
    position: 'top',
    avatar: avatar,
  });
};
