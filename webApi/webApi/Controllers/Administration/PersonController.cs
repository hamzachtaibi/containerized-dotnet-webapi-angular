using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using webApi.Mapper;
using webApi.Models;
using webApi.Models.Dtos;
using webApi.Repository.IRepository;

namespace webApi.Controllers.Administration
{
    [Route("api/v{version:apiVersion}/person")]
    [ApiVersion("1.0")]
    [ApiController]

    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [Authorize]
    public class PersonController : ControllerBase
    {
        private readonly IPersonRepository _iPersonRepo;
        private readonly IAccountRepository _iAccountRepo;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IMapper _iMapper;

        public PersonController(IPersonRepository iPersonRepo, IAccountRepository iAccountRepo, UserManager<IdentityUser> userManager, IMapper iMapper)
        {
            this._iPersonRepo = iPersonRepo;
            this._iAccountRepo = iAccountRepo;
            this._userManager = userManager;
            this._iMapper = iMapper;
        }


        /// <summary>
        /// Get list of all profiles
        /// </summary>
        /// <param name="personType">this represent the type of the person: "employee", "needy", "cutomer"...</param>
        /// <returns></returns>
        [HttpGet("{personType}")]
        [ProducesResponseType(200, Type = typeof(List<NeedyDto>))]
        public IActionResult GetAllPersons(string personType)
        {
            string pT = personType.ToLower();
            //Verify person type is it "Employee" or "Needy"... etc
            if (!_iPersonRepo.CheckPersonType(pT)) return BadRequest(new { description = "Verify the person type is correct" });

            //Get the list from DataBase
            var objList = _iPersonRepo.GetAllPersons(pT);

            if (objList == null) return NotFound(new { description = "No records are available" });

            if (pT == "needy") // Prepare Needy List for return
            {
                MapperController<NeedyDto, PersonModel> mc = new();

                var objDto = mc.ConvertToFromDto(new List<NeedyDto>(), objList, _iMapper);

                return Ok(objDto);

            }

            if (pT == "employee") // Prepare Employee List for return
            {
                MapperController<EmployeeDto, PersonModel> mc = new();

                var objDto = mc.ConvertToFromDto(new List<EmployeeDto>(), objList, _iMapper);

                return Ok(objDto);
            }

            return NotFound(new { description = "No data are available" });


        }


        /// <summary>
        /// Get person information based on their [Cin] Code
        /// </summary>
        /// <param name="personType">this represent the type of the person: "employee", "needy", "cutomer"...</param>
        /// <param name="cin">Represent the given identity number by the government .</param>
        /// <returns></returns>

        [HttpGet("{personType}/cin/{cin}", Name = "GetPersonByCin")]
        [ProducesResponseType(200, Type = typeof(PersonDto))]
        [ProducesResponseType(404)] 
        [ProducesDefaultResponseType] 
        public async Task<IActionResult> GetPersonByCin(string personType, string cin)
        {
            string pT = personType.ToLower();
            //Verify person type is it "Employee" or "Needy"... etc
            if (!_iPersonRepo.CheckPersonType(pT)) return NotFound(new { description = "Please, verify the person type" });

            var obj = _iPersonRepo.GetPersonByCin(pT, cin);

            if (obj == null)
            {
                ModelState.AddModelError("ErrorWebnetart", "false");
                return NotFound(new { description = "The provided CIN number doesn't belong to a profile" });
            }

            if (pT == "needy") return Ok(_iMapper.Map<NeedyDto>(obj));

            if (pT == "employee")
            {
                var data = _iMapper.Map<EmployeeDto>(obj);
                var role = await _iAccountRepo.GetUserRole(data.Email!);
                data.Role = role;
                return Ok(data);
            }
            return NotFound(new { description = "No profile is associated to the provided CIN number" });

        }


        /// <summary>
        /// Get person information based on their ID
        /// </summary>
        /// <param name="personType">this represent the type of the person: "employee", "needy", "cutomer"...</param>
        /// <param name="id">Represent the Id number given by the system.</param>
        /// <returns></returns>

        [HttpGet("{personType}/id/{id}", Name = "GetPersonById")]
        [ProducesResponseType(200, Type = typeof(PersonDto))]
        [ProducesResponseType(404)] 
        [ProducesDefaultResponseType] 
        public async Task<IActionResult> GetPersonById(string personType, string id)
        {
            string pT = personType.ToLower();
            //Verify person type is it "Employee" or "Needy"... etc
            if (!_iPersonRepo.CheckPersonType(pT)) return BadRequest(new { description = "Vérifier le type de personne" });

            var obj = _iPersonRepo.GetPersonById(pT, id);
            if (obj == null)
            {
                return NotFound(new
                {
                    description = "Profil non trouvé"
                });
            }

            if (pT == "needy") return Ok(_iMapper.Map<NeedyDto>(obj));

            if (pT == "employee")
            {

                var data = _iMapper.Map<EmployeeDto>(obj);
                var role = await _iAccountRepo.GetUserRole(data.Email!);
                data.Role = role;
                return Ok(data);
            }


            return NotFound(new
            {
                description = "Profil non trouvé"
            });


        }



