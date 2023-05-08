using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using webApi.Data;
using webApi.Models.Dtos;
using webApi.Repository.IRepository;

namespace webApi.Repository
{
    public class AccountRepository : IAccountRepository
    {
        private readonly IConfiguration _configuration;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly IPersonRepository _iPersonRepo;
        public AccountRepository(IConfiguration configuration, UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, IPersonRepository iPersonRepo)
        {
            this._configuration = configuration;
            this._userManager = userManager;
            this._signInManager = signInManager;
            this._iPersonRepo = iPersonRepo;
        }


        //Verify User Credentials.
        public async Task<SignInResult> VerifyCredentials(AdminUserLoginDto Credential)
        {
            //Verify Credentials
            return await _signInManager.PasswordSignInAsync(Credential.Email, Credential.Password, Credential.RememberMe, false);

        }

        //Create new User for Administration.
        public async Task<IdentityResult> RegisterAdministrationUser(AdminUserRegistrationDto Credential)
        {
            //Validate Email Address (check that it do belong to an employee) and then check if it is unique
            //For unique it will be optional since you set this Configuration [options.User.RequireUniqueEmail = true;] in program.cs

            //Verify the Validation Code

            //Create the User
            var user = new IdentityUser
            {
                UserName = Credential.Email,
                Email = Credential.Email,
            };


            var identityResult = await _userManager.CreateAsync(user, Credential.Password);

            return identityResult;
        }

        //Generate Token
        public async Task<string> GenerateToken(string personType, string userEmail)
        {
            var userProfile = _iPersonRepo.GetPersonByEmail(personType, userEmail);
            var userAccount = await _userManager.FindByEmailAsync(userEmail);
            var roles = userEmail == Environment.GetEnvironmentVariable("SUPER_ADMIN_USERNAME") ? new List<string> { "superAdmin" } : await _userManager.GetRolesAsync(userAccount);
            var secretKey = Encoding.ASCII.GetBytes(_configuration.GetValue<string>("Jwt:Key"));

            //Start Creating the Security Context.
            IEnumerable<Claim> UserClaims = new List<Claim> {
                    new Claim("fullName", userProfile.FullName),
                    new Claim("email", userAccount.Email),
                    new Claim("role", roles[0]),
                    new Claim("accountId", userAccount.Id),
                    new Claim("profileId", userProfile.Id),
                };

            //Describe the Token. Define the information we want the Token to carry.
            var jwt = new JwtSecurityToken(
                claims: UserClaims,
                notBefore: DateTime.UtcNow,
                expires: DateTime.UtcNow.AddMinutes(StaticDetails.TokenLifeTimeMinutes),
                signingCredentials: new SigningCredentials(new SymmetricSecurityKey(secretKey), SecurityAlgorithms.HmacSha256Signature)
                );

            return new JwtSecurityTokenHandler().WriteToken(jwt);
        }

        public bool IsUniqueEmail(string email)
        {
            throw new NotImplementedException();
        }

        public bool IsUniqueUserName(string userName)
        {
            throw new NotImplementedException();
        }


        //Verify password is valid
        public string isValidePassword(string password)
        {
            string errorMessage = "";

            // At least one digit
            if (!password.Any(char.IsDigit))
            {
                errorMessage += "* Password must contain at least one digit.\n";
            }

            // At least one lowercase letter
            if (!password.Any(char.IsLower))
            {
                errorMessage += "* Password must contain at least one lowercase letter.\n";
            }

            // At least one uppercase letter
            if (!password.Any(char.IsUpper))
            {
                errorMessage += "* Password must contain at least one uppercase letter.\n";
            }

            // At least one special character
            if (!password.Any(ch => !char.IsLetterOrDigit(ch)))
            {
                errorMessage += "* Password must contain at least one special character.\n";
            }

            // Length between 9 and 40 characters
            if (password.Length < 9 || password.Length > 40)
            {
                errorMessage += "* Password length must be between 9 and 40 characters.\n";
            }

            // Return error message if any requirements are not met, otherwise return null
            return string.IsNullOrEmpty(errorMessage) ? null : errorMessage;
        }


        public async Task<string> GetUserRole(string email)
        {
            //Check if member has an account
            var userAccount = await _userManager.FindByEmailAsync(email);
            if (userAccount == null)
            {
                //return user is just a member
                return "member";
            }

            var userRoles = await _userManager.GetRolesAsync(userAccount);
            if (userRoles == null || userRoles.Count == 0)
            {
                //return user has no roles assigned
                return "member" ;
            }

            return userRoles[0];
        }

    }
}
