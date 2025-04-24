using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Backend.Hubs;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/realtime/beholdning")]
    public class RealtimeController : ControllerBase
    {
        private readonly IHubContext<BeholdningHub> _hubContext;

        public RealtimeController(IHubContext<BeholdningHub> hubContext)
        {
            _hubContext = hubContext;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] object payload)
        {
            Console.WriteLine("Received from microservice");
            await _hubContext.Clients.All.SendAsync("ReceiveUpdate", payload);
            return Ok();
        }
    }
}
