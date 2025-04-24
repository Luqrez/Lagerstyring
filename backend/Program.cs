using System;
using System.Text.Json.Serialization;
using Backend.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Backend.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Used to setup streaming from microservice(realtime-bridge) to client
builder.Services.AddSignalR();

// Load environment variables
DotNetEnv.Env.Load();
var url = Environment.GetEnvironmentVariable("SUPABASE_URL")
    ?? throw new InvalidOperationException("SUPABASE_URL environment variable is not set");
var key = Environment.GetEnvironmentVariable("SUPABASE_ANON_KEY")
    ?? throw new InvalidOperationException("SUPABASE_ANON_KEY environment variable is not set");

// Configure Supabase client
var options = new Supabase.SupabaseOptions
{
    AutoConnectRealtime = true
};

// Register Supabase client as a singleton service
var supabase = new Supabase.Client(url, key, options);
builder.Services.AddSingleton(supabase);

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Only use HTTPS redirection in production
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
app.UseAuthorization();
app.MapControllers();

// Initialize Supabase client
await supabase.InitializeAsync();

// Enable CORS - specifically allow the frontend origin
app.UseCors(policy => policy
    .WithOrigins("http://localhost:5173") // Default Vite dev server port
    .AllowAnyMethod()
    .AllowAnyHeader()
    .AllowCredentials());

app.MapHub<BeholdningHub>("/realtime/beholdning");

// Run the application
Console.WriteLine("ASP.NET backend running...");
app.Run();