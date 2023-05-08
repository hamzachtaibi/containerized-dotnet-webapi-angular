using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using webApi.Data;
using webApi.Models;
using webApi.Models.Dtos;
using webApi.Repository.IRepository;

namespace webApi.Controllers.Account
{

    [Route("api/v{version:apiVersion}/Account")]
    [ApiVersion("1.0")]
    [ApiController]
    public class AccountController : ControllerBase
    {

        private readonly IAccountRepository _IAccountRepository;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IPersonRepository _IPersonRepository;
        private readonly IMapper _iMapper;

        public AccountController(IAccountRepository iAccountRepository, SignInManager<IdentityUser> signInManager, UserManager<IdentityUser> userManager, IPersonRepository iPersonRepository, IMapper iMapper)
        {
            _IAccountRepository = iAccountRepository;
            this._signInManager = signInManager;
            this._userManager = userManager;
            this._IPersonRepository = iPersonRepository;
            this._iMapper = iMapper;
        }


        /// <summary>
        /// Check if the email is taken by someone.
        /// </summary>
        /// <param name="EmailAddress">email address</param>
        /// <returns></returns>
        [HttpPost("VerifyUser/{EmailAddress}")]
        public async Task<IActionResult> VerifyUser(string EmailAddress)
        {
            if (string.IsNullOrWhiteSpace(EmailAddress)) return BadRequest(ModelState);

            //Check if user Exist
            var user = await _userManager.FindByEmailAsync(EmailAddress);

            if (user == null)//Means the Email provided doesn't belong to a user.
            {
                return NotFound(new { userExist = false });
            }

            return Ok(new { userExist = true });
        }


        /// <summary>
        /// Register a new account.
        /// </summary>
        /// <returns></returns>
        [HttpPost("Registration")]
        public async Task<IActionResult> Registration([FromBody] AdminUserRegistrationDto Credential)
        {
            if (!ModelState.IsValid) return BadRequest(new { description = "le formulaire n'est pas valide" });
             
            //check password is valid
            if (_IAccountRepository.isValidePassword(Credential.Password) != null)
            {
                return BadRequest(new { description = _IAccountRepository.isValidePassword(Credential.Password) });
            }

            //check if CIN number is associated with the provided Email address

            var obj = _IPersonRepository.GetPersonByCin("employee", Credential.ValidationCode);

            if (obj == null || obj.Email != Credential.Email)
            {
                return Unauthorized(new { description = "Adresse e-mail ou votre identité incorrect" });
            }

            //Should be an employee and Active to be able to register.

            if (!obj.IsEmployee)
            {
                return Unauthorized(new { description = "Désolé en tant que membre vous ne pouvez pas créer de compte. contactez votre administration." });
            }

            if (!obj.IsActive)
            {
                return Unauthorized(new { description = "Désolé, vous ne pouvez pas vous inscrire. contactez votre administration." });
            }

            //Create the User
            var result = await _IAccountRepository.RegisterAdministrationUser(Credential);

            //is fine
            if (result.Succeeded)
            {
                //add role to user
                var grantRole = await SetUserRole("webnetart@admin.com", new UserSettings { Id = "notNeeded", Email = Credential.Email, Role = "editor" });

                // Check the returned IActionResult
                if (grantRole is OkObjectResult okResult)
                {
                    return Ok(new { description = "Compte créé avec succès" });
                }
                else
                {
                    return BadRequest(new {description = "Création de compte annulée ! Problème : impossible de vous attribuer un rôle spécifique." });
                }
            }
            return BadRequest(new {description = "L'enregistrement du compte a échoué."});

        }


        /// <summary>
        /// Let user authenticate and get a Token.
        /// </summary>
        /// <returns></returns>
        [HttpPost("Authenticate")]
        public async Task<IActionResult> Authenticate([FromBody] AdminUserLoginDto Credential)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            //Check if Email/UserName belong to a user.
            var user = await _userManager.FindByEmailAsync(Credential.Email);
            if (user == null) return Unauthorized(new
            {
                access_token = false,
                expires_at = DateTime.UtcNow,
                description = "Email ou mot de passe incorrect"
            });

