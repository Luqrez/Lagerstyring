using System;
using System.IO;
using System.Text.Json.Serialization;
using Backend.Models;
using DotNetEnv;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Backend.Hubs;
using Supabase;

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

// Initialize Supabase client
Console.WriteLine("Initializing Supabase client");
// Load environment variables from root directory
DotNetEnv.Env.Load(Path.Combine(Directory.GetCurrentDirectory(), "..", ".env"));
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

// Enable CORS - specifically allow the frontend origins
app.UseCors(policy => policy
    .WithOrigins("http://localhost:5173", "http://localhost:5174") // Vite dev server ports
    .AllowAnyMethod()
    .AllowAnyHeader()
    .AllowCredentials());

// Map BeholdningHub for realtime updates
app.MapHub<BeholdningHub>("/realtime/beholdning");

// Run the application
Console.WriteLine("ASP.NET backend running...");
app.Run();
