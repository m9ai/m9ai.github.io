import AV from 'leancloud-storage';

// 初始化LeanCloud应用
AV.init({
  appId: process.env.NEXT_PUBLIC_LEANCLOUD_APP_ID || 'V12WjVgpQ23j4il8Kqzhj4z5-MdYXbMMI',
  appKey: process.env.NEXT_PUBLIC_LEANCLOUD_APP_KEY || 'dupNAwNKNXIjdLchVO6WBYx4',
  serverURL: process.env.NEXT_PUBLIC_LEANCLOUD_SERVER_URL || 'https://api.m9ai.work'
});

if (process.env.NODE_ENV === 'development') {
  AV.debug.enable();
} else {
  AV.debug.disable();
}

export default AV;