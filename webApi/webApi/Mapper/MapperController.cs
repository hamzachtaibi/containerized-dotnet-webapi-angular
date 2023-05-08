using AutoMapper;

namespace webApi.Mapper
{
    public class MapperController<T1, T2>
    {
        public List<T1> ConvertToFromDto(List<T1> objDto, ICollection<T2> objList, IMapper _iMapper)
        {

            foreach (var obj in objList)
            {
                objDto.Add(_iMapper.Map<T1>(obj));
            }

            return objDto;
        }
    }
}
