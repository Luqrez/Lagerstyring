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
                var result = await _supabase.From<Beholdning>().Get();
                var beholdning = result.Models;

                // Map Beholdning models to BeholdningDTO objects
                var beholdningDTOs = beholdning.Select(b => new BeholdningDTO
                {
                    Id = b.Id,
                    Oprettet = b.Oprettet,
                    Navn = b.Navn,
                    Beskrivelse = b.Beskrivelse,
                    Mængde = b.Mængde,
                    Kategori = b.Kategori,
                    Lokation = b.Lokation,
                    Enhed = b.Enhed
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
