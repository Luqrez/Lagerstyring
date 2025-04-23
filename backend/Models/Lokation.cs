using System;
using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;


namespace Backend.Models
{
    [Table("lokation")]
    public class Lokation : BaseModel
    {
        [PrimaryKey("id")]
        public long Id { get; set; }
        [Column("navn")]
        public string Navn { get; set; }
    }
};

