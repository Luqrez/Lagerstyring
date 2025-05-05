namespace Backend.Models
{
    public class BeholdningCreateDTO
    {
        public string Navn { get; set; } = string.Empty;
        public string Beskrivelse { get; set; } = string.Empty;
        public int Mængde { get; set; }
        public int Minimum { get; set; }
        public string Kategori { get; set; } = string.Empty;
        public string Lokation { get; set; } = string.Empty;
        public string Enhed { get; set; } = string.Empty;
    }
}