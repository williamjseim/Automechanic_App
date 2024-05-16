using System.Security.Cryptography;
using System.Text;

namespace Mechanic.Api
{
    public static class Encrypter
    {
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

        public static bool Decrypt(byte[] encryptedText, out byte[] decryptedText, IConfiguration config)
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
                        var bytes = decrypter.TransformFinalBlock(encryptedText, 0, encryptedText.Length);
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
