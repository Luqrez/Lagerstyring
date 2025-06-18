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

        // Tjekker at varen har et gyldigt navn og positiv beholdning, så vi undgår fejlregistrering af lagerdata.
        // Sikrer at nye produktkategorier, enheder og lokationer automatisk oprettes, så medarbejdere hurtigt kan registrere varer uden forudgående opsætning.
        // Opretter en ny vare i lagerstyringssystemet, så virksomheden kan følge med i beholdningen og sikre optimale lagerbeholdninger.
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

                Console.WriteLine($"TESTTEINGINGGN {newBeholdning.Mængde}");

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

        // Henter en komplet oversigt over aktuelle lagerbeholdninger, så medarbejdere og ledelse kan træffe velinformerede beslutninger.
        // Samler detaljeret information om varer, kategorier, enheder og placeringer for nem oversigt og rapportering.
        // Mapper data til en brugervenlig form, som tydeligt viser lagersituationen på tværs af virksomheden.
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
                var kategorier = kategoriResult.Models
                    .Where(k => k.Id.HasValue)
                    .ToDictionary(k => k.Id!.Value, k => k.Navn);
                var lokationer = lokationResult.Models
                    .Where(l => l.Id.HasValue)
                    .ToDictionary(l => l.Id!.Value, l => l.Navn);
                var enheder = enhedResult.Models
                    .Where(e => e.Id.HasValue)
                    .ToDictionary(e => e.Id!.Value, e => e.Value);
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

        // Opdaterer eksisterende lagerdata, så virksomheden altid har nøjagtige oplysninger til rådighed ved ændringer i varebeholdningen.
        // Validerer input, så fejlindtastninger undgås og lagerdata forbliver pålidelige og anvendelige for drift og planlægning.
        // Sikrer at eventuelle nye kategorier, lokationer eller enheder også automatisk tilføjes, hvilket reducerer administrativt arbejde.
        [HttpPut("{id}")]
        public async Task<ActionResult<BeholdningDTO>> PutBeholdning(long id, [FromBody] BeholdningCreateDTO updatedBeholdning)
        {
            if (updatedBeholdning == null || string.IsNullOrWhiteSpace(updatedBeholdning.Navn))
            {
                return BadRequest("Navn er påkrævet.");
            }

            if (updatedBeholdning.Mængde < 0 || updatedBeholdning.Minimum < 0)
            {
                return BadRequest("Mængde og Minimum må ikke være negative.");
            }

            try
            {
                // Check if the item exists
                var existingResult = await _supabase.From<Beholdning>()
                    .Filter("id", Supabase.Postgrest.Constants.Operator.Equals, id)
                    .Get();

                var existing = existingResult.Models.FirstOrDefault();
                if (existing == null)
                {
                    return NotFound($"Vare med ID {id} findes ikke.");
                }

                // Helper function to get or create related entities
                async Task<int> GetOrCreateAsync<T>(string value, string propColumnName, string sqlColumnName) where T : Supabase.Postgrest.Models.BaseModel, new()
                {
                    var existing = await _supabase.From<T>()
                        .Filter(sqlColumnName, Supabase.Postgrest.Constants.Operator.Equals, value)
                        .Get();

                    var existingModel = existing.Models.FirstOrDefault();
                    if (existingModel != null)
                    {
                        return Convert.ToInt32(typeof(T).GetProperty("Id")!.GetValue(existingModel));
                    }

                    var newModel = new T();
                    var prop = typeof(T).GetProperty(propColumnName);

                    if (prop == null || !prop.CanWrite)
                        throw new ArgumentException($"Property '{propColumnName}' not found or is not writable on type {typeof(T).Name}");

                    prop.SetValue(newModel, value);
                    var created = await _supabase.From<T>().Insert(newModel);

                    var createdModel = created.Models.FirstOrDefault();
                    if (createdModel == null)
                        throw new Exception("Failed to create model");

                    return Convert.ToInt32(typeof(T).GetProperty("Id")!.GetValue(createdModel));
                }

                // Update related entities
                int kategoriId = await GetOrCreateAsync<Kategori>(updatedBeholdning.Kategori, "Navn", "navn");
                int lokationId = await GetOrCreateAsync<Lokation>(updatedBeholdning.Lokation, "Navn", "navn");
                int enhedId = await GetOrCreateAsync<Enhed>(updatedBeholdning.Enhed, "Value", "value");

                // Update the beholdning
                existing.Navn = updatedBeholdning.Navn;
                existing.Beskrivelse = updatedBeholdning.Beskrivelse;
                existing.Mængde = updatedBeholdning.Mængde;
                existing.Minimum = updatedBeholdning.Minimum;
                existing.Kategori = kategoriId;
                existing.Lokation = lokationId;
                existing.Enhed = enhedId;

                // Save changes
                var result = await _supabase.From<Beholdning>()
                    .Filter("id", Supabase.Postgrest.Constants.Operator.Equals, id)
                    .Update(existing);

                var updated = result.Models.FirstOrDefault();
                if (updated == null)
                {
                    return StatusCode(500, "Varen kunne ikke opdateres.");
                }

                // Map to DTO for response
                var dto = new BeholdningDTO
                {
                    Id = updated.Id,
                    Navn = updated.Navn,
                    Beskrivelse = updated.Beskrivelse,
                    Mængde = updated.Mængde,
                    Minimum = updated.Minimum,
                    Oprettet = updated.Oprettet,
                    Kategori = updatedBeholdning.Kategori,
                    Lokation = updatedBeholdning.Lokation,
                    Enhed = updatedBeholdning.Enhed
                };

                return Ok(dto);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Fejl ved opdatering af beholdning: " + ex.ToString());
                return StatusCode(500, "Intern serverfejl.");
            }
        }
    }
}