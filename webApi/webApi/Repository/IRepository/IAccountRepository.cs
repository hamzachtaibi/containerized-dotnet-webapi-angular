using Microsoft.AspNetCore.Identity;
using webApi.Models.Dtos;

namespace webApi.Repository.IRepository
{
    public interface IAccountRepository
    {
        Task<SignInResult> VerifyCredentials(AdminUserLoginDto Credential);
        bool IsUniqueUserName(string userName);
        bool IsUniqueEmail(string email);
        Task<IdentityResult> RegisterAdministrationUser(AdminUserRegistrationDto Credential);
        Task<string> GenerateToken(string personType, string userEmail);
        string isValidePassword(string errorMessage);
        Task<string> GetUserRole(string email);
    }
}
