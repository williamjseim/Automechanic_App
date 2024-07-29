using System.Security.Cryptography;
using System.Text;

namespace Mechanic.Api
{
    public static class Encrypter
    {
        /// <summary>
        /// returns encrypted jwt token which has be converted to base64 before being sendt to the user
        /// </summary>
        /// <param name="jsonString"></param>
        /// <param name="EncryptedText"></param>
        /// <param name="config"></param>
        /// <returns></returns>
        public static bool Encrypt(string jsonString, out byte[] EncryptedText, IConfiguration config)
        {
            try
            {
                byte[] plainText = Encoding.UTF8.GetBytes(jsonString);
                using(Aes aes = Aes.Create())
                {
                    //HashAlgorithm sha = SHA256.Create();
                    //aes.Key = sha.ComputeHash(Encoding.UTF8.GetBytes(config["Secret"]!));
                    aes.Key = Encoding.UTF8.GetBytes(config["Secret:Key"]!);
                    aes.IV = new byte[16];
                    aes.Mode = CipherMode.ECB;
                    aes.Padding = PaddingMode.PKCS7;
                    using(var encrypter = aes.CreateEncryptor())
                    {
                        var encrypted = encrypter.TransformFinalBlock(plainText, 0, plainText.Length);
                        EncryptedText = encrypted;
                    }
                }
                return true;
            }
            catch
            {
                EncryptedText = new byte[0];
                return false;
            }
        }

        /// <summary>
        /// return decrypted jwt token 
        /// </summary>
        /// <param name="encryptedbytes"></param>
        /// <param name="decryptedText"></param>
        /// <param name="config"></param>
        /// <returns></returns>
        public static bool Decrypt(byte[] encryptedbytes, out byte[] decryptedText, IConfiguration config)
        {
            try
            {
                using (Aes aes = Aes.Create())
                {
                    //HashAlgorithm sha = SHA256.Create();
                    //aes.Key = sha.ComputeHash(Encoding.UTF8.GetBytes(config["Secret"]!));
                    aes.Key = Encoding.UTF8.GetBytes(config["Secret:Key"]!);
                    aes.IV = new byte[16];
                    aes.Mode = CipherMode.ECB;
                    aes.Padding = PaddingMode.PKCS7;
                    using (var decrypter = aes.CreateDecryptor())
                    {
                        var bytes = decrypter.TransformFinalBlock(encryptedbytes, 0, encryptedbytes.Length);
                        decryptedText = bytes;
                    }
                }
                return true;
            }
            catch
            {
                decryptedText = new byte[0];
                return false;
            }
        }
    }
}
