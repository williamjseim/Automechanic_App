using Newtonsoft.Json;

namespace Mechanic.Api.Models
{
    public class RefreshToken
    {
        public RefreshToken(Guid clientId, string clientSecret)
        {
            this.ClientId = clientId;
            this.ClientSecret = clientSecret;
            ExpireTimeUtc = DateTime.UtcNow.AddDays(1);
        }
        public Guid ClientId { get; set; }
        public string ClientSecret { get; set; }
        public DateTime ExpireTimeUtc { get; set; }

        public string WriteToken()
        {
            return JsonConvert.SerializeObject(this);
        }

        public static RefreshToken RecreateToken(string token)
        {
            return JsonConvert.DeserializeObject<RefreshToken>(token);   
        }
    }
}
