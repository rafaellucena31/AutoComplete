using CsvHelper.Configuration;
using WebApiSwagger.Model;

namespace WebApiSwagger.Mappings;

public sealed class CitiesMapping : ClassMap<Cities>
{
    public CitiesMapping()
    {
        Map(m => m.Name).Name("name");
        Map(m => m.Country).Name("country");
        Map(m => m.Subcountry).Name("subcountry");
        Map(m => m.Geonameid).Name("geonameid");
    }
}
