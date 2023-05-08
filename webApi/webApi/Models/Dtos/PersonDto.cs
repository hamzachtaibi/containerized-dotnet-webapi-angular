using System.ComponentModel.DataAnnotations;

namespace webApi.Models.Dtos
{
    public class PersonDto
    {
        public string Id { get; set; } = Guid.NewGuid().ToString().Replace("-", "_");
        public string? Cin { get; set; } = Guid.NewGuid().ToString("N").Replace("-", "_").Substring(0, 15);
        [Required]
        public string? FullName { get; set; }
        public DateTime? BirthDate { get; set; }
        public DateTime? DeathDate { get; set; }
        public char? Gender { get; set; }
        public string? BirthPlace { get; set; }
        public string? AcademicLevel { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? PhoneNumberEmergency { get; set; }
        public string? MaritalStatus { get; set; }
        public string? Profession { get; set; }
        public string? Address { get; set; }
        public string? Country { get; set; }
        public string? City { get; set; }
        public string? PostalCode { get; set; }
        public string? GPS { get; set; }
        public string? DreamOf { get; set; }
        public string? FamilyRecordNumber { get; set; }
        public string? FatherId { get; set; }
        public string? MotherId { get; set; }
        public string? GrandFatherId { get; set; }
        public string? GrandMotherId { get; set; }
        public string? MariedToId { get; set; }
        public string? ImageProfile { get; set; }
        public string? ImageBlurry { get; set; }
        public string? Note { get; set; }
        public string? FullNameArabic { get; set; }
        public string? BirthPlaceArabic { get; set; }
        public string? AcademicLevelArabic { get; set; }
        public string? AddressArabic { get; set; }
        public string? CountryArabic { get; set; }
        public string? CityArabic { get; set; }
        public string? ProfessionArabic { get; set; }
        public string? FamilyRecordNumberArabic { get; set; }
        public string? DreamOfArabic { get; set; }
        public DateTime? RegistrationDate { get; set; }
        public DateTime? ProfileUpdateTime { get; set; }
        public string? NoteArabic { get; set; }
        public string? FacebookAccount { get; set; }
        public string? TweeterAccount { get; set; }
        public string? InstagramAccount { get; set; }
        public string? LinkedInAccount { get; set; }
        public bool IsNeedy { get; set; }
        public bool IsEmployee { get; set; }
        public bool IsCustomer { get; set; }
        public bool IsCompany { get; set; }
        public bool IsDeath { get; set; }
        public bool IsResponsable { get; set; }
        public bool IsActive { get; set; }
    }
}
