using System;
using Backend.Models;

DotNetEnv.Env.Load();
var url = Environment.GetEnvironmentVariable("SUPABASE_URL") 
    ?? throw new InvalidOperationException("SUPABASE_URL environment variable is not set");
var key = Environment.GetEnvironmentVariable("SUPABASE_ANON_KEY")
    ?? throw new InvalidOperationException("SUPABASE_ANON_KEY environment variable is not set");
var options = new Supabase.SupabaseOptions
{
    AutoConnectRealtime = true
};
var supabase = new Supabase.Client(url, key, options);
await supabase.InitializeAsync();

// A result can be fetched like so.
var result = await supabase.From<Beholdning>().Get();
var beholdning = result.Models;

Console.WriteLine("beholdning:");
foreach (var item in beholdning)
{
    Console.WriteLine($"Id: {item.Id}, Oprettet: {item.Oprettet}, Navn: {item.Navn}, Beskrivelse: {item.Beskrivelse}, Mængde: {item.Mængde}, Kategori: {item.Kategori}, Lokation: {item.Lokation}, Enhed: {item.Enhed}");
}
