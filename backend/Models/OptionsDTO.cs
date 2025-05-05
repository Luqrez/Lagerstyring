namespace Backend.Models
{
    public class OptionsDTO
    {
        public List<string> Enheder { get; set; } = new List<string>();
        public List<string> Lokationer { get; set; } = new List<string>();
        public List<string> Kategorier { get; set; } = new List<string>();
    }
}
