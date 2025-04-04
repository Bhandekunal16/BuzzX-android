import CryptoJS from 'crypto-js';

export class decryption {
    private readonly secretKey = 'robotic';

  public encrypt(data: any) {
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      this.secretKey
    ).toString();
    return { response: encryptedData };
  }

  public decrypt(encryptedData: string): any {
    const decryptedData = CryptoJS.AES.decrypt(
      encryptedData,
      this.secretKey
    ).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  }
}