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
                var beholdningResult = await _supabase.From<Beholdning>().Get();
                var kategoriResult = await _supabase.From<Kategori>().Get();
                var lokationResult = await _supabase.From<Lokation>().Get();
                var enhedResult = await _supabase.From<Enhed>().Get();

                var beholdning = beholdningResult.Models;
                var kategorier = kategoriResult.Models.ToDictionary(k => k.Id, k => k.Navn);
                var lokationer = lokationResult.Models.ToDictionary(l => l.Id, l => l.Navn);
                var enheder = enhedResult.Models.ToDictionary(e => e.Id, e => e.Value);

                // Map Beholdning models to BeholdningDTO objects
                var beholdningDTOs = beholdning.Select(b => new BeholdningDTO
                {
                    Id = b.Id,
                    Oprettet = b.Oprettet,
                    Navn = b.Navn,
                    Beskrivelse = b.Beskrivelse,
                    Mængde = b.Mængde,
                    Kategori = kategorier.TryGetValue(b.Id, out var kat) ? kat : "Ukendt",
                    Lokation = lokationer.TryGetValue(b.Id, out var lok) ? lok : "Ukendt",
                    Enhed = enheder.TryGetValue(b.Id, out var enh) ? enh : "Ukendt"
                }).ToList();

                return Ok(beholdningDTOs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
