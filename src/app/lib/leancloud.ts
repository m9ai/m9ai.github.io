import AV from 'leancloud-storage';

// 初始化LeanCloud应用
AV.init({
  appId: process.env.NEXT_PUBLIC_LEANCLOUD_APP_ID || 'ylAqTisAovtzITF7nFATJdPf-gzGzoHsz',
  appKey: process.env.NEXT_PUBLIC_LEANCLOUD_APP_KEY || '0taAbXagcnd2HfEHjMnSNU40',
  serverURL: process.env.NEXT_PUBLIC_LEANCLOUD_SERVER_URL || 'https://ylaqtisa.lc-cn-n1-shared.com'
});

if (process.env.NODE_ENV === 'development') {
  AV.debug.enable();
} else {
  AV.debug.disable();
}

export default AV;