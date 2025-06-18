using Microsoft.AspNetCore.SignalR;

namespace Backend.Hubs
{
    // Sikrer øjeblikkelig opdatering af lagerdata på alle klienter, hvilket gør det muligt for medarbejdere at reagere hurtigt på ændringer i beholdningen.
    public class BeholdningHub : Hub
    {
        // Sender live-opdateringer til alle brugere, så alle altid har adgang til den mest aktuelle lagerstatus uden at skulle genindlæse systemet.
        public async Task SendUpdate(object payload)
        {
            await Clients.All.SendAsync("ReceiveUpdate", payload);
        }
    }
}
