import { Notify } from 'quasar';

Notify.registerType('mention-notification', {
  icon: 'alternate_email',
  color: 'primary',
  textColor: 'white',
});
Notify.registerType('message-notification', {
  icon: 'chat',
  color: 'primary',
  textColor: 'white',
});

export const useNotifications = (
  message: string,
  avatar = '',
  type: string = 'message'
) => {
  Notify.create({
    type: type === 'mention' ? 'mention-notification' : 'message-notification',
    message: message,
    position: 'top',
    avatar: avatar,
  });
};
