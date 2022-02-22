using WebApiSwagger.Model;

namespace WebApiSwagger.Datasource;

public interface IWorldCitiesSingleton 
{
    public ICollection<Cities> getCities();
}