            //Check if User Profile is Active
            var userProfile = _IPersonRepository.GetPersonByEmail("employee", Credential.Email);
            if (!userProfile.IsActive) return Unauthorized(new
            {
                access_token = false,
                expires_at = DateTime.UtcNow,
                description = "Vous ne pouvez pas accéder à votre compte, Veuillez contacter votre administrateur"
            });

            //Try to SigIn User
            var result = await _signInManager.PasswordSignInAsync(Credential.Email, Credential.Password, Credential.RememberMe, false);

            if (result.Succeeded)
            {
                //Return Token
                return Ok(new
                {
                    access_token = await _IAccountRepository.GenerateToken("employee", Credential.Email),
                    //expires_at = DateTime.UtcNow.AddMinutes(StaticDetails.TokenLifeTimeMinutes),
                    description = "Authentication succeed"
                });

            }
            else
            {
                //Access not allowed
                if (result.IsLockedOut)
                {
                    return Unauthorized(new
                    {
                        access_token = false,
                        expires_at = DateTime.UtcNow,
                        description = "You are locked out"
                    });
                }
                else
                {
                    return Unauthorized(new
                    {
                        access_token = false,
                        expires_at = DateTime.UtcNow,
                        description = "Email ou mot de passe incorrect"
                    });
                }
            }

        }


        /// <summary>
        /// Possibility to regenerate Token when need, available for authenticated users.
        /// </summary>
        /// <param name="EmailAddress">email address</param>
        /// <returns></returns>
        [Authorize]
        [HttpPost("RegenerateToken/{emailAddress}")]
        public async Task<IActionResult> RegenerateToken(string emailAddress)
        {
            //Invoke the previous generated Token from Headers
            var jwt = new JwtSecurityToken();
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

            if (string.IsNullOrWhiteSpace(token)) return Unauthorized(new
            {
                access_token = false,
                expires_at = DateTime.UtcNow,
                description = "Unauthorized"
            });

            jwt = new JwtSecurityToken(token);

            //Invoke Email/UserName from Claims

            var tokenClaims = jwt.Claims; //HttpContext.User.Claims;
            var claimEmail = tokenClaims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

            if (string.IsNullOrWhiteSpace(claimEmail) || claimEmail != emailAddress) return Unauthorized(new
            {
                access_token = false,
                expires_at = DateTime.UtcNow,
                description = "Unauthorized"
            });

            //Check if the email belong to a user.
            var user = await _userManager.FindByEmailAsync(claimEmail);

            if (user == null) return Unauthorized(new
            {
                access_token = false,
                expires_at = DateTime.UtcNow,
                description = "Unauthorized"
            });


            //Return Token
            return Ok(new
            {
                access_token = await _IAccountRepository.GenerateToken("employee", emailAddress),
                expires_at = DateTime.UtcNow.AddMinutes(StaticDetails.TokenLifeTimeMinutes),
                description = "Authentication succeed"
            });



        }


        /// <summary>
        /// call this Endpoint to change the password.
        /// </summary>
        /// <param name="EmailAddress">email address</param>
        /// <returns></returns>
        [Authorize]
        [HttpPost("ChangePassword")]
        public async Task<IActionResult> ChangePassword([FromBody] NewPasswordDto request)
        {
            var userAccount = await _userManager.FindByEmailAsync(request.Email);
            var result = await _userManager.ChangePasswordAsync(userAccount, request.OldPassword, request.NewPassword);

            if (result.Succeeded)
            {
                return Ok(new { description = "Le mot de passe a été changé avec succès." });
            }
            return BadRequest(new { description = "le changement de mot de passe a échoué, réessayez plus tard." });
        }


