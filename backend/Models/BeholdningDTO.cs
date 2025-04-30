using System;

namespace Backend.Models
{
    public class BeholdningDTO
    {
        public long Id { get; set; }
        public DateTime Oprettet { get; set; }
        public string Navn { get; set; }
        public string Beskrivelse { get; set; }
        public int Mængde { get; set; }
        public int Minimum { get; set; }
        public string Kategori { get; set; }
        public string Lokation { get; set; }
        public string Enhed { get; set; }
    }
}