using System.Security.Cryptography;
using System.Text;

namespace HackGame.Api
{
    public static class PasswordHasher
    {
        public static string HashPassword(string password)
        {
            HashAlgorithm sha = SHA256.Create();
            byte[] hashedPassword = sha.ComputeHash(Encoding.UTF8.GetBytes(password));
            StringBuilder builder = new StringBuilder();
            for (int i = 0; i < hashedPassword.Length; i++)
            {
                builder.Append(hashedPassword[i]);
            }
            return builder.ToString();
        }

        public static string RandomPassword(int length)
        {
            string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var random = new Random();
            string password = new string(Enumerable.Repeat(chars, length)
              .Select(s => s[random.Next(s.Length)]).ToArray());
            return password;
        }
    }
}
