using System;
using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;


namespace Backend.Models
{

    [Table("beholdning")]
    public class Beholdning : BaseModel
    {
        [PrimaryKey("id")]
        public long Id { get; set; }
        [Column("oprettet")]
        public DateTime Oprettet { get; set; }
        [Column("navn")]
        public string Navn { get; set; } = string.Empty;
        [Column("beskrivelse")]
        public string Beskrivelse { get; set; } = string.Empty;
        [Column("mængde")]
        public int Mængde { get; set; }
        [Column("min_mængde")]
        public int Minimum { get; set; }
        [Column("kategori_id")]
        public int Kategori { get; set; }
        [Column("lokation_id")]
        public int Lokation { get; set; }
        [Column("enhed_id")]
        public int Enhed { get; set; }
    }
};
