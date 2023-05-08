using webApi.Data;
using webApi.Models;
using webApi.Repository.IRepository;

namespace webApi.Repository
{
    public class PersonRepository : IPersonRepository
    {
        private readonly AppDbContext _dbContext;

        public PersonRepository(AppDbContext dbContext)
        {
            this._dbContext = dbContext;
        }


        public ICollection<PersonModel> GetAllPersons(string personType)
        {
            ICollection<PersonModel> persons = new List<PersonModel>();

            switch (personType)
            {
                case "needy":
                    persons = _dbContext.Persons.Where(p => p.IsNeedy == true).ToList();

                    foreach (var p in persons)
                    {
                        if (IsEmailGenerated(p.Email)) p.Email = null;
                    }

                    return persons;
                case "employee":
                    persons = _dbContext.Persons.Where(p => p.IsEmployee == true).ToList();

                    foreach (var p in persons)
                    {
                        if (IsEmailGenerated(p.Email)) p.Email = null;
                    }

                    return persons;
                default:
                    return null;
            }
        }

        public PersonModel GetPersonById(string personType, string id)
        {
            PersonModel p;

            switch (personType)
            {
                case "needy":
                    p = _dbContext.Persons.FirstOrDefault(p => p.Id.ToLower().Trim() == id.ToLower().Trim() && p.IsNeedy == true);

                    if (p != null && p.Email != null)
                    {
                        if (IsEmailGenerated(p.Email)) p.Email = null;
                    }

                    return p;
                case "employee":
                    p = _dbContext.Persons.FirstOrDefault(p => p.Id.ToLower().Trim() == id.ToLower().Trim() && p.IsEmployee == true);

                    if (p != null && p.Email != null)
                    {
                        if (IsEmailGenerated(p.Email)) p.Email = null;
                    }

                    return p;
                default:
                    return null;
            }

        }

        public PersonModel GetPersonByCin(string personType, string cin)
        {
            PersonModel p;

            switch (personType)
            {
                case "needy":
                    p = _dbContext.Persons.Where(p => p.Cin.ToLower().Trim() == cin.ToLower().Trim() && p.IsNeedy == true).FirstOrDefault();

                    if (p != null && p.Email != null)
                    {
                        if (IsEmailGenerated(p.Email)) p.Email = null;
                    }

                    return p;
                case "employee":
                    p = _dbContext.Persons.Where(p => p.Cin.ToLower().Trim() == cin.ToLower().Trim() && p.IsEmployee == true).FirstOrDefault();

                    if (p != null && p.Email != null)
                    {
                        if (IsEmailGenerated(p.Email)) p.Email = null;
                    }
                    return p;
                default:
                    return null;
            }
        }

        public PersonModel GetPersonByEmail(string personType, string email)
        {
            PersonModel p;

            switch (personType)
            {
                case "needy":
                    p = _dbContext.Persons.Where(p => p.Email.ToLower().Trim() == email.ToLower().Trim() && p.IsNeedy == true).FirstOrDefault();

                    if (p != null && p.Email != null)
                    {
                        if (IsEmailGenerated(p.Email)) p.Email = null;
                    }

                    return p;
                case "employee":
                    p = _dbContext.Persons.Where(p => p.Email.ToLower().Trim() == email.ToLower().Trim() && p.IsEmployee == true).FirstOrDefault();

                    if (p != null && p.Email != null)
                    {
                        if (IsEmailGenerated(p.Email)) p.Email = null;
                    }

                    return p;
                default:
                    return null;
            }
        }

        public bool DeletePerson(PersonModel targetedObj)
        {
            _dbContext.Persons.Remove(targetedObj);
            return Save();
        }

        public bool UpdatePerson(PersonModel targetedObj)
        {
            _dbContext.Persons.Update(targetedObj);
            return Save();
        }

        public bool Save()
        {
            return _dbContext.SaveChanges() >= 0 ? true : false;
        }

        public bool CheckPersonType(string personType)
        {
            var personTypeList = new List<string>() { "needy", "employee"};

            if (personTypeList.Contains(personType)) return true;

            return false;
        }

        public bool IsPersonExistByCin(string cin)
        {
            return _dbContext.Persons.Any(p => p.Cin.ToLower().Trim() == cin.ToLower().Trim());
        }

        public bool IsPersonExistByEmail(string email)
        {
            return _dbContext.Persons.Any(p => p.Email.ToLower().Trim() == email.ToLower().Trim());
        }

        public async Task<bool> IsEmailBelongToPerson(string personType, string email)
        {
            switch (personType)
            {
                case "needy":
                    return _dbContext.Persons.Any(p => p.Email.ToLower().Trim() == email.ToLower().Trim() && p.IsNeedy == true);

                case "employee":
                    return _dbContext.Persons.Any(p => p.Email.ToLower().Trim() == email.ToLower().Trim() && p.IsEmployee == true);

                default:
                    return false;
            }
        }
       
        public bool IsPersonExistById(string id)
        {
            return _dbContext.Persons.Any(p => p.Id.ToLower().Trim() == id.ToLower().Trim());
        }

        public bool CreatePerson(PersonModel newObj)
        {
            _dbContext.Persons.Add(newObj);
            return Save();
        }

        //To check if there is another user carry the Same Cin while Updating.
        public bool IsCinDoublicated(string cin, string id)
        {
            return _dbContext.Persons.Any(p => p.Cin.ToLower().Trim() == cin.ToLower().Trim() && p.Id.ToLower().Trim() != id.ToLower().Trim());
        }

        //To check if there is another user carry the Same Email while Updating.
        public bool IsEmailDoublicated(string email, string id)
        {
            return _dbContext.Persons.Any(p => p.Email.ToLower().Trim() == email.ToLower().Trim() && p.Id.ToLower().Trim() != id.ToLower().Trim());
        }

        public bool IsEmailGenerated(string email)
        {
            if (email.Contains("no_email")) return true;

            return false;
        }

        public string GenerateUniqueCin()
        {
            //Generate a Random CIN
            var newCin = Guid.NewGuid().ToString("N").Substring(0, 15);
            //Check if Exist
            while (IsPersonExistByCin(newCin))
            {
                newCin = Guid.NewGuid().ToString("N").Substring(0, 15);
            }

            return newCin;
        }
        public string GenerateUniqueId()
        {
            //Generate a Random id
            var newid = Guid.NewGuid().ToString().Replace("-", "_");// Guid.NewGuid().ToString("N").Substring(0, 15);
            //Check if Exist
            while (IsPersonExistById(newid))
            {
                newid = Guid.NewGuid().ToString();
            }

            return newid;
        }
        public string GenerateUniqueEmail()
        {
            //Generate a Random CIN
            var temporaryEmail = "no_email" + Guid.NewGuid().ToString("N").Substring(0, 10) + "@example.com";
            //Check if Exist
            while (IsPersonExistByEmail(temporaryEmail))
            {
                temporaryEmail = "no_email" + Guid.NewGuid().ToString("N").Substring(0, 10) + "@example.com";
            }

            return temporaryEmail;
        }
    }
}
