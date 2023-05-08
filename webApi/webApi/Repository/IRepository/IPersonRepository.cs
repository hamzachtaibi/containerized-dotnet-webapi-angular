using webApi.Models;

namespace webApi.Repository.IRepository
{
    public interface IPersonRepository
    {
        string GenerateUniqueId();
        string GenerateUniqueCin();
        string GenerateUniqueEmail();
        ICollection<PersonModel> GetAllPersons(string personType);
        PersonModel GetPersonById(string personType, string id);
        PersonModel GetPersonByCin(string personType, string cin);
        PersonModel GetPersonByEmail(string personType, string email);

        bool CheckPersonType(string personType);
        bool IsPersonExistByCin(string cin);
        bool IsPersonExistByEmail(string email);
        bool IsPersonExistById(string id);
        bool IsCinDoublicated(string cin, string id);
        bool IsEmailDoublicated(string cin, string id);
        bool IsEmailGenerated(string email);
        Task<bool> IsEmailBelongToPerson(string personType, string email);
        bool CreatePerson(PersonModel ObjToCreate);
        bool UpdatePerson(PersonModel ObjToUpdate);
        bool DeletePerson(PersonModel ObjToDelete);

        bool Save();
    }
}
