import 'server-only';
import AV from 'leancloud-storage';

AV.init({
  appId: 'V12WjVgpQ23j4il8Kqzhj4z5-MdYXbMMI',
  appKey: 'dupNAwNKNXIjdLchVO6WBYx4',
  serverURLs: 'https://api.m9ai.work'
});

if (process.env.NODE_ENV === 'development') {
  AV.debug.enable();
} else {
  AV.debug.disable();
}

export default AV;