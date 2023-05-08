using AutoMapper;
using webApi.Models;
using webApi.Models.Dtos;

namespace webApi.Mapper
{
    public class MappingsModelDto : Profile
    {
        public MappingsModelDto()
        {
            CreateMap<PersonModel, PersonDto>().ReverseMap();
            CreateMap<PersonModel, NeedyDto>().ReverseMap();
            CreateMap<PersonModel, EmployeeDto>().ReverseMap();
            CreateMap<AdminUserRegistration, AdminUserRegistration>().ReverseMap();
        }
    }
}
