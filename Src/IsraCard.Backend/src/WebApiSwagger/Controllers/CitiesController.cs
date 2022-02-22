using Microsoft.AspNetCore.Mvc;
using WebApiSwagger.Datasource;
using WebApiSwagger.Model;
using System.Linq;

namespace WebApiSwagger.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class CitiesController : ControllerBase
{
    private readonly ILogger<CitiesController> _logger;
    private readonly IWorldCitiesSingleton _worldCitiesSingleton;
    
    public CitiesController(ILogger<CitiesController> logger, IWorldCitiesSingleton worldCitiesSingleton)
    {
        _logger = logger;
        _worldCitiesSingleton = worldCitiesSingleton;
    }

    [HttpGet("autocomplete/{prefix}")]
    [Produces(typeof(IEnumerable<Cities>))]
    public IEnumerable<Cities> Get(string prefix)
    {
        if (!string.IsNullOrEmpty(prefix))
        {
            return _worldCitiesSingleton.getCities()
                .Where(y => y.Name.ToLower().StartsWith(prefix.ToLower()))
                .ToList();
        }
        else
        {
            return new List<Cities>();
        }
        
    }
}
