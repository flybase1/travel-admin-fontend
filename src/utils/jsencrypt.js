import { JSEncrypt } from "jsencrypt";

// 密钥对生成http://web.chacuo.net/netrsakeypair
const publicKey =
  "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqjtN3wBrRUwGGijirOpW\n" +
  "sISg9Q6BlzagJGAYh9+0cgahL28NUFL6wHmagpURrsWsHZP8dt/9DOfFrqS+/R7f\n" +
  "VFyjclXH3XDDr4cP2+Wxgwn+PgJ3+TqkhHgdRzBQ4giCEGBJdsByUR8RN7iV+DQY\n" +
  "vLQrFrmZm5Jc/FcCqLUeNJW+kSvb75qtQV5hQq4O+BQN1TGoQPDGrN+02mxmNV0O\n" +
  "HI6U/iqTvPhDpHB6bM1jZUI7Jkeo8ySJblLmv/RtglPaV2TSDYiMWpFYy9VWmJcW\n" +
  "b0gAfUOK340negeFGUXK5Xt+jnJZ7VrVM5wIKP7ls7WPPW3yfwrx7L0Sc1w1stge\n" +
  "2QIDAQAB";

const privateKey =
  "MIIEwAIBADANBgkqhkiG9w0BAQEFAASCBKowggSmAgEAAoIBAQCqO03fAGtFTAYa\n" +
  "KOKs6lawhKD1DoGXNqAkYBiH37RyBqEvbw1QUvrAeZqClRGuxawdk/x23/0M58Wu\n" +
  "pL79Ht9UXKNyVcfdcMOvhw/b5bGDCf4+Anf5OqSEeB1HMFDiCIIQYEl2wHJRHxE3\n" +
  "uJX4NBi8tCsWuZmbklz8VwKotR40lb6RK9vvmq1BXmFCrg74FA3VMahA8Mas37Ta\n" +
  "bGY1XQ4cjpT+KpO8+EOkcHpszWNlQjsmR6jzJIluUua/9G2CU9pXZNINiIxakVjL\n" +
  "1VaYlxZvSAB9Q4rfjSd6B4UZRcrle36OclntWtUznAgo/uWztY89bfJ/CvHsvRJz\n" +
  "XDWy2B7ZAgMBAAECggEBAJmAUH++CPy7yOTd6UizJuiVL+7J3eFUyKMEZBphhn0r\n" +
  "rTzwjrjXmnTlMoZ9lSxb4w/o2cb3w19Xv9HzjKUCqa+QuXHoGAl+HXax+4L2ZFMd\n" +
  "N70CzNxYHPG2ve/riYPI2D+cE6KZdnvf3863C8R8dbHzZMdhJTo7iM2iSCuI5mvT\n" +
  "Ay3fPHvhgdkjDyOqr7jGJhrrgZvwr2piGYuPjpONGF42CfgqFNLybokxyD5JsT9d\n" +
  "j9pvPeh5Z78vlh9O3driFHCfEYKi/W8xlhRW8SgTshMlJUrYZyalhlZZ7N29PthZ\n" +
  "JgnKkrizm+XdqDPrEnM+J9ltPDPzWjgDXSxYRh8m9AECgYEA1NWgPPNe0e3JDkde\n" +
  "mFBpgwl/tafqSyxXd52YLduaLNW8kQb104y4geON99xeue+Siy2pfgdnpvxV8bd3\n" +
  "n1YIMdKKkeIfUUaJ4oxYiThfzVytK8svd7k7qtVY4/RlZZrrJqTEgoBFlAT42xyh\n" +
  "+94I+lNQQ/olZu0yZ+fAHaZB0KkCgYEAzMG8/rCxjnvdyZzmppGH0n5EjisoU4fx\n" +
  "H9NDfVYSZbcuKeLzIFXsOxEKooQn5cFyxDXBB5LQmkFejwMhA+qFDPk13tmALCHc\n" +
  "ZZ9SoytzBaw8ZIzwDyI+TQKHLXcslUyth8Jgik2xQO7mNUE7prbc4Mb0CT31dS9y\n" +
  "LU09roaWSrECgYEApV8f1HwdTux97lRSEfNZKHH3A0TnbWWUyOJw3iDl2LRyghVw\n" +
  "aOHMc1BGfTKDf+HAcdgW/E/wn/UtKlWt4uZME7pN5TBXuSUf+iGmoWhmOAEspPyJ\n" +
  "c3NAA2smWGkLaDlJQYuBDQ1yAqMiYc4LptJNE4Qst8Tjzue65LVTtzX5qZECgYEA\n" +
  "w3sTXHSEj2tiSuEos02tRiCWgsRhM55NbfzcKgTKe6FuyT6KrwxZA+s5I/7XuFn/\n" +
  "n6NSLlDUJvDRvedW1c5ISCKEc8ViwL9zEvIQiwcoQPo2jiif51Lh99O6CoYEYmVa\n" +
  "JopEcMXLvBpYXe9xa7CZH1/SDCDC/qXVc7qScNS9F4ECgYEAiCEJYYLb5fA8Avx8\n" +
  "1SIKF9/Yspc0twi+wvNVtQnLiA/xsnyQMgaMUl9PyV4IkyOiR7C82iy3q2iy7X3S\n" +
  "wv2b+vgiX0KogJb2uyTeuGj+rNo53zF96iDlLhM5Hwr7xjXLvUhbhQxQJSWS4+Fz\n" +
  "lUyPBMbw1c1PVs3WS7efadCNY5k=";

// 加密
export function encrypt(txt) {
  const jsEncrypt = new JSEncrypt();
  jsEncrypt.setPublicKey(publicKey);
  return jsEncrypt.encrypt(txt);
}

// 解密
export function decrypt(text) {
  const jsEncrypt = new JSEncrypt();
  jsEncrypt.setPrivateKey(privateKey);
  return jsEncrypt.decrypt(text);
}
