using CsvHelper;
using WebApiSwagger.Mappings;
using WebApiSwagger.Model;

namespace WebApiSwagger.Datasource;

public class WorldCitiesSingleton : IWorldCitiesSingleton
{
    private readonly object firstFileReadLock = new object();
    private readonly ICollection<Cities> cities = new List<Cities>();
    private volatile bool fileReaded = false;

    public ICollection<Cities> getCities() {
        if (!fileReaded) {
            MapCitiesToList();
        }
        return cities;
    }

    private void MapCitiesToList()
    {
        lock(firstFileReadLock) {
            if (!fileReaded){
                cities.Clear();
                fileReaded = true;
                string? currentDirectory = AppDomain.CurrentDomain.BaseDirectory;
                currentDirectory = Path.Join(currentDirectory, "Datasource");
                Console.WriteLine(currentDirectory);
                using (TextReader fileReader = File.OpenText(Path.Join(currentDirectory, @"world-cities_csv.csv")))
                using (var csv = new CsvReader(fileReader, System.Globalization.CultureInfo.InvariantCulture))
                {
                    csv.Context.RegisterClassMap<CitiesMapping>();
                    var citiesMapped = csv.GetRecords<Cities>().ToList();
                    citiesMapped.ForEach(x => {x.Id = citiesMapped.IndexOf(x)+1; cities.Add(x);});
                }
            }
        }
    }
}