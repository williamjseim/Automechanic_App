# Encryption

#### Static encrypter class

##### Decryption
to decrypt jwt tokens remove "bearer" and excess \\" from string, then convert from base64 to bytes and give to encrypter class if successful it will return true and give decrypted bytes which can then be converted to string and then to jwt token which can be read and verified

##### Encryption
to encrypt just give the encrypter a string and it will return encrypted bytes which can then be turned to base64 and given to the client
```cs
encryptedBase64 = encryptedBase64.Replace("Bearer ", string.Empty);
encryptedBase64 = encryptedBase64.Replace("\"", string.Empty);
if(Encrypter.Decrypt(Convert.FromBase64String(encryptedBase64), out byte[] cipher, config))
{
    string token = Encoding.UTF8.GetString(cipher);
    JwtSecurityTokenHandler handler = new JwtSecurityTokenHandler();
    var readToken = handler.ReadJwtToken(token);
    if(Guid.TryParse(readToken.Claims.First(i=>i.Type == JwtRegisteredClaimNames.Jti).Value, out Guid id))
    {
        return id;
    }
}
return Guid.Empty;
```

```cs
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
```