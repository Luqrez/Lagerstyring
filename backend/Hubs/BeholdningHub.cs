using Microsoft.AspNetCore.SignalR;

namespace Backend.Hubs
{
    public class BeholdningHub : Hub
    {
        public async Task SendUpdate(object payload)
        {
            await Clients.All.SendAsync("ReceiveUpdate", payload);
        }
    }
}
