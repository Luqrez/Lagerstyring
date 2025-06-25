using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Backend.Hubs;
using Backend.Models;
using System.Text.Json;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/realtime/beholdning")]
    public class RealtimeController : ControllerBase
    {
        private readonly IHubContext<BeholdningHub> _hubContext;
        private readonly Supabase.Client _supabase;

        public RealtimeController(IHubContext<BeholdningHub> hubContext, Supabase.Client supabase)
        {
            _hubContext = hubContext;
            _supabase = supabase;
        }

        // Modtager realtidsopdateringer fra bagvedliggende mikrotjenester, så alle medarbejdere øjeblikkeligt kan se opdaterede lagerdata.
        // Beriger data med forståelige navne og placeringer, så medarbejdere får klar og overskuelig information uden behov for teknisk indsigt.
        // Sender straks lageropdateringer videre til alle forbundne klienter, hvilket muliggør hurtige og præcise beslutninger på tværs af organisationen.
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] JsonElement payload)
        {
            Console.WriteLine("Received from microservice");

            var eventType = payload.GetProperty("eventType").GetString();
            Console.WriteLine(eventType);

            if (eventType != "INSERT" && eventType != "UPDATE")
            {
                Console.WriteLine("Ignoring eventType: " + eventType);
                return Ok();
            }

            var newData = payload.GetProperty("new");

            int enhedId = newData.GetProperty("enhed_id").GetInt32();
            int kategoriId = newData.GetProperty("kategori_id").GetInt32();
            int lokationId = newData.GetProperty("lokation_id").GetInt32();

            var enhed = (await _supabase.From<Enhed>()
                .Filter("id", Supabase.Postgrest.Constants.Operator.Equals, enhedId)
                .Get()).Models.FirstOrDefault();

            var kategori = (await _supabase.From<Kategori>()
                .Filter("id", Supabase.Postgrest.Constants.Operator.Equals, kategoriId)
                .Get()).Models.FirstOrDefault();

            var lokation = (await _supabase.From<Lokation>()
                .Filter("id", Supabase.Postgrest.Constants.Operator.Equals, lokationId)
                .Get()).Models.FirstOrDefault();

            var result = new
            {
                id = newData.GetProperty("id").GetInt32(),
                navn = newData.GetProperty("navn").GetString(),
                beskrivelse = newData.GetProperty("beskrivelse").GetString(),
                mængde = newData.GetProperty("mængde").GetInt32(),
                minimum = newData.GetProperty("min_mængde").GetInt32(),
                oprettet = newData.GetProperty("oprettet").GetDateTime(),
                kategori = kategori?.Navn ?? "Ukendt",
                lokation = lokation?.Navn ?? "Ukendt",
                enhed = enhed?.Value ?? "Ukendt",
                eventType = eventType
            };

            await _hubContext.Clients.All.SendAsync("ReceiveUpdate", result);
            return Ok();
        }


    }
}
