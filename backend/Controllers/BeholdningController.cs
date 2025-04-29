using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Backend.Models;

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

                        string kategoriValue = "Ukendt";
                        string lokationValue = "Ukendt";
                        string enhedValue = "Ukendt";

                        try
                        {
                            if (!string.IsNullOrEmpty(b.Kategori))
                            {
                                long kategoriId = long.Parse(b.Kategori);
                                Console.WriteLine($"Looking up Kategori with Id: {kategoriId}");
                                if (kategorier.TryGetValue(kategoriId, out var kat))
                                {
                                    kategoriValue = kat;
                                    Console.WriteLine($"Found Kategori: {kategoriValue}");
                                }
                                else
                                {
                                    Console.WriteLine($"Kategori with Id {kategoriId} not found");
                                }
                            }
                            else
                            {
                                Console.WriteLine("Kategori is null or empty");
                            }
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"Error processing Kategori: {ex.Message}");
                        }

                        try
                        {
                            if (!string.IsNullOrEmpty(b.Lokation))
                            {
                                long lokationId = long.Parse(b.Lokation);
                                Console.WriteLine($"Looking up Lokation with Id: {lokationId}");
                                if (lokationer.TryGetValue(lokationId, out var lok))
                                {
                                    lokationValue = lok;
                                    Console.WriteLine($"Found Lokation: {lokationValue}");
                                }
                                else
                                {
                                    Console.WriteLine($"Lokation with Id {lokationId} not found");
                                }
                            }
                            else
                            {
                                Console.WriteLine("Lokation is null or empty");
                            }
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"Error processing Lokation: {ex.Message}");
                        }

                        try
                        {
                            if (!string.IsNullOrEmpty(b.Enhed))
                            {
                                long enhedId = long.Parse(b.Enhed);
                                Console.WriteLine($"Looking up Enhed with Id: {enhedId}");
                                if (enheder.TryGetValue(enhedId, out var enh))
                                {
                                    enhedValue = enh;
                                    Console.WriteLine($"Found Enhed: {enhedValue}");
                                }
                                else
                                {
                                    Console.WriteLine($"Enhed with Id {enhedId} not found");
                                }
                            }
                            else
                            {
                                Console.WriteLine("Enhed is null or empty");
                            }
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"Error processing Enhed: {ex.Message}");
                        }

                        var dto = new BeholdningDTO
                        {
                            Id = b.Id,
                            Oprettet = b.Oprettet,
                            Navn = b.Navn,
                            Beskrivelse = b.Beskrivelse,
                            Mængde = b.Mængde,
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
