using System.ComponentModel.DataAnnotations;

namespace webApi.Models.Dtos
{
    public class UserSettings
    {
        [Required]
        public string Id { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string Role { get; set; }
    }
}
