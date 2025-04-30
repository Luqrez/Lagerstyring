using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OptionsController : ControllerBase
    {
        private readonly Supabase.Client _supabase;

        public OptionsController(Supabase.Client supabase)
        {
            _supabase = supabase;
        }


        [HttpGet]
        public async Task<ActionResult<OptionsDTO>> GetOptions()
        {
            try
            {
                Console.WriteLine("Fetching Kategori data");
                var kategoriResult = await _supabase.From<Kategori>().Get();
                Console.WriteLine($"Fetched {kategoriResult.Models.Count} Kategori records");

                Console.WriteLine("Fetching Lokation data");
                var lokationResult = await _supabase.From<Lokation>().Get();
                Console.WriteLine($"Fetched {lokationResult.Models.Count} Lokation records");

                Console.WriteLine("Fetching Enhed data");
                var enhedResult = await _supabase.From<Enhed>().Get();
                Console.WriteLine($"Fetched {enhedResult.Models.Count} Enhed records");

                var kategorier = kategoriResult.Models
                    .Select(k => k.Navn)
                    .Where(n => !string.IsNullOrWhiteSpace(n))
                    .Distinct()
                    .ToList();

                var lokationer = lokationResult.Models
                    .Select(l => l.Navn)
                    .Where(n => !string.IsNullOrWhiteSpace(n))
                    .Distinct()
                    .ToList();

                var enheder = enhedResult.Models
                    .Select(e => e.Value)
                    .Where(n => !string.IsNullOrWhiteSpace(n))
                    .Distinct()
                    .ToList();

                var dto = new OptionsDTO
                {
                    Enheder = enheder,
                    Lokationer = lokationer,
                    Kategorier = kategorier
                };

                return Ok(dto);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error in GetOptions: " + ex.Message);
                return StatusCode(500, "Internal server error");
            }
        }

    }

}