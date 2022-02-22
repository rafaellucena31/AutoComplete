namespace WebApiSwagger.Model;

public class Cities
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Country { get; set; } = null!;

    public string Subcountry { get; set; } = null!;

    public string Geonameid { get; set; } = null!;
}
