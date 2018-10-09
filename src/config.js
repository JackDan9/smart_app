
const DEVELOPMENT = 0;
const DEV_API = 'http://192.168.112.23:8003/api';
const SER_API = 'http://www.xytywlkj.com/api';

  export default{
    api: DEVELOPMENT ? DEV_API: SER_API,
    baseUrl: 'http://x.xytywlkj.com/',
    defaultPic:DEVELOPMENT ? '/dist/logo.jpg': '/app/home/dist/logo.jpg'
  }
