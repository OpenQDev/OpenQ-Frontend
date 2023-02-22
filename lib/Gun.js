import Gun from 'gun/gun';
import 'gun/lib/load';

export const gun = new Gun({
  peers: ['https://gun.mktcode.uber.space/gun', 'https://gun-manhattan.herokuapp.com/gun'],
})
  .get('openq')
  .get('v1');
