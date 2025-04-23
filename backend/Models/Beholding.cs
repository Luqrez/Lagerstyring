using System;
using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;


namespace Backend.Models
{

    [Table("beholdning")]
    public class Beholdning : BaseModel
    {
        [PrimaryKey("id")]
        public long Id { get; set; }                   // bigint
        [Column("oprettet")]
        public DateTime Oprettet { get; set; }         // timestamp with time zone
        [Column("navn")]
        public string Navn { get; set; }               // text
        [Column("beskrivelse")]
        public string Beskrivelse { get; set; }        // text
        [Column("mængde")]
        public int Mængde { get; set; }                // integer
        [Column("kategori")]
        public int Kategori { get; set; }           // text
        [Column("lokation")]
        public int Lokation { get; set; }           // character varying
        [Column("enhed")]
        public int Enhed { get; set; }              // text
    }
};