        /// <summary>
        /// Change a role for a user like from Admin to Editor, or from Editor to Admin...
        /// </summary>
        /// <param name="activeUserEmail">this represent the email of the logged in user</param>
        /// <returns></returns>
        [Authorize]
        [HttpPost("setRole/{activeUserEmail}", Name = "SetUserRole")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> SetUserRole(string activeUserEmail, [FromBody] UserSettings settings)
        {
            //Check if the change is requested by a superAdmin or an admin to change the role
            List<string> allowedUsers = new List<string>() { "superAdmin", "admin"};
            var activeUserRole = await _IAccountRepository.GetUserRole(activeUserEmail);
            if (!allowedUsers.Contains(activeUserRole))
            {
                return Unauthorized(new { description = "Désolé, vous ne pouvez pas modifier les paramètres des autres membres" });
            }

            //before giving a roll check if the new role is superAdmin
            if(settings.Role == "superAdmin")
            {
                //if there is already a superAdmin, prevent the changes.
                var superAdmins = await _userManager.GetUsersInRoleAsync("superAdmin");

                if (superAdmins != null && superAdmins.Any())
                {
                    return Unauthorized(new { description = "il existe déjà un utilisateur avec le rôle superAdmin.\nUn seul super administrateur est autorisé" });
                }
            }


            //Check if member is just a member or has an account
            var oldRole = await _IAccountRepository.GetUserRole(settings.Email);
            var userAccount = await _userManager.FindByEmailAsync(settings.Email);

            if (userAccount == null)
            {
                return Unauthorized(new { description = "Aucun compte n'est associé à ce membre." });
            }


            //if the old role is "admin", make sure only supperAdmin can change their role
            if (oldRole.Any() && oldRole == "admin" && activeUserRole != "superAdmin")
            {
                return Unauthorized(new { description = "Seul le super-administrateur peut modifier le rôle d'un administrateur" });
            }

            //if the old role is superAdmin prevent updating it.
            if (oldRole.Any() && oldRole == "superAdmin")
            {
                return Unauthorized(new { description = "vous ne pouvez pas modifier le rôle d'un superadministrateur" });
            }
            //check if a role is given before to this member.
            if (userAccount != null)
            {
                //remove old role.
                if(oldRole.Count() > 0 && oldRole != "member")
                {
                    var removeRole = await _userManager.RemoveFromRoleAsync(userAccount, oldRole);

                    if (!removeRole.Succeeded)
                    {
                        return BadRequest(removeRole.Errors);
                    }
                }

                //set the new role.
                var setNewRole = await _userManager.AddToRoleAsync(userAccount, settings.Role);

                if (!setNewRole.Succeeded)
                {
                    return BadRequest(setNewRole.Errors);
                }

                return Ok(new { description = "Le rôle a été changé avec succès" });
            }

            return BadRequest(new { description = "Quelque chose ne va pas," });
            
        }


        /// <summary>
        /// Change a role for a user like from Admin to Editor, or from Editor to Admin...
        /// </summary>
        /// <param name="secretKey">this represent the Key associate to the superAdmin to activate the account.</param>
        /// <param name="email">this represent the email address what will be used to activate the superAdmin account.</param>
        /// <param name="password">the chosen password</param>
        /// <returns></returns>
        [HttpPost("superAdmin/{secretKey}/{email}/{password}")]
        public async Task<IActionResult> ActivateSuperAdmin(string secretKey, string email, string password)
        {
            var key_Env = Environment.GetEnvironmentVariable("SUPER_ADMIN_KEY");
            var userName_Env = Environment.GetEnvironmentVariable("SUPER_ADMIN_USERNAME");

            if (key_Env != secretKey || userName_Env != email)
            {
                return Unauthorized(new { description = "Vérifier vos informations d'identification" });  
            }

            //check if there is already a superAdmin.
            var superAdmins = await _userManager.GetUsersInRoleAsync("superAdmin");

            if (superAdmins != null && superAdmins.Any())
            {
                return Unauthorized(new { description = "il existe déjà un utilisateur avec le rôle superAdmin.\nUn seul super administrateur est autorisé" });
            }

            //Create superAdmin profile.
            var superAdminAsProfile = new PersonDto { FullName = userName_Env, Cin=key_Env, Email=userName_Env, IsActive=true, IsEmployee=true };
            //Convert from Dto to main Model.
            var obj = _iMapper.Map<PersonModel>(superAdminAsProfile);
            if (!_IPersonRepository.CreatePerson(obj))
            {
                return StatusCode(500, new { description = "Something goes wront while creating superAdmin Profile." });
            }

            //Create superAdmin as a user
            var userSuperAdmin = new IdentityUser
            {
                UserName = email,
                Email = email,
            };


            var createSuperAdmin = await _userManager.CreateAsync(userSuperAdmin, password);

            if (createSuperAdmin.Succeeded)
            {
                //grant superAdmin to the activated user.
                var userAccount = await _userManager.FindByEmailAsync(email);
                createSuperAdmin = await _userManager.AddToRoleAsync(userAccount, "superAdmin");

                if (!createSuperAdmin.Succeeded)
                {
                    await _userManager.DeleteAsync(userAccount);
                    return BadRequest(new {description = "échec de l'attribution du rôle superAdmin" });
                }

                return Ok(new { description = "Compte superadmin activé avec succès" });
            }

            //return errors
            return BadRequest(createSuperAdmin.Errors);

        }


        /// <summary>
        /// check if there is already a user with the role of SuperAdmin...
        /// </summary>
        /// <returns></returns>
        [HttpGet("superAdminExist")]
        public async Task<IActionResult> SuperAdminExist()
        {
            //check if there is already a superAdmin.
            var superAdmins = await _userManager.GetUsersInRoleAsync("superAdmin");

            if (superAdmins != null && superAdmins.Any())
            {
                return Unauthorized(new { isExist = true });
            }

            return Ok(new { isExist = false });

        }



        /// <summary>
        /// Delete a user account.
        /// </summary>
        /// <param name="userProfileId">Is the id of the account we want to delete.</param>
        /// <param name="accountRole">Is the role of the account we want to delete.</param>
        /// <param name="activeUserRole">Is the role of logged in user.</param>
        /// <returns></returns>
        [Authorize]
        [HttpDelete("DeleteUserAccount/{userProfileId}/{accountRole}/{activeUserRole}", Name = "DeleteUserAccount")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteUserAccount(string userProfileId, string accountRole, string activeUserRole)
        {
            //if account to delete is a superAdmin ==> reject request.
            if(accountRole == "superAdmin")
            {
                return Unauthorized(new {description = "vous ne pouvez pas supprimer un compte avec le rôle superAdmin" });
            }
            //make sure only superAdmin can delete admins account.
            if(accountRole == "admin" && activeUserRole != "superAdmin")
            {
                return Unauthorized(new { description = "Seuls les super-administrateurs peuvent supprimer le compte des administrateurs." });
            }

            //make sure the account is not active
            var userProfile = _IPersonRepository.GetPersonById("employee", userProfileId);
            if (userProfile.IsActive)
            {
                return Unauthorized(new { description = "Vous ne pouvez pas supprimer un compte actif, assurez-vous que le compte est inactif pour le supprimer." });
            }

            //Get user account to delete.
            var userToDelete = await _userManager.FindByEmailAsync(userProfile.Email);
            if (userToDelete == null)
            {
                return NotFound(new { description = "Le compte que vous souhaitez supprimer n'existe plus." });
            }

            //first try delete the associated role.
            var roles = await _userManager.GetRolesAsync(userToDelete);
            if (roles.Count > 0)
            {
                var deleteRole = await _userManager.RemoveFromRolesAsync(userToDelete, roles);
                if (!deleteRole.Succeeded)
                {
                    return BadRequest("Opération abandonnée, la suppression du rôle a échoué.");
                }
            }

            //then try delete user account
            var deleteUser = await _userManager.DeleteAsync(userToDelete);
            if (deleteUser.Succeeded)
            {
                return Ok(new {description = "Le compte a été supprimé avec succès" });
            }

            return BadRequest(new { description = "la suppression a échoué" });


        }



    }
}
