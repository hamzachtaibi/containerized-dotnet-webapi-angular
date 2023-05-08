using System.ComponentModel.DataAnnotations;

namespace webApi.Models.Dtos
{
    public class AdminUserRegistrationDto
    {
        [Required]
        [EmailAddress(ErrorMessage = "Invalid Email address.")]
        [Display(Name = "Email")]
        public string Email { get; set; }

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [Required]
        [DataType(DataType.Text)]
        [Display(Name = "code de validation")]
        public string ValidationCode { get; set; }
    }
}
