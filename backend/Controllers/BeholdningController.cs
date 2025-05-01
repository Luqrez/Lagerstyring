using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using System.Reflection;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BeholdningController : ControllerBase
    {
        private readonly Supabase.Client _supabase;

        public BeholdningController(Supabase.Client supabase)
        {
            _supabase = supabase;
        }

        [HttpPost]
        public async Task<ActionResult<Beholdning>> PostBeholdning([FromBody] BeholdningCreateDTO newBeholdning)
        {
            if (newBeholdning == null || string.IsNullOrWhiteSpace(newBeholdning.Navn))
            {
                return BadRequest("Navn er påkrævet.");
            }

            if (newBeholdning.Mængde < 0 || newBeholdning.Minimum < 0)
            {
                return BadRequest("Mængde og Minimum må ikke være negative.");
            }

            try
            {
                async Task<int> GetOrCreateAsync<T>(string value, string propColumnName, string sqlColumnName) where T : Supabase.Postgrest.Models.BaseModel, new()
                {
                    // Fetch existing by value (e.g., "Stk", "Frugt")
                    var existing = await _supabase.From<T>()
                        .Filter(sqlColumnName, Supabase.Postgrest.Constants.Operator.Equals, value)
                        .Get();

                    var existingModel = existing.Models.FirstOrDefault();
                    if (existingModel != null)
                    {
                        return Convert.ToInt32(typeof(T).GetProperty("Id")!.GetValue(existingModel));
                    }

                    // Create a new object dynamically
                    var newModel = new T();
                    var prop = typeof(T).GetProperty(propColumnName);

                    if (prop == null || !prop.CanWrite)
                        throw new ArgumentException($"Property '{propColumnName}' not found or is not writable on type {typeof(T).Name}");

                    Console.WriteLine(newModel);
                    prop.SetValue(newModel, value);

                    // Insert into Supabase
                    var created = await _supabase.From<T>().Insert(newModel);

                    var createdModel = created.Models.FirstOrDefault();
                    if (createdModel == null)
                        throw new Exception("Failed to create model");

                    return Convert.ToInt32(typeof(T).GetProperty("Id")!.GetValue(createdModel));
                }

                Console.WriteLine(newBeholdning);

                var beholdning = new Beholdning
                {
                    Navn = newBeholdning.Navn,
                    Beskrivelse = newBeholdning.Beskrivelse,
                    Mængde = newBeholdning.Mængde,
                    Minimum = newBeholdning.Minimum,
                    Oprettet = DateTime.UtcNow,
                    Kategori = (int)await GetOrCreateAsync<Kategori>(newBeholdning.Kategori, "Navn", "navn"),
                    Lokation = (int)await GetOrCreateAsync<Lokation>(newBeholdning.Lokation, "Navn", "navn"),
                    Enhed = (int)await GetOrCreateAsync<Enhed>(newBeholdning.Enhed, "Value", "value"),
                };

                var result = await _supabase.From<Beholdning>().Insert(new List<Beholdning> { beholdning });

                var inserted = result.Models.FirstOrDefault();
                if (inserted == null)
                {
                    return StatusCode(500, "Varen kunne ikke gemmes.");
                }

                var dto = new BeholdningDTO
                {
                    Id = beholdning.Id,
                    Navn = beholdning.Navn,
                    Beskrivelse = beholdning.Beskrivelse,
                    Mængde = beholdning.Mængde,
                    Minimum = beholdning.Minimum,
                    Oprettet = beholdning.Oprettet,
                    Kategori = newBeholdning.Kategori,
                    Lokation = newBeholdning.Lokation,
                    Enhed = newBeholdning.Enhed
                };

                return CreatedAtAction(nameof(GetBeholdning), new { id = dto.Id }, dto);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Fejl ved oprettelse af beholdning: " + ex.ToString());
                return StatusCode(500, "Intern serverfejl.");
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BeholdningDTO>>> GetBeholdning()
        {
            try
            {
                Console.WriteLine("Starting GetBeholdning method");

                Console.WriteLine("Fetching Beholdning data");
                var beholdningResult = await _supabase.From<Beholdning>().Get();
                Console.WriteLine($"Fetched {beholdningResult.Models.Count} Beholdning records");

                Console.WriteLine("Fetching Kategori data");
                var kategoriResult = await _supabase.From<Kategori>().Get();
                Console.WriteLine($"Fetched {kategoriResult.Models.Count} Kategori records");

                Console.WriteLine("Fetching Lokation data");
                var lokationResult = await _supabase.From<Lokation>().Get();
                Console.WriteLine($"Fetched {lokationResult.Models.Count} Lokation records");

                Console.WriteLine("Fetching Enhed data");
                var enhedResult = await _supabase.From<Enhed>().Get();
                Console.WriteLine($"Fetched {enhedResult.Models.Count} Enhed records");

                Console.WriteLine("Processing data");
                var beholdning = beholdningResult.Models;
                var kategorier = kategoriResult.Models.ToDictionary(k => k.Id, k => k.Navn);
                var lokationer = lokationResult.Models.ToDictionary(l => l.Id, l => l.Navn);
                var enheder = enhedResult.Models.ToDictionary(e => e.Id, e => e.Value);

                Console.WriteLine("Mapping Beholdning models to BeholdningDTO objects");
                var beholdningDTOs = new List<BeholdningDTO>();

                foreach (var b in beholdning)
                {
                    try
                    {
                        Console.WriteLine($"Processing Beholdning with Id: {b.Id}, Navn: {b.Navn}");

                        string kategoriValue = kategorier.TryGetValue(b.Kategori, out var kat) ? kat : "Ukendt";
                        string lokationValue = lokationer.TryGetValue(b.Lokation, out var lok) ? lok : "Ukendt";
                        string enhedValue = enheder.TryGetValue(b.Enhed, out var enh) ? enh : "Ukendt";

                        var dto = new BeholdningDTO
                        {
                            Id = b.Id,
                            Oprettet = b.Oprettet,
                            Navn = b.Navn,
                            Beskrivelse = b.Beskrivelse,
                            Mængde = b.Mængde,
                            Minimum = b.Minimum,
                            Kategori = kategoriValue,
                            Lokation = lokationValue,
                            Enhed = enhedValue
                        };

                        beholdningDTOs.Add(dto);
                        Console.WriteLine($"Added DTO for {b.Navn}");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error mapping Beholdning to DTO: {ex.Message}");
                    }
                }

                Console.WriteLine($"Mapped {beholdningDTOs.Count} DTOs");

                return Ok(beholdningDTOs);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetBeholdning: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner exception: {ex.InnerException.Message}");
                    Console.WriteLine($"Inner stack trace: {ex.InnerException.StackTrace}");
                }
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
