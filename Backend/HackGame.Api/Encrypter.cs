using System.Security.Cryptography;
using System.Text;

namespace HackGame.Api
{
    public static class Encrypter
    {
        public static bool Encrypt(string jsonString, out byte[] EncryptedText, IConfiguration config)
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

        public static bool Decrypt(byte[] encryptedText, out byte[] decryptedText, IConfiguration config)
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
                    var bytes = decrypter.TransformFinalBlock(encryptedText, 0, encryptedText.Length);
                    decryptedText = bytes;
                }
            }
            return true;
        }
    }
}