        /// <summary>
        /// Create/Add new profile to the list
        /// </summary>
        /// <param name="personType">this represent the type of the person: "employee", "needy", "cutomer"...</param>
        /// <param name="newObjDto"> Represent the inserted profile data.</param>
        /// <returns></returns>

        [HttpPost("{personType}")]
        [ProducesResponseType(201, Type = typeof(PersonDto))] 
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status404NotFound)] 
        [ProducesResponseType(StatusCodes.Status500InternalServerError)] 
        public IActionResult CreatePerson(string personType, [FromBody] PersonDto newObjDto)
        {
            //Verify the model [this is Server side Validation in case the user stopped the JavaScript or
            //sent data through a link.
            if (!ModelState.IsValid) return BadRequest(ModelState);

            string pT = personType.ToLower();

            //Verify person type is it "Employee" or "Needy"... etc
            if (!_iPersonRepo.CheckPersonType(pT))
            {
                return BadRequest(new { description = "person type not defined" });
            }
            //Set person Type.
            switch (pT)
            {
                case "needy":
                    newObjDto.IsNeedy = true;
                    break;
                case "employee":
                    newObjDto.IsEmployee = true;
                    break;
            }

            //check if model is not null
            if (newObjDto == null) return BadRequest(ModelState);

            //Verify the id is Unique
            if (string.IsNullOrWhiteSpace(newObjDto.Id))
            {
                //Generate a Random id
                newObjDto.Id = _iPersonRepo.GenerateUniqueId();
            }

            //Verify the CIN is Unique
            if (string.IsNullOrWhiteSpace(newObjDto.Cin))
            {
                //Generate a Random CIN
                newObjDto.Cin = _iPersonRepo.GenerateUniqueCin();
            }
            else
            {
                //if CIN is already given by the user, Check if there is a Double.
                if (_iPersonRepo.IsPersonExistByCin(newObjDto.Cin))
                {
                    return StatusCode(404, new { description = "Double CIN number" });
                }
            }


            //Verify the Email is Unique.
            if (string.IsNullOrWhiteSpace(newObjDto.Email))
            {
                //Generate a Random CIN
                newObjDto.Email = _iPersonRepo.GenerateUniqueEmail();
            }
            else
            {
                //if Email is already given by the user, Check if there is a Double.
                if (_iPersonRepo.IsPersonExistByEmail(newObjDto.Email))
                {
                    return StatusCode(404, new { description = "Double Email Address" });
                }
            }


            //Set the Registration Date & Update Date.
            newObjDto.RegistrationDate = DateTime.Now;
            newObjDto.ProfileUpdateTime = null;
            //Convert from Dto to main Model.
            var newObj = _iMapper.Map<PersonModel>(newObjDto);

            //Insert data
            if (!_iPersonRepo.CreatePerson(newObj))
            {
                return StatusCode(500, new { description = $"Something went wrong while saving the record {newObjDto.FullName}, Make sure the Form feild are correct" });
            }

            //if Everything goes right.
            //return Ok();
            // Or return the created object
            return CreatedAtRoute("GetPersonByCin", new { version = HttpContext.GetRequestedApiVersion().ToString(), personType = pT, cin = newObj.Cin }, newObjDto);

        }


        /// <summary>
        /// Update the information of a profile Based on the id
        /// </summary>
        /// <param name="personType">this represent the type of the person: "employee", "needy", "cutomer"...</param>
        /// <param name="id">Represent the Id number given by the system.</param>
        /// <param name="editedObjDto">The updated data</param>
        /// <returns></returns>

        [HttpPatch("{personType}/{id}", Name = "UpdatePerson")]
        [ProducesResponseType(StatusCodes.Status204NoContent)] 
        [ProducesResponseType(StatusCodes.Status404NotFound)] 
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult UpdatePerson(string personType, string id, [FromBody] PersonDto editedObjDto)
        {
            string pT = personType.ToLower();

            //Verify person type is it "Employee" or "Needy"... etc
            if (!_iPersonRepo.CheckPersonType(pT))
            {
                //ModelState.AddModelError("ErrorWebnetart", "Bad API route");
                return BadRequest(new { description = "Bad API route" });
            }

            if (editedObjDto == null || id != editedObjDto.Id)
            {
                //ModelState.AddModelError("ErrorWebnetart", "Null object or something wrong with the Id");
                return BadRequest(new { description = "Null object or something wrong with the Id" });
            }

            //CIN VERIFICATION ========
            // 1 - Generate a random one if the CIN is Null or Empty.
            if (string.IsNullOrWhiteSpace(editedObjDto.Cin))
            {
                //Generate a Random CIN
                editedObjDto.Cin = _iPersonRepo.GenerateUniqueCin();
            }

            // 2- Check if it is doublicated CIN. (if given by user)
            if (_iPersonRepo.IsCinDoublicated(editedObjDto.Cin, id))
            {
                //ModelState.AddModelError("ErrorWebnetart", "Double CIN number");

                return StatusCode(500, new { description = "Double CIN number" });
            }

            //EMAIL VERIFICATION ========
            // 1 - Generate a random Email if no email is been provided.
            if (string.IsNullOrWhiteSpace(editedObjDto.Email))
            {
                //Generate a Random Email
                editedObjDto.Email = _iPersonRepo.GenerateUniqueEmail();
            }
            // 2- Check if email is doublicated. (if given by user)
            if (_iPersonRepo.IsEmailDoublicated(editedObjDto.Email, id))
            {
                //ModelState.AddModelError("ErrorWebnetart", "Double Email Address");

                return StatusCode(500, new { description = "Double Email Address" });
            }

            //Model VERIFICATION ========
            if (!ModelState.IsValid) return BadRequest(ModelState);

            //Convert from Dto to main Model.
            var freshData = _iMapper.Map<PersonModel>(editedObjDto);

            //Before Update, Check if the records still exist in the DataBase
            if (!_iPersonRepo.IsPersonExistById(id))
            {
                //ModelState.AddModelError("ErrorWebnetart", "THE RECORDS YOU ARE TRYING TO UPDATE DOESN'T EXIST.");
                return StatusCode(404, new { description = "the record you are trying to update doesn't exist." });
            }

            //Set Update Time
            freshData.ProfileUpdateTime = DateTime.Now;
            // Try to Update data
            if (!_iPersonRepo.UpdatePerson(freshData))
            {
                //if condition returned False.
                //ModelState.AddModelError("ErrorWebnetart", $"Something went wrong while updating the record {editedObjDto.FullName}, Make sure the Form feilds are formatted correctly");
                return StatusCode(500, new { description = $"Something went wrong while updating the record {editedObjDto.FullName}, Make sure the Form feilds are formatted correctly" });
            }

            return NoContent();

        }


        /// <summary>
        /// Delete a record of a profile based on the Given Id.
        /// </summary>
        /// <param name="personType">this represent the type of the person: "employee", "needy", "cutomer"...</param>
        /// <param name="id">this is the id of the person in Database</param>
        /// <returns></returns>

        [HttpDelete("{personType}/{id}", Name = "DeletePerson")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeletePerson(string personType, string id)
        {
            string pT = personType.ToLower();
            //Verify person type is it "Employee" or "Needy"... etc
            if (!_iPersonRepo.CheckPersonType(pT)) return BadRequest(new { description = "Vérifier le type de personne" });

            //Before delete, Check if the records still exist in the DataBase
            if (!_iPersonRepo.IsPersonExistById(id))
            {
                //ModelState.AddModelError("ErrorWebnetart", "THE RECORDS YOU ARE TRYING TO DELETE DOESN'T EXIST ANYMORE");
                return StatusCode(404, new { description = "LES ENREGISTREMENTS QUE VOUS ESSAYEZ DE SUPPRIMER N'EXISTENT PLUS" });
            }
            else
            {
                var targetedObj = _iPersonRepo.GetPersonById(pT, id);

                if (targetedObj == null)
                {
                    //ModelState.AddModelError("ErrorWebnetart", $"MAKE SURE THERE IS A [{pT}] WITH THE ID NUMBER YOU PROVIDED");
                    return StatusCode(404, new { description = $"ASSUREZ-VOUS QU'IL Y A UN [{pT}] AVEC LE NUMÉRO D'IDENTIFICATION QUE VOUS AVEZ FOURNI" });
                }

                //Check there is no user account is associated to this profile
                var associatedAccount = await _userManager.FindByEmailAsync(targetedObj.Email);
                if (associatedAccount != null)
                {
                    return Unauthorized(new { description = "Ce profil est associé à un compte actif. Pour supprimer ce profil, vous devez d'abord supprimer le compte associé." });
                }

                if (!_iPersonRepo.DeletePerson(targetedObj))
                {
                    //if condition returned true means delete operation Failed.
                    //ModelState.AddModelError("ErrorWebnetart", $"Something went wrong while Deleting the record {targetedObj.FullName}.");
                    return StatusCode(500, new { description = $"Une erreur s'est produite lors de la suppression de l'enregistrement {targetedObj.FullName}." });
                }

                //if Delete Succefully
                return NoContent();
            }


        }


    }
}
