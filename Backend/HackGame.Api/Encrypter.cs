using System.Security.Cryptography;
using System.Text;

namespace HackGame.Api
{
    public static class Encrypter
    {
        private static Aes aes = Aes.Create();
        public static bool Encrypt(string jsonString, out string EncryptedText)
        {
            try
            {
                byte[] plainText = Encoding.UTF8.GetBytes(jsonString);
                byte[] cipherText = new byte[plainText.Length];
                if(aes.IV == null || aes.Key == null)
                {
                    aes.KeySize = 128;
                    aes.GenerateIV();
                    aes.GenerateKey();
                }
                EncryptedText = Encoding.UTF8.GetString(aes.EncryptCfb(plainText, aes.IV));
                return true;
            }
            catch
            {
                EncryptedText = "";
                return false;
            }
        }

        public static bool Decrypt(string encryptedText, out string decryptedText)
        {
            try
            {
                var decrypted = aes.DecryptCfb(Encoding.UTF8.GetBytes(encryptedText), aes.IV);
                decryptedText = Encoding.UTF8.GetString(decrypted);
                return true;
            }
            catch
            {
                decryptedText = "";
                return false;
            }
        }
    }
}
