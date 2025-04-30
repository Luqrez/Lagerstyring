using Backend.Models;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class VareController : ControllerBase
{
    private readonly Supabase.Client _supabase;

    public VareController(Supabase.Client supabase)
    {
        _supabase = supabase;
    }

    [HttpPost]
    public async Task<ActionResult> AddVare([FromBody] Vare newVare)
    {
        if (newVare == null || string.IsNullOrWhiteSpace(newVare.Navn))
        {
            return BadRequest("Navn er påkrævet.");
        }

        try
        {
            var response = await _supabase.From<Vare>().Insert(new List<Vare> { newVare });
            return Ok(response.Models.FirstOrDefault());
        }
        catch (Exception ex)
        {
            Console.WriteLine("Fejl ved oprettelse af vare: " + ex.Message);
            return StatusCode(500, "Intern serverfejl.");
        }
    }
}
